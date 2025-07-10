"use client";

import {
  Button,
  Input,
  VStack,
  Box,
  Text,
  Dialog,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Product, CreateProductData, UpdateProductData } from "@/types/global";
import { CATEGORIES } from "@/hooks/use-products";

interface ProductFormProps {
  onSubmit: (data: CreateProductData | UpdateProductData) => Promise<void>;
  product?: Product | null;
  isEdit?: boolean;
  trigger: React.ReactNode;
}

const DefaultValueForm = {
  name: "",
  price: 0,
  category: "",
  stock: 0,
};

export default function ProductForm({
  onSubmit,
  product,
  isEdit = false,
  trigger,
}: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(DefaultValueForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function resetForm() {
    setFormData(DefaultValueForm);
    setErrors({});
  }

  useEffect(() => {
    if (product && isEdit) {
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        stock: product.stock,
      });
    } else {
      resetForm();
    }
    setErrors({});
  }, [product, isEdit]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }
    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }
    if (formData.stock < 0) {
      newErrors.stock = "Stock cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData =
        isEdit && product ? { ...formData, id: product.id } : formData;

      await onSubmit(submitData);

      alert(
        `Product ${formData.name} has been ${
          isEdit ? "updated" : "created"
        } successfully.`
      );
    } catch (error) {
      alert(
        `Error: ${
          error instanceof Error ? error.message : "Something went wrong"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog.Root onExitComplete={resetForm}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxWidth="lg">
            <Dialog.Header>
              <Dialog.Title>
                {isEdit ? "Edit Product" : "Add New Product"}
              </Dialog.Title>
            </Dialog.Header>
            <Box p={6}>
              <VStack gap={4}>
                <Box width="100%">
                  <Text fontWeight="bold" mb={2}>
                    Product Name *
                  </Text>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter product name"
                    borderColor={errors.name ? "red.500" : undefined}
                  />
                  {errors.name && (
                    <Text color="red.500" fontSize="sm">
                      {errors.name}
                    </Text>
                  )}
                </Box>

                <Box width="100%">
                  <Text fontWeight="bold" mb={2}>
                    Price *
                  </Text>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      handleInputChange(
                        "price",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    borderColor={errors.price ? "red.500" : undefined}
                  />
                  {errors.price && (
                    <Text color="red.500" fontSize="sm">
                      {errors.price}
                    </Text>
                  )}
                </Box>

                <Box width="100%">
                  <Text fontWeight="bold" mb={2}>
                    Category *
                  </Text>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                      border: errors.category
                        ? "1px solid #E53E3E"
                        : "1px solid #E2E8F0",
                      backgroundColor: "white",
                    }}
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <Text color="red.500" fontSize="sm">
                      {errors.category}
                    </Text>
                  )}
                </Box>

                <Box width="100%">
                  <Text fontWeight="bold" mb={2}>
                    Stock *
                  </Text>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      handleInputChange("stock", parseInt(e.target.value) || 0)
                    }
                    placeholder="0"
                    min="0"
                    borderColor={errors.stock ? "red.500" : undefined}
                  />
                  {errors.stock && (
                    <Text color="red.500" fontSize="sm">
                      {errors.stock}
                    </Text>
                  )}
                </Box>
              </VStack>
            </Box>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Dialog.ActionTrigger asChild>
                <Button
                  colorScheme="blue"
                  onClick={handleSubmit}
                  loading={loading}
                >
                  {isEdit ? "Update" : "Create"} Product
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
