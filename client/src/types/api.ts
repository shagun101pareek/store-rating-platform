export type Role = "ADMIN" | "USER" | "STORE_OWNER";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type AdminDashboardData = {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
};

export type AdminUserOwnedStore = {
  id: string;
  name: string;
  averageRating: number | string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
  createdAt?: string;
  ownedStore?: AdminUserOwnedStore;
};

export type AdminStore = {
  id: string;
  name: string;
  email: string;
  address: string;
  rating: number | string;
};

export type AdminStoreOwner = {
  id: string;
  name: string;
  email: string;
};

export type AdminStoreDetail = {
  id: string;
  name: string;
  email: string;
  address: string;
  owner: AdminStoreOwner;
  averageRating: number | string;
};

export type AdminUserQueryParams = {
  name?: string;
  email?: string;
  address?: string;
  role?: string;
  sortBy?: "name" | "email" | "address" | "role";
  order?: "asc" | "desc";
};

export type AdminStoreQueryParams = {
  name?: string;
  email?: string;
  address?: string;
  sortBy?: "name" | "email" | "address" | "rating";
  order?: "asc" | "desc";
};

export type CreateAdminUserPayload = {
  name: string;
  email: string;
  address: string;
  password: string;
  role: Role;
};

export type CreateAdminStorePayload = {
  name: string;
  email: string;
  address: string;
  ownerId: string;
  imageUrl?: string | null;
};

export type OwnerStoreData = {
  id: string;
  name: string;
  email: string;
  address: string;
  imageUrl: string | null;
  ownerName: string;
  ownerEmail: string;
};

export type UpdateOwnerStorePayload = {
  name?: string;
  address?: string;
  imageUrl?: string | null;
};

export type OwnerDashboardData = {
  storeName: string | null;
  totalRatings: number;
  averageRating: number;
  hasStore?: boolean;
};

export type OwnerRating = {
  id: string;
  rating: number;
  userId: string;
  storeId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type OwnerRatingQueryParams = {
  sortBy?: "name" | "email" | "rating" | "createdAt";
  order?: "asc" | "desc";
};

export type StoreListing = {
  id: string;
  name: string;
  address: string;
  imageUrl?: string | null;
  ownerName?: string;
  averageRating: number | string;
  userRating: number | null;
  hasRated: boolean;
};

export type StoreQueryParams = {
  search?: string;
  sortBy?: "name";
  order?: "asc" | "desc";
};

export type NameSortOrder = "asc" | "desc";

export type SortOrder = "asc" | "desc";
