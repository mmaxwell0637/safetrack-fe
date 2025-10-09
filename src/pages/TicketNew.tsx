import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
  const [errors, setErrors] = useState<{ subject?: string; desc?: string }>({});

  const isValid = useMemo(() => {
    const e: typeof errors = {};
    if (!subject.trim()) e.subject = "Subject is required";
    if (!desc.trim()) e.desc = "Please describe the problem";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [subject, desc]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700)); // TODO: replace with real API call
    setLoading(false);
    navigate("/dashboard", { replace: true, state: { created: true } });
  }

  return (
    <div className="container-page">
      <div className="page-wrap">
        <h1 className="page-title">Create a Ticket</h1>
        <p className="page-sub">Tell us what’s going on and we’ll help.</p>

        <form onSubmit={onSubmit} className="card card-pad space-y-5">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Category</label>
            <select
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
            <label className="block text-sm font-medium text-slate-700">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Short summary"
              className={`input mt-1 ${errors.subject ? "border-rose-300 focus:ring-rose-300" : ""}`}
            />
            {errors.subject && <p className="mt-1 text-xs text-rose-600">{errors.subject}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              rows={6}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="What happened? Any error messages or steps to reproduce?"
              className={`textarea mt-1 ${errors.desc ? "border-rose-300 focus:ring-rose-300" : ""}`}
            />
            {errors.desc && <p className="mt-1 text-xs text-rose-600">{errors.desc}</p>}
          </div>

          {/* Notifications */}
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <legend className="text-sm font-medium text-slate-700 mb-1">Notify me via</legend>
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(optional) Phone for SMS"
                className="input ml-2 flex-1"
                disabled={!notifySms}
              />
            </div>
          </fieldset>

          {/* Submit */}
          <div className="flex items-center justify-end">
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
