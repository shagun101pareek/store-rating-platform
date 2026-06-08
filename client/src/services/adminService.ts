import api, { getAuthHeaders } from "./api";
import type {
  AdminDashboardData,
  AdminStore,
  AdminStoreDetail,
  AdminStoreQueryParams,
  AdminUser,
  AdminUserQueryParams,
  CreateAdminStorePayload,
  CreateAdminUserPayload,
} from "../types/api";

const buildQueryString = (params: Record<string, string | undefined>) => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.set(key, value);
    }
  }
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const fetchAdminDashboard = async (): Promise<AdminDashboardData> => {
  const response = await api.get("/admin/dashboard", {
    headers: getAuthHeaders(),
  });
  return response.data.dashboard;
};

export const fetchAdminUsers = async (
  params: AdminUserQueryParams = {}
): Promise<AdminUser[]> => {
  const query = buildQueryString({
    name: params.name,
    email: params.email,
    address: params.address,
    role: params.role,
    sortBy: params.sortBy,
    order: params.order,
  });

  const response = await api.get(`/admin/users${query}`, {
    headers: getAuthHeaders(),
  });
  return response.data.users;
};

export const fetchAdminUserById = async (id: string): Promise<AdminUser> => {
  const response = await api.get(`/admin/users/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data.user;
};

export const fetchAdminStores = async (
  params: AdminStoreQueryParams = {}
): Promise<AdminStore[]> => {
  const query = buildQueryString({
    name: params.name,
    email: params.email,
    address: params.address,
    sortBy: params.sortBy,
    order: params.order,
  });

  const response = await api.get(`/admin/stores${query}`, {
    headers: getAuthHeaders(),
  });
  return response.data.stores;
};

export const fetchAdminStoreById = async (
  id: string
): Promise<AdminStoreDetail> => {
  const response = await api.get(`/admin/stores/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data.store;
};

export const createAdminUser = async (
  payload: CreateAdminUserPayload
): Promise<AdminUser> => {
  const response = await api.post("/admin/users", payload, {
    headers: getAuthHeaders(),
  });
  return response.data.user;
};

export const createAdminStore = async (
  payload: CreateAdminStorePayload
): Promise<AdminStore> => {
  const response = await api.post("/admin/stores", payload, {
    headers: getAuthHeaders(),
  });
  return response.data.store;
};
