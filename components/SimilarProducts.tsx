import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { ProductType } from "@/types/type";
import { Link } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

type Props = {
  item: ProductType;
  index: number;
};
const width = Dimensions.get("window").width - 40;

const SimilarProducts = ({ item, index }: Props) => {
  const criteria = [
    { key: "cpuType", label: "CPU" },
    { key: "ramType", label: "RAM" },
    { key: "romType", label: "ROM" },
    { key: "screenSize", label: "Screen" },
    { key: "bateryCapacity", label: "Battery" },
    { key: "detailsType", label: "Details" },
    { key: "connectType", label: "Connect" },
  ] as const;

  return (
    <Link
      href={{
        pathname: "/product-details/[id]",
        params: {
          id: item.id ?? Math.random().toString(),
        },
      }}
      asChild
    >
      <TouchableOpacity style={{ width: 250 }}>
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

          {/* Table info */}
          <View style={{ marginTop: 10 }}>
            {criteria.map(({ key, label }, idx) => {
              const value = item[key as keyof typeof item];
              const isValid =
                value &&
                (typeof value === "string" || typeof value === "number");

              return isValid ? (
                <View key={key} style={{ marginBottom: 10 }}>
                  <Text style={styles.criteriaLabel}>{label}</Text>
                  <Text style={styles.criteriaValue}>{value}</Text>

                  {idx !== criteria.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </View>
              ) : null;
            })}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );
};

export default SimilarProducts;

const styles = StyleSheet.create({
  container: {
    width: width / 1.9,
    left: 20,
  },
  productImg: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 15,
    marginBottom: 10,
  },
  bookmarkBtn: {
    position: "absolute",
    right: 10,
    top: 20,
    backgroundColor: "rgba(255,255,255,0.6)",
    padding: 5,
    borderRadius: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
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
  criteriaLabel: {
    fontSize: 15,
    fontWeight: 600,
    color: Colors.black,
    marginBottom: 4,
  },
  criteriaValue: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.gray,
    marginTop: 6,
  },
});
