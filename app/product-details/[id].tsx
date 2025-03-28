import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { ProductType } from "@/types/type";
import ImageSlider from "@/components/ImageSlider";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useHeaderHeight } from "@react-navigation/elements";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeInDown, SlideInDown } from "react-native-reanimated";
import { API_ENDPOINTS } from "@/service/apiService";
import { addToCart } from "@/service/cartService";
import { useNavigation } from "@react-navigation/native";


type Props = {};

const ProductDetails = (props: Props) => {
  const headerHeight = useHeaderHeight();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<ProductType>();
  const navigation = useNavigation();
  useEffect(() => {
    getProductDetails();
  }, []);
  useEffect(() => {
    if (product?.name) {
      navigation.setOptions({ title: product.name });
    }
  }, [product]);

  const getProductDetails = async () => {
    const response = await axios.get(`${API_ENDPOINTS.GET_PRODUCT_DETAILS}/${id}`);
    setProduct(response.data);
  };
  const handleAddToCart = async () => {
    if (product?.id) {
      const success = await addToCart(product.id);
      if (success) {
        Alert.alert("Success", "Product added to cart!");
      } else {
        Alert.alert("Error", "Failed to add product to cart.");
      }
    }
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTransparent: true,
          // headerLeft: () => (
          //   <TouchableOpacity onPress={() => router.back()}>
          //     <Ionicons name="arrow-back" size={24} color={Colors.black} />
          //   </TouchableOpacity>
          // ),
          headerRight: () => (
            <TouchableOpacity>
              <Ionicons name="cart-outline" size={24} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={{ marginTop: headerHeight, marginBottom: 90 }}>
        <View>
          {product && (
            <Animated.View entering={FadeInDown.delay(300).duration(500)}>
              <ImageSlider imageList={product.productImages.map(img => img.imageUrl)} />

            </Animated.View>
          )}
          {product && (
            <View style={styles.container}>
              <Animated.View
                style={styles.ratingWrapper}
                entering={FadeInDown.delay(500).duration(500)}
              >
                <View style={styles.ratingWrapper}>
                  <Ionicons name="star" size={18} color={"#D4AF37"} />
                  <Text style={styles.rating}>
                    4.7 <Text>{136}</Text>
                  </Text>
                </View>
                <TouchableOpacity>
                  <Ionicons
                    name="heart-outline"
                    size={20}
                    color={Colors.black}
                  />
                </TouchableOpacity>
              </Animated.View>

              <Animated.Text
                style={styles.title}
                entering={FadeInDown.delay(700).duration(500)}
              >
                {product.name}
              </Animated.Text>

              <Animated.View
                style={styles.priceWrapper}
                entering={FadeInDown.delay(900).duration(500)}
              >
                <Text style={styles.price}>
                              {product.price.toLocaleString("vi-VN")} VNĐ
                            </Text>
                <View style={styles.priceDiscount}>
                  <Text style={styles.priceDiscountTxt}>6% Off</Text>
                </View>
                <Text style={styles.oldPrice}>${product.price + 2}</Text>
              </Animated.View>

              <Animated.Text
                style={styles.description}
                entering={FadeInDown.delay(1100).duration(500)}
              >
                {product.description}
              </Animated.Text>

              <Animated.View
                style={styles.productVariationWrapper}
                entering={FadeInDown.delay(1300).duration(500)}
              >
              </Animated.View>
            </View>
          )}
        </View>
      </ScrollView>
      <Animated.View
        style={styles.buttonWrapper}
        entering={SlideInDown.delay(500).duration(500)}
      >
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: Colors.white,
              borderColor: Colors.primary,
              borderWidth: 1,
            },
          ]}
          onPress={handleAddToCart}
        >
          <Ionicons name="cart-outline" size={20} color={Colors.primary} />
          <Text style={[styles.buttonText, { color: Colors.primary }]}>
            Add to Cart
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  ratingWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  rating: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 400,
    color: Colors.gray,
  },
  title: {
    fontSize: 28,
    fontWeight: 400,
    color: Colors.black,
    letterSpacing: 0.6,
    lineHeight: 32,
  },
  priceWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 5,
  },
  price: {
    fontSize: 18,
    fontWeight: 600,
    color: Colors.black,
  },
  priceDiscount: {
    backgroundColor: Colors.extraLightGray,
    padding: 5,
    borderRadius: 5,
  },
  priceDiscountTxt: {
    fontSize: 14,
    fontWeight: 400,
    color: Colors.primary,
  },
  oldPrice: {
    fontSize: 16,
    fontWeight: 400,
    textDecorationLine: "line-through",
    color: Colors.gray,
  },
  description: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 400,
    color: Colors.black,
    letterSpacing: 0.6,
    lineHeight: 24,
  },
  productVariationWrapper: {
    flexDirection: "row",
    marginTop: 20,
    flexWrap: "wrap",
  },
  productVariationType: {
    width: "50%",
    gap: 5,
    marginBottom: 10,
  },
  productVariationTitle: {
    fontSize: 16,
    fontWeight: 500,
    color: Colors.black,
  },
  productVariationValueWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexWrap: "wrap",
  },
  productVariationColorValue: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.extraLightGray,
  },
  productVariationSizeValue: {
    width: 50,
    height: 30,
    borderRadius: 5,
    backgroundColor: Colors.extraLightGray,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.lightGray,
    borderWidth: 1,
  },
  productVariationSizeValueText: {
    fontSize: 12,
    fontWeight: 500,
    color: Colors.black,
  },
  buttonWrapper: {
    position: "absolute",
    height: 90,
    padding: 20,
    bottom: 0,
    width: "100%",
    backgroundColor: Colors.white,
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: Colors.primary,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    gap: 5,
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 500,
    color: Colors.white,
  },
});
