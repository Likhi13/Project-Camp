import { useState } from "react";
import { createTask, updateTask } from "../../api/task.api";
import { TASK_STATUSES, STATUS_LABELS } from "../../utils/taskStatus";

export default function TaskFormModal({
  projectId,
  task,
  members,
  onClose,
  onSuccess,
}) {
  const isEdit = Boolean(task);

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");

  const [assignedTo, setAssignedTo] = useState(
    task?.assignedTo?._id || task?.assignedTo || "",
  );

  const [status, setStatus] = useState(task?.status || TASK_STATUSES[0]);

  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("status", status);

    if (assignedTo) {
      formData.append("assignedTo", assignedTo);
    }

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      if (isEdit) {
        await updateTask(projectId, task._id, formData);
      } else {
        await createTask(projectId, formData);
      }

      onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-black/10 dark:border-white/10 bg-bg-light dark:bg-bg-dark px-3 py-2.5 text-sm text-text-light dark:text-text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition";

  const selectClass =
    "mt-1.5 w-full rounded-lg border border-black/10 dark:border-white/10 bg-bg-light dark:bg-bg-dark px-3 py-2.5 text-sm text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-black/10 dark:border-white/10 w-full max-w-md p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="font-heading text-lg font-semibold text-text-light dark:text-text-dark mb-5">
          {isEdit ? "Edit Task" : "New Task"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark">
              Title
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Assign to */}
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark">
              Assign to
            </label>

            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className={selectClass}
            >
              <option
                value=""
                className="bg-white dark:bg-surface-dark text-text-light dark:text-text-dark"
              >
                Unassigned
              </option>

              {members.map((m) => (
                <option
                  key={m.user._id}
                  value={m.user._id}
                  className="bg-white dark:bg-surface-dark text-text-light dark:text-text-dark"
                >
                  {m.user.fullName || m.user.username}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={selectClass}
            >
              {TASK_STATUSES.map((s) => (
                <option
                  key={s}
                  value={s}
                  className="bg-white dark:bg-surface-dark text-text-light dark:text-text-dark"
                >
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark">
              Attachments {isEdit && "(uploading replaces existing)"}
            </label>

            <input
              type="file"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="mt-1.5 w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-90"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 text-sm text-muted hover:bg-bg-light dark:hover:bg-bg-dark hover:text-text-light dark:hover:text-text-dark transition disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {submitting
                ? isEdit
                  ? "Saving…"
                  : "Creating…"
                : isEdit
                  ? "Save"
                  : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
