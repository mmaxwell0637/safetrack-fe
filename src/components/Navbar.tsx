import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import { useAuth } from "../lib/auth";

const link = ({ isActive }: { isActive: boolean }) =>
  `navlink ${isActive ? "navlink-active" : ""}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // ✅ Added for mobile toggle

  // Subtle shadow on scroll
  useEffect(() => {
    const nav = document.querySelector(".safetrack-nav");
    const onScroll = () =>
      window.scrollY > 10
        ? nav?.classList.add("nav-shadow")
        : nav?.classList.remove("nav-shadow");
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // First name from email
  const displayName = user?.email
    ? (() => {
        const part = user.email.split("@")[0] || "";
        const cleaned = part.replace(/\d+/g, "").replace(/[._-]+/g, " ").trim();
        const token = cleaned.includes(" ")
          ? cleaned.split(" ")[0]
          : cleaned.slice(0, 6);
        return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
      })()
    : "";

  // Redirect after logout
  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  // ---- Styles from new design ----
  const navStyle = {
    background: "white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    position: "sticky" as const,
    top: 0,
    zIndex: 100,
    transition: "box-shadow 0.3s",
  };
  const innerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };
  const linkActiveStyle = {
    padding: "10px 20px",
    color: "#2563EB",
    fontWeight: 600,
    textDecoration: "none",
    borderRadius: "8px",
    background: "rgba(37, 99, 235, 0.1)",
  };
  const linkInactiveStyle = {
    padding: "10px 20px",
    color: "#475569",
    fontWeight: 500,
    textDecoration: "none",
    borderRadius: "8px",
    transition: "all 0.2s",
  };

  return (
    <>
      <style>{`
        .safetrack-nav.nav-shadow { box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-toggle { display: block !important; }
          .mobile-menu { display: flex !important; }
        }
      `}</style>

      <div className="safetrack-nav transition-shadow duration-300" style={navStyle}>
        <div style={innerStyle}>
          {/* Brand */}
          <div
            onClick={() => navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
            }}
            title="Go to Landing Page"
          >
            <Logo size={32} className="hover:scale-105 transition-transform duration-150" />
            <span style={{ fontSize: "1.3em", fontWeight: 700, color: "#1E293B" }}>
              SafeTrack<span style={{ color: "#2563EB" }}>™</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div
            className="nav-links"
            style={{ display: "flex", alignItems: "center", gap: "16px" }}
          >
            {/* Role-aware nav */}
            {!user && (
              <>
                <NavLink
                  to="/"
                  style={({ isActive }) =>
                    isActive ? linkActiveStyle : linkInactiveStyle
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/contact"
                  style={({ isActive }) =>
                    isActive ? linkActiveStyle : linkInactiveStyle
                  }
                >
                  Contact Us
                </NavLink>
                <button
                  onClick={() => navigate("/login")}
                  style={{
                    padding: "10px 24px",
                    background: "#2563EB",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1em",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#1E40AF")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "#2563EB")
                  }
                >
                  Sign In
                </button>
              </>
            )}

            {user?.role === "customer" && (
              <>
                <NavLink
                  to="/tickets/new"
                  style={({ isActive }) =>
                    isActive ? linkActiveStyle : linkInactiveStyle
                  }
                >
                  New Ticket
                </NavLink>
                <NavLink
                  to="/chat"
                  style={({ isActive }) =>
                    isActive ? linkActiveStyle : linkInactiveStyle
                  }
                >
                  Chat
                </NavLink>
              </>
            )}

            {user?.role === "employee" && (
              <>
                <NavLink
                  to="/dashboard"
                  style={({ isActive }) =>
                    isActive ? linkActiveStyle : linkInactiveStyle
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/chat"
                  style={({ isActive }) =>
                    isActive ? linkActiveStyle : linkInactiveStyle
                  }
                >
                  Chat
                </NavLink>
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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginLeft: "12px",
                  }}
                >
                  <span className="text-sm text-slate-600">
                    Welcome back,{" "}
                    <span className="font-medium text-slate-900">
                      {displayName}
                    </span>{" "}
                    💙
                  </span>
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: "8px 18px",
                      background: "#2563EB",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "0.9em",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#1E40AF")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "#2563EB")
                    }
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="nav-toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              fontSize: "1.6em",
              cursor: "pointer",
              color: "#1E293B",
            }}
          >
            ☰
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div
            className="mobile-menu"
            style={{
              display: "none",
              flexDirection: "column",
              background: "white",
              borderTop: "1px solid #E2E8F0",
              padding: "12px 24px",
              gap: "12px",
            }}
          >
            {!user && (
              <>
                <NavLink
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  style={({ isActive }) =>
                    isActive ? linkActiveStyle : linkInactiveStyle
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  style={({ isActive }) =>
                    isActive ? linkActiveStyle : linkInactiveStyle
                  }
                >
                  Contact Us
                </NavLink>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/login");
                  }}
                  style={{
                    ...linkInactiveStyle,
                    background: "#2563EB",
                    color: "white",
                    fontWeight: 600,
                  }}
                >
                  Sign In
                </button>
              </>
            )}

            {user?.role === "customer" && (
              <>
                <NavLink
                  to="/tickets/new"
                  onClick={() => setMenuOpen(false)}
                  style={({ isActive }) =>
                    isActive ? linkActiveStyle : linkInactiveStyle
                  }
                >
                  New Ticket
                </NavLink>
                <NavLink
                  to="/chat"
                  onClick={() => setMenuOpen(false)}
                  style={({ isActive }) =>
                    isActive ? linkActiveStyle : linkInactiveStyle
                  }
                >
                  Chat
                </NavLink>
              </>
            )}

            {user?.role === "employee" && (
              <>
                <NavLink
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  style={({ isActive }) =>
                    isActive ? linkActiveStyle : linkInactiveStyle
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/chat"
                  onClick={() => setMenuOpen(false)}
                  style={({ isActive }) =>
                    isActive ? linkActiveStyle : linkInactiveStyle
                  }
                >
                  Chat
                </NavLink>
              </>
            )}

            {user && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                style={{
                  ...linkInactiveStyle,
                  background: "#2563EB",
                  color: "white",
                  fontWeight: 600,
                }}
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
