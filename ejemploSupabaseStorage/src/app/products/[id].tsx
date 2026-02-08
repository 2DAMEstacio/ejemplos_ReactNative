import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Image,
} from "react-native";

import { useDeleteProduct } from "@/hooks/useDeleteProduct";
import { useProduct } from "@/hooks/useProduct";
import { useUpdateProduct } from "@/hooks/useUpdateProduct";
import { resolveStorageUrl, uploadProductImage } from "@/services/storage";

export default function ProductEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError, error } = useProduct(id ?? "");
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [images, setImages] = React.useState<string[]>([]);
  const [formError, setFormError] = React.useState("");
  const [uploading, setUploading] = React.useState(false);

  React.useEffect(() => {
    if (data) {
      setName(data.name);
      setDescription(data.description ?? "");
      setPrice(String(data.price));
      setImages(data.images);
    }
  }, [data]);

  const handleAddImages = async () => {
    setFormError("");
    if (!data?.id) {
      Alert.alert("Espera un momento", "El producto aún no está cargado.");
      return;
    }
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Necesitamos acceso a tus fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });


    if (result.canceled) return;

    try {
      setUploading(true);
      const uploadedPaths: string[] = [];
      for (const asset of result.assets) {
        const path = await uploadProductImage(
          asset.uri,
          data?.id ?? "",
          asset.fileName,
        );
        uploadedPaths.push(path);
      }
      setImages((prev) => [...prev, ...uploadedPaths]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al subir imágenes.";
      Alert.alert("Error", message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setFormError("");
    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError("El nombre es obligatorio.");
      return;
    }

    const normalizedPrice = price.replace(",", ".").trim();
    const parsedPrice = Number.parseFloat(normalizedPrice);
    if (Number.isNaN(parsedPrice)) {
      setFormError("El precio debe ser un número válido.");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: data?.id ?? "",
        name: trimmedName,
        description: description.trim() ? description.trim() : null,
        price: parsedPrice,
        images,
      });
      Alert.alert("Guardado", "Producto actualizado correctamente.");
      router.back();
    } catch (err) {
      console.log(err);
      const message = err instanceof Error ? err.message : "Error al guardar.";
      Alert.alert("Error", message);
    }
  };

  const handleDelete = () => {
    if (!data?.id) {
      return;
    }
    Alert.alert("Eliminar producto", "¿Seguro que quieres eliminarlo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(data.id);
            Alert.alert("Eliminado", "Producto eliminado.");
            router.back();
          } catch (err) {
            const message =
              err instanceof Error ? err.message : "Error al eliminar.";
            Alert.alert("Error", message);
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.messageTitle}>No se pudo cargar.</Text>
        <Text style={styles.messageBody}>{(error as Error).message}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Stack.Screen
        options={{
          title: "Editar producto",
          headerStyle: { backgroundColor: "#f8fafc" },
        }}
      />
      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Nombre del producto"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Descripción"
            style={[styles.input, styles.multiline]}
            multiline
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Precio</Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            placeholder="0.00"
            keyboardType="decimal-pad"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Imágenes</Text>
          <Pressable
            onPress={handleAddImages}
            disabled={uploading}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed ? styles.buttonPressed : null,
              uploading ? styles.buttonDisabled : null,
            ]}
          >
            <Text style={styles.secondaryButtonText}>
              {uploading ? "Subiendo..." : "Añadir imágenes"}
            </Text>
          </Pressable>

          <View style={styles.imagesGrid}>
            {images.length === 0 ? (
              <Text style={styles.helperText}>No hay imágenes aún.</Text>
            ) : (
              images.map((uri, index) => (
                <View key={`${uri}-${index}`} style={styles.imageItem}>
                  <Image source={{ uri: resolveStorageUrl(uri) }} style={styles.thumbnail} />
                  <Pressable
                    onPress={() => handleRemoveImage(index)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>Quitar</Text>
                  </Pressable>
                </View>
              ))
            )}
          </View>
        </View>

        {formError ? <Text style={styles.error}>{formError}</Text> : null}

        <Pressable
          onPress={handleSave}
          disabled={updateMutation.isPending}
          style={({ pressed }) => [
            styles.button,
            pressed ? styles.buttonPressed : null,
            updateMutation.isPending ? styles.buttonDisabled : null,
          ]}
        >
          <Text style={styles.buttonText}>
            {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleDelete}
          disabled={deleteMutation.isPending}
          style={({ pressed }) => [
            styles.deleteButton,
            pressed ? styles.buttonPressed : null,
            deleteMutation.isPending ? styles.buttonDisabled : null,
          ]}
        >
          <Text style={styles.deleteButtonText}>
            {deleteMutation.isPending ? "Eliminando..." : "Eliminar producto"}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  messageBody: {
    fontSize: 14,
    color: "#4b5563",
    textAlign: "center",
  },
  form: {
    padding: 16,
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 14,
    color: "#111827",
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: "top",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#111827",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  secondaryButtonText: {
    color: "#111827",
    fontWeight: "600",
  },
  imagesGrid: {
    gap: 12,
  },
  helperText: {
    color: "#6b7280",
    fontSize: 13,
  },
  imageItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#f1f1f1",
  },
  removeButton: {
    marginLeft: "auto",
    backgroundColor: "#fee2e2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  removeButtonText: {
    color: "#b91c1c",
    fontWeight: "600",
    fontSize: 12,
  },
  error: {
    color: "#b91c1c",
    fontSize: 13,
  },
  button: {
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#fee2e2",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#b91c1c",
    fontWeight: "600",
  },
});
