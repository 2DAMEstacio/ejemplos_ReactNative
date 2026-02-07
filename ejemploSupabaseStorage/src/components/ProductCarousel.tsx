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
  const [index, setIndex] = React.useState(0);
  const listRef = React.useRef<FlatList<string>>(null);
  const autoScrollDelay = 4000;

  React.useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, autoScrollDelay);
    return () => clearInterval(timer);
  }, [images.length]);

  React.useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollToOffset({
      offset: index * cardWidth,
      animated: true,
    });
  }, [index, cardWidth]);

  return (
    <View>
      <FlatList
        ref={listRef}
        data={images}
        keyExtractor={(item, i) => `${item}-${i}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth}
        decelerationRate="normal"
        style={[styles.list, { width: cardWidth }]}
        onMomentumScrollEnd={(event) => {
          const nextIndex = Math.round(
            event.nativeEvent.contentOffset.x / cardWidth,
          );
          setIndex(nextIndex);
        }}
        getItemLayout={(_, i) => ({
          length: cardWidth,
          offset: cardWidth * i,
          index: i,
        })}
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
  list: {
    alignSelf: "center",
  },
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
