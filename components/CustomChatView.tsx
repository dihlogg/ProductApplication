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
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_ENDPOINTS } from "@/service/apiService";
import { Ionicons } from "@expo/vector-icons";
import { Message, Product } from "@/types/conversation";
import { router } from "expo-router";
import { parseBotMessage } from "@/utils/parseBotMessage";
import { HubConnection } from "@microsoft/signalr";
import connectChatSignalR from "@/service/connectChatSignalR";

const decodeHTML = (html: string) => {
  const entities: { [key: string]: string } = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&apos;": "'",
    "&nbsp;": " ",
  };

  return html.replace(
    /&(?:amp|lt|gt|quot|apos|nbsp);/g,
    (match) => entities[match] || match
  );
};

const CustomChatView = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const signalRConnection = useRef<HubConnection | undefined>(null);

  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (isTyping) {
      const animateDot = (dot: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(dot, {
              toValue: 1,
              duration: 300,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0.3,
              duration: 300,
              useNativeDriver: true,
            }),
          ])
        );
      };

      const dot1Animation = animateDot(dot1Opacity, 0);
      const dot2Animation = animateDot(dot2Opacity, 100);
      const dot3Animation = animateDot(dot3Opacity, 200);

      dot1Animation.start();
      dot2Animation.start();
      dot3Animation.start();

      return () => {
        dot1Animation.stop();
        dot2Animation.stop();
        dot3Animation.stop();
      };
    }
  }, [isTyping]);

  // Lấy thông tin người dùng từ AsyncStorage và thiết lập SignalR
  useEffect(() => {
    const fetchUserInfoAndConnect = async () => {
      try {
        const userData = await AsyncStorage.getItem("userInfo");
        if (!userData) return;

        const user = JSON.parse(userData);
        setUserInfo(user);

        if (!user.id) return;

        console.log(`Connecting SignalR for user: ${user.id}`);
        const connection = await connectChatSignalR(
          user.id,
          async (messageText: string, sender: string) => {
            // Xử lý tin nhắn nhận được từ SignalR
            let products: Product[] | undefined = undefined;
            if (sender === "bot") {
              try {
                const parsedJson = JSON.parse(messageText);
                if (Array.isArray(parsedJson) && parsedJson[0]?.output) {
                  messageText = parsedJson[0].output;
                  products = parseBotMessage(messageText).products;
                } else {
                  products = parseBotMessage(messageText).products;
                }
              } catch (e) {
                console.warn("Failed to parse bot message JSON:", messageText);
                products = parseBotMessage(messageText).products;
              }
            }

            const newMessage: Message = {
              id: Date.now().toString(),
              text: messageText,
              sender: sender as "user" | "bot",
              timestamp: new Date().toISOString(),
              products,
            };

            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setIsTyping(false);

            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }
        );

        signalRConnection.current = connection;

        return () => {
          console.log("Stopping SignalR connection");
          signalRConnection.current?.stop();
        };
      } catch (error) {
        console.error("Error fetching user info or connecting SignalR:", error);
      }
    };

    fetchUserInfoAndConnect();
  }, []);

  // Lấy lịch sử chat từ API GetMessages
  useEffect(() => {
    const loadMessagesFromServer = async () => {
      if (!userInfo?.id) return;
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.GET_MESSAGES}/${userInfo.id}`
        );
        const serverMessages = response.data.map((msg: any) => {
          let messageText = msg.message;
          let products: Product[] | undefined = undefined;

          if (msg.sender === "bot") {
            try {
              const parsedJson = JSON.parse(msg.message);
              if (Array.isArray(parsedJson) && parsedJson[0]?.output) {
                messageText = parsedJson[0].output;
                products = parseBotMessage(messageText).products;
              } else {
                products = parseBotMessage(messageText).products;
              }
            } catch (e) {
              console.warn("Failed to parse bot message JSON:", msg.message);
              products = parseBotMessage(messageText).products;
            }
          }

          return {
            id: msg.id,
            text: messageText,
            sender: msg.sender,
            timestamp: msg.timestamp,
            products,
          };
        });
        console.log("Server Messages:", serverMessages);
        setMessages(serverMessages);
      } catch (error) {
        console.error("Error loading messages from server:", error);
      }
    };
    loadMessagesFromServer();
  }, [userInfo]);

  // Xử lý gửi tin nhắn qua SignalR
  const handleSend = async () => {
    if (!inputText.trim() || !userInfo?.id || !signalRConnection.current)
      return;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      // Gửi tin nhắn qua SignalR với sender = user
      await signalRConnection.current.invoke(
        "SendMessage",
        userInfo.id,
        inputText,
        "user"
      );
      console.log("Message sent via SignalR");

      // Gọi API PostMessage để xử lý tin nhắn bot
      const response = await axios.post(`${API_ENDPOINTS.POST_MESSAGE}`, {
        Message: inputText,
        UserId: userInfo.id,
      });
      console.log("PostMessage Response:", response.status, response.data);

      let aiText = response.data;
      if (Array.isArray(response.data) && response.data[0]?.output) {
        aiText = response.data[0].output;
        console.log("Extracted AI Text:", aiText);
      } else if (typeof response.data === "string") {
        aiText = response.data;
      } else {
        console.error("Invalid response format:", response.data);
        throw new Error("Invalid response format from PostMessage API");
      }

      // Gửi phản hồi của bot qua SignalR với sender="bot"
      await signalRConnection.current.invoke(
        "SendMessage",
        userInfo.id,
        aiText,
        "bot"
      );
    } catch (error: any) {
      console.error(
        "Error in handleSend:",
        error.message,
        error.response?.data
      );
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Đã xảy ra lỗi khi xử lý. Vui lòng thử lại sau.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
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
      {item.products && item.products.length > 0 ? (
        <View>
          {item.text.includes("Chúng tôi có một vài gợi ý") && (
            <Text
              style={[
                styles.messageText,
                {
                  color: item.sender === "user" ? "#fff" : "#000",
                  marginBottom: 10,
                },
              ]}
            >
              {item.text.split("\n")[0]}
            </Text>
          )}
          {item.products.map((product, index) => (
            <View key={index} style={{ marginBottom: 5 }}>
              {product.link.label ? (
                <Text
                  style={[
                    styles.messageText,
                    {
                      color: item.sender === "user" ? "#fff" : "#000",
                      fontWeight: "bold",
                      marginBottom: 5,
                    },
                  ]}
                >
                  {product.link.label}
                </Text>
              ) : null}
              {product.price ? (
                <Text
                  style={[
                    styles.messageText,
                    { color: item.sender === "user" ? "#fff" : "#000" },
                  ]}
                >
                  {product.price}
                </Text>
              ) : null}
              {product.description ? (
                <Text
                  style={[
                    styles.messageText,
                    { color: item.sender === "user" ? "#fff" : "#000" },
                  ]}
                >
                  {product.description}
                </Text>
              ) : null}
              {product.link.url ? (
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => {
                    router.push(`/product-details/${product.link.url}`);
                  }}
                >
                  <Text style={styles.linkButtonText}>Xem sản phẩm</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ))}
        </View>
      ) : (
        <Text
          style={[
            styles.messageText,
            { color: item.sender === "user" ? "#fff" : "#000" },
          ]}
        >
          {item.text && typeof item.text === "string"
            ? decodeHTML(item.text.replace(/<[^>]+>/g, ""))
            : "Không có sản phẩm phù hợp."}
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
        keyExtractor={(item) => item.id}
        style={styles.chatList}
        contentContainerStyle={{ paddingBottom: 20 }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {isTyping && (
        <View style={styles.typingIndicator}>
          <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
          <Animated.View style={[styles.dot, { opacity: dot2Opacity }]} />
          <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask everything u want."
          placeholderTextColor="#888"
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={isTyping || !userInfo?.id}
        >
          <Ionicons name="send" size={22} color="#fff" />
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
    backgroundColor: "#572FFF",
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
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    fontSize: 16,
    color: "#000",
  },
  sendButton: {
    backgroundColor: "#572FFF",
    borderRadius: 25,
    paddingVertical: 11,
    paddingHorizontal: 11,
    marginLeft: 8,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderColor: "#ccc",
  },
  linkButton: {
    marginTop: 6,
    backgroundColor: "#572FFF",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  linkButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#572FFF",
    marginHorizontal: 2,
  },
});

export default CustomChatView;
