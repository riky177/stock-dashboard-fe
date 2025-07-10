"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heading, Button, Flex, Box, Text, Spinner } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import { useUsers } from "@/hooks/use-users";
import { CreateUserData } from "@/types/global";
import UserTableView from "@/components/user/user-table-view";
import UserForm from "@/components/user/user-form";
import Container from "@/components/container";

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { users, loading, error, createUser, deleteUser, fetchUsers } =
    useUsers();

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/auth/login");
      return;
    }

    if (session.user.role !== "admin") {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSubmit = async (data: CreateUserData) => {
    try {
      await createUser(data);
    } catch (error) {
      console.error("Error submitting user:", error);
      throw error;
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  if (status === "loading") {
    return (
      <Container>
        <Flex justify="center" align="center" minH="50vh">
          <Spinner size="lg" />
          <Text ml={4}>Loading...</Text>
        </Flex>
      </Container>
    );
  }

  if (!session?.user || session.user.role !== "admin") {
    return null;
  }

  return (
    <Box maxW="7xl" mx="auto" py={8} px={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color="blue.600">
          Staff Management
        </Heading>
        <UserForm
          onSubmit={handleSubmit}
          trigger={
            <Button colorPalette="blue" gap="2">
              <FiPlus />
              Add New Staff
            </Button>
          }
        />
      </Flex>

      {error && (
        <Box
          bg="red.50"
          border="1px"
          borderColor="red.200"
          borderRadius="md"
          p={3}
          mb={4}
        >
          <Text color="red.600" fontSize="sm">
            {error}
          </Text>
        </Box>
      )}

      <Box>
        <UserTableView
          users={users}
          loading={loading}
          onDelete={handleDelete}
        />
      </Box>
    </Box>
  );
}
