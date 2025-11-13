import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import { useAuth } from "../lib/auth";

const link = ({ isActive }: { isActive: boolean }) =>
  `navlink ${isActive ? "navlink-active" : ""}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Subtle shadow on scroll
  useEffect(() => {
    const nav = document.querySelector(".nav-shell");
    const onScroll = () => (window.scrollY > 10 ? nav?.classList.add("shadow-md") : nav?.classList.remove("shadow-md"));
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // First name from email
  const displayName = user?.email
    ? (() => {
        const part = user.email.split("@")[0] || "";
        const cleaned = part.replace(/\d+/g, "").replace(/[._-]+/g, " ").trim();
        const token = cleaned.includes(" ") ? cleaned.split(" ")[0] : cleaned.slice(0, 6);
        return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
      })()
    : "";

  // Redirect after logout
  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="nav-shell transition-shadow duration-300">
      <div className="nav-inner">
        {/* Brand */}
        <div className="flex items-center gap-2 mr-2">
          <Logo size={28} className="hover:scale-105 transition-transform duration-150 shadow-sm shadow-sky-200 rounded-lg" />
          <div className="font-bold text-slate-900">SafeTrack</div>
        </div>

        <div className="grow" />

        {/* Role-aware nav */}
        {!user && <NavLink to="/login" className={link}>Login</NavLink>}

        {user?.role === "customer" && (
          <>
            <NavLink to="/tickets" className={link}>My Tickets</NavLink>
            <NavLink to="/tickets/new" className={link}>New Ticket</NavLink>
            <NavLink to="/chat" className={link}>Chat</NavLink>
          </>
        )}

        {user?.role === "employee" && (
          <>
            <NavLink to="/dashboard" className={link}>Dashboard</NavLink>
            <NavLink to="/chat" className={link}>Chat</NavLink>
          </>
        )}

        {/* Greeting + Logout */}
        <AnimatePresence>
          {user && (
            <motion.div
              key="user-greeting"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex items-center gap-2 ml-3"
            >
              <span className="text-sm text-slate-600">
                Welcome back, <span className="font-medium text-slate-900">{displayName}</span> 💙
              </span>
              <button onClick={handleLogout} className="btn-muted text-xs px-3 py-1 rounded-lg">
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

