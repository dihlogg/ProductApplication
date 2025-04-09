import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { ProductType } from "@/types/type";

type Props = {
  products: ProductType[];
};

const criteria = [
  { key: "CpuType", label: "CPU" },
  { key: "RamType", label: "RAM" },
  { key: "RomType", label: "ROM" },
  { key: "ScreenSize", label: "Screen" },
  { key: "BateryCapacity", label: "Battery" },
  { key: "DetailsType", label: "Details" },
  { key: "ConnectType", label: "Connect" },
] as const;

const SimilarProducts = ({ products }: Props) => {
  return (
    <ScrollView horizontal style={styles.tableContainer}>
      <View>
      </View>
    </ScrollView>
  );
};

export default SimilarProducts;

const styles = StyleSheet.create({
  tableContainer: {
    marginTop: 10,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  cell: {
    minWidth: 100,
    paddingHorizontal: 6,
    paddingVertical: 4,
    fontSize: 14,
    textAlign: "center",
  },
  headerRow: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginBottom: 8,
  },
  headerCell: {
    fontWeight: "bold",
  },
  labelCell: {
    fontWeight: "600",
    textAlign: "left",
  },
});
