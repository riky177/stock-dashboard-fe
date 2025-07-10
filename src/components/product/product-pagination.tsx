"use client";

import { Button, Flex, HStack, Text } from "@chakra-ui/react";

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
    <Flex justify="space-between" align="center" mt={6}>
      <HStack>
        <Text fontSize="sm">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
          {pagination.total} results
        </Text>
      </HStack>

      <HStack>
        <Text fontSize="sm">Rows per page:</Text>
        <select
          value={pagination.limit}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          style={{
            padding: "4px",
            borderRadius: "4px",
            border: "1px solid #E2E8F0",
          }}
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </HStack>

      <HStack>
        <Button
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={pagination.page === 1}
        >
          First
        </Button>
        <Button
          size="sm"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          Previous
        </Button>
        <Text fontSize="sm">
          Page {pagination.page} of {pagination.totalPages}
        </Text>
        <Button
          size="sm"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
        >
          Next
        </Button>
        <Button
          size="sm"
          onClick={() => onPageChange(pagination.totalPages)}
          disabled={pagination.page === pagination.totalPages}
        >
          Last
        </Button>
      </HStack>
    </Flex>
  );
}
