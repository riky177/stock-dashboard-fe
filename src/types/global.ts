export interface HTTPResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  role: string;
  accessToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  name?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  sku?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserData
  extends Partial<Omit<CreateUserData, "password">> {
  id: string;
  password?: string;
}

export type UsersResponse = User[];

export interface UserFilters {
  search?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
