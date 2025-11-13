import type { Ticket } from "./schemas";

let TICKETS: Ticket[] = [
  { id:"ST-1001", subject:"VPN not connecting", requester:"Alex K", status:"Pending",
    priority:"Medium", updatedAt:"2025-10-08T21:10:00Z", dueAt:"2025-10-30T12:00:00Z" },
  { id:"ST-1002", subject:"Billing discrepancy", requester:"Renee P", status:"In Progress",
    assignee:"Jamal", priority:"High", updatedAt:"2025-10-08T18:40:00Z", dueAt:"2025-10-18T12:00:00Z" },
  { id:"ST-1003", subject:"Password reset loop", requester:"Iris M", status:"Resolved",
    assignee:"Priya", priority:"Low", updatedAt:"2025-10-07T14:02:00Z" },
  { id:"ST-1004", subject:"Cannot access dashboard", requester:"Ken D", status:"Unassigned",
    priority:"Medium", updatedAt:"2025-10-08T22:05:00Z" },
];

export const tickets = {
  list() { return [...TICKETS]; },
  byId(id: string) { return TICKETS.find(t => t.id === id) || null; },
  update(id: string, patch: Partial<Ticket>) {
    const i = TICKETS.findIndex(t => t.id === id);
    if (i >= 0) TICKETS[i] = { ...TICKETS[i], ...patch, updatedAt: new Date().toISOString() };
    return TICKETS[i] ?? null;
  },
  add(t: Ticket) { TICKETS = [t, ...TICKETS]; },
};
