import api, { getAuthHeaders } from "./api";
import type {
  OwnerDashboardData,
  OwnerRating,
  OwnerRatingQueryParams,
  OwnerStoreData,
  UpdateOwnerStorePayload,
} from "../types/api";

export const fetchOwnerDashboard = async (): Promise<OwnerDashboardData> => {
  const response = await api.get("/owner/dashboard", {
    headers: getAuthHeaders(),
  });
  return response.data.dashboard;
};

export const fetchOwnerRatings = async (
  params: OwnerRatingQueryParams = {}
): Promise<OwnerRating[]> => {
  const searchParams = new URLSearchParams();
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.order) searchParams.set("order", params.order);

  const query = searchParams.toString();
  const url = query ? `/owner/ratings?${query}` : "/owner/ratings";

  const response = await api.get(url, {
    headers: getAuthHeaders(),
  });
  return response.data.ratings;
};

export const fetchOwnerStore = async (): Promise<OwnerStoreData> => {
  const response = await api.get("/owner/store", {
    headers: getAuthHeaders(),
  });
  return response.data.store;
};

export const updateOwnerStore = async (
  payload: UpdateOwnerStorePayload
): Promise<OwnerStoreData> => {
  const response = await api.patch("/owner/store", payload, {
    headers: getAuthHeaders(),
  });
  return response.data.store;
};
