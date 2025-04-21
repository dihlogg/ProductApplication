import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

type Props = {
  onSearch: (query: string) => void;
};

const Header = ({ onSearch }: Props) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchPress = () => {
    onSearch(searchQuery); // Trigger search
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      onSearch("");
    }
  }, [searchQuery]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.logo}>T-Shop</Text>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={Colors.gray} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={handleSearchPress}>
          <Ionicons name="search-outline" size={24} color={Colors.gray} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 15,
  },
  logo: {
    fontSize: 24,
    fontWeight: 700,
    color: Colors.primary,
  },
  searchBar: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 8,
  },
  searchTxt: {
    color: Colors.black,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 6,
    fontSize: 16,
  },
});
