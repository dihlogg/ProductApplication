import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import React from "react";
import { Link, router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import {
  TextInput,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import SocialLoginButtons from "@/components/SocialLoginButtons";
import InputField from "@/components/InputField";

type Props = {};

const SignInScreen = (props: Props) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
              <Text style={styles.title}>Login to Your Account</Text>

              <InputField
                placeholder="Email Address"
                placeholderTextColor={Colors.gray}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <InputField
                placeholder="Password"
                placeholderTextColor={Colors.gray}
                secureTextEntry={true}
              />

              <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                  router.dismissAll();
                  router.push("/(tabs)");
                }}
              >
                <Text style={styles.btnTxt}>Login</Text>
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
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
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
