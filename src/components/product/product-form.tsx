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
  InputGroup,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Product, CreateProductData, UpdateProductData } from "@/types/global";
import { CATEGORIES } from "@/hooks/use-products";
import { toaster } from "../ui/toaster";

interface ProductFormProps {
  onSubmit: (data: CreateProductData | UpdateProductData) => Promise<void>;
  product?: Product | null;
  isEdit?: boolean;
  trigger: (onTrigger: () => void) => React.ReactNode;
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
  const [isOpen, setIsOpen] = useState(false);

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
    if (formData.stock <= 0) {
      newErrors.stock = "Stock cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const onTriggerClick = () => {
    setIsOpen(true);
  };

  const onCloseDialog = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData =
        isEdit && product ? { ...formData, id: product.id } : formData;

      await onSubmit(submitData);

      toaster.success({
        description: `Product ${formData.name} has been ${
          isEdit ? "updated" : "created"
        } successfully.`,
      });
    } catch {
      toaster.error({
        description: `Failed to ${isEdit ? "update" : "create"} product.`,
      });
    } finally {
      setLoading(false);
      onCloseDialog();
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onExitComplete={onCloseDialog}
      onFocusOutside={onCloseDialog}
      closeOnInteractOutside={false}
    >
      <Dialog.Trigger asChild>{trigger(onTriggerClick)}</Dialog.Trigger>
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
                  <InputGroup startElement="Rp">
                    <Input
                      value={formData.price || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d*\.?\d*$/.test(value)) {
                          handleInputChange("price", parseFloat(value) || 0);
                        }
                      }}
                      placeholder="0"
                      borderColor={errors.price ? "red.500" : undefined}
                    />
                  </InputGroup>
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
                    type="text"
                    value={formData.stock || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow integers (no decimal point for stock)
                      if (value === "" || /^\d+$/.test(value)) {
                        handleInputChange("stock", parseInt(value) || 0);
                      }
                    }}
                    placeholder="0"
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
                <Button variant="outline" onClick={onCloseDialog}>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>

              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                loading={loading}
              >
                {isEdit ? "Update" : "Create"} Product
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" onClick={onCloseDialog} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
