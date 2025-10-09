import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TicketNew from "./pages/TicketNew";
import Chat from "./pages/Chat";
import ProtectedRoute from "./lib/ProtectedRoute";
import { AuthProvider } from "./lib/auth"; // 👈 Wrap your app with global auth
import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <div style={{ padding: 16 }}>
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/tickets/new" element={<TicketNew />} />
            <Route path="/chat" element={<Chat />} />

            {/* Protected route (only employees can access Dashboard) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={["employee"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}
