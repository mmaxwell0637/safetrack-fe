import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { API } from "../lib/api";
import type { Ticket } from "../lib/api";

export default function TicketReceipt() {
  const { id } = useParams();
  const location = useLocation() as { state?: { ticket?: Ticket } };
  const [ticket, setTicket] = useState<Ticket | null>(location.state?.ticket ?? null);
  const [loading, setLoading] = useState(!ticket);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ticket || !id) return;
    (async () => {
      try {
        const t = await API.getTicket(id);
        setTicket(t);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load ticket");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, ticket]);

  if (loading) return <div className="page-wrap">Loading…</div>;
  if (error)   return <div className="page-wrap text-rose-600">{error}</div>;
  if (!ticket) return <div className="page-wrap">No ticket found.</div>;

  const createdPretty =
    ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "—";

  const onPrint = () => window.print();
  const onDownload = () => {
    const blob = new Blob([JSON.stringify(ticket, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ticket.id}_receipt.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-page">
      {/* print-only brand header */}
      <header className="hidden print:block text-center mb-4">
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>SafeTrack™ — Ticket Receipt</h2>
      </header>

      <div className="page-wrap card card-pad space-y-4">
        <h1 className="page-title">Ticket Receipt</h1>
        <p className="page-sub">Save or print this confirmation for your records.</p>

        <div className="grid gap-2 text-sm">
          <Row label="Ticket ID"   value={ticket.id} />
          <Row label="Subject"     value={ticket.subject} />
          <Row label="Description" value={ticket.description ?? "—"} />
          <Row label="Status"      value={ticket.status} />
          <Row label="Created"     value={createdPretty} />
        </div>

        <div className="flex gap-2 pt-2 print:hidden">
          <button className="btn-secondary" onClick={onPrint}>🖨️ Print / Save PDF</button>
          <button className="btn-secondary" onClick={onDownload}>⬇️ Download JSON</button>
          <Link to="/dashboard" className="btn-primary ml-auto">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-slate-200 py-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800 text-right">{value}</span>
    </div>
  );
}
