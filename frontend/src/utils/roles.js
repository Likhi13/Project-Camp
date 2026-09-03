export const ROLES = {
  ADMIN: "admin",
  PROJECT_ADMIN: "project_admin",
  MEMBER: "member",
};

// UX-only — server is source of truth via validateProjectPermission
export const canManageProject = (role) =>
  role === ROLES.ADMIN || role === ROLES.PROJECT_ADMIN;

// Notes are ADMIN-only on the backend (see note.routes.js) — narrower than canManageProject
export const canManageNotes = (role) => role === ROLES.ADMIN;
