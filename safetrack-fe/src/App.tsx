import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TicketNew from "./pages/TicketNew";
import Chat from "./pages/Chat";
import ProtectedRoute from "./lib/ProtectedRoute";
import { AuthProvider } from "./lib/auth";
import { Toaster } from "react-hot-toast";
import TicketReceipt from "./pages/TicketReceipt"; // ✅ Added receipt page
import Tickets from "./pages/Tickets";          // 🆕
import TicketDetail from "./pages/TicketDetail"; // 🆕

import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <div style={{ padding: 16 }}>
          <Routes>
            {/* Default route → redirect to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/tickets/new" element={<TicketNew />} />
           
            <Route path="/chat" element={<Chat />} />
            
            {/* Protected customer routes */}
            <Route
              path="/tickets"
              element={
                <ProtectedRoute>
                  <Tickets />
                </ProtectedRoute>
              }
            />
            <Route path="/tickets/:id" element={<TicketDetail />} />

            {/* ✅ Receipt route (for printable ticket confirmation) */}
            <Route path="/tickets/:id/receipt" element={<TicketReceipt />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={["employee"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback for unknown paths */}
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </div>

        {/* ✅ Global toast notifications */}
        <Toaster position="top-center" />
      </div>
    </AuthProvider>
  );
}
