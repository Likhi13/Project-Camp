import apiClient from "./axiosClient";

export const getNotes = (projectId) => apiClient.get(`/notes/${projectId}`);

export const getNoteById = (projectId, noteId) =>
  apiClient.get(`/notes/${projectId}/n/${noteId}`);

export const createNote = (projectId, content) =>
  apiClient.post(`/notes/${projectId}`, { content });

export const updateNote = (projectId, noteId, content) =>
  apiClient.put(`/notes/${projectId}/n/${noteId}`, { content });

export const deleteNote = (projectId, noteId) =>
  apiClient.delete(`/notes/${projectId}/n/${noteId}`);
