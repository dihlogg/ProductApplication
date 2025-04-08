import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { ProductType } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Link } from "expo-router";

type Props = {
  item: ProductType;
  index: number;
  productType: "history" | "regular";
};
const width = Dimensions.get("window").width - 40;

const ProductItem = ({ item, index, productType }: Props) => {
  return (
    <Link
      href={{
        pathname: "/product-details/[id]",
        params: {
          id: item.id ?? Math.random().toString(),
          productType: productType,
        },
      }}
      asChild
    >
      <TouchableOpacity>
        <Animated.View
          style={styles.container}
          entering={FadeInDown.delay(300 + index * 100).duration(500)}
        >
          <Image
            source={{
              uri:
                item?.productImages?.length > 0
                  ? item.productImages[0].imageUrl
                  : "https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/b1/ff/b1ff8943a6d5c41189d9a59591fd68b2.png",
            }}
            style={styles.productImg}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.bookmarkBtn}>
            <Ionicons name="heart-outline" size={22} color={Colors.black} />
          </TouchableOpacity>
          <View style={styles.productInfo}>
            <Text style={styles.price}>
              {item.price.toLocaleString("vi-VN")} VNĐ
            </Text>
            <View style={styles.ratingWrapper}>
              <Ionicons name="star" size={16} color={"#D4AF37"} />
            </View>
          </View>
          <Text style={styles.title}>{item.name}</Text>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  container: {
    width: width / 2 - 15,
  },
  productImg: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 15,
    marginBottom: 10,
  },
  bookmarkBtn: {
    position: "absolute",
    right: 20,
    top: 20,
    backgroundColor: "rgba(255,255,255,0.6)",
    padding: 5,
    borderRadius: 30,
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: Colors.black,
    letterSpacing: 1.1,
  },
  productInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: 700,
    color: Colors.primary,
  },
  ratingWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  rating: {
    fontSize: 14,
    color: Colors.gray,
  },
});
