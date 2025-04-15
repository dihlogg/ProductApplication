import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SocialLoginButtons from "@/components/SocialLoginButtons";
import InputField from "@/components/InputField";
import { LoginRequest } from "@/types/login-request";
import axios from "axios";
import { RegisterRequest } from "@/types/register-request";
import { API_ENDPOINTS } from "@/service/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {};

const SignInScreen = (props: Props) => {
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!userName || !passWord) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      const loginData: LoginRequest = { userName, passWord };

      const response = await axios.post(API_ENDPOINTS.LOGIN_USER, loginData);

      if (response.status === 200 && response.data?.id) {
        const userId = response.data.id;
        const user = response.data;

        // save user_info
        await AsyncStorage.setItem("userInfo", JSON.stringify(user));
        console.log("User info saved:", user);

        Alert.alert("Success", "Login successful!");
        router.replace({ pathname: "/(tabs)", params: { id: user.id } });
      } else {
        Alert.alert("Error", "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={Platform.OS === "web" ? undefined : Keyboard.dismiss}
      accessible={false}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.title}>Login to Your Account</Text>

            <InputField
              placeholder="Username"
              value={userName}
              onChangeText={setUserName}
              placeholderTextColor={Colors.gray}
              autoCapitalize="none"
            />
            <InputField
              placeholder="Password"
              value={passWord}
              onChangeText={setPassWord}
              placeholderTextColor={Colors.gray}
              secureTextEntry={true}
            />

            <TouchableOpacity
              style={styles.btn}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.btnTxt}>
                {loading ? "Logging in..." : "Login"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.loginTxt}>
              Don't have an account?{" "}
              <Text
                onPress={() => router.push("/signup")}
                style={styles.loginTxtSpan}
              >
                SignUp
              </Text>
            </Text>

            <View style={styles.divider} />
            <SocialLoginButtons emailHref={"/signin"} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F4F4F4",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 1.2,
    color: "#333",
    marginBottom: 50,
  },
  btn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignSelf: "stretch",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 20,
  },
  btnTxt: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 600,
  },
  loginTxt: {
    marginBottom: 30,
    fontSize: 14,
    color: "#333",
    lineHeight: 24,
  },
  loginTxtSpan: {
    color: "#572fff", //primary color
    fontWeight: 600,
  },
  divider: {
    borderTopColor: Colors.gray,
    borderTopWidth: StyleSheet.hairlineWidth,
    width: "30%",
    marginBottom: 30,
  },
});
