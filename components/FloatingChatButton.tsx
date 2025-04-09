import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
} from "react-native";

interface FloatingChatButtonProps {
  onPress: () => void;
  isActive?: boolean;
}

const FloatingChatButton = ({
  onPress,
  isActive = false,
}: FloatingChatButtonProps) => {
  if (Platform.OS === "web") {
    return null;
  }

  return (
    <TouchableOpacity
      style={[styles.button, isActive && styles.activeButton]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.buttonContent}>
        {!isActive && <Text style={styles.buttonText}>Hỗ trợ</Text>}
      </View>
    </TouchableOpacity>
  );
};

export default FloatingChatButton;

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#4A6FFF",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  activeButton: {
    backgroundColor: "#FF4A6F",
    paddingHorizontal: 12,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
});

