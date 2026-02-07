import { useQuery } from "@tanstack/react-query";

import { fetchProductByIdRaw } from "@/services/products";

export const useProduct = (id: string) =>
  useQuery({
    queryKey: ["products", id],
    queryFn: () => fetchProductByIdRaw(id),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
