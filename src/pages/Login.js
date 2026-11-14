import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import "./Login.css";

/* ─── constants ─── */
const REDUCED = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
const HEX     = "0123456789ABCDEF";

/* ─── helpers ─── */
const okId = v => /^\S+@\S+\.\S+$/.test(v) || /^\+?\d[\d\s-]{8,13}$/.test(v);

function uidOf(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
  return [24,16,8,0].map(sh => ((h >>> sh) & 0xff).toString(16).padStart(2,"0").toUpperCase()).join(" ");
}
const rndUid = () => Array.from({length:4}, () => HEX[Math.random()*16|0]+HEX[Math.random()*16|0]).join(" ");

function buildBarcode() {
  let s=11, x=0, o="";
  const r = () => {
    s|=0; s=(s+0x6D2B79F5)|0;
    let t=Math.imul(s^(s>>>15),1|s); t=(t+Math.imul(t^(t>>>7),61|t))^t;
    return ((t^(t>>>14))>>>0)/4294967296;
  };
  while (x<94) {
    const bw=1+Math.floor(r()*3), g=1+Math.floor(r()*2);
    o+=`<rect x="${x}" y="0" width="${bw}" height="20" fill="#b7d1ff"/>`;
    x+=bw+g;
  }
  return o;
}

function buildCoil() {
  return Array.from({length:7},(_,i)=>
    `<rect x="${14+i*11}" y="${12+i*8}" width="${172-i*22}" height="${102-i*16}" rx="${16-i}"/>`
  ).join("");
}

function pwScore(v) {
  const n = (v.length>=8) + (/[a-z]/.test(v)&&/[A-Z]/.test(v)) + /\d/.test(v) + /[^A-Za-z0-9]/.test(v);
  return v ? Math.max(1,n) : 0;
}
function pwTests(v) {
  return [v.length>=8, /[a-z]/.test(v)&&/[A-Z]/.test(v), /\d/.test(v), /[^A-Za-z0-9]/.test(v)];
}
const SCORE_LABELS = [" ","Weak","Fair","Good","Strong"];

/* ═══════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════ */
export default function Login() {
  const navigate = useNavigate();
  const { user, login, register } = useAuth();

  /* ── redirect if already signed in ── */
  useEffect(() => { if (user) navigate("/home", {replace:true}); }, [user, navigate]);

  /* ── refs ── */
  const swingRef  = useRef(null);
  const tiltRef   = useRef(null);
  const panelsRef = useRef(null);
  const bkRef     = useRef(null);
  const uidTimer  = useRef(null);

  /* ── mode / step ── */
  const [mode,     setMode]     = useState("in");   // "in" | "join"
  const [step,     setStep]     = useState(0);      // join: 0=details 1=security
  const [panelIdx, setPanelIdx] = useState(0);      // 0=sign-in 1=join-step1 2=join-step2

  /* ── sign-in fields ── */
  const [siId,     setSiId]     = useState("");
  const [siPass,   setSiPass]   = useState("");
  const [siRem,    setSiRem]    = useState(true);
  const [siShowPw, setSiShowPw] = useState(false);

  /* ── register fields ── */
  const [jName,    setJName]    = useState("");
  const [jEmail,   setJEmail]   = useState("");
  const [jPass,    setJPass]    = useState("");
  const [jConf,    setJConf]    = useState("");
  const [jTerms,   setJTerms]   = useState(false);
  const [jShowPw,  setJShowPw]  = useState(false);
  const [jShowCf,  setJShowCf]  = useState(false);
  const [pwSc,     setPwSc]     = useState(0);
  const [pwReqs,   setPwReqs]   = useState([false,false,false,false]);

  /* ── errors ── */
  const E0 = {siId:false,siPass:false,jName:false,jEmail:false,jPass:false,jConf:false,jTerms:false};
  const [err, setErr] = useState(E0);
  const [loading, setLoading] = useState(false);

  /* ── RFID back state ── */
  const [scanning,  setScanning]  = useState(false);
  const [flipped,   setFlipped]   = useState(false);
  const [reading,   setReading]   = useState(false);
  const [bLabel,    setBLabel]    = useState("Access granted");
  const [bHeading,  setBHeading]  = useState("Welcome <em>back</em>");
  const [bName,     setBName]     = useState("Member");
  const [bUid,      setBUid]      = useState("00 00 00 00");
  const [bRows,     setBRows]     = useState([]);
  const [openLabel, setOpenLabel] = useState("Opening the store");
  const [ledOk,     setLedOk]     = useState(false);
  const [ledText,   setLedText]   = useState("Reading tag");

  /* ── panel height animation ── */
  useEffect(() => {
    if (!panelsRef.current) return;
    const panels = panelsRef.current.querySelectorAll(".panel");
    const active = panels[panelIdx];
    if (active) panelsRef.current.style.height = (active.offsetHeight + 18) + "px";
  }, [panelIdx, mode, step]);

  useEffect(() => {
    const fit = () => {
      if (!panelsRef.current) return;
      const panels = panelsRef.current.querySelectorAll(".panel");
      const active = panels[panelIdx];
      if (active) panelsRef.current.style.height = (active.offsetHeight + 18) + "px";
    };
    window.addEventListener("resize", fit);
    document.fonts?.ready?.then(fit);
    return () => window.removeEventListener("resize", fit);
  }, [panelIdx]);

  /* ── RFID sheen ── */
  useEffect(() => {
    const el = bkRef.current; if (!el) return;
    const onMove = e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", Math.min(100,Math.max(0,(e.clientX-r.left)/r.width*100)).toFixed(0)+"%");
      el.style.setProperty("--my", Math.min(100,Math.max(0,(e.clientY-r.top)/r.height*100)).toFixed(0)+"%");
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  /* ── Lanyard swing physics ── */
  useEffect(() => {
    if (REDUCED) return;
    const swing = swingRef.current, tilt = tiltRef.current;
    if (!swing || !tilt) return;
    let ang=0.12, om=0, tx=0, ty=0, mx=0, my=0, last=0, rafId;
    const onMove = e => {
      mx=(e.clientX/window.innerWidth-.5)*2; my=(e.clientY/window.innerHeight-.5)*2;
      const r=swing.getBoundingClientRect();
      const cx=r.left+r.width/2;
      if (Math.abs(e.clientX-cx)<r.width*.6 && e.clientY>r.top+120)
        om+=Math.min(.03,Math.max(-.03,e.movementX*.0007));
    };
    const onLeave = () => { mx=0; my=0; };
    const loop = t => {
      const dt=Math.min(.05,(t-last)/1000||.016); last=t;
      tx+=(my*-4-tx)*.08; ty+=(mx*7-ty)*.08;
      const target=Math.sin(t*.0009)*.012;
      om+=(-14*(ang-target)-1.15*om)*dt; ang+=om*dt;
      swing.style.transform=`rotate(${ang.toFixed(4)}rad)`;
      tilt.style.transform=`rotateX(${tx.toFixed(2)}deg) rotateY(${ty.toFixed(2)}deg)`;
      rafId=requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    rafId=requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  /* ── mode switch ── */
  function switchMode(m) {
    setMode(m); setStep(0); setErr(E0);
    setPanelIdx(m==="join" ? 1 : 0);
  }
  function goStep(n) {
    setStep(n); setPanelIdx(1+n);
  }

  /* ── grant (flip to RFID) ── */
  function grant(cfg) {
    setScanning(true);
    setTimeout(() => {
      setBLabel(cfg.lbl);
      setBHeading(cfg.h);
      setBName(cfg.name);
      setBUid("00 00 00 00");
      setBRows(cfg.rows);
      setOpenLabel("Opening the store");
      setLedOk(false);
      setLedText(cfg.led);
      setReading(true);
      setFlipped(true);

      if (!REDUCED) {
        uidTimer.current = setInterval(() => setBUid(rndUid()), 55);
        setTimeout(() => {
          clearInterval(uidTimer.current);
          setBUid(cfg.uid);
          setLedOk(true);
          setLedText(cfg.done);
          setReading(false);
        }, 2300);
        setTimeout(() => {
          setOpenLabel("Store ready");
          setTimeout(() => navigate("/home"), 900);
        }, 4300);
      } else {
        setBUid(cfg.uid);
        setLedOk(true);
        setLedText(cfg.done);
        setReading(false);
        setOpenLabel("Store ready");
        setTimeout(() => navigate("/home"), 400);
      }
    }, REDUCED ? 50 : 1350);
  }

  /* ── reset ── */
  function resetAll() {
    clearInterval(uidTimer.current);
    setFlipped(false); setScanning(false); setReading(false); setLedOk(false);
    setSiPass(""); setJPass(""); setJConf("");
    setPwSc(0); setPwReqs([false,false,false,false]);
    setLoading(false); setErr(E0);
    switchMode("in");
  }

  /* ── sign-in submit ── */
  async function handleSignIn(e) {
    e.preventDefault();
    const ne={...E0};
    let bad=false;
    if (!siId.trim() || !okId(siId)) { ne.siId=true; bad=true; }
    if (!siPass || siPass.length<6)  { ne.siPass=true; bad=true; }
    if (bad) { setErr(ne); return; }
    setLoading(true);
    try { await login(siId.trim(), siPass); } catch(_) { /* demo — still flip */ }
    finally { setLoading(false); }
    const nm = siId.includes("@") ? siId.split("@")[0].split(/[._-]/)[0] : "Member "+siId.slice(-4);
    grant({ lbl:"Access granted", h:"Welcome <em>back</em>", name:nm.charAt(0).toUpperCase()+nm.slice(1),
            uid:uidOf(siId), led:"Reading tag", done:"Tag verified",
            rows:["Tag UID verified","Shopping list synced","Trolley session ready"] });
  }

  /* ── join step 1 ── */
  function handleJoinNext(e) {
    e.preventDefault();
    const ne={...E0}; let bad=false;
    if (!/^\p{L}[\p{L} .'\u2019-]+$/u.test(jName.trim())) { ne.jName=true; bad=true; }
    if (!jEmail.trim() || !okId(jEmail))                   { ne.jEmail=true; bad=true; }
    if (bad) { setErr(ne); return; }
    goStep(1);
    setTimeout(() => document.getElementById("lp-jp")?.focus(), 500);
  }

  /* ── join step 2 ── */
  async function handleJoinSubmit(e) {
    e.preventDefault();
    if (step===0) { handleJoinNext(e); return; }
    const ne={...E0}; let bad=false;
    const tests=pwTests(jPass);
    if (jPass.length<8 || tests.filter(Boolean).length<3) { ne.jPass=true; bad=true; }
    if (!jConf)                   { ne.jConf=true; bad=true; }
    else if (jConf!==jPass)       { ne.jConf=true; bad=true; }
    if (!jTerms)                  { ne.jTerms=true; bad=true; }
    if (bad) { setErr(ne); return; }
    setLoading(true);
    try { await register(jEmail.trim(), jPass); } catch(_) { /* demo */ }
    finally { setLoading(false); }
    const first=jName.trim().split(/\s+/)[0];
    grant({ lbl:"Card issued", h:`Welcome, <em>${first}</em>`, name:jName.trim(),
            uid:uidOf(jEmail), led:"Writing tag", done:"Card issued",
            rows:["Account created","RFID card issued","Shopping list ready"] });
  }

  /* ── tilt class ── */
  const tiltCls = ["tilt", flipped?"ok":"", reading?"rd":""].filter(Boolean).join(" ");
  const isJoin  = mode==="join";

  /* ═══════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════ */
  return (
    <div className="lp-root">

      {/* ── SVG defs ── */}
      <svg width="0" height="0" style={{position:"absolute"}} aria-hidden="true" focusable="false">
        <defs>
          <symbol id="lp-logo" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="23" fill="#fff"/>
            <circle cx="24" cy="24" r="19.5" fill="none" stroke="#1647a8" strokeWidth="1.2" strokeDasharray="2 3"/>
            <g transform="translate(11 11) scale(1.1)" fill="none" stroke="#0b1f4b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="20" r="1.5" fill="#0b1f4b"/>
              <circle cx="18" cy="20" r="1.5" fill="#0b1f4b"/>
              <path d="M2 3h3l2.5 12h11l2-8H6"/>
              <path d="M10 8.5l2 2 4-4" stroke="#3f7fe0"/>
            </g>
          </symbol>
          <symbol id="lp-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
          <symbol id="lp-user"  viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></symbol>
          <symbol id="lp-mail"  viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 7 9-7"/></symbol>
          <symbol id="lp-lock"  viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></symbol>
          <symbol id="lp-eye"   viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></symbol>
          <symbol id="lp-eyeoff"viewBox="0 0 24 24"><path d="M3 3l18 18"/><path d="M10.5 5.2A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6C3.7 8.4 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1.1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></symbol>
          <linearGradient id="lp-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0"  stopColor="#f7e3a0"/>
            <stop offset=".5" stopColor="#d9b25a"/>
            <stop offset="1"  stopColor="#a97f2b"/>
          </linearGradient>
        </defs>
      </svg>

      {/* ══════════ LANYARD ══════════ */}
      <main className="swing" id="lp-swing" ref={swingRef}>

        <div className="strap"/>
        <div className="clip"><span className="ringm"/></div>

        <div className={tiltCls} id="lp-tilt" ref={tiltRef}>
          <div className="flipper">

            {/* ════ FRONT FACE ════ */}
            <section className={`face front${scanning?" scanning":""}`}>

              {/* header */}
              <div className="head">
                <span className="hole"/>
                <div className="hrow">
                  <div className="logo">
                    <svg><use href="#lp-logo"/></svg>
                    <div className="wm"><b>GMR</b><span>Smart Mart</span></div>
                  </div>
                  <svg className="hbars" id="lp-hbars" preserveAspectRatio="none" viewBox="0 0 96 20"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: buildBarcode() }}
                  />
                </div>
                <h1>
                  {isJoin ? <>Join <em>us</em></> : <>Sign <em>in</em></>}
                </h1>
                <p>
                  {isJoin ? "Create your RFID member card in two steps." : "Welcome back to GMR Smart Mart."}
                </p>
                <span className="holo"/>
              </div>

              {/* body */}
              <div className={`body${isJoin?" join":""}`}>

                {/* stepper */}
                <div className="stepper" aria-label="Registration steps">
                  <div className={`st${step===0?" on":step>0?" done":""}`}>
                    <b>{step>0?"✓":"1"}</b>Details
                  </div>
                  <span className="sbar" style={{"--s": step>=1 ? 1 : 0}}/>
                  <div className={`st${step===1?" on":""}`}>
                    <b>2</b>Security
                  </div>
                </div>

                {/* panels container */}
                <div className="panels" ref={panelsRef}>

                  {/* ── Panel 0: Sign In ── */}
                  <div className={`panel${panelIdx===0?" on":""}`} role="tabpanel">
                    <form onSubmit={handleSignIn} noValidate>
                      {/* email/phone */}
                      <div className={`field${err.siId?" err":""}`}>
                        <label htmlFor="lp-uid">Email or phone</label>
                        <div className="row">
                          <svg className="i"><use href="#lp-user"/></svg>
                          <input id="lp-uid" name="uid" autoComplete="username"
                            placeholder="you@example.com" value={siId}
                            onChange={e=>{setSiId(e.target.value);setErr(x=>({...x,siId:false}));}}/>
                        </div>
                        <div className="msg" role="alert" aria-live="polite">
                          {err.siId ? (!siId.trim() ? "Enter your email or phone number." : "That is not a valid email or phone.") : ""}
                        </div>
                      </div>
                      {/* password */}
                      <div className={`field${err.siPass?" err":""}`}>
                        <label htmlFor="lp-pw">Password</label>
                        <div className="row">
                          <svg className="i"><use href="#lp-lock"/></svg>
                          <input id="lp-pw" name="pw" type={siShowPw?"text":"password"}
                            autoComplete="current-password" placeholder="Enter your password"
                            value={siPass}
                            onChange={e=>{setSiPass(e.target.value);setErr(x=>({...x,siPass:false}));}}/>
                          <button type="button" className="eye"
                            aria-label={siShowPw?"Hide password":"Show password"}
                            onClick={()=>setSiShowPw(v=>!v)}>
                            <svg className="i"><use href={siShowPw?"#lp-eyeoff":"#lp-eye"}/></svg>
                          </button>
                        </div>
                        <div className="msg" role="alert" aria-live="polite">
                          {err.siPass ? (!siPass?"Enter your password.":"Use at least 6 characters.") : ""}
                        </div>
                      </div>
                      {/* opts */}
                      <div className="opts">
                        <label className="sw">
                          <input type="checkbox" checked={siRem} onChange={e=>setSiRem(e.target.checked)}/>
                          <span className="track"/>Stay in
                        </label>
                        <button type="button" className="lk"
                          onClick={()=>alert("Password reset — contact store support.")}>
                          Forgot?
                        </button>
                      </div>
                      {/* submit */}
                      <button type="submit" className={`btn${loading?" load":""}`} disabled={loading}>
                        <span className="btxt">Enter the mart</span>
                        <svg className="i"><use href="#lp-arrow"/></svg>
                        <span className="spin"/>
                      </button>
                    </form>
                  </div>

                  {/* ── Panel 1: Join — Details ── */}
                  <div className={`panel${panelIdx===1?" on":""}`} role="tabpanel">
                    <form onSubmit={handleJoinNext} noValidate>
                      <div className={`field${err.jName?" err":""}`}>
                        <label htmlFor="lp-jn">Full name</label>
                        <div className="row">
                          <svg className="i"><use href="#lp-user"/></svg>
                          <input id="lp-jn" autoComplete="name" placeholder="Your name"
                            value={jName}
                            onChange={e=>{setJName(e.target.value);setErr(x=>({...x,jName:false}));}}/>
                        </div>
                        <div className="msg" role="alert" aria-live="polite">
                          {err.jName?"Enter your full name using letters only.":""}
                        </div>
                      </div>
                      <div className={`field${err.jEmail?" err":""}`}>
                        <label htmlFor="lp-je">Email or phone</label>
                        <div className="row">
                          <svg className="i"><use href="#lp-mail"/></svg>
                          <input id="lp-je" autoComplete="email" placeholder="you@example.com"
                            value={jEmail}
                            onChange={e=>{setJEmail(e.target.value);setErr(x=>({...x,jEmail:false}));}}/>
                        </div>
                        <div className="msg" role="alert" aria-live="polite">
                          {err.jEmail?(!jEmail.trim()?"Enter your email or phone.":"Not a valid email or phone."):""}
                        </div>
                      </div>
                      <p className="hint">You will use this to sign in and to receive your RFID card.</p>
                      <button type="submit" className="btn">
                        <span>Continue</span>
                        <svg className="i"><use href="#lp-arrow"/></svg>
                      </button>
                    </form>
                  </div>

                  {/* ── Panel 2: Join — Security ── */}
                  <div className={`panel${panelIdx===2?" on":""}`} role="tabpanel">
                    <form onSubmit={handleJoinSubmit} noValidate>
                      {/* password */}
                      <div className={`field${err.jPass?" err":""}`}>
                        <label htmlFor="lp-jp">Create password</label>
                        <div className="row">
                          <svg className="i"><use href="#lp-lock"/></svg>
                          <input id="lp-jp" type={jShowPw?"text":"password"}
                            autoComplete="new-password" placeholder="At least 8 characters"
                            value={jPass}
                            onChange={e=>{
                              const v=e.target.value;
                              setJPass(v); setPwSc(pwScore(v)); setPwReqs(pwTests(v));
                              setErr(x=>({...x,jPass:false}));
                            }}/>
                          <button type="button" className="eye"
                            aria-label={jShowPw?"Hide password":"Show password"}
                            onClick={()=>setJShowPw(v=>!v)}>
                            <svg className="i"><use href={jShowPw?"#lp-eyeoff":"#lp-eye"}/></svg>
                          </button>
                        </div>
                        <div className="msg" role="alert" aria-live="polite">
                          {err.jPass?"Meet at least 3 of the 4 requirements.":""}
                        </div>
                      </div>
                      {/* strength meter */}
                      <div className="meter" data-s={pwSc}>
                        <i/><i/><i/><i/>
                        <span>{SCORE_LABELS[pwSc]}</span>
                      </div>
                      <ul className="reqs" id="lp-reqs">
                        {["8+ characters","Upper and lower case","A number","A symbol"].map((req,k)=>(
                          <li key={k} className={pwReqs[k]?"ok":""}>{req}</li>
                        ))}
                      </ul>
                      {/* confirm */}
                      <div className={`field${err.jConf?" err":""}`}>
                        <label htmlFor="lp-jc">Confirm password</label>
                        <div className="row">
                          <svg className="i"><use href="#lp-lock"/></svg>
                          <input id="lp-jc" type={jShowCf?"text":"password"}
                            autoComplete="new-password" placeholder="Re-enter your password"
                            value={jConf}
                            onChange={e=>{setJConf(e.target.value);setErr(x=>({...x,jConf:false}));}}/>
                          <button type="button" className="eye"
                            aria-label={jShowCf?"Hide password":"Show password"}
                            onClick={()=>setJShowCf(v=>!v)}>
                            <svg className="i"><use href={jShowCf?"#lp-eyeoff":"#lp-eye"}/></svg>
                          </button>
                        </div>
                        <div className="msg" role="alert" aria-live="polite">
                          {err.jConf?(!jConf?"Confirm your password.":"Passwords do not match."):""}
                        </div>
                      </div>
                      {/* terms */}
                      <label className={`sw terms${err.jTerms?" err":""}`}>
                        <input type="checkbox" id="lp-jt" checked={jTerms}
                          onChange={e=>{setJTerms(e.target.checked);setErr(x=>({...x,jTerms:false}));}}/>
                        <span className="track"/>
                        <span>I agree to the GMR Smart Mart{" "}
                          <button type="button" className="lk"
                            onClick={()=>alert("GMR Smart Mart Policies")}>Policies</button>
                        </span>
                      </label>
                      {/* buttons */}
                      <div className="btnrow">
                        <button type="button" className="btn btn-g" aria-label="Back"
                          onClick={()=>goStep(0)}>
                          <svg className="i"><use href="#lp-arrow"/></svg>
                        </button>
                        <button type="submit" className={`btn${loading?" load":""}`} disabled={loading}>
                          <span className="btxt">Issue my card</span>
                          <svg className="i"><use href="#lp-arrow"/></svg>
                          <span className="spin"/>
                        </button>
                      </div>
                    </form>
                  </div>

                </div>{/* /panels */}
              </div>{/* /body */}

              {/* footer tear line */}
              <div className="foot">
                <span className="notch l" aria-hidden="true"/>
                <span className="notch r" aria-hidden="true"/>
                <div className="flow" aria-hidden="true">
                  <span>Scan</span>
                  <svg className="i"><use href="#lp-arrow"/></svg>
                  <span>Shop</span>
                  <svg className="i"><use href="#lp-arrow"/></svg>
                  <span>Go</span>
                </div>
                <button className="joinb" type="button"
                  onClick={()=>switchMode(isJoin?"in":"join")}>
                  {isJoin ? "Sign in" : "Join"}
                </button>
              </div>

              {/* scan beam */}
              <span className="beam" aria-hidden="true"/>

            </section>{/* /front */}

            {/* ════ BACK FACE — RFID CARD ════ */}
            <section className="face back-face">
              <div className="bk" ref={bkRef} style={{"--mx":"30%","--my":"6%"}}>

                {/* antenna coil — right side of card */}
                <svg className="coil" viewBox="0 0 200 160" aria-hidden="true"
                  style={{position:"absolute",right:"-2%",top:"8%",width:"52%",pointerEvents:"none",opacity:1,zIndex:0}}>
                  {Array.from({length:7},(_,i)=>(
                    <rect key={i}
                      x={14+i*11} y={12+i*8}
                      width={172-i*22} height={136-i*16}
                      rx={16-i}
                      fill="none"
                      stroke="rgba(143,180,238,0.28)"
                      strokeWidth="1.5"
                    />
                  ))}
                </svg>

                {/* hole punch */}
                <span className="hole" aria-hidden="true"/>

                {/* radio rings */}
                <i className="ring-anim"    aria-hidden="true"/>
                <i className="ring-anim r2" aria-hidden="true"/>

                {/* ── top row: logo + NFC icon ── */}
                <div className="btop">
                  <div className="logo">
                    <svg style={{width:36,height:36}}><use href="#lp-logo"/></svg>
                    <div className="wm"><b>GMR</b><span>Smart Mart</span></div>
                  </div>
                  <svg className="nfc" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 8.5a5.5 5.5 0 0 1 0 7"/>
                    <path d="M10 6a9.5 9.5 0 0 1 0 12"/>
                    <path d="M14 3.5a13 13 0 0 1 0 17"/>
                    <path d="M18 1a16.5 16.5 0 0 1 0 22"/>
                  </svg>
                </div>

                {/* ── chip + status LED ── */}
                <div className="bmid">
                  <svg className="chip" viewBox="0 0 50 38" aria-hidden="true">
                    <rect x=".75" y=".75" width="48.5" height="36.5" rx="7"
                      fill="url(#lp-gold)" stroke="#8a6620" strokeWidth="1.5"/>
                    <g fill="none" stroke="#7a5a1c" strokeWidth="1.2">
                      <path d="M1 13h14v12H1M49 13H35v12h14M15 13V1M35 13V1M15 25v12M35 25v12"/>
                      <rect x="15" y="13" width="20" height="12" rx="3"/>
                    </g>
                  </svg>
                  <div className="stat">
                    <i className={`led${ledOk?" ok":""}`}/>
                    <span role="status" aria-live="polite">{ledText}</span>
                  </div>
                </div>

                {/* ── ACCESS GRANTED label + heading ── */}
                <span className="lbl">{bLabel}</span>
                <h2 dangerouslySetInnerHTML={{ __html: bHeading }}/>

                {/* ── member pass panel ── */}
                <div className="pass">
                  <div>
                    <small>Member</small>
                    <b>{bName}</b>
                  </div>
                  <div className="u">
                    <small>UID</small>
                    <b>{bUid}</b>
                  </div>
                </div>

                {/* ── animated check rows ── */}
                <ul className="rows">
                  {bRows.map((row,i)=>(
                    <li key={i} style={{"--n":i}}>
                      <span className="ck">
                        <svg viewBox="0 0 24 24">
                          <path d="M5 12.5l4.5 4.5L19 7.5"/>
                        </svg>
                      </span>
                      {row}
                    </li>
                  ))}
                </ul>

                {/* ── progress bar ── */}
                <div className="opening">
                  <small role="status" aria-live="polite">{openLabel}</small>
                  <div className="tr"><i/></div>
                </div>

                {/* ── Continue to store button ── */}
                <button type="button" className="btn btn-w"
                  style={{width:"100%"}}
                  onClick={()=>navigate("/home")}>
                  <span>Continue to store</span>
                  <svg className="i"><use href="#lp-arrow"/></svg>
                </button>

                <button type="button" className="again" onClick={resetAll}>
                  Back to sign in
                </button>

                <p className="note">Design preview · no account checked · 13.56 MHz</p>

              </div>
            </section>{/* /back */}

          </div>{/* /flipper */}
        </div>{/* /tilt */}
      </main>

    </div>
  );
}
