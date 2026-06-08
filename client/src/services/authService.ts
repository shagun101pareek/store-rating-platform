import api, { getAuthHeaders } from "./api";

type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export const changePassword = async (
  payload: ChangePasswordPayload
): Promise<void> => {
  await api.patch("/auth/change-password", payload, {
    headers: getAuthHeaders(),
  });
};
