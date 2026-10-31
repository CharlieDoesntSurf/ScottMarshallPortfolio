import { useEffect, useRef, useState } from "react";
import { ArrowUp, RotateCcw } from "lucide-react";
import { type Intake } from "./data";
import { validateIntake } from "./coach";
import { TeddyBear, TeddyBrand } from "./TeddyBrand";
type Message = { role: "user" | "assistant"; content: string };
const sessions = new Map<string, { messages: Message[]; profile: Intake | null; draft: string }>();
const opening = "Hey, I’m Teddy. What should I call you, and what would you like to work toward?";
export function InterviewChat({ initialIntake, onSave }: { initialIntake: Intake | null; onSave: (profile: Intake) => void }) {
  const sessionKey = JSON.stringify(initialIntake);
  const cached = sessions.get(sessionKey);
  const [messages, setMessages] = useState<Message[]>(cached?.messages || [{ role: "assistant", content: initialIntake ? `Welcome back, ${initialIntake.name}. What would you like to change about your training?` : opening }]);
  const [profile, setProfile] = useState<Intake | null>(cached?.profile || null);
  const [draft, setDraft] = useState(cached?.draft || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(cached?.messages.at(-1)?.role === "user" ? "Your last message needs a reply." : "");
  const [failed, setFailed] = useState<Message[] | null>(cached?.messages.at(-1)?.role === "user" ? cached.messages : null);
  const scroll = useRef<HTMLDivElement>(null);
  const controller = useRef<AbortController | null>(null);
  const inFlight = useRef(false);
  useEffect(() => { sessions.set(sessionKey, { messages, profile, draft }); }, [sessionKey, messages, profile, draft]);
  useEffect(() => () => { controller.current?.abort(); controller.current = null; }, []);
  useEffect(() => { if (scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight; }, [messages, busy]);
  async function send(history: Message[]) {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true); setError(""); setFailed(null); setProfile(null);
    const abort = new AbortController(); controller.current = abort;
    const timer = window.setTimeout(() => abort.abort(), 65000);
    try {
      const endpoint = (import.meta.env.VITE_COACH_API_URL as string | undefined) || "/api/coach/interview";
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ messages: history, initialIntake }), signal: abort.signal });
      if (!response.headers.get("content-type")?.includes("application/json")) throw new Error("Teddy isn’t connected yet. Please try again later.");
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Teddy couldn’t reply. Please try again.");
      if (typeof result.reply !== "string" || !result.reply.trim()) throw new Error("Teddy couldn’t reply. Please try again.");
      if (result.ready && (!result.profile || validateIntake(result.profile).length)) throw new Error("Your profile needs another look. Please try again.");
      setMessages([...history, { role: "assistant", content: result.reply }]);
      if (result.ready) setProfile(result.profile);
    } catch (err) {
      if (controller.current !== abort) return;
      setError(abort.signal.aborted ? "That took too long. Please try again." : (err as Error).message);
      setFailed(history);
    } finally {
      window.clearTimeout(timer); inFlight.current = false; setBusy(false);
    }
  }
  function submit(text: string) {
    if (!text.trim() || busy) return;
    const history = [...messages, { role: "user" as const, content: text.trim() }];
    setMessages(history); setDraft(""); void send(history);
  }
  return <>
    <div className="page-heading"><div><p className="eyebrow">YOUR INTERVIEW</p><h1>Let’s talk about you.</h1></div></div>
    <div className="chat-layout">
      <section className="card interview-chat" aria-label="Interview with Teddy">
        <div className="chat-heading"><TeddyBrand /><button className="text-button" disabled={busy} onClick={() => { setMessages([{ role: "assistant", content: initialIntake ? `Welcome back, ${initialIntake.name}. What would you like to change?` : opening }]); setProfile(null); setDraft(""); setError(""); setFailed(null); }}>Start over</button></div>
        <div ref={scroll} className="interview-messages" role="log" aria-live="polite" aria-label="Conversation">
          {messages.map((message, i) => <div key={i} className={`interview-message ${message.role}`}><small>{message.role === "user" ? "YOU" : "TEDDY"}</small><p>{message.content}</p></div>)}
          {busy && <div className="interview-message"><small>TEDDY</small><p role="status">Thinking…</p></div>}
        </div>
        {messages.length === 1 && !initialIntake && <div className="chat-suggestions">{["I want to build strength", "I want to feel fitter", "I’m starting fresh"].map(text => <button key={text} disabled={busy} onClick={() => submit(text)}>{text}</button>)}</div>}
        {error && <div className="chat-error" role="alert"><span>{error}</span>{failed && <button className="secondary" disabled={busy} onClick={() => void send(failed)}><RotateCcw size={14}/> Retry</button>}{failed && <button className="text-button" onClick={() => { setDraft(failed.at(-1)!.content); setMessages(failed.slice(0,-1)); setFailed(null); setError(""); }}>Edit</button>}</div>}
        <form className="chat-composer" onSubmit={e => { e.preventDefault(); submit(draft); }}>
          <textarea aria-label="Message Teddy" placeholder="Tell Teddy…" maxLength={2000} rows={2} value={draft} disabled={busy || !!failed} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit(draft); } }}/>
          <button className="primary" type="submit" aria-label="Send message" disabled={busy || !!failed || !draft.trim()}><ArrowUp size={20}/></button>
        </form>
        <p className="chat-privacy">Messages are sent to OpenAI. Share only what you’re comfortable sharing.</p>
      </section>
      <aside className="card chat-profile"><TeddyBear/><h2>{profile ? "Sound like you?" : "A plan that fits."}</h2>
        {profile ? <><dl>{[["Name",profile.name],["Goal",profile.goal],["Experience",profile.experience],["Schedule",`${profile.days.join(" · ")} / ${profile.minutes} min`],["Equipment",profile.equipment.join(", ")],["Limitations",profile.limitations || "None shared"],["Your why",profile.motivation || "Not shared"]].map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><button className="primary" onClick={() => { try { onSave(profile); } catch (err) { setError((err as Error).message); } }}>Save my profile</button><p className="chat-privacy">Want to change something? Tell Teddy.</p></> : <p>Tell me your goals. We’ll take it one question at a time.</p>}
      </aside>
    </div>
  </>;
}
