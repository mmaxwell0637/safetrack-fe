import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../components/Logo";
import { useAuth } from "../lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();           // ← also read current user

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [role, setRole] = useState<"customer" | "employee">("customer");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; pwd?: string }>({});

  // ✅ Already signed in? Skip login page.
  useEffect(() => {
    if (!user) return;
    navigate(user.role === "employee" ? "/dashboard" : "/tickets/new", { replace: true });
  }, [user, navigate]);

  function validate() {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email";
    if (!pwd) next.pwd = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700)); // mock API
    setLoading(false);

    // ✅ save to global auth state
    login({ email, role });

    // ✅ route by role
    navigate(role === "employee" ? "/dashboard" : "/tickets/new", { replace: true });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* ✅ White card container with SafeTrack blue styling */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          padding: "40px 32px",
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
            title="Go to Landing Page"
          >
            <Logo size={36} />
            <span style={{ fontSize: "1.4em", fontWeight: 700, color: "#1E293B" }}>
              SafeTrack<span style={{ color: "#2563EB" }}>™</span>
            </span>
          </div>
          <h1
            style={{
              marginTop: "18px",
              fontSize: "1.6em",
              fontWeight: 700,
              color: "#1E293B",
            }}
          >
            Sign In
          </h1>
          <p style={{ fontSize: "0.9em", color: "#64748B" }}>
            Customers &amp; employees sign in here.
          </p>
        </div>

        {/* Card */}
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Role */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label style={{ fontSize: "0.9em", fontWeight: 600, color: "#334155" }}>I am a</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {["customer", "employee"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r as "customer" | "employee")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: role === r ? "2px solid #2563EB" : "1px solid #CBD5E1",
                    background: role === r ? "#EFF6FF" : "white",
                    color: role === r ? "#2563EB" : "#475569",
                    cursor: "pointer",
                    fontWeight: 500,
                    transition: "all 0.2s",
                  }}
                >
                  {r === "customer" ? "Customer" : "Employee"}
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ fontSize: "0.9em", fontWeight: 600, color: "#334155" }}>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              style={{
                marginTop: "6px",
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: errors.email ? "1px solid #FCA5A5" : "1px solid #CBD5E1",
                outline: "none",
                fontSize: "0.95em",
              }}
            />
            {errors.email && (
              <p style={{ marginTop: "4px", fontSize: "0.8em", color: "#DC2626" }}>{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: "0.9em", fontWeight: 600, color: "#334155" }}>Password</label>
            <div style={{ position: "relative", marginTop: "6px" }}>
              <input
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "10px 38px 10px 14px",
                  borderRadius: "8px",
                  border: errors.pwd ? "1px solid #FCA5A5" : "1px solid #CBD5E1",
                  outline: "none",
                  fontSize: "0.95em",
                }}
              />
              <button
                type="button"
                aria-label={showPwd ? "Hide password" : "Show password"}
                onClick={() => setShowPwd((s) => !s)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.2em",
                  color: "#64748B",
                }}
              >
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.pwd && (
              <p style={{ marginTop: "4px", fontSize: "0.8em", color: "#DC2626" }}>{errors.pwd}</p>
            )}
          </div>

          {/* Extras */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "0.85em",
              color: "#475569",
            }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <input type="checkbox" style={{ accentColor: "#2563EB" }} /> Remember me
            </label>
            <Link to="/chat" style={{ color: "#2563EB", textDecoration: "none" }}>
              Need help?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 24px",
              width: "100%",
              background: loading ? "#60A5FA" : "#2563EB",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1em",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) =>
              !loading && (e.currentTarget.style.background = "#1E40AF")
            }
            onMouseOut={(e) =>
              !loading && (e.currentTarget.style.background = "#2563EB")
            }
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div style={{ marginTop: "22px", textAlign: "center", fontSize: "0.9em" }}>
          <p style={{ color: "#475569" }}>
            Don’t have an account?{" "}
            <span style={{ color: "#2563EB", fontWeight: 500 }}>
              Ask an admin to invite you.
            </span>
          </p>

          <p style={{ marginTop: "10px", color: "#475569" }}>
            Or{" "}
            <span
              onClick={() => navigate("/demo")}
              style={{
                color: "#2563EB",
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              request a demo
            </span>{" "}
            to see SafeTrack in action.
          </p>
        </div>
      </div>
    </div>
  );
}
