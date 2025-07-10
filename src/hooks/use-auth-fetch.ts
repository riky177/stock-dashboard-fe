"use client";

import { useSession } from "next-auth/react";
import { fetchWithAuthClient } from "@/api/xhr";
import { useCallback } from "react";

/**
 * Custom hook for making authenticated API requests in client components
 */
export const useAuthFetch = () => {
  const { data: session, status } = useSession();

  const authFetch = useCallback(
    async <T>(input: string, init?: RequestInit): Promise<T> => {
      if (status === "loading") {
        throw new Error("Session is still loading");
      }

      if (status === "unauthenticated" || !session?.accessToken) {
        throw new Error("Not authenticated. Please login.");
      }

      return fetchWithAuthClient<T>(input, session.accessToken, init);
    },
    [session?.accessToken, status]
  );

  return {
    authFetch,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    session,
  };
};
