import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

// Định nghĩa interface cho tin nhắn
interface Message {
  id: number;
  text: string;
  sender: "user" | "bot"; // Giới hạn sender chỉ là "user" hoặc "bot"
}

const ChatScreen = () => {
  const headerHeight = useHeaderHeight();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]); // Khai báo kiểu cho messages

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await axios.post(
        "http://your-asp-net-core-server/api/chat/send",
        {
          conversationId: "your-conversation-id",
          message,
        }
      );
      // Thêm tin nhắn vào danh sách
      setMessages([...messages, { id: Date.now(), text: message, sender: "user" }]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <Stack.Screen options={{ headerShown: true, headerTransparent: true }} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={headerHeight - 80}
          style={styles.flexContainer}
        >
          <View style={[styles.container, { marginTop: headerHeight }]}>
            <Text style={styles.greeting}>Hello, Đinh Long</Text>
            <View style={styles.messageList}>
              {messages.map((msg) => (
                <Text
                  key={msg.id}
                  style={[
                    styles.message,
                    msg.sender === "user" ? styles.userMessage : styles.botMessage,
                  ]}
                >
                  {msg.text}
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask everything u want"
              value={message}
              onChangeText={(text) => setMessage(text)}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons name="send" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flexContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },
  messageList: {
    flex: 1,
  },
  message: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "70%",
  },
  userMessage: {
    backgroundColor: "#007AFF",
    color: "#fff",
    alignSelf: "flex-end",
  },
  botMessage: {
    backgroundColor: "#ddd",
    color: "#000",
    alignSelf: "flex-start",
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 8,
    height: 60,
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "white",
    paddingRight: 20,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 50,
    marginLeft: 10,
  },
});