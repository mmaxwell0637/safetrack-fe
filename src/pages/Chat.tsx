import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

type Author = "me" | "agent";
type Msg = { id: string; author: Author; text: string; ts: number };
type Intent = "agent" | "status" | "password" | "new" | "other";

const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const PHONE_RE = /\b(\+?\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})\b/;

function detectIntent(text: string): Intent {
  if (/speak.*agent|live.*agent|human|representative|\/agent/i.test(text)) return "agent";
  if (/status|where|update|check.*ticket|\/status/i.test(text)) return "status";
  if (/password|reset|login issue/i.test(text)) return "password";
  if (/new ticket|create.*ticket|open.*ticket|\/new/i.test(text)) return "new";
  return "other";
}
function extractTicketId(text: string): string | null {
  const m = text.match(/\bST-\d{3,}\b/i);
  return m ? m[0].toUpperCase() : null;
}
function subjectFrom(text: string) {
  const words = text.trim().split(/\s+/).slice(0, 8).join(" ");
  return words.length ? words.charAt(0).toUpperCase() + words.slice(1) : "New ticket";
}

export default function Chat() {
  const navigate = useNavigate();

  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: crypto.randomUUID(),
      author: "agent",
      text: "Hi! 👋 This is SafeTrack Support. Tell us what's going on and I’ll help open or update a ticket.",
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<string | null>(null); // last issue text or ticket id
  const [askedCreate, setAskedCreate] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    "Check ticket status",
    "Reset my password",
    "Create a new ticket",
    "Speak to an agent",
  ]);

  const endRef = useRef<HTMLDivElement | null>(null);

  // restore chat
  useEffect(() => {
    const raw = localStorage.getItem("safetrack-chat");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Msg[];
        if (Array.isArray(parsed) && parsed.length) setMsgs(parsed);
      } catch {}
    }
  }, []);
  // persist chat + autoscroll
  useEffect(() => {
    localStorage.setItem("safetrack-chat", JSON.stringify(msgs));
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  const canSend = useMemo(() => input.trim().length > 0, [input]);
  const addMessage = (author: Author, text: string) =>
    setMsgs((m) => [...m, { id: crypto.randomUUID(), author, text, ts: Date.now() }]);

  async function handleSend() {
    if (!canSend) return;
    const text = input.trim();
    setInput("");
    addMessage("me", text);

    // slash commands
    if (/^\/status\s+/i.test(text)) {
      const id = extractTicketId(text);
      addMessage("agent", id ? `Checking status for ${id}… (stubbed)` : "Usage: /status ST-1005");
      return;
    }
    if (/^\/new\b/i.test(text)) {
      setPendingDraft("New ticket created from chat");
      setAskedCreate(true);
      addMessage("agent", "Okay — I can draft a new ticket. Say “yes” to continue.");
      setSuggestions(["Yes, create a ticket", "Share my email", "Share my phone"]);
      return;
    }
    if (/^\/agent\b/i.test(text)) {
      addMessage("agent", "A live agent has been requested. We’ll notify you when connected. (stub)");
      setSuggestions(["Yes, create a ticket", "Share my email", "Share my phone"]);
      return;
    }

    // “yes” follow-up for create/open
    const saidYes = /^(\s*(yes|y|sure|ok|okay|please)|yes, create a ticket)\b/i.test(text);
    if (askedCreate && saidYes && pendingDraft) {
      if (/^ST-\d{3,}$/i.test(pendingDraft)) {
        navigate(`/tickets/${pendingDraft}`);
      } else {
        navigate("/tickets/new", {
          state: { draft: { subject: subjectFrom(pendingDraft), desc: pendingDraft } },
        });
      }
      setAskedCreate(false);
      setPendingDraft(null);
      setSuggestions(["Check ticket status", "Create a new ticket", "Speak to an agent"]);
      return;
    }

    // ticket id in message -> offer to open
    const maybeId = extractTicketId(text);
    if (maybeId) {
      addMessage("agent", `I see ticket ${maybeId}. Open it now? (say "yes")`);
      setPendingDraft(maybeId);
      setAskedCreate(true);
      setSuggestions(["Yes, open it", "Create a new ticket", "Speak to an agent"]);
      return;
    }

    // capture contact info if provided
    const email = text.match(EMAIL_RE)?.[0] ?? null;
    const phone = text.match(PHONE_RE)?.[0] ?? null;
    if (email) addMessage("agent", `Thanks, I captured your email: **${email}**.`);
    if (phone) addMessage("agent", `Got it — phone noted: **${phone}**.`);

    // intent-aware guidance
    const intent = detectIntent(text);
    let canned = "";
    let nextChips: string[] = [];

    switch (intent) {
      case "agent":
        canned =
          "I can connect you with a live specialist. To speed things up, want me to create a ticket with your details so the agent can review first?";
        nextChips = ["Yes, create a ticket", "No, just chat", "Share my email", "Share my phone"];
        setPendingDraft(text);
        setAskedCreate(true);
        break;
      case "status":
        canned =
          "Sure — I can check a ticket. If you know the ID (e.g., ST-1005), send it here. If not, I can create a new ticket to track this.";
        nextChips = ["ST-1005", "Create a new ticket", "Speak to an agent"];
        setPendingDraft(text);
        setAskedCreate(true);
        break;
      case "password":
        canned =
          "Password issues happen! I can file a helpdesk ticket so we can reset securely. Should I create that ticket now?";
        nextChips = ["Yes, create a ticket", "I’ll try again", "Speak to an agent"];
        setPendingDraft(text);
        setAskedCreate(true);
        break;
      case "new":
        canned =
          "Happy to help. I’ll turn your last message into a ticket. What’s the best way to reach you if we need more info — chat only, email, or phone?";
        nextChips = ["Chat only", "Share my email", "Share my phone"];
        setPendingDraft(text);
        setAskedCreate(true);
        break;
      default:
        canned =
          "Thanks — I’ve captured that. Would you like me to create a ticket so we can track this and notify you of updates?";
        nextChips = ["Yes, create a ticket", "Check ticket status", "Speak to an agent"];
        setPendingDraft(text);
        setAskedCreate(true);
        break;
    }

    setTyping(true);
    await new Promise((r) => setTimeout(r, 600));
    setTyping(false);

    setSuggestions(nextChips);
    addMessage("agent", canned);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="container-page flex flex-col">
      {/* Header */}
      <div className="nav-shell">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Logo size={28} className="hover:scale-105 transition-transform" />
          <div>
            <div className="font-semibold text-slate-900">SafeTrack Support</div>
            <div className="text-xs text-slate-500">Chat assistant • opens tickets &amp; helps triage</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-3xl mx-auto w-full grow px-4 py-4">
        <div className="flex flex-col gap-3" aria-live="polite">
          {msgs.map((m) => (
            <Bubble key={m.id} author={m.author} text={m.text} ts={m.ts} />
          ))}
          {typing && (
            <div className="flex items-end gap-2">
              <Avatar />
              <div className="rounded-2xl rounded-tl-none bg-slate-100 px-3 py-2 text-slate-700 text-sm">
                <span className="inline-flex gap-1">
                  <Dot /> <Dot className="animation-delay-150" /> <Dot className="animation-delay-300" />
                </span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {/* Composer */}
      <div className="border-t bg-white">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="card focus-within:ring-2 focus-within:ring-sky-300">
            {/* dynamic quick replies */}
            <div className="px-3 pt-3 pb-2 flex flex-wrap gap-2">
              {suggestions.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setInput(label);
                    setTimeout(() => handleSend(), 30); // tap-to-send
                  }}
                  className="text-xs border rounded-full px-3 py-1 hover:bg-slate-50"
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="card-pad pb-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={2}
                placeholder='Type a message…  (Enter to send • Shift+Enter for new line). Try "/status ST-1005", "/new", or "/agent".'
                className="w-full resize-none rounded-2xl p-3 outline-none text-slate-800 border border-slate-200"
              />
            </div>

            <div className="flex items-center justify-between px-3 pb-3">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <p>Say “yes” to create/open from your last message.</p>
                {/* attachment stub */}
                <label className="cursor-pointer text-slate-500 hover:text-slate-700 flex items-center gap-1">
                  📎
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      addMessage("me", `Attached file: ${f.name} (${Math.round(f.size / 1024)} KB)`);
                    }}
                  />
                </label>
              </div>

              <button
                onClick={handleSend}
                disabled={!canSend || typing}
                className={`btn-primary ${(!canSend || typing) ? "bg-sky-300 cursor-not-allowed" : ""}`}
              >
                Send ↵
              </button>
            </div>
          </div>

          <p className="mt-2 text-center text-xs text-slate-400">
            Tip: describe your issue, paste a ticket like ST-1005, or use /status • /new • /agent
          </p>
        </div>
      </div>
    </div>
  );
}

function Bubble({ author, text, ts }: { author: Author; text: string; ts: number }) {
  const isMe = author === "me";
  return (
    <div className={`flex items-end gap-2 ${isMe ? "justify-end" : ""}`}>
      {!isMe && <Avatar />}
      <div
        className={`max-w-[76%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm
        ${isMe ? "bg-sky-600 text-white rounded-tr-none" : "bg-slate-100 text-slate-800 rounded-tl-none"}`}
      >
        <div>{text}</div>
        <div className={`mt-1 text-[10px] ${isMe ? "text-sky-100/80" : "text-slate-500/80"}`}>
          {new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div className="flex items-center justify-center">
      <Logo size={28} />
    </div>
  );
}

function Dot({ className = "" }: { className?: string }) {
  return <span className={`h-2 w-2 rounded-full bg-slate-400 inline-block animate-pulse ${className}`} />;
}
