import { useState } from "react";
import {
  addProjectMember,
  updateMemberRole,
  deleteMember,
} from "../../api/project.api";
import { ROLES } from "../../utils/roles";

export default function MembersPanel({
  projectId,
  members,
  canManage,
  onChange,
}) {
  const [email, setEmail] = useState("");
  const [newRole, setNewRole] = useState(ROLES.MEMBER);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await addProjectMember(projectId, {
        email,
        role: newRole,
      });

      setEmail("");
      setNewRole(ROLES.MEMBER);

      await onChange();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add member");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    setError("");

    try {
      await updateMemberRole(projectId, userId, role);

      await onChange();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update role");
    }
  };

  const handleRemove = async (userId) => {
    if (!window.confirm("Remove this member from the project?")) {
      return;
    }

    setError("");

    try {
      await deleteMember(projectId, userId);

      await onChange();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to remove member");
    }
  };

  const inputClass =
    "rounded-lg border border-black/10 dark:border-white/10 bg-bg-light dark:bg-bg-dark px-3 py-2.5 text-sm text-text-light dark:text-text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition";

  return (
    <div>
      {canManage && (
        <form
          onSubmit={handleAdd}
          className="flex flex-wrap gap-3 mb-6 items-end"
        >
          {/* Email */}
          <div className="flex-1 min-w-[220px]">
            <label className="block text-sm font-medium text-text-light dark:text-text-dark">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter member email"
              required
              className={`mt-1.5 w-full ${inputClass}`}
            />
          </div>

          {/* Role */}
          <div className="w-[180px]">
            <label className="block text-sm font-medium text-text-light dark:text-text-dark">
              Role
            </label>

            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className={`mt-1.5 w-full ${inputClass}`}
            >
              <option
                value={ROLES.MEMBER}
                className="bg-white dark:bg-surface-dark text-text-light dark:text-text-dark"
              >
                Member
              </option>

              <option
                value={ROLES.PROJECT_ADMIN}
                className="bg-white dark:bg-surface-dark text-text-light dark:text-text-dark"
              >
                Project Admin
              </option>

              <option
                value={ROLES.ADMIN}
                className="bg-white dark:bg-surface-dark text-text-light dark:text-text-dark"
              >
                Admin
              </option>
            </select>
          </div>

          {/* Add */}
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {submitting ? "Adding…" : "Add"}
          </button>
        </form>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
          <p className="text-red-500 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Members list */}
      <div className="rounded-xl border border-black/10 dark:border-white/10 overflow-hidden bg-bg-light dark:bg-bg-dark">
        {members.map((m) => (
          <div
            key={m.user?._id}
            className="flex items-center justify-between gap-4 px-4 py-4 bg-surface-light dark:bg-surface-dark border-b border-black/10 dark:border-white/10 last:border-b-0 hover:bg-bg-light dark:hover:bg-bg-dark transition"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-light dark:text-text-dark">
                {m.user?.fullName || m.user?.username}
              </p>

              <p className="text-xs text-muted mt-0.5">{m.user?.username}</p>
            </div>

            {canManage ? (
              <div className="flex items-center gap-3 shrink-0">
                <select
                  value={m.role}
                  onChange={(e) => handleRoleChange(m.user._id, e.target.value)}
                  className="rounded-lg border border-black/10 dark:border-white/10 bg-bg-light dark:bg-bg-dark px-2.5 py-1.5 text-xs text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                >
                  <option
                    value={ROLES.MEMBER}
                    className="bg-white dark:bg-surface-dark text-text-light dark:text-text-dark"
                  >
                    Member
                  </option>

                  <option
                    value={ROLES.PROJECT_ADMIN}
                    className="bg-white dark:bg-surface-dark text-text-light dark:text-text-dark"
                  >
                    Project Admin
                  </option>

                  <option
                    value={ROLES.ADMIN}
                    className="bg-white dark:bg-surface-dark text-text-light dark:text-text-dark"
                  >
                    Admin
                  </option>
                </select>

                <button
                  type="button"
                  onClick={() => handleRemove(m.user._id)}
                  className="text-xs font-medium text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <span className="text-xs text-muted capitalize">
                {m.role.replace("_", " ")}
              </span>
            )}
          </div>
        ))}

        {members.length === 0 && (
          <div className="px-4 py-8 text-center bg-surface-light dark:bg-surface-dark">
            <p className="text-sm text-muted">No members yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
