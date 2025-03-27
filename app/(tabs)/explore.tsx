import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CategoryType, ProductType } from "@/types/type";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Link, router, Stack } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { Colors } from "@/constants/Colors";
import Animated, { FadeInDown } from "react-native-reanimated";
import { API_ENDPOINTS } from "@/service/apiService";

type Props = {
  item: ProductType;
};

const ExploreScreen = ({ item }: Props) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const headerHeight = useHeaderHeight();

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const response = await axios.get(API_ENDPOINTS.GET_CATEGORIES);
    setCategories(response.data);
  };

  return (
    <GestureHandlerRootView>
      <Stack.Screen options={{ headerShown: true, headerTransparent: true }} />
      <View style={[styles.container, { marginTop: headerHeight }]}>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id ?? Math.random().toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => router.push(`/product-by-categories/${item.id}`)}
            >
              <Animated.View style={styles.itemWrapper}>
                <Text style={styles.itemTitle}>{item.categoryName}</Text>
                <Image
                  source={{ uri: `data:image/png;base64,${item.image}` }}
                  style={{ width: 100, height: 100 }}
                />
              </Animated.View>
            </TouchableOpacity>
          )}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  itemWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.extraLightGray,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 500,
    color: Colors.black,
  },
});
