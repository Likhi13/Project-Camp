import apiClient from "./axiosClient";

export const getTasks = (projectId) => apiClient.get(`/tasks/${projectId}`);

export const getTaskById = (projectId, taskId) =>
  apiClient.get(`/tasks/${projectId}/t/${taskId}`);

export const createTask = (projectId, formData) =>
  apiClient.post(`/tasks/${projectId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateTask = (projectId, taskId, formData) =>
  apiClient.put(`/tasks/${projectId}/t/${taskId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteTask = (projectId, taskId) =>
  apiClient.delete(`/tasks/${projectId}/t/${taskId}`);

export const createSubTask = (projectId, taskId, data) =>
  apiClient.post(`/tasks/${projectId}/t/${taskId}/subtasks`, data);

export const updateSubTask = (projectId, subTaskId, data) =>
  apiClient.put(`/tasks/${projectId}/st/${subTaskId}`, data);

export const deleteSubTask = (projectId, subTaskId) =>
  apiClient.delete(`/tasks/${projectId}/st/${subTaskId}`);
