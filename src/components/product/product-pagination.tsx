"use client";

import { Button, Flex, HStack, Text } from "@chakra-ui/react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ProductPaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function ProductPagination({
  pagination,
  onPageChange,
  onPageSizeChange,
}: ProductPaginationProps) {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justify="space-between"
      align="center"
      mt={6}
      gap={4}
    >
      <HStack display={{ base: "none", md: "flex" }}>
        <Text fontSize="sm">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
          {pagination.total} results
        </Text>
      </HStack>

      <HStack gap={2}>
        <Text fontSize="sm" display={{ base: "none", sm: "block" }}>
          Rows per page:
        </Text>
        <select
          value={pagination.limit}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            border: "1px solid #E2E8F0",
            fontSize: "14px",
            minWidth: "60px",
          }}
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </HStack>

      {/* Navigation buttons */}
      <HStack gap={1}>
        <Button
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={pagination.page === 1}
          display={{ base: "none", sm: "flex" }}
        >
          <FiChevronsLeft />
        </Button>
        <Button
          size="sm"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          <FiChevronLeft />
        </Button>
        <Text fontSize="sm" px={2} minW="fit-content">
          {pagination.page} / {pagination.totalPages}
        </Text>
        <Button
          size="sm"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
        >
          <FiChevronRight />
        </Button>
        <Button
          size="sm"
          onClick={() => onPageChange(pagination.totalPages)}
          disabled={pagination.page === pagination.totalPages}
          display={{ base: "none", sm: "flex" }}
        >
          <FiChevronsRight />
        </Button>
      </HStack>

      <Text
        fontSize="xs"
        display={{ base: "block", md: "none" }}
        color="gray.600"
      >
        {(pagination.page - 1) * pagination.limit + 1}-
        {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
        {pagination.total}
      </Text>
    </Flex>
  );
}
