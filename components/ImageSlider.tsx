import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  ViewToken,
  Animated,
} from "react-native";
import React, { useRef, useState } from "react";
import Pagination from "./Pagination";

type Props = {
  imageList: string[];
};
const width = Dimensions.get("screen").width;

const ImageSlider = ({ imageList }: Props) => {
  const [paginationIndex, setPaginationIndex] = useState(0);
  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (
      viewableItems.length > 0 &&
      viewableItems[0].index !== null &&
      viewableItems[0].index !== undefined
    ) {
      setPaginationIndex(viewableItems[0].index % imageList.length);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };
  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);
  return (
    <View>
      <FlatList
        data={imageList}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        scrollEventThrottle={16}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={({ item }) => (
          <View
            style={{
              width: width,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: item }}
              style={{ width: 375, height: 310, padding: 10, borderRadius: 10 }}
              resizeMode="contain"
            />
          </View>
        )}
      />
      <Pagination items={imageList} paginationIndex={paginationIndex} />
    </View>
  );
};

export default ImageSlider;

const styles = StyleSheet.create({});
