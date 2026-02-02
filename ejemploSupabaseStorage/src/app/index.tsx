import { Stack, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";

export default function Home() {
  const router = useRouter();
  const { data, isLoading, isError, error } = useProducts();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Productos",
          headerStyle: { backgroundColor: "#f8fafc" },
        }}
      />
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : isError ? (
        <View style={styles.message}>
          <Text style={styles.messageTitle}>No se pudo cargar.</Text>
          <Text style={styles.messageBody}>
            {(error as Error).message}
          </Text>
        </View>
      ) : data && data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => router.push(`/products/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.message}>
          <Text style={styles.messageTitle}>Sin productos.</Text>
          <Text style={styles.messageBody}>
            Añade productos en Supabase para verlos aquí.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  list: {
    padding: 16,
  },
  message: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 8,
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  messageBody: {
    fontSize: 14,
    color: "#4b5563",
    textAlign: "center",
  },
});
