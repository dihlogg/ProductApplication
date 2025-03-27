import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { CategoryType, ProductType } from "@/types/type";
import { API_ENDPOINTS } from "@/service/apiService";
import ProductList from "@/components/ProductList";
import { useNavigation } from "@react-navigation/native";

type Props = {};

const ProductByCategories = (props: Props) => {
  const { categoryId } = useLocalSearchParams();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const navigation = useNavigation();

//   useEffect(() => {
//     navigation.setOptions({ title: categoryName });
//   }, []);

  useEffect(() => {
    getProductByCategories();
    getCategoryName();
  }, []);

  useEffect(() => {
    navigation.setOptions({ title: categoryName }); // update categoryName
  }, [categoryName]);

  const getProductByCategories = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.GET_PRODUCT_BY_CATEGORY}/${categoryId}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getCategoryName = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_CATEGORIES);
      const categories: CategoryType[] = response.data;
      
      const category = categories.find((c) => c.id === categoryId);
      const categoryName = category?.categoryName ?? "Category Not Found";
      setCategoryName(categoryName);
    } catch (error) {
      console.error("Error fetching category name:", error);
    }
  };
  return (
    <View style={styles.productContainer}>
      <ProductList products={products} flatlist={false} />
    </View>
  );
};

export default ProductByCategories;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  productContainer: {
    marginTop: 20,
  }
});
