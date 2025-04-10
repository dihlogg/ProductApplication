import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { ProductType } from "@/types/type";
import ProductItem from "./ProductItem";
import { API_ENDPOINTS } from "@/service/apiService";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

type Props = {};

const Features = (props: Props) => {
  const [featuredProducts, setFeaturedProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    GetFeaturedProducts();
  }, []);

  const GetFeaturedProducts = async () => {
    const response = await axios.get(
      API_ENDPOINTS.GET_FEATURED_PRODUCTS_HISTORY
    );
    console.log("Featured Products:", response.data);
    setFeaturedProducts(response.data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <View style={styles.timerWrapper}>
          <Text style={styles.title}>Featured Products</Text>
          <Ionicons name="trending-up-outline" size={20} color={"#FE2020"} />
          <Ionicons name="trending-up-outline" size={20} color={"#FE2020"} />
          <Ionicons name="trending-up-outline" size={20} color={"#FE2020"} />
        </View>
        <TouchableOpacity>
          <Text style={styles.titleBtn}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={featuredProducts}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ marginLeft: 20, paddingRight: 10 }}
        keyExtractor={(item) => item.id ?? Math.random().toString()}
        renderItem={({ index, item }) => (
          <View style={{ marginRight: 20 }}>
            <ProductItem index={index} item={item} productType="regular" />
          </View>
        )}
      />
    </View>
  );
};

export default Features;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: 0.6,
    color: Colors.black,
  },
  titleBtn: {
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: 0.6,
    color: Colors.black,
  },
  timerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
