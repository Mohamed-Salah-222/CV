import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import ShowResponse from "@/pages/ShowResponse";
import HealthPage from "@/pages/HealthPage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <nav className="flex gap-4 border-b bg-white p-4">
        <Link to="/" className="font-medium">Home</Link>
        <Link to="/health" className="font-medium">Health</Link>
        <Link to="/ai" className="font-medium">AI</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ai" element={<ShowResponse />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
