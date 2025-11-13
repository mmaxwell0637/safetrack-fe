// src/pages/TicketDetail.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../lib/api";
import type { Ticket, Comment } from "../lib/api"; // ⬅️ include Comment
import toast from "react-hot-toast";

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ticket state
  const [t, setT] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // status update state
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Ticket["status"]>("Pending");

  // comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [posting, setPosting] = useState(false);

  // load ticket
  async function load() {
    if (!id) {
      console.warn("[TicketDetail] No ticket ID in URL params");
      return;
    }
    console.log("[TicketDetail] Loading ticket:", id);
    setLoading(true);
    try {
      const row = await API.getTicket(id);
      console.log("[TicketDetail] Ticket loaded:", row);
      setT(row);
      setStatus(row.status);
    } catch (e: any) {
      console.error("[TicketDetail] Failed to load ticket:", e);
      toast.error(e?.message ?? "Failed to load ticket");
      setErr(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  // load comments
  async function loadComments() {
    if (!id) return;
    try {
      const list = await API.getComments(id);
      setComments(list);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to load comments");
    }
  }

  // post a comment
  async function onPostComment() {
    if (!id || !commentText.trim()) return;
    setPosting(true);
    try {
      await API.addComment(id, { body: commentText, is_internal: isInternal });
      setCommentText("");
      setIsInternal(false);
      await loadComments();
      toast.success("Comment added");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to add comment");
    } finally {
      setPosting(false);
    }
  }

  // save status
  async function onSaveStatus() {
    if (!id || !t) return;

    // optimistic UI
    const prev = t;
    const next = { ...t, status };
    setSaving(true);
    setT(next);

    try {
      const updated = await API.updateTicketStatus(id, status);
      setT(updated);
      toast.success("Status updated");
    } catch (e: any) {
      setT(prev);
      toast.error(e?.message ?? "Update failed");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    console.log("[TicketDetail] Component mounted/updated, ticket ID:", id);
    setErr(null);
    if (id) {
      load();
      loadComments();
    } else {
      console.warn("[TicketDetail] No ticket ID provided");
      setErr("No ticket ID provided");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="container-page">
        <div className="page-wrap">
          <p className="text-slate-600">Loading ticket {id}…</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="container-page">
        <div className="page-wrap">
          <div className="card card-pad">
            <h1 className="page-title text-rose-600">Error Loading Ticket</h1>
            <p className="text-slate-700 mb-4">{err}</p>
            <button className="btn" onClick={() => navigate("/tickets")}>
              Back to Tickets
            </button>
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-slate-500">Debug Info</summary>
              <pre className="mt-2 text-xs bg-slate-100 p-2 rounded overflow-auto">
                Ticket ID: {id || "undefined"}
                {"\n"}Error: {err}
              </pre>
            </details>
          </div>
        </div>
      </div>
    );
  }

  if (!t) {
    return (
      <div className="container-page">
        <div className="page-wrap">
          <div className="card card-pad">
            <h1 className="page-title">Ticket Not Found</h1>
            <p className="text-slate-700 mb-4">Ticket {id} could not be loaded.</p>
            <button className="btn" onClick={() => navigate("/tickets")}>
              Back to Tickets
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page">
      <div className="page-wrap space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="page-title">Ticket {t.id}</h1>
          <div className="flex gap-2">
            <button className="btn" onClick={() => navigate("/tickets")}>
              Back to list
            </button>
            <button
              className="btn-primary"
              onClick={() =>
                navigate(`/tickets/${t.id}/receipt`, { state: { ticket: t } })
              }
            >
              View Receipt
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Left: ticket summary */}
          <div className="card card-pad md:col-span-2">
            <h2 className="font-semibold text-slate-800 mb-2">Summary</h2>
            <div className="space-y-2 text-sm">
              <Row label="Subject" value={t.subject} />
              <Row label="Type" value={t.type} />
              <Row label="Priority" value={t.priority} />
              <Row
                label="Created"
                value={t.createdAt ? new Date(t.createdAt).toLocaleString() : "—"}
              />
              <Row
                label="Updated"
                value={t.updatedAt ? new Date(t.updatedAt).toLocaleString() : "—"}
              />
            </div>
            <div className="mt-4">
              <h3 className="font-medium text-slate-800 mb-1">Description</h3>
              <p className="whitespace-pre-wrap text-slate-700">
                {t.description || "—"}
              </p>
            </div>
          </div>

          {/* Right: status card */}
          <div className="card card-pad">
            <h2 className="font-semibold text-slate-800 mb-2">Status</h2>
            <select
              className="select mb-3"
              value={status}
              onChange={(e) => setStatus(e.target.value as Ticket["status"])}
              disabled={saving}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Unassigned</option>
            </select>
            <button
              className="btn-primary w-full"
              onClick={onSaveStatus}
              disabled={saving}
            >
              {saving ? "Saving…" : "Update Status"}
            </button>
          </div>

          {/* Right: comments card */}
          <div className="card card-pad md:col-span-1">
            <h2 className="font-semibold text-slate-800 mb-3">Comments</h2>

            {/* list */}
            <div className="space-y-3 max-h-80 overflow-auto pr-1">
              {comments.length === 0 && (
                <p className="text-sm text-slate-500">No comments yet.</p>
              )}
              {comments.map((c) => (
                <div key={c.id} className="border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{c.author || "User"}</span>
                    <span>•</span>
                    <span>{new Date(c.createdAt).toLocaleString()}</span>
                    {c.is_internal && (
                      <>
                        <span>•</span>
                        <span className="inline-block text-[11px] px-2 py-[1px] rounded bg-slate-100 text-slate-700">
                          Internal
                        </span>
                      </>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-800 whitespace-pre-wrap">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>

            {/* composer */}
            <div className="mt-3 space-y-2">
              <textarea
                className="textarea w-full"
                rows={3}
                placeholder="Write a comment…"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                  />
                  Internal note
                </label>
                <button
                  className="btn-primary"
                  onClick={onPostComment}
                  disabled={posting || !commentText.trim()}
                >
                  {posting ? "Posting…" : "Add Comment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="text-slate-500">{label}</div>
      <div className="col-span-2 text-slate-800">{value || "—"}</div>
    </div>
  );
}
