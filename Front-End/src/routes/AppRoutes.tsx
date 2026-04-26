import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";
import HomePage from "@/pages/HomePage";
import ShowResponse from "@/pages/ShowResponse";
import HealthPage from "@/pages/HealthPage";
import NotFoundPage from "@/pages/NotFoundPage";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import ProfilePage from "@/pages/ProfilePage";
import DashboardPage from "@/pages/DashboardPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import TempalteViewPage from "@/pages/TemplateViewPage";
import TemplateDetailPage from "@/pages/TemplateDetailPage";
import CVBuilderPage from "@/pages/CVBuilderPage";
import CVsPage from "@/pages/CVsPage";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <nav className="flex items-center gap-4 border-b bg-white p-4">
        <Link to="/" className="font-medium">Home</Link>
        <Link to="/health" className="font-medium">Health</Link>
        <Link to="/ai" className="font-medium">AI</Link>
        <Link to="/templates" className="font-medium">TemplateView</Link>
        <Link to="/cvs" className="font-medium">My CVs</Link>

        <Show when="signed-in">
          <Link to="/dashboard" className="font-medium">Dashboard</Link>
          <Link to="/profile" className="font-medium">Profile</Link>
        </Show>

        <div className="ml-auto flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="redirect">
              <button className="rounded bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-700">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="redirect">
              <button className="rounded border border-slate-900 px-3 py-1.5 text-sm hover:bg-slate-50">
                Sign up
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ai" element={<ShowResponse />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="/templates" element={<TempalteViewPage />} />
        <Route path="/template/:name" element={<TemplateDetailPage />} />
        <Route path="/cv-builder" element={<CVBuilderPage />} />
        <Route path="/cvs" element={<CVsPage />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
