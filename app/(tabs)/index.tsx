import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { CategoryType, ProductType } from "@/types/type";
import { FlatList } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import Header from "@/components/Header";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ProductList from "@/components/ProductList";
import Categories from "@/components/Categories";
import { API_ENDPOINTS } from "@/service/apiService";
import Features from "@/components/Features";
import ChatWootWidget from "@/components/ChatwootWebView";
import FloatingChatButton from "@/components/FloatingChatButton";

type Props = {};

const HomeScreen = (props: Props) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chatVisible, setChatVisible] = useState(false);

  useEffect(() => {
    getCategories();
    getProducts();
  }, []);

  const getProducts = async () => {
    const response = await axios.get(API_ENDPOINTS.GET_PRODUCT_INFO);
    setProducts(response.data);
    setIsLoading(false);
  };

  const getCategories = async () => {
    const response = await axios.get(API_ENDPOINTS.GET_CATEGORIES);
    setCategories(response.data);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }
  const toggleChat = () => {
    setChatVisible(!chatVisible);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => <Header />,
        }}
      />
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <Categories categories={categories} />
          <Features />
          <View style={{ marginHorizontal: 20, marginBottom: 10 }}>
            <Image
              source={require("@/assets/images/702-LycNL.webp")}
              style={{ width: "100%", height: 150, borderRadius: 15 }}
            />
          </View>
          <ProductList products={products} flatlist={false} />
        </ScrollView>
        {Platform.OS !== "web" && (
          <>
            <ChatWootWidget visible={chatVisible} />
            <FloatingChatButton onPress={toggleChat} isActive={chatVisible} />
          </>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  chatWootContainer: {
    position: "absolute",
    right: 10,
    bottom: 20,
    width: 100,
    height: 400,
    zIndex: 100,
  },
});
