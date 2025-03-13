import { StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, ScrollView } from "react-native";
import React from "react";
import { Link, router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import {
  TextInput,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import InputField from "@/components/InputField";

type Props = {};

const SignUpScreen = (props: Props) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
              <Text style={styles.title}>Create an Account</Text>

              <InputField
                placeholder="Email"
                placeholderTextColor={Colors.gray}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <InputField
                placeholder="Password"
                placeholderTextColor={Colors.gray}
                secureTextEntry={true}
              />
              <InputField
                placeholder="Full Name"
                placeholderTextColor={Colors.gray}
              />
              <InputField
                placeholder="Address"
                placeholderTextColor={Colors.gray}
              />
              <InputField
                placeholder="Phone Number"
                placeholderTextColor={Colors.gray}
                keyboardType="phone-pad"
              />

              <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                  router.dismissAll();
                  router.push("/(tabs)");
                }}
              >
                <Text style={styles.btnTxt}>Create an Account</Text>
              </TouchableOpacity>

              <Text style={styles.loginTxt}>
                Already have an account?{" "}
                <Text
                  onPress={() => router.push("/signin")}
                  style={styles.loginTxtSpan}
                >
                  SignIn
                </Text>
              </Text>

              <View style={styles.divider} />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
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
    textAlignVertical: "center"
  },
  loginTxtSpan: {
    color: "#572fff", //primary color
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 24,
    textAlignVertical: "center"
  },
  divider: {
    borderTopColor: Colors.gray,
    borderTopWidth: StyleSheet.hairlineWidth,
    width: "30%",
    marginBottom: 30,
  },
});
