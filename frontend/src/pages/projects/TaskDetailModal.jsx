import { useEffect, useState } from "react";
import {
  getTaskById,
  deleteTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
} from "../../api/task.api";
import { STATUS_LABELS } from "../../utils/taskStatus";
import TaskFormModal from "./TaskFormModal";

export default function TaskDetailModal({
  projectId,
  initialTask,
  taskId,
  members,
  canManage,
  onClose,
  onChange,
}) {
  const [task, setTask] = useState(initialTask || null);
  const [loading, setLoading] = useState(!initialTask);

  const [error, setError] = useState("");
  const [showEdit, setShowEdit] = useState(false);

  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [subtaskError, setSubtaskError] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchTask = async () => {
    try {
      const res = await getTaskById(projectId, taskId);

      setTask(res.data.data);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const handleDeleteTask = async () => {
    if (!window.confirm("Delete this task? This cannot be undone.")) {
      return;
    }

    try {
      await deleteTask(projectId, taskId);

      onChange();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete task");
    }
  };

  const handleToggleSubtask = async (subtask) => {
    setError("");

    const newCompletedState = !subtask.isCompleted;

    // Optimistic update.
    setTask((prevTask) => {
      if (!prevTask) return prevTask;

      return {
        ...prevTask,

        subtasks: prevTask.subtasks?.map((st) =>
          st._id === subtask._id
            ? {
                ...st,
                isCompleted: newCompletedState,
              }
            : st,
        ),
      };
    });

    try {
      await updateSubTask(projectId, subtask._id, {
        isCompleted: newCompletedState,
      });
    } catch (err) {
      // Restore previous value if request fails.
      setTask((prevTask) => {
        if (!prevTask) return prevTask;

        return {
          ...prevTask,

          subtasks: prevTask.subtasks?.map((st) =>
            st._id === subtask._id
              ? {
                  ...st,
                  isCompleted: subtask.isCompleted,
                }
              : st,
          ),
        };
      });

      setError(err?.response?.data?.message || "Failed to update subtask");
    }
  };

  const handleAddSubtask = async (e) => {
    e.preventDefault();

    const trimmedTitle = subtaskTitle.trim();

    if (!trimmedTitle) return;

    setSubtaskError("");
    setAdding(true);

    try {
      await createSubTask(projectId, taskId, {
        title: trimmedTitle,
      });

      setSubtaskTitle("");

      await fetchTask();
    } catch (err) {
      setSubtaskError(err?.response?.data?.message || "Failed to add subtask");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await deleteSubTask(projectId, subtaskId);

      await fetchTask();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete subtask");
    }
  };

  if (showEdit && task) {
    return (
      <TaskFormModal
        projectId={projectId}
        task={task}
        members={members}
        onClose={() => setShowEdit(false)}
        onSuccess={() => {
          setShowEdit(false);

          fetchTask();
          onChange();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-black/10 dark:border-white/10 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
        {loading && !task && <p className="text-muted text-sm">Loading…</p>}

        {error && (
          <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {task && (
          <>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-heading text-lg font-semibold text-text-light dark:text-text-dark">
                  {task.title}
                </h2>

                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                  {STATUS_LABELS[task.status]}
                </span>
              </div>

              {canManage && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowEdit(true)}
                    className="px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 text-sm text-text-light dark:text-text-dark hover:bg-bg-light dark:hover:bg-bg-dark transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={handleDeleteTask}
                    className="px-3 py-1.5 rounded-lg border border-red-500/40 text-sm text-red-500 hover:bg-red-500/10 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {task.description && (
              <p className="text-sm text-muted mb-4">{task.description}</p>
            )}

            <div className="text-sm text-muted mb-4">
              Assigned to:{" "}
              <span className="text-text-light dark:text-text-dark">
                {task.assignedTo?.fullName ||
                  task.assignedTo?.username ||
                  "Unassigned"}
              </span>
            </div>

            {task.attachments?.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Attachments
                </p>

                <ul className="space-y-1">
                  {task.attachments.map((a, i) => (
                    <li key={i}>
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-accent hover:underline"
                      >
                        {a.url.split("/").pop()}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-text-light dark:text-text-dark mb-2">
                Subtasks ({task.subtasks?.length || 0})
              </p>

              <ul className="space-y-1.5 mb-3">
                {task.subtasks?.map((st) => (
                  <li key={st._id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={st.isCompleted}
                      onChange={() => handleToggleSubtask(st)}
                      className="accent-accent"
                    />

                    <span
                      className={`text-sm flex-1 ${
                        st.isCompleted
                          ? "text-muted line-through"
                          : "text-text-light dark:text-text-dark"
                      }`}
                    >
                      {st.title}
                    </span>

                    {canManage && (
                      <button
                        type="button"
                        onClick={() => handleDeleteSubtask(st._id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              {canManage && (
                <form onSubmit={handleAddSubtask} className="flex gap-2">
                  <input
                    value={subtaskTitle}
                    onChange={(e) => setSubtaskTitle(e.target.value)}
                    placeholder="Add a subtask…"
                    className="flex-1 rounded-lg border border-black/10 dark:border-white/10 bg-bg-light dark:bg-bg-dark px-3 py-2 text-sm text-text-light dark:text-text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                  />

                  <button
                    type="submit"
                    disabled={adding}
                    className="px-3 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
                  >
                    {adding ? "Adding…" : "Add"}
                  </button>
                </form>
              )}

              {subtaskError && (
                <p className="text-red-500 text-xs mt-2">{subtaskError}</p>
              )}
            </div>
          </>
        )}

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-black/10 dark:border-white/10 text-sm text-muted hover:bg-bg-light dark:hover:bg-bg-dark hover:text-text-light dark:hover:text-text-dark transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
