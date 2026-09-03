//object
export const UserRolesEnum = {
  ADMIN: "admin",
  PROJECT_ADMIN: "project_admin",
  MEMBER: "member",
};
//Returns an array of just the values(here [admin,project_admin,member]) of the loopable own properties of an object
export const AvailableUserRole = Object.values(UserRolesEnum);

export const TaskStatusEnum = {
  TODO: "todo",
  IN_PROGERESS: "in_progress",
  DONE: "done",
};
export const AvailableTaskStatuses = Object.values(TaskStatusEnum);
