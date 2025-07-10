"use client";

import { Box, Flex, Input, Text, VStack } from "@chakra-ui/react";
import { CATEGORIES } from "@/hooks/use-products";
import type { ProductFilters } from "@/types/global";

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: Partial<ProductFilters>) => void;
}

export default function ProductFilters({
  filters,
  onFiltersChange,
}: ProductFiltersProps) {
  return (
    <VStack gap={4} mb={6}>
      <Flex wrap="wrap" gap={4} width="100%">
        <Box flex="1" minW="200px">
          <Text fontWeight="semibold" mb={2}>
            Search
          </Text>
          <Input
            placeholder="Search products..."
            value={filters.name || ""}
            onChange={(e) => onFiltersChange({ name: e.target.value })}
          />
        </Box>

        <Box flex="1" minW="150px">
          <Text fontWeight="semibold" mb={2}>
            Category
          </Text>
          <select
            value={filters.category || ""}
            onChange={(e) => onFiltersChange({ category: e.target.value })}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #E2E8F0",
              backgroundColor: "white",
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

        <Box flex="1" minW="120px">
          <Text fontWeight="semibold" mb={2}>
            Min Price
          </Text>
          <Input
            type="number"
            placeholder="0.00"
            value={filters.min_price || ""}
            onChange={(e) =>
              onFiltersChange({
                min_price: e.target.value
                  ? parseFloat(e.target.value)
                  : undefined,
              })
            }
          />
        </Box>

        <Box flex="1" minW="120px">
          <Text fontWeight="semibold" mb={2}>
            Max Price
          </Text>
          <Input
            type="number"
            placeholder="1000.00"
            value={filters.max_price || ""}
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
    </VStack>
  );
}
