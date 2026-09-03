import axiosClient from "./axiosClient";

export const updateProfile = (payload) =>
  axiosClient.patch("/users/profile", payload);

export const updateAvatar = (formData) =>
  axiosClient.patch("/users/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
