// src/pages/Dashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Ticket, Status, Priority } from "../lib/schemas";
import { API } from "../lib/api";

// UI-only category (not stored in shared Ticket yet)
type Category = "Technical" | "Billing" | "Account" | "Other";

// Local shape = shared Ticket + UI category
type LocalTicket = Ticket & { category: Category };

/** Normalize priority coming from API */
function normalizePriority(p: string): Priority {
  // backend may send "Med" – UI expects "Medium"
  if (p === "Med") return "Medium";
  if (p === "High" || p === "Low" || p === "Medium") return p as Priority;
  // default safety
  return "Medium";
}

/** Map API ticket -> LocalTicket your UI expects */
function adapt(t: any): LocalTicket {
  return {
    id: t.id,
    subject: t.subject,
    requester: t.requester ?? "—",
    assignee: t.assignee ?? null,
    status: (t.status ?? "Pending") as Status,
    updatedAt: t.updatedAt ?? t.createdAt ?? new Date().toISOString(),
    priority: normalizePriority(t.priority ?? "Medium"),
    // prefer explicit category field; otherwise fall back to "type"
    category: (t.category ?? t.type ?? "Other") as Category,
  };
}

// ---- Pills (uses your CSS utilities in index.css) ---------------------------
function StatusPill({ s }: { s: Status }) {
  const map: Record<Status, string> = {
    Pending: "status-pending",
    "In Progress": "status-progress",
    Resolved: "status-resolved",
    Unassigned: "status-unassigned",
  };
  return <span className={map[s]} style={{ pointerEvents: 'none' }}>{s}</span>;
}

function PriorityPill({ p }: { p: Priority }) {
  const map: Record<Priority, string> = {
    Low: "inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-emerald-50 text-emerald-700",
    Medium: "inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-amber-50 text-amber-700",
    High: "inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-rose-50 text-rose-700",
  };
  return <span className={map[p]} style={{ pointerEvents: 'none' }}>{p}</span>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const open = (id: string) => {
    console.log("[Dashboard] Opening ticket:", id);
    navigate(`/tickets/${id}`);
  };

  const [rows, setRows] = useState<LocalTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [tab, setTab] = useState<"All" | Status>("All");
  const [agent, setAgent] = useState<"All" | "Jamal" | "Priya" | "—">("All");
  const [category, setCategory] = useState<"All" | Category>("All");
  const [q, setQ] = useState("");

  // fetch from API on mount
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await API.getTickets(); // hits /api/tickets or http://localhost:4000/tickets
        if (!alive) return;
        setRows((data as any[]).map(adapt));
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? String(e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const agents = useMemo(() => {
    const names = Array.from(new Set(rows.map((t) => t.assignee ?? "—"))) as Array<
      "Jamal" | "Priya" | "—"
    >;
    return ["All", ...names] as const;
  }, [rows]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return rows
      .filter((t) => (tab === "All" ? true : t.status === tab))
      .filter((t) => (agent === "All" ? true : (t.assignee ?? "—") === agent))
      .filter((t) => (category === "All" ? true : t.category === category))
      .filter((t) => {
        if (!ql) return true;
        const hay = `${t.id} ${t.subject} ${t.requester} ${t.assignee ?? ""} ${t.status} ${t.priority}`.toLowerCase();
        return hay.includes(ql);
      });
  }, [rows, tab, agent, category, q]);

  return (
    <div className="container-page">
      <div className="page-wrap">
        <div className="mb-6 text-center">
          <h1 className="page-title">Employee Dashboard</h1>
          <p className="page-sub">Track and manage support tickets.</p>
        </div>

        {/* Controls */}
        <div className="card card-pad mb-4 space-y-3">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {(["All", "Pending", "In Progress", "Resolved", "Unassigned"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t as any)}
                className={`btn-chip ${
                  tab === t
                    ? "bg-slate-900 text-white border-transparent"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Filters row */}
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={agent}
              onChange={(e) => setAgent(e.target.value as any)}
              className="select w-full sm:w-40"
              title="Filter by assignee"
            >
              {agents.map((a) => (
                <option key={a} value={a}>
                  {a === "—" ? "Unassigned" : a}
                </option>
              ))}
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="select w-full sm:w-48"
              title="Filter by category"
            >
              {(["All", "Technical", "Billing", "Account", "Other"] as const).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tickets…"
              className="input grow"
            />
          </div>
        </div>

        {/* Results */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-slate-500">Loading…</div>
          ) : err ? (
            <div className="p-10 text-center text-rose-600">Error: {err}</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              <p className="mb-3">No tickets match your filters.</p>
              <a href="/tickets/new" className="btn-muted">
                Create your first ticket
              </a>
            </div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="text-left px-4 py-3 border-b">Ticket</th>
                    <th className="text-left px-4 py-3 border-b">Subject</th>
                    <th className="text-left px-4 py-3 border-b">Requester</th>
                    <th className="text-left px-4 py-3 border-b">Assignee</th>
                    <th className="text-left px-4 py-3 border-b">Status</th>
                    <th className="text-left px-4 py-3 border-b">Priority</th>
                    <th className="text-left px-4 py-3 border-b">Category</th>
                    <th className="text-left px-4 py-3 border-b">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => open(t.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          open(t.id);
                        }
                      }}
                      tabIndex={0}
                      aria-label={`View ticket ${t.id}`}
                      title="Click to view ticket details"
                    >
                      <td className="px-4 py-3 border-t font-medium text-sky-700 underline">
                        {t.id}
                      </td>
                      <td className="px-4 py-3 border-t">{t.subject}</td>
                      <td className="px-4 py-3 border-t">{t.requester}</td>
                      <td className="px-4 py-3 border-t">
                        {t.assignee ?? <span className="text-slate-400">—</span>}
                      </td>
                      <td className="px-4 py-3 border-t">
                        <StatusPill s={t.status} />
                      </td>
                      <td className="px-4 py-3 border-t">
                        <PriorityPill p={t.priority} />
                      </td>
                      <td className="px-4 py-3 border-t">{t.category}</td>
                      <td className="px-4 py-3 border-t">
                        {new Date(t.updatedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-3 text-xs text-slate-500 border-t">
                Showing {filtered.length} of {rows.length} tickets
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
