import { useState, useEffect, useRef, useCallback } from "react";

// ─── Palette & design tokens ───────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #0b0d11;
    --surface:  #13161d;
    --card:     #1a1e28;
    --border:   #252a38;
    --accent:   #5b6af0;
    --accent2:  #e05c8a;
    --green:    #3ecf8e;
    --yellow:   #f5c842;
    --red:      #f04e5e;
    --orange:   #f0853e;
    --text:     #e4e8f5;
    --muted:    #687091;
    --font-ui:  'Syne', sans-serif;
    --font-mono:'DM Mono', monospace;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-ui); }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 8px; border-radius: 99px;
    font-family: var(--font-mono); font-size: 11px; font-weight: 500;
    letter-spacing: .04em;
  }
  .badge-critical { background: #2d0f14; color: var(--red); border: 1px solid #4a1820; }
  .badge-high     { background: #2d1e0a; color: var(--orange); border: 1px solid #4a3015; }
  .badge-medium   { background: #2d2a0a; color: var(--yellow); border: 1px solid #4a4215; }
  .badge-low      { background: #0a2d1e; color: var(--green); border: 1px solid #154a33; }
  .badge-new      { background: #141a3d; color: #9ba8f5; border: 1px solid #242e5e; }
  .badge-assigned { background: #1a1a3d; color: var(--accent); border: 1px solid #2a2d5e; }
  .badge-progress { background: #2d1e0a; color: var(--orange); border: 1px solid #4a3015; }
  .badge-resolved { background: #0a2d1e; color: var(--green); border: 1px solid #154a33; }
  .badge-closed   { background: #1a1e28; color: var(--muted); border: 1px solid var(--border); }
  .badge-auto     { background: #0a2d25; color: #3ee8c0; border: 1px solid #154a3e; }

  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer;
    font-family: var(--font-ui); font-size: 13px; font-weight: 600;
    transition: all .15s ease; white-space: nowrap;
  }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: #6b7af5; transform: translateY(-1px); }
  .btn-ghost { background: transparent; color: var(--text); border: 1px solid var(--border); }
  .btn-ghost:hover { background: var(--card); }
  .btn-danger { background: #2d0f14; color: var(--red); border: 1px solid #4a1820; }
  .btn-danger:hover { background: #3d1520; }
  .btn-sm { padding: 5px 10px; font-size: 12px; }
  .btn:disabled { opacity: .45; cursor: not-allowed; transform: none !important; }

  .input, .select, .textarea {
    width: 100%; padding: 10px 12px; border-radius: 8px;
    background: var(--surface); border: 1px solid var(--border);
    color: var(--text); font-family: var(--font-ui); font-size: 13px;
    outline: none; transition: border-color .15s;
  }
  .input:focus, .select:focus, .textarea:focus { border-color: var(--accent); }
  .textarea { resize: vertical; min-height: 90px; line-height: 1.6; }
  .select option { background: var(--surface); }

  .label { display: block; font-size: 11px; font-weight: 600; color: var(--muted); letter-spacing: .08em; text-transform: uppercase; margin-bottom: 6px; }

  .card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; padding: 20px;
  }

  .spinner {
    width: 18px; height: 18px; border: 2px solid var(--border);
    border-top-color: var(--accent); border-radius: 50%;
    animation: spin .7s linear infinite; flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .pulse { animation: pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.5 } }

  .fade-in { animation: fadeIn .3s ease; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:none } }

  .tag {
    display: inline-block; padding: 2px 8px; border-radius: 4px;
    background: var(--surface); border: 1px solid var(--border);
    font-family: var(--font-mono); font-size: 11px; color: var(--muted);
  }

  .divider { border: none; border-top: 1px solid var(--border); margin: 16px 0; }

  .stat-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; padding: 18px 20px;
  }
  .stat-num { font-family: var(--font-mono); font-size: 28px; font-weight: 500; }
  .stat-label { font-size: 12px; color: var(--muted); margin-top: 2px; }

  .timeline-item { position: relative; padding-left: 28px; padding-bottom: 16px; }
  .timeline-item::before {
    content:''; position:absolute; left:8px; top:8px; bottom:0;
    width:1px; background: var(--border);
  }
  .timeline-item:last-child::before { display: none; }
  .timeline-dot {
    position:absolute; left:4px; top:6px;
    width:9px; height:9px; border-radius:50%; background: var(--accent);
    border: 2px solid var(--bg);
  }

  .progress-bar {
    height: 6px; background: var(--surface); border-radius: 3px; overflow: hidden;
  }
  .progress-fill { height: 100%; border-radius: 3px; transition: width .5s ease; }

  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; font-size: 11px; color: var(--muted); font-weight: 600;
       letter-spacing: .08em; text-transform: uppercase; padding: 0 12px 10px; }
  td { padding: 12px; border-top: 1px solid var(--border); font-size: 13px; vertical-align: middle; }
  tr:hover td { background: rgba(255,255,255,.02); }

  .notification {
    position: fixed; bottom: 24px; right: 24px; z-index: 1000;
    background: var(--card); border: 1px solid var(--border); border-radius: 10px;
    padding: 14px 18px; max-width: 320px; box-shadow: 0 8px 32px rgba(0,0,0,.5);
    animation: slideUp .3s ease;
  }
  @keyframes slideUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:none } }

  .ai-stream {
    font-family: var(--font-mono); font-size: 12px; line-height: 1.7;
    color: var(--green); background: #040a06; padding: 14px;
    border-radius: 8px; border: 1px solid #0e2a1a; white-space: pre-wrap;
  }
`;

// ─── Seed data ──────────────────────────────────────────────────────────────
const SEED_EMPLOYEES = [
  { id:"e1", name:"Priya Nair",      email:"priya@corp.io",    dept:"Engineering", role:"Senior Backend Eng",  skills:["Database","Python","API"],       load:3, availability:"Available", avgResolution:4.2 },
  { id:"e2", name:"Arjun Mehta",     email:"arjun@corp.io",    dept:"Engineering", role:"DevOps Lead",          skills:["Server","Linux","Docker"],       load:5, availability:"Busy",      avgResolution:2.8 },
  { id:"e3", name:"Sofia Renata",    email:"sofia@corp.io",    dept:"IT",          role:"IT Support Analyst",   skills:["Networking","Access","Windows"], load:2, availability:"Available", avgResolution:1.5 },
  { id:"e4", name:"David Okoye",     email:"david@corp.io",    dept:"IT",          role:"System Administrator", skills:["Linux","Access","Security"],     load:4, availability:"Available", avgResolution:2.1 },
  { id:"e5", name:"Lin Mei",         email:"lin@corp.io",      dept:"Finance",     role:"Payroll Specialist",   skills:["Payroll","Billing","Excel"],     load:1, availability:"Available", avgResolution:3.0 },
  { id:"e6", name:"Carlos Vega",     email:"carlos@corp.io",   dept:"Finance",     role:"Finance Analyst",      skills:["Billing","Reimbursement"],       load:3, availability:"Busy",      avgResolution:3.5 },
  { id:"e7", name:"Amara Osei",      email:"amara@corp.io",    dept:"HR",          role:"HR Business Partner",  skills:["Onboarding","Policy","Leave"],   load:2, availability:"Available", avgResolution:5.0 },
  { id:"e8", name:"Tom Brandt",      email:"tom@corp.io",      dept:"Product",     role:"Product Manager",      skills:["Feature","UX","Roadmap"],        load:6, availability:"Busy",      avgResolution:8.0 },
  { id:"e9", name:"Neha Sharma",     email:"neha@corp.io",     dept:"Engineering", role:"Frontend Engineer",    skills:["Bug","React","JavaScript"],      load:2, availability:"Available", avgResolution:3.3 },
  { id:"e10",name:"James Wu",        email:"james@corp.io",    dept:"Legal",       role:"Legal Counsel",         skills:["Compliance","Contract","Legal"], load:1, availability:"Available", avgResolution:12.0 },
  { id:"e11",name:"Fatima Al-Hassan",email:"fatima@corp.io",   dept:"Marketing",   role:"Content Manager",      skills:["Content","Branding","Social"],  load:2, availability:"On Leave",  avgResolution:4.0 },
  { id:"e12",name:"Ravi Kiran",      email:"ravi@corp.io",     dept:"Engineering", role:"Database Admin",        skills:["Database","SQL","MongoDB"],      load:4, availability:"Available", avgResolution:3.8 },
];

const SEED_TICKETS = [
  {
    id:"TKT-001", title:"Cannot access internal dashboard after password change",
    description:"After resetting my password yesterday, I'm locked out of the main analytics dashboard. Getting 403 Forbidden error.",
    submittedBy:"Alice Johnson", email:"alice@corp.io", createdAt: new Date(Date.now()-3600000*5).toISOString(),
    status:"Resolved", severity:"High", category:"Access", department:"IT",
    assigneeId:"e3", autoResolved:false,
    aiAnalysis:{ summary:"User is experiencing 403 Forbidden errors after a password change, likely a session/permission sync issue. Needs IT to verify access roles and clear stale sessions.", sentiment:"Frustrated", confidence:94, estimatedHours:1.5, resolutionPath:"Assign" },
    timeline:[
      { at: new Date(Date.now()-3600000*5).toISOString(), action:"Ticket submitted" },
      { at: new Date(Date.now()-3600000*4.8).toISOString(), action:"AI Analysis complete — routed to IT" },
      { at: new Date(Date.now()-3600000*4).toISOString(), action:"Assigned to Sofia Renata" },
      { at: new Date(Date.now()-3600000*2).toISOString(), action:"Status → In Progress" },
      { at: new Date(Date.now()-3600000*1).toISOString(), action:"Resolved — session tokens cleared, access restored" },
    ],
    notes:[], feedback:null,
  },
  {
    id:"TKT-002", title:"How do I apply for annual leave?",
    description:"I'm new to the company and not sure how to request my annual leave through the system.",
    submittedBy:"Raj Patel", email:"raj@corp.io", createdAt: new Date(Date.now()-3600000*2).toISOString(),
    status:"Resolved", severity:"Low", category:"HR", department:null,
    assigneeId:null, autoResolved:true,
    aiAnalysis:{ summary:"New employee asking about the leave application process. This is a standard FAQ that can be auto-resolved with clear instructions about the HR portal.", sentiment:"Polite", confidence:97, estimatedHours:0, resolutionPath:"Auto-resolve" },
    autoResponse:"Hi Raj! Welcome aboard. To apply for annual leave: 1) Log into the HR Portal at hr.corp.io 2) Navigate to My Requests → Leave Application 3) Select leave type, dates, and add a reason 4) Submit for your manager's approval. You'll receive an email once approved. Your leave balance is visible on your HR portal dashboard. Hope that helps!",
    timeline:[
      { at: new Date(Date.now()-3600000*2).toISOString(), action:"Ticket submitted" },
      { at: new Date(Date.now()-3600000*1.9).toISOString(), action:"AI Analysis complete — auto-resolved" },
      { at: new Date(Date.now()-3600000*1.9).toISOString(), action:"Auto-response sent to raj@corp.io" },
    ],
    notes:[], feedback:"yes",
  },
  {
    id:"TKT-003", title:"Production database returning NULL on user_profiles JOIN",
    description:"Critical: Our prod DB is returning NULL on all user_profiles LEFT JOINs since the migration last night. Affecting 100% of logged-in users.",
    submittedBy:"Dev Team", email:"devteam@corp.io", createdAt: new Date(Date.now()-3600000*1).toISOString(),
    status:"In Progress", severity:"Critical", category:"DB", department:"Engineering",
    assigneeId:"e12", autoResolved:false,
    aiAnalysis:{ summary:"A critical database regression following last night's migration is causing all user_profiles JOIN queries to return NULL, breaking the entire authenticated user experience. Immediate engineering attention required.", sentiment:"Frustrated", confidence:99, estimatedHours:6, resolutionPath:"Assign" },
    timeline:[
      { at: new Date(Date.now()-3600000*1).toISOString(), action:"Ticket submitted" },
      { at: new Date(Date.now()-3600000*.95).toISOString(), action:"AI Analysis — severity bumped to Critical, routed to Engineering" },
      { at: new Date(Date.now()-3600000*.8).toISOString(), action:"Assigned to Ravi Kiran (DB Admin)" },
      { at: new Date(Date.now()-3600000*.5).toISOString(), action:"Status → In Progress" },
    ],
    notes:[{ author:"Ravi Kiran", at: new Date(Date.now()-3600000*.4).toISOString(), text:"Investigating schema diff — foreign key constraint may have been dropped during migration." }],
    feedback:null,
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
const uid  = () => "TKT-" + String(Math.floor(Math.random()*9000)+1000);
const now  = () => new Date().toISOString();
const fmtDate = iso => new Date(iso).toLocaleString("en-IN", { month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" });
const fmtHours = h => h === 0 ? "Auto" : h < 1 ? `${Math.round(h*60)}m` : `${h}h`;

const severityOrder = { Critical:4, High:3, Medium:2, Low:1 };

const DEPT_MAP = {
  DB:"Engineering", Bug:"Engineering", Server:"Engineering",
  Access:"IT", Billing:"Finance", HR:"HR", Feature:"Product",
  Marketing:"Marketing", Legal:"Legal", Other:"IT"
};

const deptColor = d => ({ Engineering:"#5b6af0", IT:"#e05c8a", Finance:"#3ecf8e", HR:"#f5c842", Product:"#f0853e", Marketing:"#a855f7", Legal:"#06b6d4", Other:"#687091" }[d] || "#687091");

// ─── Claude API call ────────────────────────────────────────────────────────
async function callClaude(messages, system) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens:1000,
      system,
      messages,
    }),
  });
  const data = await res.json();
  return data.content?.map(b => b.text || "").join("") || "";
}

const ANALYSIS_SYSTEM = `You are an AI ticket analysis engine for an internal company ticketing system.
Analyze the incoming support ticket and respond ONLY with a valid JSON object — no markdown, no prose, just JSON.

Required fields:
{
  "category": one of ["Billing","Bug","Access","HR","Server","DB","Feature","Marketing","Legal","Other"],
  "summary": "2-3 sentence summary of the issue",
  "severity": one of ["Critical","High","Medium","Low"],
  "sentiment": one of ["Frustrated","Neutral","Polite"],
  "resolutionPath": one of ["Auto-resolve","Assign"],
  "department": one of ["Engineering","IT","Finance","HR","Product","Marketing","Legal","Other"],
  "confidence": integer 0-100,
  "estimatedHours": number (0 if auto-resolvable),
  "autoResponse": "string — only if resolutionPath is Auto-resolve, else null. Write a professional, specific, helpful response to the user. End with: Was this helpful? [Yes] [No]"
}

Auto-resolve ONLY for: password reset how-tos, leave application FAQs, general HR policy questions, tool/system FAQs, simple billing clarifications, or status-check questions.
For anything requiring real action (account locked, actual bug, outage, payroll error), always Assign.
Severity rules: Critical = system down / data loss / affects many users. High = blocking one user. Medium = degraded experience. Low = informational.`;

// ─── Sub-components ──────────────────────────────────────────────────────────

function SeverityBadge({ s }) {
  const cls = { Critical:"badge-critical", High:"badge-high", Medium:"badge-medium", Low:"badge-low" }[s] || "badge-low";
  return <span className={`badge ${cls}`}>{s}</span>;
}

function StatusBadge({ s }) {
  const cls = { New:"badge-new", Assigned:"badge-assigned", "In Progress":"badge-progress", Resolved:"badge-resolved", Closed:"badge-closed", "Pending Info":"badge-high" }[s] || "badge-new";
  return <span className={`badge ${cls}`}>{s}</span>;
}

function Notification({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, []);
  return (
    <div className="notification">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
        <span style={{ fontSize:13 }}>{msg}</span>
        <button onClick={onClose} style={{ background:"none", border:"none", color:"var(--muted)", cursor:"pointer", fontSize:16, lineHeight:1 }}>×</button>
      </div>
    </div>
  );
}

function ConfidenceBar({ pct, color="#5b6af0" }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div className="progress-bar" style={{ flex:1 }}>
        <div className="progress-fill" style={{ width:`${pct}%`, background:color }} />
      </div>
      <span style={{ fontFamily:"var(--font-mono)", fontSize:12, color:"var(--muted)", minWidth:36 }}>{pct}%</span>
    </div>
  );
}

// ─── Submit Ticket View ──────────────────────────────────────────────────────
function SubmitTicket({ employees, onSubmit, notify }) {
  const [form, setForm] = useState({ title:"", description:"", submittedBy:"", email:"" });
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [streamText, setStreamText] = useState("");

  const set = k => e => setForm(f => ({...f, [k]:e.target.value}));

  const analyze = async () => {
    if (!form.title || !form.description || !form.submittedBy) return;
    setLoading(true); setAiResult(null);
    setStreamText("Analyzing ticket…");
    try {
      const raw = await callClaude(
        [{ role:"user", content:`Ticket Title: ${form.title}\n\nDescription: ${form.description}\n\nSubmitted by: ${form.submittedBy}` }],
        ANALYSIS_SYSTEM
      );
      const clean = raw.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setAiResult(parsed);
      setStreamText("");
    } catch(e) {
      setStreamText("Analysis failed — check API key. " + e.message);
    }
    setLoading(false);
  };

  const submit = () => {
    if (!aiResult) return;
    // pick best assignee
    let assigneeId = null;
    if (aiResult.resolutionPath === "Assign") {
      const deptStaff = employees.filter(e => e.dept === aiResult.department && e.availability !== "On Leave");
      const scored = deptStaff.map(e => {
        const skillMatch = e.skills.some(s => aiResult.category.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(aiResult.category.toLowerCase())) ? 20 : 0;
        const loadPenalty = e.load * 5;
        const availBonus = e.availability === "Available" ? 15 : 0;
        return { ...e, score: skillMatch + availBonus - loadPenalty };
      }).sort((a,b) => b.score - a.score);
      assigneeId = scored[0]?.id || null;
    }

    const ticket = {
      id: uid(),
      ...form,
      createdAt: now(),
      status: aiResult.resolutionPath === "Auto-resolve" ? "Resolved" : "New",
      severity: aiResult.severity,
      category: aiResult.category,
      department: aiResult.department,
      assigneeId,
      autoResolved: aiResult.resolutionPath === "Auto-resolve",
      aiAnalysis: {
        summary: aiResult.summary,
        sentiment: aiResult.sentiment,
        confidence: aiResult.confidence,
        estimatedHours: aiResult.estimatedHours,
        resolutionPath: aiResult.resolutionPath,
      },
      autoResponse: aiResult.autoResponse || null,
      timeline: [
        { at: now(), action:"Ticket submitted" },
        { at: now(), action:`AI Analysis complete — ${aiResult.resolutionPath === "Auto-resolve" ? "auto-resolved" : `routed to ${aiResult.department}`}` },
        ...(assigneeId ? [{ at: now(), action:`Assigned to ${employees.find(e=>e.id===assigneeId)?.name}` }] : []),
      ],
      notes:[],
      feedback: null,
    };

    onSubmit(ticket);
    setForm({ title:"", description:"", submittedBy:"", email:"" });
    setAiResult(null);
    notify(aiResult.resolutionPath === "Auto-resolve" ? "✅ Ticket auto-resolved by AI" : `📬 Ticket routed to ${aiResult.department}`);
  };

  return (
    <div style={{ maxWidth:720, margin:"0 auto" }} className="fade-in">
      <h2 style={{ fontFamily:"var(--font-ui)", fontWeight:800, fontSize:22, marginBottom:4 }}>Submit a Ticket</h2>
      <p style={{ color:"var(--muted)", fontSize:13, marginBottom:24 }}>AI will analyze, classify, and route your request automatically.</p>

      <div className="card" style={{ marginBottom:16 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
          <div>
            <label className="label">Your Name</label>
            <input className="input" value={form.submittedBy} onChange={set("submittedBy")} placeholder="Jane Smith" />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email} onChange={set("email")} placeholder="jane@corp.io" />
          </div>
        </div>
        <div style={{ marginBottom:14 }}>
          <label className="label">Subject</label>
          <input className="input" value={form.title} onChange={set("title")} placeholder="Brief description of the issue…" />
        </div>
        <div style={{ marginBottom:16 }}>
          <label className="label">Description</label>
          <textarea className="textarea" value={form.description} onChange={set("description")} placeholder="Describe the issue in detail — what happened, when, and any error messages…" style={{ minHeight:110 }} />
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button className="btn btn-primary" onClick={analyze} disabled={loading || !form.title || !form.description || !form.submittedBy}>
            {loading ? <><div className="spinner" />&nbsp;Analyzing…</> : "⚡ Analyze with AI"}
          </button>
          {aiResult && <button className="btn btn-ghost" onClick={() => setAiResult(null)}>Clear</button>}
        </div>
      </div>

      {streamText && !aiResult && (
        <div className="ai-stream" style={{ marginBottom:16 }}>
          <span className="pulse">{streamText}</span>
        </div>
      )}

      {aiResult && (
        <div className="card fade-in" style={{ marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <span style={{ fontWeight:700, fontSize:14 }}>AI Analysis Result</span>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <SeverityBadge s={aiResult.severity} />
              <span className={`badge ${aiResult.resolutionPath==="Auto-resolve"?"badge-auto":"badge-assigned"}`}>{aiResult.resolutionPath}</span>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:14 }}>
            {[
              ["Category", aiResult.category],
              ["Department", aiResult.department],
              ["Sentiment", aiResult.sentiment],
              ["Est. Resolution", fmtHours(aiResult.estimatedHours)],
              ["Confidence", null],
            ].map(([k,v]) => (
              <div key={k} style={{ background:"var(--surface)", borderRadius:8, padding:"10px 12px" }}>
                <div style={{ fontSize:11, color:"var(--muted)", fontWeight:600, letterSpacing:".06em", textTransform:"uppercase", marginBottom:4 }}>{k}</div>
                {v ? <div style={{ fontFamily:"var(--font-mono)", fontSize:13 }}>{v}</div>
                   : <ConfidenceBar pct={aiResult.confidence} />}
              </div>
            ))}
          </div>

          <div style={{ background:"var(--surface)", borderRadius:8, padding:"10px 12px", marginBottom:14 }}>
            <div className="label" style={{ marginBottom:4 }}>AI Summary</div>
            <p style={{ fontSize:13, lineHeight:1.6, color:"var(--text)" }}>{aiResult.summary}</p>
          </div>

          {aiResult.autoResponse && (
            <div style={{ background:"#040a06", border:"1px solid #0e2a1a", borderRadius:8, padding:"12px 14px", marginBottom:14 }}>
              <div style={{ fontSize:11, color:"var(--green)", fontWeight:600, letterSpacing:".06em", textTransform:"uppercase", marginBottom:8 }}>Auto-Response Preview</div>
              <p style={{ fontSize:13, lineHeight:1.7, color:"#a0e8c0", fontFamily:"var(--font-mono)" }}>{aiResult.autoResponse}</p>
            </div>
          )}

          <button className="btn btn-primary" onClick={submit} style={{ width:"100%" }}>
            {aiResult.resolutionPath === "Auto-resolve" ? "✅ Submit & Auto-Resolve" : `📬 Submit & Route to ${aiResult.department}`}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Ticket List View ────────────────────────────────────────────────────────
function TicketList({ tickets, employees, onSelect }) {
  const [filter, setFilter] = useState({ status:"All", severity:"All", dept:"All", search:"" });

  const filtered = tickets
    .filter(t => filter.status==="All" || t.status===filter.status)
    .filter(t => filter.severity==="All" || t.severity===filter.severity)
    .filter(t => filter.dept==="All" || t.department===filter.dept)
    .filter(t => !filter.search || t.title.toLowerCase().includes(filter.search.toLowerCase()) || t.id.toLowerCase().includes(filter.search.toLowerCase()) || t.submittedBy?.toLowerCase().includes(filter.search.toLowerCase()))
    .sort((a,b) => (severityOrder[b.severity]||0)-(severityOrder[a.severity]||0) || new Date(b.createdAt)-new Date(a.createdAt));

  const depts = [...new Set(tickets.map(t=>t.department).filter(Boolean))];

  return (
    <div className="fade-in">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <h2 style={{ fontWeight:800, fontSize:22 }}>All Tickets <span style={{ color:"var(--muted)", fontSize:16, fontWeight:400 }}>({filtered.length})</span></h2>
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        <input className="input" style={{ maxWidth:220 }} placeholder="Search…" value={filter.search} onChange={e=>setFilter(f=>({...f,search:e.target.value}))} />
        {[
          ["status",["All","New","Assigned","In Progress","Pending Info","Resolved","Closed"]],
          ["severity",["All","Critical","High","Medium","Low"]],
          ["dept",["All",...depts]],
        ].map(([k,opts])=>(
          <select key={k} className="select" style={{ maxWidth:160 }} value={filter[k]} onChange={e=>setFilter(f=>({...f,[k]:e.target.value}))}>
            {opts.map(o=><option key={o}>{o}</option>)}
          </select>
        ))}
      </div>

      <div className="card" style={{ padding:0, overflow:"hidden" }}>
        <table>
          <thead><tr>
            <th>ID</th><th>Title</th><th>Category</th><th>Severity</th><th>Status</th><th>Assignee</th><th>Created</th>
          </tr></thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign:"center", color:"var(--muted)", padding:32 }}>No tickets match the current filters.</td></tr>
            )}
            {filtered.map(t => {
              const assignee = employees.find(e=>e.id===t.assigneeId);
              return (
                <tr key={t.id} style={{ cursor:"pointer" }} onClick={()=>onSelect(t.id)}>
                  <td><span style={{ fontFamily:"var(--font-mono)", fontSize:12, color:"var(--accent)" }}>{t.id}</span></td>
                  <td>
                    <div style={{ fontWeight:600, fontSize:13, marginBottom:2 }}>{t.title}</div>
                    <div style={{ fontSize:11, color:"var(--muted)" }}>{t.submittedBy}</div>
                  </td>
                  <td><span className="tag">{t.category}</span></td>
                  <td><SeverityBadge s={t.severity} /></td>
                  <td><StatusBadge s={t.status} /></td>
                  <td style={{ fontSize:12, color: assignee?"var(--text)":"var(--muted)" }}>
                    {t.autoResolved ? <span className="badge badge-auto" style={{ fontSize:10 }}>AI Auto</span> : assignee?.name || "—"}
                  </td>
                  <td style={{ fontSize:12, color:"var(--muted)" }}>{fmtDate(t.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Ticket Detail View ──────────────────────────────────────────────────────
function TicketDetail({ ticket, employees, onUpdate, onBack, notify }) {
  const [note, setNote] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const assignee = employees.find(e=>e.id===ticket.assigneeId);

  const changeStatus = (s) => {
    const updated = { ...ticket, status:s, timeline:[...ticket.timeline, { at:now(), action:`Status → ${s}` }] };
    onUpdate(updated); notify(`Status updated to ${s}`);
  };

  const addNote = () => {
    if (!note.trim()) return;
    const n = { author:"Agent", at:now(), text:note };
    onUpdate({ ...ticket, notes:[...ticket.notes, n], timeline:[...ticket.timeline, { at:now(), action:`Note added by Agent` }] });
    setNote(""); notify("Note added");
  };

  const giveFeedback = (val) => {
    onUpdate({ ...ticket, feedback:val });
    notify(val==="yes" ? "Thanks for the positive feedback!" : "Feedback recorded — we'll improve.");
  };

  const aiAssist = async () => {
    setAiLoading(true);
    try {
      const ctx = `Ticket: ${ticket.title}\nDescription (implied): ${ticket.aiAnalysis?.summary}\nCategory: ${ticket.category}\nNotes: ${ticket.notes.map(n=>n.text).join("; ")||"none"}`;
      const res = await callClaude(
        [{ role:"user", content:`As a support agent for the ${ticket.department} team, draft a professional internal progress note or resolution message for this ticket:\n\n${ctx}` }],
        "You are a helpful internal IT/support agent. Write a concise, professional note (2-4 sentences). No markdown headers."
      );
      setAiReply(res);
    } catch(e) { setAiReply("Failed: " + e.message); }
    setAiLoading(false);
  };

  const STATUSES = ["New","Assigned","In Progress","Pending Info","Resolved","Closed"];

  return (
    <div className="fade-in">
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom:16 }}>← Back</button>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20, alignItems:"start" }}>
        {/* LEFT */}
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6, flexWrap:"wrap" }}>
            <span style={{ fontFamily:"var(--font-mono)", color:"var(--accent)", fontSize:13 }}>{ticket.id}</span>
            <SeverityBadge s={ticket.severity} />
            <StatusBadge s={ticket.status} />
            {ticket.autoResolved && <span className="badge badge-auto">AI Auto-Resolved</span>}
          </div>
          <h2 style={{ fontWeight:800, fontSize:20, marginBottom:4 }}>{ticket.title}</h2>
          <p style={{ color:"var(--muted)", fontSize:13 }}>Submitted by {ticket.submittedBy} · {fmtDate(ticket.createdAt)}</p>

          <hr className="divider" />

          {/* AI Analysis */}
          <div className="card" style={{ marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:13, marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ background:"var(--accent)", borderRadius:6, padding:"2px 8px", fontSize:11 }}>AI</span> Analysis
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:12 }}>
              {[["Category",ticket.category],["Sentiment",ticket.aiAnalysis?.sentiment],["Est. Time",fmtHours(ticket.aiAnalysis?.estimatedHours||0)]].map(([k,v])=>(
                <div key={k} style={{ background:"var(--surface)", borderRadius:8, padding:"8px 10px" }}>
                  <div style={{ fontSize:10, color:"var(--muted)", textTransform:"uppercase", letterSpacing:".06em", marginBottom:2 }}>{k}</div>
                  <div style={{ fontFamily:"var(--font-mono)", fontSize:13 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom:10 }}>
              <div className="label" style={{ marginBottom:4 }}>Summary</div>
              <p style={{ fontSize:13, lineHeight:1.6 }}>{ticket.aiAnalysis?.summary}</p>
            </div>
            <div>
              <div className="label" style={{ marginBottom:4 }}>Confidence</div>
              <ConfidenceBar pct={ticket.aiAnalysis?.confidence||0} />
            </div>
          </div>

          {/* Auto-response */}
          {ticket.autoResponse && (
            <div style={{ background:"#040a06", border:"1px solid #0e2a1a", borderRadius:10, padding:"14px 16px", marginBottom:16 }}>
              <div style={{ fontSize:11, color:"var(--green)", fontWeight:600, textTransform:"uppercase", letterSpacing:".06em", marginBottom:8 }}>AI Auto-Response</div>
              <p style={{ fontSize:13, lineHeight:1.7, fontFamily:"var(--font-mono)", color:"#a0e8c0" }}>{ticket.autoResponse}</p>
              {ticket.feedback === null && (
                <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:12, color:"var(--muted)" }}>Was this helpful?</span>
                  <button className="btn btn-ghost btn-sm" onClick={()=>giveFeedback("yes")}>👍 Yes</button>
                  <button className="btn btn-ghost btn-sm" onClick={()=>giveFeedback("no")}>👎 No</button>
                </div>
              )}
              {ticket.feedback && <p style={{ marginTop:8, fontSize:12, color:"var(--muted)" }}>Feedback recorded: {ticket.feedback === "yes" ? "👍 Helpful" : "👎 Not helpful"}</p>}
            </div>
          )}

          {/* Notes */}
          <div className="card" style={{ marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:13, marginBottom:12 }}>Internal Notes</div>
            {ticket.notes.length === 0 && <p style={{ fontSize:13, color:"var(--muted)", marginBottom:12 }}>No notes yet.</p>}
            {ticket.notes.map((n,i) => (
              <div key={i} style={{ background:"var(--surface)", borderRadius:8, padding:"10px 12px", marginBottom:8 }}>
                <div style={{ fontSize:11, color:"var(--muted)", marginBottom:4 }}>{n.author} · {fmtDate(n.at)}</div>
                <p style={{ fontSize:13, lineHeight:1.6 }}>{n.text}</p>
              </div>
            ))}
            <div style={{ marginTop:8 }}>
              {aiReply && (
                <div style={{ background:"var(--surface)", borderRadius:8, padding:"10px 12px", marginBottom:8, border:"1px dashed var(--accent)" }}>
                  <div style={{ fontSize:11, color:"var(--accent)", marginBottom:4 }}>AI Draft</div>
                  <p style={{ fontSize:13, lineHeight:1.6 }}>{aiReply}</p>
                  <button className="btn btn-ghost btn-sm" style={{ marginTop:8 }} onClick={()=>{ setNote(aiReply); setAiReply(""); }}>Use this draft</button>
                </div>
              )}
              <textarea className="textarea" value={note} onChange={e=>setNote(e.target.value)} placeholder="Add an internal note…" style={{ marginBottom:8 }} />
              <div style={{ display:"flex", gap:8 }}>
                <button className="btn btn-primary btn-sm" onClick={addNote}>Add Note</button>
                <button className="btn btn-ghost btn-sm" onClick={aiAssist} disabled={aiLoading}>
                  {aiLoading ? <><div className="spinner" style={{ width:12, height:12 }} /> Drafting…</> : "✨ AI Draft"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT sidebar */}
        <div>
          {/* Status control */}
          <div className="card" style={{ marginBottom:14 }}>
            <div className="label" style={{ marginBottom:8 }}>Update Status</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {STATUSES.map(s => (
                <button key={s} className={`btn btn-ghost btn-sm ${ticket.status===s?"":"" }`}
                  style={{ justifyContent:"flex-start", background: ticket.status===s?"var(--accent)":"", color: ticket.status===s?"#fff":"" }}
                  onClick={()=>changeStatus(s)}>{s}</button>
              ))}
            </div>
          </div>

          {/* Assignee */}
          <div className="card" style={{ marginBottom:14 }}>
            <div className="label" style={{ marginBottom:8 }}>Assignee</div>
            {assignee ? (
              <div>
                <div style={{ fontWeight:600, fontSize:14 }}>{assignee.name}</div>
                <div style={{ fontSize:12, color:"var(--muted)" }}>{assignee.role}</div>
                <div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>{assignee.email}</div>
                <div style={{ marginTop:6, display:"flex", gap:4, flexWrap:"wrap" }}>
                  {assignee.skills.map(s=><span key={s} className="tag" style={{ fontSize:10 }}>{s}</span>)}
                </div>
              </div>
            ) : <p style={{ fontSize:13, color:"var(--muted)" }}>No assignee</p>}
          </div>

          {/* Details */}
          <div className="card" style={{ marginBottom:14 }}>
            <div className="label" style={{ marginBottom:8 }}>Details</div>
            {[["Department",ticket.department||"—"],["Category",ticket.category],["Severity",ticket.severity],["Resolution",ticket.aiAnalysis?.resolutionPath]].map(([k,v])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:8 }}>
                <span style={{ color:"var(--muted)" }}>{k}</span>
                <span style={{ fontFamily:"var(--font-mono)", fontSize:12 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="card">
            <div className="label" style={{ marginBottom:12 }}>Timeline</div>
            {ticket.timeline.map((e,i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot" />
                <div style={{ fontSize:12, lineHeight:1.5 }}>{e.action}</div>
                <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{fmtDate(e.at)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Employee Directory ──────────────────────────────────────────────────────
function EmployeeDirectory({ employees, tickets, setEmployees, notify }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", dept:"Engineering", role:"", skills:"", availability:"Available" });
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  const openTickets = id => tickets.filter(t=>t.assigneeId===id && !["Resolved","Closed"].includes(t.status)).length;

  const save = () => {
    const emp = { id:"e"+Date.now(), ...form, skills:form.skills.split(",").map(s=>s.trim()).filter(Boolean), load:openTickets(""), avgResolution:0 };
    setEmployees(prev=>[...prev,emp]); setShowAdd(false); notify("Employee added");
    setForm({ name:"", email:"", dept:"Engineering", role:"", skills:"", availability:"Available" });
  };

  const toggle = (id, field, values) => {
    setEmployees(prev=>prev.map(e=>e.id===id ? {...e,[field]:values[( values.indexOf(e[field])+1)%values.length]} : e));
  };

  const depts = [...new Set(employees.map(e=>e.dept))];

  return (
    <div className="fade-in">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h2 style={{ fontWeight:800, fontSize:22 }}>Employee Directory <span style={{ color:"var(--muted)", fontSize:16, fontWeight:400 }}>({employees.length})</span></h2>
        <button className="btn btn-primary" onClick={()=>setShowAdd(v=>!v)}>+ Add Employee</button>
      </div>

      {showAdd && (
        <div className="card fade-in" style={{ marginBottom:20 }}>
          <h3 style={{ fontWeight:700, marginBottom:14, fontSize:15 }}>New Employee</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
            <div><label className="label">Name</label><input className="input" value={form.name} onChange={set("name")} /></div>
            <div><label className="label">Email</label><input className="input" value={form.email} onChange={set("email")} /></div>
            <div><label className="label">Department</label>
              <select className="select" value={form.dept} onChange={set("dept")}>
                {["Engineering","IT","Finance","HR","Product","Marketing","Legal","Other"].map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
            <div><label className="label">Role</label><input className="input" value={form.role} onChange={set("role")} /></div>
            <div><label className="label">Skills (comma-sep)</label><input className="input" value={form.skills} onChange={set("skills")} placeholder="Database, Python, API" /></div>
            <div><label className="label">Availability</label>
              <select className="select" value={form.availability} onChange={set("availability")}>
                {["Available","Busy","On Leave"].map(a=><option key={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button className="btn btn-primary" onClick={save}>Save</button>
            <button className="btn btn-ghost" onClick={()=>setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      {depts.map(dept => (
        <div key={dept} style={{ marginBottom:24 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <div style={{ width:10, height:10, borderRadius:3, background:deptColor(dept) }} />
            <span style={{ fontWeight:700, fontSize:15 }}>{dept}</span>
            <span style={{ color:"var(--muted)", fontSize:13 }}>{employees.filter(e=>e.dept===dept).length} members</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px,1fr))", gap:12 }}>
            {employees.filter(e=>e.dept===dept).map(emp => {
              const load = openTickets(emp.id);
              const avColor = { Available:"var(--green)", Busy:"var(--orange)", "On Leave":"var(--muted)" }[emp.availability];
              return (
                <div key={emp.id} className="card" style={{ borderLeft:`3px solid ${deptColor(emp.dept)}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14 }}>{emp.name}</div>
                      <div style={{ fontSize:12, color:"var(--muted)" }}>{emp.role}</div>
                      <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{emp.email}</div>
                    </div>
                    <button
                      onClick={()=>toggle(emp.id,"availability",["Available","Busy","On Leave"])}
                      style={{ background:"none", border:"none", cursor:"pointer", fontSize:11, color:avColor, fontWeight:600 }}>
                      ● {emp.availability}
                    </button>
                  </div>
                  <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:10 }}>
                    {emp.skills.map(s=><span key={s} className="tag" style={{ fontSize:10 }}>{s}</span>)}
                  </div>
                  <div style={{ display:"flex", gap:12 }}>
                    <div>
                      <div style={{ fontSize:10, color:"var(--muted)", textTransform:"uppercase", letterSpacing:".06em" }}>Open Tickets</div>
                      <div style={{ fontFamily:"var(--font-mono)", fontSize:16, fontWeight:500 }}>{load}</div>
                    </div>
                    <div>
                      <div style={{ fontSize:10, color:"var(--muted)", textTransform:"uppercase", letterSpacing:".06em" }}>Avg. Resolution</div>
                      <div style={{ fontFamily:"var(--font-mono)", fontSize:16, fontWeight:500 }}>{emp.avgResolution ? `${emp.avgResolution}h` : "—"}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Analytics Dashboard ─────────────────────────────────────────────────────
function Analytics({ tickets, employees }) {
  const total = tickets.length;
  const open = tickets.filter(t=>!["Resolved","Closed"].includes(t.status)).length;
  const resolved = tickets.filter(t=>t.status==="Resolved").length;
  const autoRes = tickets.filter(t=>t.autoResolved).length;
  const escalated = tickets.filter(t=>t.severity==="Critical").length;
  const helpful = tickets.filter(t=>t.feedback==="yes").length;
  const feedbackTotal = tickets.filter(t=>t.feedback!==null).length;
  const successRate = feedbackTotal > 0 ? Math.round((helpful/feedbackTotal)*100) : 0;
  const autoResPct = autoRes > 0 ? Math.round((autoRes/total)*100) : 0;

  const deptLoad = employees.reduce((acc,e) => {
    acc[e.dept] = (acc[e.dept]||0) + tickets.filter(t=>t.assigneeId===e.id && !["Resolved","Closed"].includes(t.status)).length;
    return acc;
  }, {});
  const maxLoad = Math.max(...Object.values(deptLoad), 1);

  const catCount = tickets.reduce((acc,t) => { acc[t.category]=(acc[t.category]||0)+1; return acc; }, {});
  const topCats = Object.entries(catCount).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const maxCat = Math.max(...topCats.map(([,v])=>v),1);

  const sevDist = ["Critical","High","Medium","Low"].map(s=>({ s, n:tickets.filter(t=>t.severity===s).length }));
  const sevColors = { Critical:"var(--red)", High:"var(--orange)", Medium:"var(--yellow)", Low:"var(--green)" };

  return (
    <div className="fade-in">
      <h2 style={{ fontWeight:800, fontSize:22, marginBottom:20 }}>Analytics Dashboard</h2>

      {/* KPI row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:12, marginBottom:24 }}>
        {[
          { label:"Total Tickets", n:total, color:"var(--accent)" },
          { label:"Open",          n:open,  color:"var(--orange)" },
          { label:"Resolved",      n:resolved, color:"var(--green)" },
          { label:"Auto-Resolved", n:autoRes, color:"#3ee8c0" },
          { label:"Critical",      n:escalated, color:"var(--red)" },
          { label:"Auto-Res Rate", n:`${autoResPct}%`, color:"var(--yellow)" },
          { label:"AI Success Rate",n:`${successRate}%`, color:"var(--green)" },
        ].map(({ label,n,color }) => (
          <div key={label} className="stat-card">
            <div className="stat-num" style={{ color }}>{n}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        {/* Dept load */}
        <div className="card">
          <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Department Ticket Load</div>
          {Object.entries(deptLoad).sort((a,b)=>b[1]-a[1]).map(([dept,n]) => (
            <div key={dept} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                <span style={{ color:deptColor(dept), fontWeight:600 }}>{dept}</span>
                <span style={{ fontFamily:"var(--font-mono)" }}>{n}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width:`${(n/maxLoad)*100}%`, background:deptColor(dept) }} />
              </div>
            </div>
          ))}
        </div>

        {/* Top categories */}
        <div className="card">
          <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Top 5 Ticket Categories</div>
          {topCats.map(([cat,n]) => (
            <div key={cat} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                <span className="tag" style={{ fontSize:11 }}>{cat}</span>
                <span style={{ fontFamily:"var(--font-mono)" }}>{n}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width:`${(n/maxCat)*100}%`, background:"var(--accent)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {/* Severity dist */}
        <div className="card">
          <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Severity Distribution</div>
          {sevDist.map(({ s,n }) => (
            <div key={s} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <SeverityBadge s={s} />
              <div className="progress-bar" style={{ flex:1 }}>
                <div className="progress-fill" style={{ width:`${total>0?(n/total)*100:0}%`, background:sevColors[s] }} />
              </div>
              <span style={{ fontFamily:"var(--font-mono)", fontSize:12, minWidth:20, textAlign:"right" }}>{n}</span>
            </div>
          ))}
        </div>

        {/* Employee workload */}
        <div className="card">
          <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Top Employees by Load</div>
          {employees
            .map(e => ({ ...e, openLoad: tickets.filter(t=>t.assigneeId===e.id&&!["Resolved","Closed"].includes(t.status)).length }))
            .sort((a,b)=>b.openLoad-a.openLoad).slice(0,6)
            .map(e => (
              <div key={e.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:600 }}>{e.name}</div>
                  <div style={{ fontSize:11, color:"var(--muted)" }}>{e.dept}</div>
                </div>
                <div className="progress-bar" style={{ width:90 }}>
                  <div className="progress-fill" style={{ width:`${Math.min(e.openLoad/8*100,100)}%`, background:deptColor(e.dept) }} />
                </div>
                <span style={{ fontFamily:"var(--font-mono)", fontSize:12, minWidth:14, textAlign:"right" }}>{e.openLoad}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [tickets, setTickets] = useState(SEED_TICKETS);
  const [employees, setEmployees] = useState(SEED_EMPLOYEES);
  const [view, setView] = useState("submit"); // submit | list | detail | employees | analytics
  const [selectedId, setSelectedId] = useState(null);
  const [notif, setNotif] = useState(null);

  const notify = msg => { setNotif(msg); };

  const addTicket = t => { setTickets(prev=>[t,...prev]); setView("list"); };
  const updateTicket = t => setTickets(prev=>prev.map(x=>x.id===t.id?t:x));

  const selectTicket = id => { setSelectedId(id); setView("detail"); };

  const NAV = [
    { id:"submit",    label:"+ New Ticket" },
    { id:"list",      label:"All Tickets" },
    { id:"employees", label:"Employees" },
    { id:"analytics", label:"Analytics" },
  ];

  const openCount = tickets.filter(t=>!["Resolved","Closed"].includes(t.status)).length;

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
        {/* Top bar */}
        <header style={{ background:"var(--surface)", borderBottom:"1px solid var(--border)", padding:"0 24px", position:"sticky", top:0, zIndex:100 }}>
          <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", height:52 }}>
            <div style={{ fontFamily:"var(--font-ui)", fontWeight:800, fontSize:18, letterSpacing:"-.02em", marginRight:32 }}>
              <span style={{ color:"var(--accent)" }}>⚡</span> TicketAI
            </div>
            <nav style={{ display:"flex", gap:2, flex:1 }}>
              {NAV.map(n => (
                <button key={n.id} onClick={()=>{ setView(n.id); if(n.id!=="detail") setSelectedId(null); }}
                  className="btn btn-ghost btn-sm"
                  style={{ background: view===n.id||( view==="detail"&&n.id==="list") ?"var(--card)":"", color: view===n.id?"var(--accent)":"var(--muted)", border:"none" }}>
                  {n.label}
                  {n.id==="list" && openCount>0 && (
                    <span style={{ background:"var(--accent)", color:"#fff", borderRadius:99, padding:"0 6px", fontSize:10, marginLeft:4 }}>{openCount}</span>
                  )}
                </button>
              ))}
            </nav>
            <div style={{ fontSize:12, color:"var(--muted)", fontFamily:"var(--font-mono)" }}>
              {tickets.length} tickets · {employees.length} agents
            </div>
          </div>
        </header>

        {/* Body */}
        <main style={{ flex:1, padding:"28px 24px" }}>
          <div style={{ maxWidth:1200, margin:"0 auto" }}>
            {view==="submit"    && <SubmitTicket employees={employees} onSubmit={addTicket} notify={notify} />}
            {view==="list"      && <TicketList tickets={tickets} employees={employees} onSelect={selectTicket} />}
            {view==="detail"    && selectedId && (
              <TicketDetail
                ticket={tickets.find(t=>t.id===selectedId)}
                employees={employees}
                onUpdate={updateTicket}
                onBack={()=>setView("list")}
                notify={notify}
              />
            )}
            {view==="employees" && <EmployeeDirectory employees={employees} tickets={tickets} setEmployees={setEmployees} notify={notify} />}
            {view==="analytics" && <Analytics tickets={tickets} employees={employees} />}
          </div>
        </main>
      </div>

      {notif && <Notification msg={notif} onClose={()=>setNotif(null)} />}
    </>
  );
}
