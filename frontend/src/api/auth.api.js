import axiosClient from "./axiosClient";

export const register = (payload) =>
  axiosClient.post("/auth/register", payload);
export const login = (payload) => axiosClient.post("/auth/login", payload);
export const logout = () => axiosClient.post("/auth/logout");
export const getCurrentUser = () => axiosClient.get("/auth/current-user");
export const verifyEmail = (token) =>
  axiosClient.get(`/auth/verify-email/${token}`);
export const resendEmailVerification = () =>
  axiosClient.post("/auth/resend-email-verification");
export const forgotPassword = (email) =>
  axiosClient.post("/auth/forgot-password", { email });
export const resetPassword = (token, newPassword) =>
  axiosClient.post(`/auth/reset-password/${token}`, { newPassword });
export const changePassword = (payload) =>
  axiosClient.post("/auth/change-password", payload);
