// src/lib/api.ts
export type Ticket = {
  id: string;
  subject: string;
  description?: string;
  status: "Pending" | "In Progress" | "Resolved" | "Unassigned";
  requester?: string;
  assignee?: string;
  createdAt?: string;
  updatedAt?: string;
  type: "Technical" | "Billing" | "Other";
  priority: "Low" | "Med" | "High";
};

/* ── Comment types ───────────────────────────────────────────── */
export type Comment = {
  id: string;
  ticket_id: string;
  author?: string | null;   // optional until auth is wired
  body: string;
  is_internal: boolean;
  createdAt: string;
};

export type CreateCommentInput = {
  body: string;
  is_internal?: boolean;    // default false on the API if omitted
};
/* ───────────────────────────────────────────────────────────── */

export type CreateTicketInput = {
  subject: string;
  description: string;
  type: "Technical" | "Billing" | "Other";
  priority: "Low" | "Med" | "High";
};

const base =
  (import.meta as any).env?.VITE_API_URL?.replace(/\/$/, "") || "/api"; // supports Vite proxy

// ---- auth token helpers (swap for Supabase session if you prefer) ----
let _token: string | null = null;
export function setToken(t: string | null) {
  _token = t;
  if (t) localStorage.setItem("authToken", t);
  else localStorage.removeItem("authToken");
}
(function bootstrapToken() {
  const t = localStorage.getItem("authToken");
  if (t) _token = t;
})();

// ---- generic request with sane defaults & error surfacing ----
async function req<T>(
  path: string,
  init: RequestInit = {},
  opts: { parseJson?: boolean } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as any),
  };
  if (_token) headers.Authorization = `Bearer ${_token}`;

  const r = await fetch(`${base}${path}`, {
    credentials: "include",
    ...init,
    headers,
  });

  // 204 no content
  if (r.status === 204) return undefined as T;

  const text = await r.text();
  const isJson =
    opts.parseJson ?? r.headers.get("content-type")?.includes("application/json");

  if (!r.ok) {
    const msg = isJson ? safeParseMessage(text) : text || r.statusText;
    throw new Error(msg || `HTTP ${r.status}`);
  }
  return (isJson ? safeJSON(text) : (text as any)) as T;
}

function safeJSON(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return s;
  }
}
function safeParseMessage(s: string) {
  try {
    const j = JSON.parse(s);
    return j?.error || j?.message || s;
  } catch {
    return s;
  }
}

// ---------------- API surface ----------------
export const API = {
  // If you’re using Supabase Auth on the FE, you may not need this.
  // Keep as a placeholder if you proxy login through your API.
  login(email: string, password: string) {
    return req<{ token: string; role: "customer" | "employee" }>(
      `/auth/login`,
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );
  },

  // PATCH /tickets/:id  (status only)
  updateTicketStatus(id: string, status: Ticket["status"]) {
    return req<Ticket>(`/tickets/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  // GET /tickets?q=...
  getTickets(q?: string) {
    const qs = q ? `?q=${encodeURIComponent(q)}` : "";
    return req<Ticket[]>(`/tickets${qs}`);
  },

  // GET /tickets/:id — fetch a single ticket by ID
  getTicket(id: string) {
    return req<Ticket>(`/tickets/${id}`);
  },

  // POST /tickets
  createTicket(payload: CreateTicketInput) {
    return req<Ticket>(`/tickets`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // ── Comments ────────────────────────────────────────────────
  getComments(ticketId: string) {
    return req<Comment[]>(`/tickets/${ticketId}/comments`);
  },

  addComment(ticketId: string, payload: CreateCommentInput) {
    return req<Comment>(`/tickets/${ticketId}/comments`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  // ───────────────────────────────────────────────────────────

  // optional: /chat/suggest (hook up later)
  chatSuggest(text: string) {
    return req<{ reply: string }>(`/chat/suggest`, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  },

  // presign upload (when you add attachments)
  presignAttachment(ticketId: string, filename: string) {
    return req<{ uploadUrl: string; path: string }>(
      `/tickets/${ticketId}/attachments/presign`,
      {
        method: "POST",
        body: JSON.stringify({ filename }),
      }
    );
  },

  // signed read url
  signAttachment(path: string) {
    return req<{ url: string }>(
      `/attachments/sign?path=${encodeURIComponent(path)}`
    );
  },
};

