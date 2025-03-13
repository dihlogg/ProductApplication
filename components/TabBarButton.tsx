import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import React from "react";
import { icon } from "@/constants/Icons";
import { Colors } from "@/constants/Colors";

type Props = {
  onPress: (event: GestureResponderEvent) => void;
  onLongPress: (event: GestureResponderEvent) => void;
  isFocused: boolean;
  label: string;
  routeName: string;
};

const TabBarButton = (props: Props) => {
  const { onPress, onLongPress, isFocused, label, routeName } = props;
  const IconComponent = icon[routeName as keyof typeof icon];
  if (!IconComponent) {
    console.warn(`No icon found for route: ${routeName}`);
    return null;
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabBarBtn}
    >
      {routeName === "cart" && (
        <View style={styles.badgeWrapper}>
          <Text style={styles.badgeText}>1</Text>
        </View>
      )}
      
      <IconComponent color={isFocused ? Colors.primary : Colors.black} />
      
      <Text style={{ color: isFocused ? "#673ab7" : "#222" }}>{label}</Text>
    </TouchableOpacity>
  );
};

export default TabBarButton;

const styles = StyleSheet.create({
  tabBarBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  badgeWrapper: {
    position: "absolute",
    backgroundColor: Colors.highlight,
    top: -8,
    right: 17,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    zIndex: 10,
  },
  badgeText: {
    color: Colors.black,
    fontSize: 12,
  },
});
