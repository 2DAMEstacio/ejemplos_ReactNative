import { SUPABASE_STORAGE_BUCKET } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";

export const resolveStorageUrl = (image: string) => {
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const { data } = supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .getPublicUrl(image);
  return data.publicUrl;
};

const getFileExtension = (uri: string, fileName?: string | null) => {
  const name = fileName ?? uri.split("/").pop() ?? "";
  const parts = name.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "jpg";
};

const getContentType = (ext: string) => {
  switch (ext) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "heic":
      return "image/heic";
    case "jpeg":
    case "jpg":
    default:
      return "image/jpeg";
  }
};

export const uploadProductImage = async (
  uri: string,
  productId: string,
  fileName?: string | null,
): Promise<string> => {
  const ext = getFileExtension(uri, fileName);
  const contentType = getContentType(ext);
  const path = `products/${productId}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${ext}`;

  const response = await fetch(uri);
  const blob = await response.blob();

  const { error } = await supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .upload(path, blob, {
      contentType,
      upsert: false,
    });

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  return path;
};
