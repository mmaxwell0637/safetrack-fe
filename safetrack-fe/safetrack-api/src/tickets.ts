// safetrack-api/src/tickets.ts
import { Router } from "express";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const r = Router();

// ---- Supabase env guard ----
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
    "Check safetrack-api/.env and ensure dotenv.config() runs before importing routes."
  );
}

// ---- Supabase client (service role) ----
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

// ---- Types ----
type Ticket = {
  id: string;                                // e.g., ST-1003
  subject: string;
  description: string;
  type: "Technical" | "Billing" | "Other";
  priority: "Low" | "Med" | "High";
  status: "Pending" | "In Progress" | "Resolved" | "Unassigned";
  created_at?: string | null;
  updated_at?: string | null;
};

// ---- Validation ----
// Accept either {type} or {category}
const CreateTicket = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  type: z.enum(["Technical", "Billing", "Other"]).optional(),
  category: z.enum(["Technical", "Billing", "Other"]).optional(),
  priority: z.enum(["Low", "Med", "High"]).default("Low"),
});

const UpdateTicket = z.object({
  status: z.enum(["Pending", "In Progress", "Resolved", "Unassigned"]),
});

// ---- Helpers ----
async function nextTicketId(): Promise<string> {
  // table: public.ticket_counter  (k text PK, v int)
  // row:   { k: 'TICKET', v: 1000 }
  const { data: row, error: selErr } = await supabase
    .from("ticket_counter")
    .select("v")
    .eq("k", "TICKET")
    .single();

  if (selErr && selErr.code !== "PGRST116") throw selErr; // not found is fine

  const current = row?.v ?? 1000; // start at 1000
  const next = current + 1;

  const { error: upErr } = await supabase
    .from("ticket_counter")
    .upsert({ k: "TICKET", v: next })
    .eq("k", "TICKET");

  if (upErr) throw upErr;

  return `ST-${next}`;
}

// ---- Routes ----

// LIST with optional ?q= & ?status= & ?type=
r.get("/", async (req, res) => {
  try {
    const { q, status, type } = req.query as {
      q?: string;
      status?: Ticket["status"];
      type?: Ticket["type"];
    };

    let query = supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);
    if (type) query = query.eq("type", type);

    // crude search on subject+description
    if (q) {
      // You can switch to Postgres full-text later
      query = query.or(
        `subject.ilike.%${q}%,description.ilike.%${q}%`
      );
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    // map DB row -> API shape (createdAt casing for FE)
    const mapped = (data || []).map((t) => ({
      id: t.id,
      subject: t.subject,
      description: t.description,
      type: t.type,
      priority: t.priority,
      status: t.status,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    })) as Ticket[];

    res.json(mapped);
  } catch (e: any) {
    res.status(500).json({ error: e.message || "List failed" });
  }
});

// GET by id
r.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error?.code === "PGRST116") return res.status(404).json({ error: "Not found" });
  if (error) return res.status(500).json({ error: error.message });

  res.json({
    id: data.id,
    subject: data.subject,
    description: data.description,
    type: data.type,
    priority: data.priority,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as Ticket);
});

// CREATE
r.post("/", async (req, res) => {
  const parsed = CreateTicket.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  try {
    const data = parsed.data;
    const chosenType = (data.type ?? data.category) as Ticket["type"];
    if (!chosenType) return res.status(400).json({ error: "Missing category/type" });

    const id = await nextTicketId();

    const row = {
      id,
      subject: data.subject.trim(),
      description: data.description.trim(),
      type: chosenType,
      priority: data.priority,
      status: "Pending" as const,
      // created_at defaults to now()
    };

    const { data: inserted, error } = await supabase
      .from("tickets")
      .insert(row)
      .select("*")
      .single();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json({
      id: inserted.id,
      subject: inserted.subject,
      description: inserted.description,
      type: inserted.type,
      priority: inserted.priority,
      status: inserted.status,
      createdAt: inserted.created_at,
      updatedAt: inserted.updated_at,
    } as Ticket);
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Create failed" });
  }
});

// UPDATE (status only)
r.patch("/:id", async (req, res) => {
  const parsed = UpdateTicket.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const { data, error } = await supabase
    .from("tickets")
    .update({ status: parsed.data.status, updated_at: new Date().toISOString() })
    .eq("id", req.params.id)
    .select("*")
    .single();

  if (error?.code === "PGRST116") return res.status(404).json({ error: "Not found" });
  if (error) return res.status(500).json({ error: error.message });

  res.json({
    id: data.id,
    subject: data.subject,
    description: data.description,
    type: data.type,
    priority: data.priority,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as Ticket);
});

// ------------------------------------
// Comments: list + create
// ------------------------------------

type CommentRow = {
  id: string;
  ticket_id: string;
  author?: string | null;
  body: string;
  is_internal: boolean;
  created_at: string;
};

const CreateComment = z.object({
  body: z.string().min(1, "Comment cannot be empty"),
  is_internal: z.boolean().optional().default(false),
  author: z.string().optional(), // later: take from auth/session
});

// GET /api/tickets/:id/comments
r.get("/:id/comments", async (req, res) => {
  const ticketId = req.params.id;

  const { data, error } = await supabase
    .from("ticket_comments")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  const mapped = (data as CommentRow[] | null)?.map((c) => ({
    id: c.id,
    ticket_id: c.ticket_id,
    author: c.author,
    body: c.body,
    is_internal: c.is_internal,
    createdAt: c.created_at,
  })) ?? [];

  res.json(mapped);
});

// POST /api/tickets/:id/comments
r.post("/:id/comments", async (req, res) => {
  const ticketId = req.params.id;

  const parsed = CreateComment.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const payload = {
    ticket_id: ticketId,
    body: parsed.data.body.trim(),
    is_internal: !!parsed.data.is_internal,
    author: parsed.data.author ?? null,
  };

  const { data, error } = await supabase
    .from("ticket_comments")
    .insert(payload)
    .select("*")
    .single();

  if (error) return res.status(500).json({ error: error.message });

  const c = data as CommentRow;
  res.status(201).json({
    id: c.id,
    ticket_id: c.ticket_id,
    author: c.author,
    body: c.body,
    is_internal: c.is_internal,
    createdAt: c.created_at,
  });
});

export default r;
