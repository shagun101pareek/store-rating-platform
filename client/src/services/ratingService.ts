import api, { getAuthHeaders } from "./api";

export const createRating = async (
  storeId: string,
  rating: number
): Promise<void> => {
  await api.post(
    "/ratings",
    { storeId, rating },
    { headers: getAuthHeaders() }
  );
};

export const updateRating = async (
  storeId: string,
  rating: number
): Promise<void> => {
  await api.patch(
    `/ratings/${storeId}`,
    { rating },
    { headers: getAuthHeaders() }
  );
};
