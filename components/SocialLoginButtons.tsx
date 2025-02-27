import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Href, Link } from "expo-router";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import Google from "@/assets/images/google-logo.svg";

type Props = {
    emailHref: Href;
};

const SocialLoginButtons = (props: Props) => {
    const {emailHref} = props;
  return (
    <View style={styles.socialLoginWrapper}>
      <Animated.View entering={FadeInDown.delay(300).duration(500)}>
        <Link href={emailHref} asChild>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="mail-outline" size={20} color="333" />
            <Text style={styles.btnTxt}>Continue with Email</Text>
          </TouchableOpacity>
        </Link>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(700).duration(500)}>
        <Link href={"/signup"} asChild>
          <TouchableOpacity style={styles.button}>
            <Google width={20} height={20} />
            <Text style={styles.btnTxt}>Continue with Google</Text>
          </TouchableOpacity>
        </Link>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(1100).duration(500)}>
        <Link href={"/signup"} asChild>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="logo-apple" size={20} color="333" />
            <Text style={styles.btnTxt}>Continue with Apple</Text>
          </TouchableOpacity>
        </Link>
      </Animated.View>
    </View>
  );
};

export default SocialLoginButtons;

const styles = StyleSheet.create({
  socialLoginWrapper: {
    alignSelf: "stretch",
  },
  button: {
    flexDirection: "row",
    padding: 10,
    borderColor: "#666",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginBottom: 15,
  },
  btnTxt: {
    fontSize: 14,
    fontWeight: 600,
    color: "#333", //black
  },
});
