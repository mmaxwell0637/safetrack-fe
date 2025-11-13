// src/lib/schemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});

export const ticketSchema = z.object({
  subject: z.string().min(3).max(120),
  desc: z.string().min(10).max(4000),
  files: z.array(z.custom<File>()).max(5).optional(),
});

export type Priority = "Low" | "Medium" | "High";
export type Status   = "Pending" | "In Progress" | "Resolved" | "Unassigned";

export type Ticket = {
  id: string;
  subject: string;
  description?: string;
  requester: string;
  assignee?: string | null;
  status: Status;
  priority: Priority;
  dueAt?: string;     // ISO date
  updatedAt: string;  // ISO date
  photos?: string[];
};
