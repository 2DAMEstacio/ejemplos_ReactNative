import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

type Props = {
  images: string[];
};

export const ProductCarousel = ({ images }: Props) => {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(420, width - 32);
  const separatorWidth = 12;
  const [index, setIndex] = React.useState(0);

  return (
    <View>
      <FlatList
        data={images}
        keyExtractor={(item, i) => `${item}-${i}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + separatorWidth}
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const nextIndex = Math.round(
            event.nativeEvent.contentOffset.x / (cardWidth + separatorWidth),
          );
          setIndex(nextIndex);
        }}
        ItemSeparatorComponent={() => <View style={{ width: separatorWidth }} />}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={[styles.image, { width: cardWidth }]}
          />
        )}
      />
      {images.length > 1 ? (
        <View style={styles.dots}>
          {images.map((_, dotIndex) => (
            <View
              key={`dot-${dotIndex}`}
              style={[
                styles.dot,
                dotIndex === index ? styles.dotActive : null,
              ]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 220,
    borderRadius: 16,
    backgroundColor: "#f1f1f1",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#cfcfcf",
  },
  dotActive: {
    backgroundColor: "#111827",
  },
});
