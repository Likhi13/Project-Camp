import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import EmailVerificationBanner from "./EmailVerificationBanner";
import { useAuth } from "../../context/AuthContext";
import { ProjectsProvider } from "../../context/ProjectsContext";

export default function AppLayout() {
  const { user } = useAuth();
  return (
    <ProjectsProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          {user && !user.isEmailVerified && <EmailVerificationBanner />}
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </ProjectsProvider>
  );
}
