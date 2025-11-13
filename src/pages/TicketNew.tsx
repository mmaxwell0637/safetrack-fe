import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
//import { API } from "../lib/api";
//import toast from "react-hot-toast"; // ✅ for success/error popups

type Category = "Billing" | "Technical" | "Account" | "Other";

export default function TicketNew() {
  const navigate = useNavigate();
  const location = useLocation() as {
    state?: { draft?: { subject?: string; desc?: string } };
  };

  const [category, setCategory] = useState<Category>("Technical");
  const [subject, setSubject] = useState(() => location.state?.draft?.subject ?? "");
  const [desc, setDesc] = useState(() => location.state?.draft?.desc ?? "");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ subject?: string; desc?: string; submit?: string }>({});

  const [attachments, setAttachments] = useState<File[]>([]);
  function onFiles(files: File[]) {
    const ALLOWED = /\.(png|jpg|jpeg|pdf|txt|log)$/i;
    const ok = files.slice(0, 5).filter(
      (f) => f.size <= 10 * 1024 * 1024 && ALLOWED.test(f.name)
    );
    setAttachments(ok);
  }

  const isValid = useMemo(() => {
    const e: typeof errors = {};
    if (!subject.trim()) e.subject = "Subject is required";
    if (!desc.trim()) e.desc = "Please describe the problem";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [subject, desc]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || loading) return;
    setLoading(true);
    setErrors((x) => ({ ...x, submit: undefined }));

    try {
      const type =
        category === "Account" ? "Other" : (category as "Technical" | "Billing" | "Other");

      const t = await API.createTicket({
        subject,
        description: desc,
        type,
        priority: "Med",
      });

      // ✅ Success toast
      toast.success(`Ticket ${t.id} created successfully! 🎉`);

      // ✅ Navigate to the printable receipt page
      navigate(`/tickets/${t.id}/receipt`, {
        replace: true,
        state: { created: t.id, ticket: t },
      });

      // ✅ Clear form after submission
      setSubject("");
      setDesc("");
      setCategory("Technical");
      setAttachments([]);
      setNotifyEmail(true);
      setNotifySms(false);
      setPhone("");
      setLoading(false);
    } catch (err: any) {
      setErrors((x) => ({ ...x, submit: err?.message ?? String(err) }));
      toast.error("Failed to create ticket. Please check your input.");
      setLoading(false);
    }
  }

  // ✅ Clean, corporate SafeTrack styling
  const containerStyle = {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "48px 20px",
    display: "flex",
    justifyContent: "center",
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    padding: "40px",
    width: "100%",
    maxWidth: "720px",
    fontFamily: "Inter, sans-serif",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.9em",
    fontWeight: 600,
    color: "#334155",
    marginBottom: "8px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #CBD5E1",
    borderRadius: "8px",
    fontSize: "0.95em",
    outline: "none",
  };

  const errorInputStyle = {
    ...inputStyle,
    borderColor: "#FCA5A5",
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={onSubmit} style={cardStyle}>
        <h1
          style={{
            fontSize: "1.8em",
            fontWeight: 700,
            color: "#1E293B",
            marginBottom: "6px",
          }}
        >
          Create a Ticket
        </h1>
        <p style={{ color: "#64748B", marginBottom: "28px" }}>
          Tell us what’s going on and we’ll help.
        </p>

        {/* Category */}
        <div style={{ marginBottom: "22px" }}>
          <label style={labelStyle}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            style={inputStyle}
          >
            <option>Technical</option>
            <option>Billing</option>
            <option>Account</option>
            <option>Other</option>
          </select>
        </div>

        {/* Subject */}
        <div style={{ marginBottom: "22px" }}>
          <label style={labelStyle}>Subject</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Short summary"
            style={errors.subject ? errorInputStyle : inputStyle}
          />
          {errors.subject && (
            <p style={{ marginTop: "4px", fontSize: "0.8em", color: "#DC2626" }}>
              {errors.subject}
            </p>
          )}
        </div>

        {/* Description */}
        <div style={{ marginBottom: "22px" }}>
          <label style={labelStyle}>Description</label>
          <textarea
            rows={6}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="What happened? Any error messages or steps to reproduce?"
            style={errors.desc ? errorInputStyle : inputStyle}
          />
          {errors.desc && (
            <p style={{ marginTop: "4px", fontSize: "0.8em", color: "#DC2626" }}>
              {errors.desc}
            </p>
          )}
        </div>

        {/* Attachments */}
        <div style={{ marginBottom: "22px" }}>
          <label style={labelStyle}>Attachments</label>
          <Dropzone onFiles={onFiles} />
          {attachments.length > 0 && (
            <ul
              style={{
                marginTop: "8px",
                fontSize: "0.85em",
                color: "#64748B",
                listStyle: "none",
                padding: 0,
              }}
            >
              {attachments.map((f) => (
                <li
                  key={f.name}
                  style={{
                    marginBottom: "4px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  • {f.name} ({Math.ceil(f.size / 1024)} KB)
                </li>
              ))}
            </ul>
          )}
          <p style={{ marginTop: "8px", fontSize: "0.8em", color: "#94A3B8" }}>
            Allowed: .png, .jpg, .pdf, .txt, .log • Max 5 files • 10MB each
          </p>
        </div>

        {/* Notifications */}
        <fieldset style={{ marginBottom: "28px", border: "none", padding: 0 }}>
          <legend style={{ ...labelStyle, marginBottom: "12px" }}>Notify me via</legend>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
            }}
          >
            <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#334155" }}>
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
              />
              Email
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#334155" }}>
                <input
                  type="checkbox"
                  checked={notifySms}
                  onChange={(e) => setNotifySms(e.target.checked)}
                />
                SMS
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(optional) Phone"
                disabled={!notifySms}
                style={{ ...inputStyle, marginTop: 0, flex: 1 }}
              />
            </div>
          </div>
        </fieldset>

        {/* Submit */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {errors.submit && (
            <p style={{ fontSize: "0.85em", color: "#DC2626" }}>{errors.submit}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 32px",
              background: loading ? "#93C5FD" : "#2563EB",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1em",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) =>
              !loading && (e.currentTarget.style.background = "#1E40AF")
            }
            onMouseOut={(e) =>
              !loading && (e.currentTarget.style.background = "#2563EB")
            }
          >
            {loading ? "Submitting…" : "Submit Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ✅ Styled Dropzone consistent with SafeTrack branding
function Dropzone({ onFiles }: { onFiles: (files: File[]) => void }) {
  return (
    <label
      style={{
        display: "block",
        border: "2px dashed #CBD5E1",
        borderRadius: "12px",
        padding: "28px",
        textAlign: "center",
        color: "#64748B",
        cursor: "pointer",
        transition: "all 0.25s",
      }}
      onMouseOver={(e) => (e.currentTarget.style.background = "#F1F5F9")}
      onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <input
        type="file"
        multiple
        style={{ display: "none" }}
        accept=".png,.jpg,.jpeg,.pdf,.txt,.log"
        onChange={(e) => onFiles(Array.from(e.target.files ?? []))}
      />
      Drag & drop files or click to upload
    </label>
  );
}
