import { useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle";
import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname === "/") {
      return "Dashboard";
    }

    if (location.pathname === "/projects") {
      return "Projects";
    }

    if (location.pathname.startsWith("/projects/")) {
      return "Project";
    }

    if (location.pathname === "/settings") {
      return "Profile Settings";
    }

    return "Dashboard";
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="h-14 shrink-0 border-b border-black/10 dark:border-white/10 flex items-center justify-between px-6">
      <h1 className="text-sm font-medium">{getTitle()}</h1>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <button
          onClick={handleLogout}
          className="text-sm text-muted hover:text-text-light dark:hover:text-text-dark"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
