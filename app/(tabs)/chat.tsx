import { View, StyleSheet, Platform } from "react-native";
import React from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import CustomChatView from "@/components/CustomChatView";
import ChatWootView from "@/components/ChatWootView";

const ChatScreen = () => {
  const headerHeight = useHeaderHeight();

  return (
    <GestureHandlerRootView style={styles.root}>
      <Stack.Screen options={{ headerShown: true, headerTransparent: true }} />
      <View style={[styles.container, { marginTop: headerHeight }]}>
        {/* {Platform.OS !== "web" && <CustomChatView />} */}
        <CustomChatView />
      </View>
    </GestureHandlerRootView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
});