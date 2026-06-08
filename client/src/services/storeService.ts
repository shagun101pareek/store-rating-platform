import api, { getAuthHeaders } from "./api";
import type { StoreListing, StoreQueryParams } from "../types/api";

export const fetchStores = async (
  params?: StoreQueryParams
): Promise<StoreListing[]> => {
  const response = await api.get("/stores", {
    headers: getAuthHeaders(),
    params: {
      ...(params?.search ? { search: params.search } : {}),
      ...(params?.sortBy ? { sortBy: params.sortBy } : {}),
      ...(params?.order ? { order: params.order } : {}),
    },
  });
  return response.data.stores;
};
