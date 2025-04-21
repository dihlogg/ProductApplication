import { View, StyleSheet, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import ChatWootView from "@/components/ChatWootView";
import { RegisterRequest } from "@/types/register-request";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatScreen = () => {
  const headerHeight = useHeaderHeight();

  return (
    <GestureHandlerRootView style={styles.root}>
      <Stack.Screen options={{ headerShown: true, headerTransparent: true }} />
      <View style={[styles.container, { marginTop: headerHeight }]}>
          {Platform.OS !== "web" && (
            <ChatWootView />
          )}
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
