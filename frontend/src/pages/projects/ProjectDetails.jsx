import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProjectById,
  getProjectMembers,
  deleteProject,
} from "../../api/project.api";
import { getTasks } from "../../api/task.api";
import { getNotes } from "../../api/note.api";
import { useAuth } from "../../context/AuthContext";
import { useProjects } from "../../context/ProjectsContext";
import { canManageProject } from "../../utils/roles";
import { STATUS_LABELS, TASK_STATUSES } from "../../utils/taskStatus";
import ProjectFormModal from "./ProjectFormModal";
import MembersPanel from "./MembersPanel";
import TaskPanel from "./TaskPanel";
import NotesPanel from "./NotesPanel";

export default function ProjectDetails() {
  const { projectId } = useParams();

  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshProjects } = useProjects();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [role, setRole] = useState(null);

  // Only used for the initial project + members load.
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [tab, setTab] = useState("overview");

  const fetchProject = async () => {
    try {
      const res = await getProjectById(projectId);

      setProject(res.data.data);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load project");
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await getProjectMembers(projectId);

      setMembers(res.data.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load project members",
      );
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await getTasks(projectId);

      setTasks(res.data.data || []);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await getNotes(projectId);

      setNotes(res.data.data || []);
    } catch (err) {
      console.error("Failed to load notes:", err);
    }
  };

  const fetchAll = async () => {
    try {
      // Project and members must both finish before
      // the initial page is considered ready.
      await Promise.all([fetchProject(), fetchMembers()]);
    } finally {
      // Tasks and notes are intentionally NOT awaited.
      setLoading(false);
    }

    // Load tasks and notes separately in the background.
    fetchTasks();
    fetchNotes();
  };

  useEffect(() => {
    if (!projectId || projectId === "undefined") {
      navigate("/projects", { replace: true });
      return;
    }

    fetchAll();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // Derive the caller's role independently of when fetchMembers ran.
  // AuthContext resolves `user` asynchronously on app load, so `user`
  // may still be null the moment fetchMembers first runs — without this
  // effect, role would get stuck at null until something else happened
  // to re-trigger fetchAll. Recomputing here whenever either `members`
  // or `user` changes makes it correct regardless of which one settles
  // first.
  useEffect(() => {
    if (!members.length || !user) {
      return;
    }

    const me = members.find((m) => m.user?._id === user._id);
    setRole(me?.role || null);
  }, [members, user]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this project? This cannot be undone.")) {
      return;
    }

    try {
      await deleteProject(projectId);

      // Keep the Sidebar's project list in sync immediately.
      await refreshProjects();

      navigate("/projects");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete project");
    }
  };

  // Initial loading only.
  // Refreshes do not replace the existing page with Loading…
  if (loading && !project) {
    return <p className="p-6 text-text-primary text-sm">Loading…</p>;
  }

  if (!project) {
    return (
      <p className="p-6 text-red-500 text-sm">{error || "Project not found"}</p>
    );
  }

  const canManage = canManageProject(role);

  const taskCounts = TASK_STATUSES.reduce((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status).length;

    return acc;
  }, {});

  return (
    <div className="p-6">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Project header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-text-primary">
            {project.name}
          </h1>

          <p className="text-text-secondary text-sm mt-1">
            {project.description || "No description"}
          </p>
        </div>

        {canManage && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowEdit(true)}
              className="px-3 py-1.5 rounded-lg border border-border text-sm text-text-primary hover:bg-surface transition"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="px-3 py-1.5 rounded-lg border border-red-500/40 text-sm text-red-500 hover:bg-red-500/10 transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border mb-6">
        {["overview", "tasks", "members", "notes"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 text-sm capitalize border-b-2 transition ${
              tab === t
                ? "border-accent text-accent font-medium"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface rounded-xl border border-border p-4">
            <p className="text-sm font-medium text-text-primary mb-3">Tasks</p>

            <div className="space-y-2">
              {TASK_STATUSES.map((status) => (
                <div key={status} className="flex justify-between text-sm">
                  <span className="text-text-primary/70">
                    {STATUS_LABELS[status]}
                  </span>

                  <span className="text-text-primary font-medium">
                    {taskCounts[status]}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setTab("tasks")}
              className="text-xs text-accent hover:underline mt-3"
            >
              View task board →
            </button>
          </div>

          <div className="bg-surface rounded-xl border border-border p-4">
            <p className="text-sm font-medium text-text-primary mb-3">
              Members
            </p>

            <p className="text-2xl font-semibold text-text-primary">
              {members.length}
            </p>

            <button
              onClick={() => setTab("members")}
              className="text-xs text-accent hover:underline mt-3"
            >
              Manage members →
            </button>
          </div>
        </div>
      )}

      {/* Tasks */}
      {tab === "tasks" && (
        <TaskPanel
          projectId={projectId}
          tasks={tasks}
          setTasks={setTasks}
          members={members}
          canManage={canManage}
        />
      )}

      {/* Members */}
      {tab === "members" && (
        <MembersPanel
          projectId={projectId}
          members={members}
          canManage={canManage}
          onChange={fetchAll}
        />
      )}

      {/* Notes */}
      {tab === "notes" && (
        <NotesPanel
          projectId={projectId}
          notes={notes}
          setNotes={setNotes}
          role={role}
        />
      )}

      {/* Edit Project */}
      {showEdit && (
        <ProjectFormModal
          project={project}
          onClose={() => setShowEdit(false)}
          onSuccess={async () => {
            setShowEdit(false);
            await fetchAll();
            // Name/description may have changed — keep the Sidebar in sync.
            await refreshProjects();
          }}
        />
      )}
    </div>
  );
}
