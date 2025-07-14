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
import { FiTrash2 } from "react-icons/fi";
import { useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ICellRendererParams,
  ModuleRegistry,
  AllCommunityModule,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import type { User } from "@/types/global";

ModuleRegistry.registerModules([AllCommunityModule]);

interface UserTableProps {
  users: User[];
  loading: boolean;
  onDelete: (userId: string) => void;
}

export default function UserTableView({
  users,
  loading,
  onDelete,
}: UserTableProps) {
  const handleDelete = useCallback(
    (userId: string) => {
      onDelete(userId);
    },
    [onDelete]
  );

  const ActionsCellRenderer = useCallback(
    (params: ICellRendererParams<User>) => {
      return (
        <HStack>
          <Dialog.Root size="sm">
            <Dialog.Trigger asChild>
              <Button colorScheme="red" variant="ghost">
                <FiTrash2 />
              </Button>
            </Dialog.Trigger>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner px={{ base: 4, md: 0 }}>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>Delete User</Dialog.Title>
                  </Dialog.Header>

                  <Box p={4}>
                    <Text>
                      Are you sure you want to delete this user? This action
                      cannot be undone.
                    </Text>
                  </Box>

                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </Dialog.ActionTrigger>
                    <Button
                      colorScheme="red"
                      onClick={() => handleDelete(params.data!.id)}
                    >
                      Delete
                    </Button>
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
    [handleDelete]
  );

  const EmailCellRenderer = useCallback((params: ICellRendererParams<User>) => {
    return (
      <Text fontWeight="semibold" color="blue.600">
        {params.value}
      </Text>
    );
  }, []);

  const RoleCellRenderer = useCallback((params: ICellRendererParams<User>) => {
    const role = params.value;
    return (
      <Badge colorScheme={role === "admin" ? "red" : "blue"} variant="subtle">
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  }, []);

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: "email",
        headerName: "Email",
        cellRenderer: EmailCellRenderer,
        flex: 1,
      },
      {
        field: "role",
        headerName: "Role",
        cellRenderer: RoleCellRenderer,
        width: 120,
      },
      {
        field: "actions",
        headerName: "Actions",
        cellRenderer: ActionsCellRenderer,
        width: 120,
        sortable: false,
        filter: false,
      },
    ],
    [EmailCellRenderer, RoleCellRenderer, ActionsCellRenderer]
  );

  if (loading) {
    return (
      <Flex justify="center" align="center" py={8}>
        <Spinner size="lg" />
        <Text ml={4}>Loading users...</Text>
      </Flex>
    );
  }

  return (
    <Box className="ag-theme-alpine" h="400px" w="100%">
      <AgGridReact
        rowData={users}
        columnDefs={columnDefs}
        animateRows={true}
        domLayout="normal"
        theme="legacy"
      />
    </Box>
  );
}
