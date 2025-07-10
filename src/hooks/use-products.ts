import { useCallback, useState } from "react";
import {
  Product,
  ProductFilters,
  CreateProductData,
  UpdateProductData,
  ProductsResponse,
  HTTPResponse,
} from "@/types/global";
import { useAuthFetch } from "@/hooks/use-auth-fetch";

export const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Food & Beverage",
  "Accessories",
  "Health",
  "Books",
];

export function useProducts() {
  const { authFetch } = useAuthFetch();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchProducts = useCallback(
    async (filters: ProductFilters = {}) => {
      setLoading(true);
      setError(null);

      try {
        const searchParams = new URLSearchParams();

        if (filters.name) {
          searchParams.append("name", filters.name);
        }
        if (filters.category) {
          searchParams.append("category", filters.category);
        }
        if (filters.min_price !== undefined) {
          searchParams.append("min_price", filters.min_price.toString());
        }
        if (filters.max_price !== undefined) {
          searchParams.append("max_price", filters.max_price.toString());
        }
        if (filters.sortBy) {
          searchParams.append("sortBy", filters.sortBy);
        }
        if (filters.sortOrder) {
          searchParams.append("sortOrder", filters.sortOrder);
        }

        const page = filters.page || 1;
        const limit = filters.limit || 10;
        searchParams.append("page", page.toString());
        searchParams.append("limit", limit.toString());

        const url = `/products${
          searchParams.toString() ? `?${searchParams.toString()}` : ""
        }`;

        const response = await authFetch<HTTPResponse<ProductsResponse>>(url, {
          method: "GET",
        });

        setProducts(response.data.products);
        setPagination({
          page: response.data.page,
          limit: response.data.limit,
          total: response.data.total,
          totalPages: response.data.totalPages,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products"
        );
      } finally {
        setLoading(false);
      }
    },
    [authFetch]
  );

  const createProduct = useCallback(
    async (productData: CreateProductData) => {
      try {
        const newProduct = await authFetch<Product>("/products", {
          method: "POST",
          body: JSON.stringify(productData),
        });

        return newProduct;
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "Failed to create product"
        );
      }
    },
    [authFetch]
  );

  const updateProduct = useCallback(
    async (productData: UpdateProductData) => {
      try {
        const updatedProduct = await authFetch<Product>(
          `/products/${productData.id}`,
          {
            method: "PUT",
            body: JSON.stringify(productData),
          }
        );

        return updatedProduct;
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "Failed to update product"
        );
      }
    },
    [authFetch]
  );

  const deleteProduct = useCallback(
    async (productId: string) => {
      try {
        await authFetch(`/products/${productId}`, {
          method: "DELETE",
        });
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "Failed to delete product"
        );
      }
    },
    [authFetch]
  );

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
