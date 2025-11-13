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
    <div className="container-page flex items-center">
      <div className="w-full max-w-md mx-auto p-6">
        {/* Brand */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2">
            <Logo size={36} />
            <span className="text-xl font-bold text-slate-900">SafeTrack</span>
          </div>
          <h1 className="mt-4 page-title !text-2xl">Sign in</h1>
          <p className="text-sm text-slate-500">Customers &amp; employees sign in here.</p>
        </div>

        {/* Card */}
        <form onSubmit={onSubmit} className="card card-pad space-y-4">
          {/* Role */}
          <div className="flex items-center justify-between gap-2">
            <label className="text-sm font-medium text-slate-700">I am a</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`btn-chip ${role === "customer" ? "border-sky-300 bg-sky-50 text-sky-800" : "border-slate-300 text-slate-700"}`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setRole("employee")}
                className={`btn-chip ${role === "employee" ? "border-sky-300 bg-sky-50 text-sky-800" : "border-slate-300 text-slate-700"}`}
              >
                Employee
              </button>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              className={`input mt-1 ${errors.email ? "border-rose-300 focus:ring-rose-300" : ""}`}
            />
            {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <div className="mt-1 relative">
              <input
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className={`input pr-10 ${errors.pwd ? "border-rose-300 focus:ring-rose-300" : ""}`}
              />
              <button
                type="button"
                aria-label={showPwd ? "Hide password" : "Show password"}
                onClick={() => setShowPwd((s) => !s)}
                className="absolute inset-y-0 right-2 my-auto text-slate-500 hover:text-slate-700"
              >
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.pwd && <p className="mt-1 text-xs text-rose-600">{errors.pwd}</p>}
          </div>

          {/* Extras */}
          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 text-slate-600">
              <input type="checkbox" className="rounded border-slate-300" /> Remember me
            </label>
            <Link to="/chat" className="text-sky-700 hover:underline">
              Need help?
            </Link>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} className={`btn-primary w-full ${loading ? "bg-sky-400" : ""}`}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-4 text-center text-sm text-slate-500">
          Don’t have an account? <span className="text-slate-700">Ask an admin to invite you.</span>
        </p>
      </div>
    </div>
  );
}
