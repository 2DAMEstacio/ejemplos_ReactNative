import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Product } from "../types/product";
import { ProductCarousel } from "./ProductCarousel";

type Props = {
  product: Product;
  onPress?: () => void;
};

export const ProductCard = ({ product, onPress }: Props) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : null]}
  >
    {product.images.length > 0 ? (
      <ProductCarousel images={product.images} />
    ) : (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Sin imágenes</Text>
      </View>
    )}
    <View style={styles.info}>
      <Text style={styles.name}>{product.name}</Text>
      {product.description ? (
        <Text style={styles.description}>{product.description}</Text>
      ) : null}
      <Text style={styles.price}>
        {product.price.toLocaleString("es-ES", {
          style: "currency",
          currency: "EUR",
        })}
      </Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.9,
  },
  placeholder: {
    height: 220,
    borderRadius: 16,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: "#6b7280",
    fontSize: 14,
  },
  info: {
    marginTop: 12,
    gap: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  description: {
    fontSize: 14,
    color: "#4b5563",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
});
