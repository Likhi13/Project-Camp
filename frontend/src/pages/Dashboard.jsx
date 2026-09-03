import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../context/ProjectsContext";

export default function Dashboard() {
  const { user } = useAuth();
  const { projects, loading, error } = useProjects();

  if (loading) return <p className="text-muted text-sm">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-heading font-semibold mb-2">
        Welcome{user?.fullName ? `, ${user.fullName}` : ""}
      </h2>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {!error && projects.length === 0 && (
        <p className="text-muted text-sm">
          You don't have any projects yet.{" "}
          <Link to="/projects" className="text-accent hover:underline">
            Create one
          </Link>{" "}
          to get started.
        </p>
      )}

      {projects.length > 0 && (
        <>
          <p className="text-muted text-sm mb-4">
            You're part of {projects.length} project
            {projects.length !== 1 ? "s" : ""}.
          </p>
          <div className="space-y-2">
            {projects.map((project) => (
              <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="block bg-surface rounded-xl border border-border p-4 hover:border-accent transition"
              >
                <p className="text-sm font-medium text-text-primary">
                  {project.name}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {project.description || "No description"}
                </p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
