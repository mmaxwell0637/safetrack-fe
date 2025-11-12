// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";
import type { Ticket } from "../lib/api";

const sample: Ticket[] = [
  { id:"ST-1001", subject:"VPN not connecting", status:"Pending", requester:"Alex K", updatedAt:new Date().toISOString() },
  // ...
];

export const handlers = [
  http.post("/api/auth/login", async () =>
    HttpResponse.json({ token: "dev", role: "employee" })
  ),
  http.get("/api/tickets", () => HttpResponse.json(sample)),
  http.post("/api/tickets", async ({ request }) => {
    const body = await request.json() as any;
    const t: Ticket = { id:`ST-${1000 + sample.length + 1}`, subject: body.subject, status:"Pending", requester:"You", updatedAt:new Date().toISOString() };
    sample.unshift(t);
    return HttpResponse.json(t, { status: 201 });
  }),
  http.post("/api/chat/suggest", async () =>
    HttpResponse.json({ reply: "Thanks! Would you like me to create a ticket from this chat?" })
  ),
];
