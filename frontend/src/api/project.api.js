import apiClient from "./axiosClient";

export const getProjects = () => apiClient.get("/projects");

export const getProjectById = (projectId) =>
  apiClient.get(`/projects/${projectId}`);

export const createProject = (data) => apiClient.post("/projects", data);

export const updateProject = (projectId, data) =>
  apiClient.put(`/projects/${projectId}`, data);

export const deleteProject = (projectId) =>
  apiClient.delete(`/projects/${projectId}`);

export const getProjectMembers = (projectId) =>
  apiClient.get(`/projects/${projectId}/members`);

export const addProjectMember = (projectId, data) =>
  apiClient.post(`/projects/${projectId}/members`, data);

export const updateMemberRole = (projectId, userId, role) =>
  apiClient.put(`/projects/${projectId}/members/${userId}`, { role });

export const deleteMember = (projectId, userId) =>
  apiClient.delete(`/projects/${projectId}/members/${userId}`);
