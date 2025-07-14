"use client";

import { Box, Flex, Input, InputGroup, VStack } from "@chakra-ui/react";
import { CATEGORIES } from "@/hooks/use-products";
import type { ProductFilters } from "@/types/global";
import { AiOutlineClose } from "react-icons/ai";

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: Partial<ProductFilters>) => void;
}

export default function ProductFilters({
  filters,
  onFiltersChange,
}: ProductFiltersProps) {
  const handleClearSearch = () => {
    onFiltersChange({ name: "" });
  };
  return (
    <VStack gap={4} mb={6}>
      <Box width="100%">
        <InputGroup
          endElement={
            filters.name ? (
              <AiOutlineClose cursor={"pointer"} onClick={handleClearSearch} />
            ) : undefined
          }
        >
          <Input
            placeholder="Search products..."
            value={filters.name || ""}
            size="sm"
            onChange={(e) => onFiltersChange({ name: e.target.value })}
          />
        </InputGroup>
      </Box>

      <Flex direction={{ base: "column", md: "row" }} gap={4} width="100%">
        <Box flex="1" minW={{ base: "100%", md: "150px" }}>
          <select
            value={filters.category || ""}
            onChange={(e) => onFiltersChange({ category: e.target.value })}
            style={{
              width: "100%",
              padding: "6px 8px",
              borderRadius: "6px",
              border: "1px solid #E2E8F0",
              backgroundColor: "white",
              fontSize: "14px",
            }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Box>

        <Flex direction="row" gap={4} flex="1">
          <Box flex="1" minW={{ base: "100px", sm: "120px" }}>
            <Input
              type="number"
              placeholder="Min Price"
              value={filters.min_price || ""}
              size="sm"
              onChange={(e) =>
                onFiltersChange({
                  min_price: e.target.value
                    ? parseFloat(e.target.value)
                    : undefined,
                })
              }
            />
          </Box>

          <Box flex="1" minW={{ base: "100px", sm: "120px" }}>
            <Input
              type="number"
              placeholder="Max Price"
              value={filters.max_price || ""}
              size="sm"
              onChange={(e) =>
                onFiltersChange({
                  max_price: e.target.value
                    ? parseFloat(e.target.value)
                    : undefined,
                })
              }
            />
          </Box>
        </Flex>
      </Flex>
    </VStack>
  );
}
