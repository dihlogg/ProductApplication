import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Link, router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import {
  TextInput,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import InputField from "@/components/InputField";
import { RegisterRequest } from "@/types/register-request";
import axios from "axios";
import { API_ENDPOINTS } from "@/service/apiService";

type Props = {};

const SignUpScreen = () => {
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !userName ||
      !userPassword ||
      !userFullName ||
      !userAddress ||
      !userPhone
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const registerData: RegisterRequest = {
        userName,
        userPassword,
        userFullName,
        userAddress,
        userPhone,
      };

      const response = await axios.post(
        API_ENDPOINTS.REGISTER_USER,
        registerData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Register response:", response.data);

      if (response.status === 200) {
        Alert.alert("Success", "Account created successfully!");
        router.dismissAll();
        router.push("/signin");
      } else {
        Alert.alert("Error", "Registration failed.");
      }
    } catch (error: any) {
      console.error("Register error:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <Text style={styles.title}>Create an Account</Text>

            <InputField
              placeholder="Username"
              value={userName}
              onChangeText={setUserName}
              placeholderTextColor={Colors.gray}
              autoCapitalize="none"
            />
            <InputField
              placeholder="Password"
              value={userPassword}
              onChangeText={setUserPassword}
              placeholderTextColor={Colors.gray}
              secureTextEntry={true}
            />
            <InputField
              placeholder="Full Name"
              value={userFullName}
              onChangeText={setUserFullName}
              placeholderTextColor={Colors.gray}
            />
            <InputField
              placeholder="Address"
              value={userAddress}
              onChangeText={setUserAddress}
              placeholderTextColor={Colors.gray}
            />
            <InputField
              placeholder="Phone Number"
              value={userPhone}
              onChangeText={setUserPhone}
              placeholderTextColor={Colors.gray}
              keyboardType="phone-pad"
            />

            <TouchableOpacity
              style={styles.btn}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.btnTxt}>
                {loading ? "Registering..." : "Create an Account"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.loginTxt}>
              Already have an account?{" "}
              <Text
                onPress={() => router.push("/signin")}
                style={styles.loginTxtSpan}
              >
                Sign In
              </Text>
            </Text>

            <View style={styles.divider} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default SignUpScreen;

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
    textAlignVertical: "center",
  },
  loginTxtSpan: {
    color: "#572fff", //primary color
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 24,
    textAlignVertical: "center",
  },
  divider: {
    borderTopColor: Colors.gray,
    borderTopWidth: StyleSheet.hairlineWidth,
    width: "30%",
    marginBottom: 30,
  },
});
