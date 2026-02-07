import { SUPABASE_STORAGE_BUCKET } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import type { Product, ProductForm } from "@/types/product";

export type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  images: string[] | null;
};

const resolveImageUrl = (image: string) => {
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const { data } = supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .getPublicUrl(image);
  return data.publicUrl;
};

// Espera una tabla "products" con columnas: id, name, description, price, images (text[]).
export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("id,name,description,price,images")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as ProductRow[];
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    images: (row.images ?? []).map(resolveImageUrl),
  }));
};

export const fetchProductByIdRaw = async (id: string): Promise<ProductForm> => {
  const { data, error } = await supabase
    .from("products")
    .select("id,name,description,price,images")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const row = data as ProductRow;
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    images: row.images ?? [],
  };
};

export const updateProduct = async (
  product: ProductForm,
): Promise<ProductForm> => {
  const { data, error } = await supabase
    .from("products")
    .update({
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images,
    })
    .eq("id", product.id)
    .select("id,name,description,price,images")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Producto no encontrado.");
  }

  const row = data as ProductRow;
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    images: row.images ?? [],
  };
};
