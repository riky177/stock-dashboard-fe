"use client";

import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import { useState, useEffect, useCallback } from "react";
import type {
  Product,
  ProductFilters as ProductFiltersType,
  CreateProductData,
  UpdateProductData,
} from "@/types/global";
import { useProducts } from "@/hooks/use-products";
import { useUrlParams } from "@/hooks/use-url-params";
import ProductForm from "./product-form";
import ProductFilters from "./product-filters";
import ProductTableView from "./product-table-view";
import ProductPagination from "./product-pagination";
import { useColorModeValue } from "../ui/color-mode";
import { toaster } from "../ui/toaster";
import { useSession } from "next-auth/react";

export default function ProductTable() {
  const { data, status } = useSession();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const { getFiltersFromUrl, updateUrlParams } = useUrlParams();

  const [filters, setFilters] = useState<ProductFiltersType>({});

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const urlFilters = getFiltersFromUrl();
    setFilters(urlFilters);
  }, [getFiltersFromUrl]);

  useEffect(() => {
    if (Object.keys(filters).length > 0 && status === "authenticated") {
      fetchProducts(filters);
    }
  }, [filters, fetchProducts, status]);

  const handleFiltersChange = useCallback(
    (newFilters: Partial<ProductFiltersType>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      updateUrlParams(newFilters);
    },
    [filters, updateUrlParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      handleFiltersChange({ page: newPage });
    },
    [handleFiltersChange]
  );

  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      handleFiltersChange({ limit: newSize, page: 1 });
    },
    [handleFiltersChange]
  );

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
  }, []);

  const handleDelete = useCallback(
    async (productId: string) => {
      try {
        await deleteProduct(productId);
        await fetchProducts(filters);
        toaster.success({ description: "Product deleted successfully" });
      } catch {
        toaster.error({ description: "Failed to delete product" });
      }
    },
    [deleteProduct, fetchProducts, filters]
  );

  const handleAddNew = () => {
    setEditingProduct(null);
  };

  const handleFormSubmit = async (
    data: CreateProductData | UpdateProductData
  ) => {
    try {
      if (editingProduct) {
        await updateProduct(data as UpdateProductData);
      } else {
        await createProduct(data as CreateProductData);
      }
      fetchProducts(filters);
    } catch (error) {
      throw error;
    }
  };

  if (error) {
    return (
      <Box bg={bgColor} p={6} borderRadius="md" textAlign="center">
        <Text color="red.500">Error: {error}</Text>
      </Box>
    );
  }

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="md"
      border="1px"
      borderColor={borderColor}
    >
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize={{ base: "md", md: "2xl" }} fontWeight="bold">
          Product Inventory
        </Text>
        {data?.user?.role === "admin" && (
          <ProductForm
            onSubmit={handleFormSubmit}
            product={null}
            isEdit={false}
            trigger={
              <Button
                colorPalette="blue"
                onClick={() => {
                  handleAddNew();
                }}
                p={2}
                gap="2px"
              >
                <FiPlus />
                Add Product
              </Button>
            }
          />
        )}
      </Flex>

      <ProductFilters filters={filters} onFiltersChange={handleFiltersChange} />

      <ProductTableView
        products={products}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSubmit={handleFormSubmit}
      />

      {!loading && products?.length > 0 && (
        <ProductPagination
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </Box>
  );
}
