import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
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
import FlashSale from "@/components/FlashSale";
import { API_ENDPOINTS } from "@/service/config";

type Props = {};

const HomeScreen = (props: Props) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [saleProducts, setSaleProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  return (
    <GestureHandlerRootView>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => <Header />,
        }}
      />
      <ScrollView>
      <Categories categories={categories} />
      <FlashSale/>
      <View style={{ marginHorizontal: 20, marginBottom: 10 }}>
        <Image
          source={require("@/assets/images/702-LycNL.webp")}
          style={{ width: "100%", height: 150, borderRadius: 15 }}
        />
      </View>
      <ProductList products={products} flatlist={false} />
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
