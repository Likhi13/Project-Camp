import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutGrid, Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useProjects } from "../../context/ProjectsContext";
import ProjectFormModal from "../../pages/projects/ProjectFormModal";

export default function Sidebar() {
  const { user } = useAuth();
  const { projects, refreshProjects } = useProjects();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <aside className="w-[250px] shrink-0 border-r border-black/10 dark:border-white/10 flex flex-col bg-surface-light dark:bg-surface-dark">
      <div className="px-5 py-5">
        <span className="font-heading font-semibold text-lg">Project Camp</span>
      </div>

      <nav className="px-3 flex flex-col gap-1">
        {/* Dashboard */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
              isActive
                ? "bg-accent/10 text-accent"
                : "text-muted hover:bg-black/5 dark:hover:bg-white/5"
            }`
          }
        >
          <LayoutGrid size={16} />
          Dashboard
        </NavLink>

        {/* Projects */}
        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
              isActive
                ? "bg-accent/10 text-accent"
                : "text-muted hover:bg-black/5 dark:hover:bg-white/5"
            }`
          }
        >
          Projects
        </NavLink>
      </nav>

      <div className="mt-6 px-3 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-xs font-medium text-muted uppercase tracking-wide">
            Projects
          </span>

          <button
            aria-label="New project"
            onClick={() => setShowCreate(true)}
            className="p-1 rounded text-muted hover:text-accent hover:bg-accent/10"
          >
            <Plus size={14} />
          </button>
        </div>

        {projects.length === 0 && (
          <p className="px-2 text-sm text-muted">No projects yet</p>
        )}

        <div className="flex flex-col gap-0.5">
          {projects.map((project) => (
            <NavLink
              key={project._id}
              to={`/projects/${project._id}`}
              className={({ isActive }) =>
                `px-2 py-1.5 rounded-md text-sm truncate ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:bg-black/5 dark:hover:bg-white/5"
                }`
              }
            >
              {project.name}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 border-t border-black/10 dark:border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center text-sm font-medium overflow-hidden shrink-0">
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              user?.username?.[0]?.toUpperCase() || "U"
            )}
          </div>

          <div className="text-sm min-w-0">
            <p className="font-medium leading-tight truncate">
              {user?.fullName || user?.username}
            </p>

            <p className="text-muted text-xs leading-tight truncate">
              {user?.email}
            </p>
          </div>
        </div>
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
    </aside>
  );
}
