import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API } from "../lib/api";
import toast from "react-hot-toast"; // ✅ for success/error popups

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

  return (
    <div className="container-page">
      <div className="page-wrap">
        <h1 className="page-title">Create a Ticket</h1>
        <p className="page-sub">Tell us what’s going on and we’ll help.</p>

        <form onSubmit={onSubmit} className="card card-pad space-y-5">
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="select mt-1"
            >
              <option>Technical</option>
              <option>Billing</option>
              <option>Account</option>
              <option>Other</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Short summary"
              className={`input mt-1 ${
                errors.subject ? "border-rose-300 focus:ring-rose-300" : ""
              }`}
            />
            {errors.subject && <p className="mt-1 text-xs text-rose-600">{errors.subject}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="What happened? Any error messages or steps to reproduce?"
              className={`textarea mt-1 ${
                errors.desc ? "border-rose-300 focus:ring-rose-300" : ""
              }`}
            />
            {errors.desc && <p className="mt-1 text-xs text-rose-600">{errors.desc}</p>}
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Attachments
            </label>
            <Dropzone onFiles={onFiles} />
            {attachments.length > 0 && (
              <ul className="mt-2 text-sm text-slate-600 space-y-1">
                {attachments.map((f) => (
                  <li key={f.name} className="truncate">
                    • {f.name} ({Math.ceil(f.size / 1024)} KB)
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-1 text-xs text-slate-400">
              Allowed: .png, .jpg, .pdf, .txt, .log • Max 5 files • 10MB each
            </p>
          </div>

          {/* Notifications */}
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <legend className="text-sm font-medium text-slate-700 mb-1">
              Notify me via
            </legend>
            <label className="inline-flex items-center gap-2 text-slate-700">
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
              />
              Email
            </label>
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-2 text-slate-700">
                <input
                  type="checkbox"
                  checked={notifySms}
                  onChange={(e) => setNotifySms(e.target.checked)}
                />
                SMS
              </label>
              <input
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(optional) Phone for SMS"
                className="input ml-2 flex-1"
                disabled={!notifySms}
              />
            </div>
          </fieldset>

          {/* Submit */}
          <div className="flex items-center justify-between">
            {errors.submit && <p className="text-sm text-rose-600">{errors.submit}</p>}
            <button
              type="submit"
              disabled={loading}
              className={`btn-primary ${loading ? "bg-sky-400" : ""}`}
            >
              {loading ? "Submitting…" : "Submit Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Dropzone component
function Dropzone({ onFiles }: { onFiles: (files: File[]) => void }) {
  return (
    <label className="block border-2 border-dashed rounded-xl p-4 text-slate-600 hover:bg-slate-50 cursor-pointer">
      <input
        type="file"
        multiple
        className="hidden"
        accept=".png,.jpg,.jpeg,.pdf,.txt,.log"
        onChange={(e) => onFiles(Array.from(e.target.files ?? []))}
      />
      Drag & drop files or click to upload (max 5 • 10MB each)
    </label>
  );
}
