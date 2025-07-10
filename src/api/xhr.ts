import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const fetchWithAuth = async <T>(
  input: string,
  init?: RequestInit
): Promise<T> => {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    throw new Error("No access token found. Please login again.");
  }

  const headers: HeadersInit = {
    Authorization: `Bearer ${session.accessToken}`,
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string>),
  };

  const response = await fetch(`/api${input}`, {
    ...init,
    headers,
    mode: "cors",
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Authentication failed. Please login again.");
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const fetchWithAuthClient = async <T>(
  input: string,
  accessToken: string,
  init?: RequestInit
): Promise<T> => {
  if (!accessToken) {
    throw new Error("No access token provided. Please login again.");
  }

  const headers: HeadersInit = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string>),
  };

  const response = await fetch(`/api${input}`, {
    ...init,
    headers,
    mode: "cors",
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Authentication failed. Please login again.");
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const fetchWithAuthAction = async <T>(
  input: string,
  init?: RequestInit
): Promise<T> => {
  const { getSession } = await import("@/app/api/auth/auth");
  const session = await getSession();

  if (!session?.accessToken) {
    throw new Error("No access token found. Please login again.");
  }

  const headers = {
    ...init?.headers,
    Authorization: `Bearer ${session.accessToken}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(`${BASE_URL}/api${input}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Authentication failed. Please login again.");
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const nextAuthFetcher = async <T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> => {
  const url = input as string;

  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        ...init?.headers,
        "Content-Type": "application/json",
      },
    });

    const responseText = await res.text();

    if (!res.ok) {
      throw new Error(
        `HTTP error! status: ${res.status}, response: ${responseText}`
      );
    }

    if (!responseText.trim()) {
      throw new Error("Empty response received from NextAuth endpoint");
    }

    try {
      return JSON.parse(responseText) as T;
    } catch (parseError) {
      console.error("❌ NextAuth JSON parse error:", parseError);
      console.error("Response that failed to parse:", responseText);
      throw new Error(
        `Invalid JSON response from NextAuth: ${
          parseError instanceof Error ? parseError.message : String(parseError)
        }`
      );
    }
  } catch (err) {
    console.error("❌ NextAuth fetcher error:", err);
    throw new Error(err instanceof Error ? err.message : String(err));
  }
};

export const fetcher = async <T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> => {
  const url = `${BASE_URL}/api${input}`;

  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        ...init?.headers,
        "Content-Type": "application/json",
      },
    });

    const responseText = await res.text();

    if (!res.ok) {
      throw new Error(
        `HTTP error! status: ${res.status}, response: ${responseText}`
      );
    }

    if (!responseText.trim()) {
      throw new Error("Empty response received from backend API");
    }

    try {
      return JSON.parse(responseText) as T;
    } catch (parseError) {
      console.error("❌ Backend API JSON parse error:", parseError);
      console.error("Response that failed to parse:", responseText);
      throw new Error(
        `Invalid JSON response from backend API: ${
          parseError instanceof Error ? parseError.message : String(parseError)
        }`
      );
    }
  } catch (err) {
    console.error("❌ Backend API fetcher error:", err);
    throw new Error(err instanceof Error ? err.message : String(err));
  }
};
