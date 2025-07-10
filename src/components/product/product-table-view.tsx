"use client";

import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  Badge,
  Spinner,
  Dialog,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ICellRendererParams,
  ModuleRegistry,
  AllCommunityModule,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import type {
  Product,
  CreateProductData,
  UpdateProductData,
} from "@/types/global";
import ProductForm from "./product-form";

ModuleRegistry.registerModules([AllCommunityModule]);

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onSubmit: (data: CreateProductData | UpdateProductData) => Promise<void>;
}

export default function ProductTableView({
  products,
  loading,
  onEdit,
  onDelete,
  onSubmit,
}: ProductTableProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const handleEdit = useCallback(
    (product: Product) => {
      onEdit(product);
    },
    [onEdit]
  );

  const handleDelete = useCallback(
    async (productId: string) => {
      onDelete(productId);
    },
    [onDelete]
  );

  const ActionsCellRenderer = useCallback(
    (params: ICellRendererParams<Product>) => {
      if (!isAdmin) {
        return null;
      }

      return (
        <HStack>
          <ProductForm
            onSubmit={onSubmit}
            product={params.data!}
            isEdit={true}
            trigger={
              <Button
                size="sm"
                colorScheme="blue"
                variant="ghost"
                onClick={() => handleEdit(params.data!)}
              >
                <FiEdit />
              </Button>
            }
          />

          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button size="sm" colorScheme="red" variant="ghost">
                <FiTrash2 />
              </Button>
            </Dialog.Trigger>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>Delete Data</Dialog.Title>
                  </Dialog.Header>

                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </Dialog.ActionTrigger>
                    <Dialog.ActionTrigger asChild>
                      <Button onClick={() => handleDelete(params.data!.id)}>
                        Delete
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
        </HStack>
      );
    },
    [handleEdit, handleDelete, onSubmit, isAdmin]
  );

  const ProductNameCellRenderer = useCallback(
    (params: ICellRendererParams<Product>) => {
      return (
        <Text fontWeight="semibold" color="blue.600">
          {params.value}
        </Text>
      );
    },
    []
  );

  const CategoryCellRenderer = useCallback(
    (params: ICellRendererParams<Product>) => {
      return (
        <Badge colorScheme="blue" variant="subtle">
          {params.value}
        </Badge>
      );
    },
    []
  );

  const PriceCellRenderer = useCallback(
    (params: ICellRendererParams<Product>) => {
      return `$${params.value.toFixed(2)}`;
    },
    []
  );

  const StockCellRenderer = useCallback(
    (params: ICellRendererParams<Product>) => {
      const stock = params.value;
      return (
        <Badge
          colorScheme={stock > 10 ? "green" : stock > 0 ? "yellow" : "red"}
        >
          {stock}
        </Badge>
      );
    },
    []
  );

  const CreatedDateCellRenderer = useCallback(
    (params: ICellRendererParams<Product>) => {
      return new Date(params.data?.created_at || "").toLocaleDateString();
    },
    []
  );

  const columnDefs: ColDef[] = useMemo(() => {
    const baseColumns: ColDef[] = [
      {
        field: "name",
        headerName: "Product Name",
        cellRenderer: ProductNameCellRenderer,
        flex: 2,
        minWidth: 150,
      },
      {
        field: "category",
        headerName: "Category",
        cellRenderer: CategoryCellRenderer,
        flex: 1,
        minWidth: 120,
      },
      {
        field: "price",
        headerName: "Price",
        cellRenderer: PriceCellRenderer,
        flex: 1,
        minWidth: 100,
      },
      {
        field: "stock",
        headerName: "Stock",
        cellRenderer: StockCellRenderer,
        flex: 1,
        minWidth: 80,
      },
      {
        field: "createdAt",
        headerName: "Created",
        cellRenderer: CreatedDateCellRenderer,
        flex: 1,
        minWidth: 120,
      },
    ];

    if (isAdmin) {
      baseColumns.push({
        field: "actions",
        headerName: "Actions",
        cellRenderer: ActionsCellRenderer,
        flex: 1,
        minWidth: 120,
        maxWidth: 150,
      });
    }

    return baseColumns;
  }, [
    ProductNameCellRenderer,
    CategoryCellRenderer,
    PriceCellRenderer,
    StockCellRenderer,
    CreatedDateCellRenderer,
    ActionsCellRenderer,
    isAdmin,
  ]);

  if (loading) {
    return (
      <Flex justify="center" align="center" py={8}>
        <Spinner size="lg" />
        <Text ml={4}>Loading products...</Text>
      </Flex>
    );
  }

  return (
    <Box className="ag-theme-alpine" h="400px" w="100%">
      <AgGridReact
        rowData={products}
        columnDefs={columnDefs}
        animateRows={true}
        domLayout="normal"
        theme="legacy"
        suppressHorizontalScroll={true}
        onGridReady={(params) => {
          params.api.sizeColumnsToFit();
        }}
        onGridSizeChanged={(params) => {
          params.api.sizeColumnsToFit();
        }}
      />
    </Box>
  );
}
