import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  UserFilters,
  UsersResponse,
  CreateUserData,
  UpdateUserData,
  HTTPResponse,
} from "@/types/global";

interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (userData: CreateUserData) => Promise<void>;
  updateUser: (userData: UpdateUserData) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

export const useUsers = (): UseUsersResult => {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(
    async (filters?: UserFilters) => {
      if (!session?.user || session.user.role !== "admin") {
        setError("Access denied. Admin role required.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const searchParams = new URLSearchParams();

        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              searchParams.append(key, String(value));
            }
          });
        }

        const queryString = searchParams.toString();
        const url = queryString ? `/api/users?${queryString}` : "/api/users";

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result: HTTPResponse<UsersResponse> = await response.json();

        if (result.success && result.data) {
          setUsers(result.data);
        } else {
          setError(result.message || "Failed to fetch users");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [session]
  );

  const createUser = useCallback(
    async (userData: CreateUserData) => {
      if (!session?.user || session.user.role !== "admin") {
        throw new Error("Access denied. Admin role required.");
      }

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result: HTTPResponse = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to create user");
      }

      await fetchUsers();
    },
    [session, fetchUsers]
  );

  const updateUser = useCallback(
    async (userData: UpdateUserData) => {
      if (!session?.user || session.user.role !== "admin") {
        throw new Error("Access denied. Admin role required.");
      }

      const response = await fetch(`/api/users/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result: HTTPResponse = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to update user");
      }

      await fetchUsers();
    },
    [session, fetchUsers]
  );

  const deleteUser = useCallback(
    async (userId: string) => {
      if (!session?.user || session.user.role !== "admin") {
        throw new Error("Access denied. Admin role required.");
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result: HTTPResponse = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to delete user");
      }

      await fetchUsers();
    },
    [session, fetchUsers]
  );

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
