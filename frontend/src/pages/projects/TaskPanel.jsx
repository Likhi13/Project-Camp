import { useState } from "react";
import { getTasks } from "../../api/task.api";
import { TASK_STATUSES, STATUS_LABELS } from "../../utils/taskStatus";
import TaskFormModal from "./TaskFormModal";
import TaskDetailModal from "./TaskDetailModal";

export default function TaskPanel({
  projectId,
  tasks,
  setTasks,
  members,
  canManage,
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [error, setError] = useState("");

  const refreshTasks = async () => {
    try {
      const res = await getTasks(projectId);

      setTasks(res.data.data || []);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to refresh tasks");
    }
  };

  return (
    <div>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <div className="flex justify-end mb-4">
        {canManage && (
          <button
            onClick={() => setShowCreate(true)}
            className="px-3 py-1.5 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition"
          >
            + New Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {TASK_STATUSES.map((status) => {
          const columnTasks = tasks.filter((t) => t.status === status);

          return (
            <div
              key={status}
              className="bg-bg rounded-xl border border-border p-3"
            >
              <p className="text-sm font-medium text-text-primary mb-3">
                {STATUS_LABELS[status]}{" "}
                <span className="text-text-secondary font-normal">
                  ({columnTasks.length})
                </span>
              </p>

              <div className="space-y-2">
                {columnTasks.map((task) => (
                  <button
                    key={task._id}
                    onClick={() => setSelectedTask(task)}
                    className="w-full text-left bg-surface rounded-lg border border-border p-3 hover:border-accent transition"
                  >
                    <p className="text-sm text-text-primary font-medium">
                      {task.title}
                    </p>

                    <p className="text-xs text-text-secondary mt-1">
                      {task.assignedTo?.fullName ||
                        task.assignedTo?.username ||
                        "Unassigned"}
                    </p>
                  </button>
                ))}

                {columnTasks.length === 0 && (
                  <p className="text-xs text-text-secondary">No tasks</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showCreate && (
        <TaskFormModal
          projectId={projectId}
          members={members}
          onClose={() => setShowCreate(false)}
          onSuccess={async () => {
            setShowCreate(false);
            await refreshTasks();
          }}
        />
      )}

      {selectedTask && (
        <TaskDetailModal
          projectId={projectId}
          taskId={selectedTask._id}
          initialTask={selectedTask}
          members={members}
          canManage={canManage}
          onClose={() => setSelectedTask(null)}
          onChange={refreshTasks}
        />
      )}
    </div>
  );
}
