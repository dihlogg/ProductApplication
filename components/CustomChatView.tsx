import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import axios from "axios";

// Define the type for a single product in the chatbot response
interface Product {
  price: string;
  description: string;
  link: { url: string; label: string };
}

// Define the type for a single message
interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
  link?: { url: string; label: string };
  products?: Product[]; // Sử dụng Product thay vì ProductType
}

const CustomChatView = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await AsyncStorage.getItem("userInfo");
      if (userInfo) {
        setUserInfo(JSON.parse(userInfo));
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      const storedMessages = await AsyncStorage.getItem("chatMessages");
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    };
    loadMessages();
  }, []);

  const saveMessages = async (newMessages: Message[]) => {
    await AsyncStorage.setItem("chatMessages", JSON.stringify(newMessages));
  };

  // Hàm parseBotMessage được cập nhật để trả về kiểu Product[]
  const parseBotMessage = (htmlText: string): { products: Product[] } => {
    console.log("Parsing input:", htmlText);

    // Tách các sản phẩm dựa trên dòng trống "\n\n"
    const productSections = htmlText
      .split("\n\n")
      .filter((section) => section.trim());

    const products: Product[] = productSections
      .map((section) => {
        // Tìm liên kết trong section
        const linkMatch = section.match(
          /<a href="myapp:\/\/product\/(.*?)">(.*?)<\/a>/
        );
        const link = linkMatch
          ? { url: linkMatch[1], label: linkMatch[2] }
          : null;

        // Tách giá và mô tả
        const lines = section.split("\n").filter((line) => line.trim());
        let price = "";
        let description = "";

        for (const line of lines) {
          if (line.includes("Giá")) {
            price = line
              .replace(
                /.*Giá\s*(?:của sản phẩm là)?\s*([0-9.]+|price)\.?\s*/,
                "$1"
              )
              .trim();
          } else if (!line.includes("<a href")) {
            description = line.trim();
          }
        }

        return {
          price: price === "price" ? "Không có thông tin giá." : price,
          description,
          link: link || { url: "", label: "" },
        };
      })
      .filter((product) => product.link.url); // Chỉ giữ các sản phẩm có liên kết hợp lệ

    console.log("Parsed products:", products);
    return { products };
  };

  const getAIResponse = async (userInput: string): Promise<string> => {
    try {
      const response = await fetch("http://192.168.1.15:5678/webhook/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userInput,
          userId: userInfo?.id,
          name: userInfo?.name,
          phone: userInfo?.phone,
        }),
      });

      // Kiểm tra nếu trạng thái phản hồi không phải OK (ví dụ: 200)
      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          "Phản hồi lỗi từ Webhook:",
          JSON.stringify(errorData, null, 2)
        );
        throw new Error(errorData.message || "Lỗi từ server n8n");
      }

      const data = await response.json();
      console.log("Phản hồi từ Webhook n8n:", JSON.stringify(data, null, 2));

      // Xử lý các cấu trúc phản hồi khác nhau
      let botResponse;
      if (Array.isArray(data) && data.length > 0 && data[0]?.output) {
        botResponse = data[0].output;
      } else if (data?.output) {
        botResponse = data.output;
      } else {
        botResponse = "Không nhận được phản hồi từ server.";
      }

      return botResponse;
    } catch (error) {
      console.error("Lỗi trong getAIResponse:", error);
      return "Đã xảy ra lỗi khi xử lý. Vui lòng thử lại sau.";
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    await saveMessages(updatedMessages);
    setInputText("");
    setIsTyping(true);

    try {
      const aiText = await getAIResponse(inputText);
      console.log("AI Response:", aiText);
      const { products } = parseBotMessage(aiText);

      const botMessage: Message = {
        id: Date.now() + 1,
        text: "", // Không cần text nữa vì sẽ hiển thị danh sách sản phẩm
        sender: "bot",
        timestamp: new Date().toISOString(),
        products, // Lưu danh sách sản phẩm
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      await saveMessages(finalMessages);
    } catch (error) {
      console.error("Error in handleSend:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Đã xảy ra lỗi khi xử lý. Vui lòng thử lại sau.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages([...updatedMessages, errorMessage]);
      await saveMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === "user" ? styles.userBubble : styles.botBubble,
      ]}
    >
      {item.products ? (
        item.products.map((product, index) => (
          <View key={index} style={{ marginBottom: 10 }}>
            <Text
              style={[
                styles.messageText,
                { color: item.sender === "user" ? "#fff" : "#000" },
              ]}
            >
              Giá của sản phẩm: {product.price} VNĐ.
            </Text>
            {product.description && (
              <Text
                style={[
                  styles.messageText,
                  { color: item.sender === "user" ? "#fff" : "#000" },
                ]}
              >
                {product.description}
              </Text>
            )}
            {product.link && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => {
                  router.push(`/product-details/${product.link.url}`);
                }}
              >
                <Text style={styles.linkButtonText}>{product.link.label}</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      ) : (
        <Text
          style={[
            styles.messageText,
            { color: item.sender === "user" ? "#fff" : "#000" },
          ]}
        >
          {item.text}
        </Text>
      )}

      <Text
        style={[
          styles.timestamp,
          {
            color:
              item.sender === "user"
                ? "rgba(255,255,255,0.7)"
                : "rgba(0,0,0,0.5)",
          },
        ]}
      >
        {new Date(item.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        extraData={messages}
        keyExtractor={(item) => item.id.toString()}
        style={styles.chatList}
        contentContainerStyle={{ paddingBottom: 20 }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {isTyping && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.typingText}>Bot đang nhập...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor="#888"
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={isTyping}
        >
          <Text style={styles.sendButtonText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  chatList: { flex: 1, paddingHorizontal: 10, paddingTop: 20 },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    marginVertical: 5,
    borderRadius: 15,
  },
  userBubble: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
    borderBottomRightRadius: 5,
  },
  botBubble: {
    backgroundColor: "#E5E5EA",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 5,
  },
  messageText: { fontSize: 16, lineHeight: 22 },
  timestamp: { fontSize: 12, marginTop: 5, textAlign: "right" },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  typingText: { marginLeft: 10, color: "#666", fontSize: 14 },
  linkButton: {
    marginTop: 8,
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  linkButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default CustomChatView;
