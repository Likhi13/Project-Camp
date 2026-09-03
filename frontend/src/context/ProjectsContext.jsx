import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getProjects } from "../api/project.api";

const ProjectsContext = createContext(null);

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = useCallback(async () => {
    setError("");
    try {
      const res = await getProjects();
      const raw = res.data.data || [];
      // backend returns [{ role, projects: { _id, name, description, members, createdAt, createdBy } }]
      const normalized = raw
        .filter((item) => item?.projects?._id) // guard against malformed entries
        .map((item) => ({
          ...item.projects,
          role: item.role,
        }));
      setProjects(normalized);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <ProjectsContext.Provider
      value={{ projects, loading, error, refreshProjects: fetchProjects }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return ctx;
}
