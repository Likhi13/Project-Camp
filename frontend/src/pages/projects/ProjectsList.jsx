import { useState } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "../../context/ProjectsContext";
import ProjectFormModal from "./ProjectFormModal";

export default function ProjectsList() {
  const { projects, loading, error, refreshProjects } = useProjects();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-semibold text-text-primary">
          Projects
        </h1>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition"
        >
          New Project
        </button>
      </div>

      {loading && <p className="text-text-secondary text-sm">Loading…</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && !error && projects.length === 0 && (
        <div className="text-center py-16 text-text-secondary">
          <p>No projects yet.</p>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="mt-3 text-accent hover:underline text-sm"
          >
            Create your first project
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Link
            key={project._id}
            to={`/projects/${project._id}`}
            className="block p-4 rounded-xl border border-border bg-surface hover:border-accent transition"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-text-primary truncate">
                {project.name}
              </h2>
              <span className="text-xs text-text-secondary shrink-0 ml-2">
                {project.members} member{project.members === 1 ? "" : "s"}
              </span>
            </div>
            <p className="text-sm text-text-secondary mt-1 line-clamp-2">
              {project.description || "No description"}
            </p>
          </Link>
        ))}
      </div>

      {showCreate && (
        <ProjectFormModal
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            setShowCreate(false);
            refreshProjects();
          }}
        />
      )}
    </div>
  );
}
