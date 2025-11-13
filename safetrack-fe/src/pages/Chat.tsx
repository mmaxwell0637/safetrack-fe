import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo"; // ⬅️ add this

type Author = "me" | "agent";
type Msg = { id: string; author: Author; text: string; ts: number };

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

  // remember last problem text and whether we asked to create a ticket
  const [pendingDraft, setPendingDraft] = useState<string | null>(null);
  const [askedCreate, setAskedCreate] = useState(false);

  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  function addMessage(author: Author, text: string) {
    setMsgs((m) => [...m, { id: crypto.randomUUID(), author, text, ts: Date.now() }]);
  }

  // small subject from the message (first ~8 words)
  function subjectFrom(text: string) {
    const words = text.trim().split(/\s+/).slice(0, 8).join(" ");
    return words.length > 0 ? words.charAt(0).toUpperCase() + words.slice(1) : "New ticket";
  }

  async function handleSend() {
    if (!canSend) return;
    const text = input.trim();
    setInput("");
    addMessage("me", text);

    // If user says "yes" after we asked to create a ticket -> jump to New Ticket with draft
    if (askedCreate && /^(\s*(yes|y|sure|ok|okay|please)\b)/i.test(text) && pendingDraft) {
      navigate("/tickets/new", {
        state: { draft: { subject: subjectFrom(pendingDraft), desc: pendingDraft } },
        replace: false,
      });
      setAskedCreate(false);
      setPendingDraft(null);
      return;
    }

    // tiny “bot typing” demo
    setTyping(true);
    await new Promise((r) => setTimeout(r, 650));
    setTyping(false);

    // canned responses + set up a draft offer
    let canned: string;
    if (/status|where|update/i.test(text)) {
      canned = "Got it — I can check ticket status or open a new one. Want me to create a ticket from this chat?";
      setPendingDraft(text);
      setAskedCreate(true);
    } else if (/password|reset/i.test(text)) {
      canned = "Password issues happen! If you’re stuck in a reset loop, I can file a ticket for the helpdesk. Should I create one now?";
      setPendingDraft(text);
      setAskedCreate(true);
    } else {
      canned = "Thanks! I’ve captured that. Would you like me to create a ticket from this chat?";
      setPendingDraft(text);
      setAskedCreate(true);
    }

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
          {/* replaced the small ST chip with the real Logo */}
          <Logo size={28} className="hover:scale-105 transition-transform" />
          <div>
            <div className="font-semibold text-slate-900">SafeTrack Support</div>
            <div className="text-xs text-slate-500">Chat assistant • opens tickets &amp; helps triage</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-3xl mx-auto w-full grow px-4 py-4">
        <div className="flex flex-col gap-3">
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
            <div className="card-pad pb-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={2}
                placeholder="Type a message…  (Enter to send • Shift+Enter for new line)"
                className="w-full resize-none rounded-2xl p-3 outline-none text-slate-800 border border-slate-200"
              />
            </div>
            <div className="flex items-center justify-between px-3 pb-3">
              <p className="text-xs text-slate-500">Say “yes” to create a ticket from your last message.</p>
              <button
                onClick={handleSend}
                disabled={!canSend}
                className={`btn-primary ${!canSend ? "bg-sky-300 cursor-not-allowed" : ""}`}
              >
                Send ↵
              </button>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-slate-400">
            Tip: try “check ticket status” or describe your issue, then answer “yes”.
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
