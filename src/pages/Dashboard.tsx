import { useMemo, useState } from "react";

type Status = "Pending" | "In Progress" | "Resolved" | "Unassigned";
type Ticket = {
  id: string;
  subject: string;
  requester: string;
  status: Status;
  assignee?: string;
  updatedAt: string; // ISO dt
};

const seed: Ticket[] = [
  { id: "ST-1001", subject: "VPN not connecting", requester: "Alex K", status: "Pending", updatedAt: "2025-10-08T21:10:00Z" },
  { id: "ST-1002", subject: "Billing discrepancy", requester: "Renee P", status: "In Progress", assignee: "Jamal", updatedAt: "2025-10-08T18:40:00Z" },
  { id: "ST-1003", subject: "Password reset loop", requester: "Iris M", status: "Resolved", assignee: "Priya", updatedAt: "2025-10-07T14:02:00Z" },
  { id: "ST-1004", subject: "Cannot access dashboard", requester: "Ken D", status: "Unassigned", updatedAt: "2025-10-08T22:05:00Z" },
];

/** Uses your preset status pills from index.css */
function StatusPill({ s }: { s: Status }) {
  const map: Record<Status, string> = {
    Pending: "status-pending",
    "In Progress": "status-progress",
    Resolved: "status-resolved",
    Unassigned: "status-unassigned",
  };
  return <span className={map[s]}>{s}</span>;
}

export default function Dashboard() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"All" | Status>("All");
  const [agent, setAgent] = useState<"All" | "Jamal" | "Priya" | "—">("All");

  const agents = useMemo(() => {
    const names = Array.from(new Set(seed.map((t) => t.assignee || "—"))) as Array<"Jamal" | "Priya" | "—">;
    return ["All", ...names] as const;
  }, []);

  const filtered = useMemo(() => {
    return seed
      .filter((t) => (tab === "All" ? true : t.status === tab))
      .filter((t) => (agent === "All" ? true : (t.assignee || "—") === agent))
      .filter((t) => {
        const s = (t.id + t.subject + t.requester + (t.assignee ?? "") + t.status).toLowerCase();
        return s.includes(q.toLowerCase());
      });
  }, [q, tab, agent]);

  return (
    <div className="container-page">
      <div className="page-wrap">
        <div className="mb-6 text-center">
          <h1 className="page-title">Employee Dashboard</h1>
          <p className="page-sub">Track and manage support tickets.</p>
        </div>

        {/* Controls */}
        <div className="card card-pad mb-4">
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

            <div className="grow" />

            <select
              value={agent}
              onChange={(e) => setAgent(e.target.value as any)}
              className="select w-40"
              title="Filter by assignee"
            >
              {agents.map((a) => (
                <option key={a} value={a}>
                  {a === "—" ? "Unassigned" : a}
                </option>
              ))}
            </select>

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tickets…"
              className="input w-56"
            />
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="text-left px-4 py-3 border-b">Ticket</th>
                <th className="text-left px-4 py-3 border-b">Subject</th>
                <th className="text-left px-4 py-3 border-b">Requester</th>
                <th className="text-left px-4 py-3 border-b">Assignee</th>
                <th className="text-left px-4 py-3 border-b">Status</th>
                <th className="text-left px-4 py-3 border-b">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-slate-500" colSpan={6}>
                    No tickets match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 border-t font-medium">{t.id}</td>
                    <td className="px-4 py-3 border-t">{t.subject}</td>
                    <td className="px-4 py-3 border-t">{t.requester}</td>
                    <td className="px-4 py-3 border-t">
                      {t.assignee ?? <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-4 py-3 border-t">
                      <StatusPill s={t.status} />
                    </td>
                    <td className="px-4 py-3 border-t">
                      {new Date(t.updatedAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}