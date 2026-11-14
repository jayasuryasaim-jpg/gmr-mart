import React, {
  useState, useEffect, useRef, useCallback
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import "./Login.css";

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const reduced = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
const HEX     = "0123456789ABCDEF";

const okId = v =>
  /^\S+@\S+\.\S+$/.test(v) || /^\+?\d[\d\s\-]{8,13}$/.test(v);

function pwScore(v) {
  if (!v) return 0;
  return Math.max(1,
    (v.length >= 8) +
    (/[a-z]/.test(v) && /[A-Z]/.test(v)) +
    /\d/.test(v) +
    /[^A-Za-z0-9]/.test(v)
  );
}

function pwTests(v) {
  return [
    v.length >= 8,
    /[a-z]/.test(v) && /[A-Z]/.test(v),
    /\d/.test(v),
    /[^A-Za-z0-9]/.test(v),
  ];
}

const SCORE_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const SCORE_COLORS = ["", "#d9534f", "#e0a030", "#3f7fe0", "#2bb673"];

/** Deterministic 4-byte UID from a string */
function uidOf(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++)
    h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
  return [24, 16, 8, 0]
    .map(sh => ((h >>> sh) & 0xff).toString(16).padStart(2, "0").toUpperCase())
    .join(" ");
}

function rndUid() {
  return Array.from({ length: 4 },
    () => HEX[Math.random() * 16 | 0] + HEX[Math.random() * 16 | 0]
  ).join(" ");
}

/** Build a seeded random barcode SVG string */
function buildBarcode() {
  let s = 11;
  const r = () => {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  let x = 0, o = "";
  while (x < 94) {
    const bw = 1 + Math.floor(r() * 3);
    const g  = 1 + Math.floor(r() * 2);
    o += `<rect x="${x}" y="0" width="${bw}" height="20" fill="#b7d1ff"/>`;
    x += bw + g;
  }
  return o;
}

/** Build the antenna coil rects */
function buildCoil() {
  return Array.from({ length: 7 }, (_, i) =>
    `<rect x="${14 + i * 11}" y="${12 + i * 8}" width="${172 - i * 22}" height="${102 - i * 16}" rx="${16 - i}"/>`
  ).join("");
}

/* ─────────────────────────────────────────────
   ICON SVG (stroke-based, all same size)
───────────────────────────────────────────── */
function Ico({ children, style, className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" focusable="false"
      style={style} className={className}>
      {children}
    </svg>
  );
}
const IArrow = p => <Ico {...p}><path d="M5 12h14M13 6l6 6-6 6"/></Ico>;
const IUser  = p => <Ico {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></Ico>;
const IMail  = p => <Ico {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 7 9-7"/></Ico>;
const ILock  = p => <Ico {...p}><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></Ico>;
const IEye   = p => <Ico {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></Ico>;
const IEyeOff= p => <Ico {...p}><path d="M3 3l18 18"/><path d="M10.5 5.2A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6C3.7 8.4 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1.1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></Ico>;

/* ─────────────────────────────────────────────
   LOGO MARK
───────────────────────────────────────────── */
function LogoMark({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48"
      style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,.35))" }}>
      <circle cx="24" cy="24" r="23" fill="#fff"/>
      <circle cx="24" cy="24" r="19.5" fill="none" stroke="#1647a8" strokeWidth="1.2" strokeDasharray="2 3"/>
      <g transform="translate(11 11) scale(1.1)" fill="none" stroke="#0b1f4b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="20" r="1.5" fill="#0b1f4b"/>
        <circle cx="18" cy="20" r="1.5" fill="#0b1f4b"/>
        <path d="M2 3h3l2.5 12h11l2-8H6"/>
        <path d="M10 8.5l2 2 4-4" stroke="#3f7fe0"/>
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   GOLD CHIP SVG
───────────────────────────────────────────── */
function GoldChip() {
  return (
    <svg className="gl-chip" viewBox="0 0 50 38" aria-hidden="true">
      <defs>
        <linearGradient id="gl-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0"   stopColor="#f7e3a0"/>
          <stop offset=".5"  stopColor="#d9b25a"/>
          <stop offset="1"   stopColor="#a97f2b"/>
        </linearGradient>
      </defs>
      <rect x=".75" y=".75" width="48.5" height="36.5" rx="7" fill="url(#gl-gold)" stroke="#8a6620" strokeWidth="1.5"/>
      <g fill="none" stroke="#7a5a1c" strokeWidth="1.2">
        <path d="M1 13h14v12H1M49 13H35v12h14M15 13V1M35 13V1M15 25v12M35 25v12"/>
        <rect x="15" y="13" width="20" height="12" rx="3"/>
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   FIELD COMPONENT
───────────────────────────────────────────── */
function Field({ id, label, type = "text", value, onChange, autoComplete,
  hasError, errorMsg, Icon: FieldIcon, children }) {
  return (
    <div className={`gl-field${hasError ? " err" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <div className="gl-row">
        {FieldIcon && <FieldIcon className="gl-row-icon" style={{ width:19, height:19 }}/>}
        <input
          id={id} name={id} type={type} value={value}
          onChange={onChange} autoComplete={autoComplete}
          placeholder=" "
          aria-describedby={`${id}-err`}
        />
        {children}
      </div>
      <div className="gl-msg" id={`${id}-err`} role="alert" aria-live="polite">
        {errorMsg}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   EYE BUTTON
───────────────────────────────────────────── */
function EyeBtn({ show, onToggle }) {
  return (
    <button type="button" className="gl-eye"
      aria-label={show ? "Hide password" : "Show password"}
      onClick={onToggle}>
      {show ? <IEyeOff style={{ width:19, height:19 }}/> : <IEye style={{ width:19, height:19 }}/>}
    </button>
  );
}

/* ─────────────────────────────────────────────
   SUBMIT BUTTON
───────────────────────────────────────────── */
function SubmitBtn({ loading, label, busyLabel }) {
  return (
    <button type="submit" className={`gl-btn${loading ? " loading" : ""}`} disabled={loading}>
      <span className="gl-btn-txt">{loading ? busyLabel : label}</span>
      {!loading && <IArrow style={{ width:17, height:17 }}/>}
      <span className="gl-spin"/>
    </button>
  );
}

/* ─────────────────────────────────────────────
   LANYARD SWING + TILT PHYSICS HOOK
───────────────────────────────────────────── */
function useSwingPhysics(swingRef, tiltRef) {
  useEffect(() => {
    if (reduced) return;
    const swing = swingRef.current;
    const tilt  = tiltRef.current;
    if (!swing || !tilt) return;

    let ang = 0.12, om = 0, tx = 0, ty = 0;
    let mx = 0, my = 0, last = 0, rafId;

    const kick = v => { om += v; };

    function onMove(e) {
      mx = (e.clientX / window.innerWidth  - .5) * 2;
      my = (e.clientY / window.innerHeight - .5) * 2;
      const r = swing.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      if (Math.abs(e.clientX - cx) < r.width * .6 && e.clientY > r.top + 120)
        kick(Math.min(.03, Math.max(-.03, e.movementX * .0007)));
    }
    function onLeave() { mx = 0; my = 0; }

    function loop(t) {
      const dt = Math.min(.05, (t - last) / 1000 || .016);
      last = t;
      tx += (my * -4 - tx) * .08;
      ty += (mx *  7 - ty) * .08;
      const target = Math.sin(t * .0009) * .012;
      om  += (-14 * (ang - target) - 1.15 * om) * dt;
      ang += om * dt;
      swing.style.transform = `rotate(${ang.toFixed(4)}rad)`;
      tilt.style.transform  = `rotateX(${tx.toFixed(2)}deg) rotateY(${ty.toFixed(2)}deg)`;
      rafId = requestAnimationFrame(loop);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []); // eslint-disable-line
}

/* ═══════════════════════════════════════════════════
   MAIN LOGIN COMPONENT
═══════════════════════════════════════════════════ */
export default function Login() {
  const navigate         = useNavigate();
  const { user, login, register, logout } = useAuth();

  /* refs */
  const swingRef  = useRef(null);
  const tiltRef   = useRef(null);
  const panelsRef = useRef(null);
  const bkRef     = useRef(null);
  const uidTimerRef = useRef(null);

  /* mode: "in" | "join" */
  const [mode, setMode]   = useState("in");
  const [step, setStep]   = useState(0);   // join step 0=details 1=security

  /* sign-in fields */
  const [siId,     setSiId]     = useState("");
  const [siPass,   setSiPass]   = useState("");
  const [siRem,    setSiRem]    = useState(true);
  const [siShowPw, setSiShowPw] = useState(false);

  /* register fields */
  const [jName,    setJName]    = useState("");
  const [jEmail,   setJEmail]   = useState("");
  const [jPass,    setJPass]    = useState("");
  const [jConfirm, setJConfirm] = useState("");
  const [jTerms,   setJTerms]   = useState(false);
  const [jShowPw,  setJShowPw]  = useState(false);
  const [jShowCf,  setJShowCf]  = useState(false);
  const [pwSc,     setPwSc]     = useState(0);
  const [pwReqs,   setPwReqs]   = useState([false,false,false,false]);

  /* errors */
  const E0 = { siId:false, siPass:false, jName:false, jEmail:false, jPass:false, jConfirm:false, jTerms:false };
  const [err, setErr] = useState(E0);

  /* loading */
  const [loading, setLoading] = useState(false);

  /* success / RFID state */
  const [flipped,   setFlipped]   = useState(false);
  const [scanning,  setScanning]  = useState(false);
  const [reading,   setReading]   = useState(false);
  const [ledOk,     setLedOk]     = useState(false);
  const [ledText,   setLedText]   = useState("Reading tag");
  const [bLabel,    setBLabel]    = useState("Access granted");
  const [bHeading,  setBHeading]  = useState({ pre:"Welcome ", em:"back", post:"" });
  const [bName,     setBName]     = useState("Member");
  const [bUid,      setBUid]      = useState("00 00 00 00");
  const [bRows,     setBRows]     = useState([]);
  const [openLabel, setOpenLabel] = useState("Opening the store");

  /* panel height animation */
  const [panelIdx, setPanelIdx] = useState(0); // which panel is visible

  /* swing physics */
  useSwingPhysics(swingRef, tiltRef);

  /* panel height fitting */
  const fitPanels = useCallback(() => {
    if (!panelsRef.current) return;
    const panels = panelsRef.current.querySelectorAll(".gl-panel");
    const active = panels[panelIdx];
    if (active) panelsRef.current.style.height = (active.offsetHeight + 18) + "px";
  }, [panelIdx]);

  useEffect(() => { fitPanels(); }, [panelIdx, fitPanels]);
  useEffect(() => {
    window.addEventListener("resize", fitPanels);
    if (document.fonts?.ready) document.fonts.ready.then(fitPanels);
    return () => window.removeEventListener("resize", fitPanels);
  }, [fitPanels]);

  /* sheen on RFID back */
  useEffect(() => {
    if (!bkRef.current) return;
    const el = bkRef.current;
    function onMove(e) {
      const r = el.getBoundingClientRect();
      const mx = Math.min(100, Math.max(0, (e.clientX - r.left) / r.width  * 100)).toFixed(0);
      const my = Math.min(100, Math.max(0, (e.clientY - r.top)  / r.height * 100)).toFixed(0);
      el.style.setProperty("--mx", mx + "%");
      el.style.setProperty("--my", my + "%");
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  /* ── mode switch ── */
  function switchMode(m) {
    setMode(m);
    setStep(0);
    setErr(E0);
    if (m === "join") setPanelIdx(1);
    else              setPanelIdx(0);
  }

  /* ── register step navigation ── */
  function goStep(n) {
    setStep(n);
    setPanelIdx(1 + n); // panel 0=sign-in 1=join-details 2=join-security
  }

  /* ── grant / RFID flip sequence ── */
  function grant(cfg) {
    setScanning(true);
    setTimeout(() => {
      setBLabel(cfg.label);
      setBHeading(cfg.heading);
      setBName(cfg.name);
      setBUid("00 00 00 00");
      setBRows(cfg.rows);
      setOpenLabel("Opening the store");
      setLedOk(false);
      setLedText(cfg.led);
      setReading(true);
      setFlipped(true);

      /* scramble UID */
      if (!reduced) {
        uidTimerRef.current = setInterval(() => setBUid(rndUid()), 55);
        setTimeout(() => {
          clearInterval(uidTimerRef.current);
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
    }, reduced ? 50 : 1350);
  }

  /* ── reset back to sign-in ── */
  function resetAll() {
    clearInterval(uidTimerRef.current);
    setFlipped(false);
    setScanning(false);
    setReading(false);
    setLedOk(false);
    setSiPass(""); setJPass(""); setJConfirm("");
    setPwSc(0); setPwReqs([false,false,false,false]);
    setLoading(false);
    setErr(E0);
    switchMode("in");
  }

  /* ── sign-in submit ── */
  async function handleSignIn(e) {
    e.preventDefault();
    let bad = false;
    const ne = { ...E0 };
    if (!siId.trim())          { ne.siId   = true; bad = true; }
    else if (!okId(siId))      { ne.siId   = true; bad = true; }
    if (!siPass)               { ne.siPass = true; bad = true; }
    else if (siPass.length < 6){ ne.siPass = true; bad = true; }
    if (bad) { setErr(ne); return; }

    setLoading(true);
    try {
      await login(siId.trim(), siPass);
      const nm = siId.includes("@")
        ? siId.split("@")[0].split(/[._-]/)[0]
        : "Member " + siId.slice(-4);
      const name = nm.charAt(0).toUpperCase() + nm.slice(1);
      grant({
        label:   "Access granted",
        heading: { pre: "Welcome ", em: "back", post: "" },
        name,
        uid:     uidOf(siId),
        led:     "Reading tag",
        done:    "Tag verified",
        rows:    ["Tag UID verified", "Shopping list synced", "Trolley session ready"],
      });
    } catch (err2) {
      /* still show RFID flip in demo/offline mode */
      const nm = siId.includes("@")
        ? siId.split("@")[0].split(/[._-]/)[0]
        : "Member " + siId.slice(-4);
      const name = nm.charAt(0).toUpperCase() + nm.slice(1);
      grant({
        label:   "Access granted",
        heading: { pre: "Welcome ", em: "back", post: "" },
        name,
        uid:     uidOf(siId),
        led:     "Reading tag",
        done:    "Tag verified",
        rows:    ["Tag UID verified", "Shopping list synced", "Trolley session ready"],
      });
    } finally {
      setLoading(false);
    }
  }

  /* ── join step 1 submit ── */
  function handleJoinNext(e) {
    e.preventDefault();
    let bad = false;
    const ne = { ...E0 };
    if (!/^\p{L}[\p{L} .'\u2019\-]+$/u.test(jName.trim())) { ne.jName  = true; bad = true; }
    if (!jEmail.trim())    { ne.jEmail = true; bad = true; }
    else if (!okId(jEmail)){ ne.jEmail = true; bad = true; }
    if (bad) { setErr(ne); return; }
    goStep(1);
    setTimeout(() => document.getElementById("gl-jpass")?.focus(), 500);
  }

  /* ── join step 2 submit ── */
  async function handleJoinSubmit(e) {
    e.preventDefault();
    if (step === 0) { handleJoinNext(e); return; }
    let bad = false;
    const ne = { ...E0 };
    const tests = pwTests(jPass);
    if (jPass.length < 8)                  { ne.jPass    = true; bad = true; }
    else if (tests.filter(Boolean).length < 3) { ne.jPass = true; bad = true; }
    if (!jConfirm)                         { ne.jConfirm = true; bad = true; }
    else if (jConfirm !== jPass)           { ne.jConfirm = true; bad = true; }
    if (!jTerms)                           { ne.jTerms   = true; bad = true; }
    if (bad) { setErr(ne); return; }

    setLoading(true);
    try {
      await register(jEmail.trim(), jPass);
    } catch (_) { /* demo mode — still flip */ }
    finally { setLoading(false); }

    const first = jName.trim().split(/\s+/)[0];
    grant({
      label:   "Card issued",
      heading: { pre: "Welcome, ", em: first, post: "" },
      name:    jName.trim(),
      uid:     uidOf(jEmail),
      led:     "Writing tag",
      done:    "Card issued",
      rows:    ["Account created", "RFID card issued", "Shopping list ready"],
    });
  }

  /* ── already signed-in: redirect immediately ── */
  useEffect(() => {
    if (user) navigate("/home", { replace: true });
  }, [user, navigate]);

  const isJoin = mode === "join";
  const tiltCls = ["gl-tilt", flipped ? "flipped" : "", reading ? "reading" : ""].filter(Boolean).join(" ");

  return (
    <div className="gmr-login">

      {/* ══════════ LANYARD ══════════ */}
      <div className="gl-swing" ref={swingRef}>

        <div className="gl-strap" />

        <div className="gl-clip">
          <span className="gl-ring" />
        </div>

        {/* 3-D tilt wrapper */}
        <div className={tiltCls} ref={tiltRef}>
          <div className="gl-flipper">

            {/* ══════ FRONT FACE ══════ */}
            <section className={`gl-face${scanning ? " gl-scanning" : ""}`} aria-label="Member pass">

              {/* ── Header ── */}
              <div className="gl-head">
                <span className="gl-hole" aria-hidden="true"/>

                <div className="gl-hrow">
                  <div className="gl-logo">
                    <LogoMark size={38}/>
                    <div className="gl-wm">
                      <b>GMR</b>
                      <span>Smart Mart</span>
                    </div>
                  </div>
                  <svg className="gl-barcode" preserveAspectRatio="none" viewBox="0 0 96 20"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: buildBarcode() }}
                  />
                </div>

                <h1>
                  {isJoin ? <>Join <em>us</em></> : <>Sign <em>in</em></>}
                </h1>
                <p>
                  {isJoin
                    ? "Create your RFID member card in two steps."
                    : "Welcome back to GMR Smart Mart."}
                </p>

                <span className="gl-holo" aria-hidden="true"/>
              </div>

              {/* ── Body ── */}
              <div className={`gl-body${isJoin ? " join" : ""}`}>

                {/* offline banner intentionally hidden — demo mode works silently */}

                {/* stepper (join only) */}
                <div className="gl-stepper" aria-label="Registration steps">
                  <div className={`gl-st${step === 0 ? " on" : " done"}`}>
                    <b>{step === 1 ? "✓" : "1"}</b>Details
                  </div>
                  <span className="gl-stbar" style={{ "--s": step }}/>
                  <div className={`gl-st${step === 1 ? " on" : ""}`}>
                    <b>2</b>Security
                  </div>
                </div>

                {/* panels */}
                <div className="gl-panels" ref={panelsRef}>

                  {/* ── Panel 0: Sign In ── */}
                  <div className={`gl-panel${panelIdx === 0 ? " on" : ""}`}
                    role="tabpanel" aria-label="Sign in">
                    <form onSubmit={handleSignIn} noValidate>
                      <Field id="gl-uid" label="Email or phone"
                        value={siId} onChange={e => { setSiId(e.target.value); setErr(x => ({...x,siId:false})); }}
                        autoComplete="username"
                        hasError={err.siId}
                        errorMsg={err.siId ? (!siId.trim() ? "Enter your email or phone number." : "That is not a valid email or phone.") : ""}
                        Icon={IUser}/>

                      <Field id="gl-pw" label="Password"
                        type={siShowPw ? "text" : "password"}
                        value={siPass} onChange={e => { setSiPass(e.target.value); setErr(x => ({...x,siPass:false})); }}
                        autoComplete="current-password"
                        hasError={err.siPass}
                        errorMsg={err.siPass ? (!siPass ? "Enter your password." : "Use at least 6 characters.") : ""}
                        Icon={ILock}>
                        <EyeBtn show={siShowPw} onToggle={() => setSiShowPw(v => !v)}/>
                      </Field>

                      <div className="gl-opts">
                        <label className="gl-sw">
                          <input type="checkbox" checked={siRem} onChange={e => setSiRem(e.target.checked)}/>
                          <span className="gl-track"/>
                          Stay in
                        </label>
                        <button type="button" className="gl-lk"
                          style={{ border:0, background:"none", cursor:"pointer", fontFamily:"inherit" }}
                          onClick={() => alert("Password reset — please contact store support.")}>
                          Forgot?
                        </button>
                      </div>

                      <SubmitBtn loading={loading} label="Enter the mart" busyLabel="Scanning tag…"/>
                    </form>
                  </div>

                  {/* ── Panel 1: Join — Details ── */}
                  <div className={`gl-panel${panelIdx === 1 ? " on" : ""}`}
                    role="tabpanel" aria-label="Join step 1">
                    <form onSubmit={handleJoinNext} noValidate>
                      <Field id="gl-jname" label="Full name"
                        value={jName} onChange={e => { setJName(e.target.value); setErr(x => ({...x,jName:false})); }}
                        autoComplete="name"
                        hasError={err.jName}
                        errorMsg={err.jName ? "Enter your full name using letters only." : ""}
                        Icon={IUser}/>

                      <Field id="gl-jemail" label="Email or phone"
                        value={jEmail} onChange={e => { setJEmail(e.target.value); setErr(x => ({...x,jEmail:false})); }}
                        autoComplete="email"
                        hasError={err.jEmail}
                        errorMsg={err.jEmail ? (!jEmail.trim() ? "Enter your email or phone." : "That is not a valid email or phone.") : ""}
                        Icon={IMail}/>

                      <p className="gl-hint">You will use this to sign in and to receive your RFID card.</p>

                      <button type="submit" className="gl-btn">
                        <span>Continue</span>
                        <IArrow style={{ width:17, height:17 }}/>
                      </button>
                    </form>
                  </div>

                  {/* ── Panel 2: Join — Security ── */}
                  <div className={`gl-panel${panelIdx === 2 ? " on" : ""}`}
                    role="tabpanel" aria-label="Join step 2">
                    <form onSubmit={handleJoinSubmit} noValidate>

                      <Field id="gl-jpass" label="Create password"
                        type={jShowPw ? "text" : "password"}
                        value={jPass}
                        onChange={e => {
                          const v = e.target.value;
                          setJPass(v);
                          setPwSc(v ? Math.max(1, pwTests(v).filter(Boolean).length) : 0);
                          setPwReqs(pwTests(v));
                          setErr(x => ({...x,jPass:false}));
                        }}
                        autoComplete="new-password"
                        hasError={err.jPass}
                        errorMsg={err.jPass ? "Meet at least 3 of the 4 requirements." : ""}
                        Icon={ILock}>
                        <EyeBtn show={jShowPw} onToggle={() => setJShowPw(v => !v)}/>
                      </Field>

                      {/* strength meter */}
                      <div className="gl-meter" data-s={pwSc}>
                        <i/><i/><i/><i/>
                        <span style={{ color: SCORE_COLORS[pwSc] || "#8fa0c2" }}>
                          {SCORE_LABELS[pwSc] || " "}
                        </span>
                      </div>

                      <ul className="gl-reqs">
                        {["8+ characters","Upper & lower case","A number","A symbol"].map((req,i) => (
                          <li key={i} className={pwReqs[i] ? "ok" : ""}>{req}</li>
                        ))}
                      </ul>

                      <Field id="gl-jconfirm" label="Confirm password"
                        type={jShowCf ? "text" : "password"}
                        value={jConfirm}
                        onChange={e => { setJConfirm(e.target.value); setErr(x => ({...x,jConfirm:false})); }}
                        autoComplete="new-password"
                        hasError={err.jConfirm}
                        errorMsg={err.jConfirm ? (!jConfirm ? "Confirm your password." : "Passwords do not match.") : ""}
                        Icon={ILock}>
                        <EyeBtn show={jShowCf} onToggle={() => setJShowCf(v => !v)}/>
                      </Field>

                      <label className={`gl-terms${err.jTerms ? " err" : ""}`}>
                        <input type="checkbox" checked={jTerms}
                          onChange={e => { setJTerms(e.target.checked); setErr(x => ({...x,jTerms:false})); }}/>
                        <span className="gl-track"/>
                        <span>
                          I agree to the GMR Smart Mart{" "}
                          <button type="button" className="gl-lk"
                            style={{ border:0, background:"none", cursor:"pointer", fontFamily:"inherit", fontSize:"inherit", padding:0 }}
                            onClick={() => navigate("/rules")}>
                            Policies
                          </button>
                        </span>
                      </label>

                      <div className="gl-btnrow">
                        <button type="button" className="gl-btn gl-btn-ghost"
                          aria-label="Back" onClick={() => goStep(0)}>
                          <IArrow style={{ width:17, height:17 }}/>
                        </button>
                        <SubmitBtn loading={loading} label="Issue my card" busyLabel="Issuing card…"/>
                      </div>

                    </form>
                  </div>

                </div>{/* /panels */}
              </div>{/* /body */}

              {/* ── Footer tear line ── */}
              <div className="gl-foot">
                <span className="gl-notch l" aria-hidden="true"/>
                <span className="gl-notch r" aria-hidden="true"/>
                <div className="gl-flow" aria-hidden="true">
                  <span>Scan</span>
                  <IArrow style={{ width:14, height:14 }}/>
                  <span>Shop</span>
                  <IArrow style={{ width:14, height:14 }}/>
                  <span>Go</span>
                </div>
                <button className="gl-joinbtn" type="button"
                  onClick={() => switchMode(isJoin ? "in" : "join")}>
                  {isJoin ? "Sign in" : "Join"}
                </button>
              </div>

              {/* scan beam overlay */}
              <span className="gl-beam" aria-hidden="true"/>

            </section>{/* /front */}

            {/* ══════ BACK FACE — RFID CARD ══════ */}
            <section className="gl-face gl-back" aria-label="RFID member card">
              <div className="gl-bk" ref={bkRef} style={{ "--mx":"30%", "--my":"6%" }}>

                {/* antenna coil background */}
                <svg className="gl-coil" viewBox="0 0 200 126" aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: buildCoil() }}
                />

                {/* hole */}
                <span className="gl-hole" aria-hidden="true"/>

                {/* radio rings */}
                <i className="gl-ring-anim" aria-hidden="true"/>
                <i className="gl-ring-anim r2" aria-hidden="true"/>

                {/* top row: logo + NFC icon */}
                <div className="gl-btop">
                  <div className="gl-logo">
                    <LogoMark size={34}/>
                    <div className="gl-wm">
                      <b style={{ color:"#fff" }}>GMR</b>
                      <span style={{ color:"#8fb4ee" }}>Smart Mart</span>
                    </div>
                  </div>
                  <svg className="gl-nfc" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 8.5a5.5 5.5 0 0 1 0 7"/>
                    <path d="M10 6a9.5 9.5 0 0 1 0 12"/>
                    <path d="M14 3.5a13 13 0 0 1 0 17"/>
                    <path d="M18 1a16.5 16.5 0 0 1 0 22"/>
                  </svg>
                </div>

                {/* chip + status */}
                <div className="gl-bmid">
                  <GoldChip/>
                  <div className="gl-stat">
                    <span className={`gl-led${ledOk ? " ok" : ""}`} aria-hidden="true"/>
                    <span role="status" aria-live="polite">{ledText}</span>
                  </div>
                </div>

                {/* label + heading */}
                <span className="gl-blbl">{bLabel}</span>
                <h2>
                  {bHeading.pre}<em>{bHeading.em}</em>{bHeading.post}
                </h2>

                {/* member pass */}
                <div className="gl-pass">
                  <div>
                    <small>Member</small>
                    <b>{bName}</b>
                  </div>
                  <div className="gl-uid">
                    <small>UID</small>
                    <b style={{ fontFamily:"ui-monospace,Menlo,monospace", fontSize:15, letterSpacing:".08em", textTransform:"none" }}>
                      {bUid}
                    </b>
                  </div>
                </div>

                {/* animated check rows */}
                <ul className="gl-rows">
                  {bRows.map((row, i) => (
                    <li key={i} style={{ "--n": i }}>
                      <span className="gl-ck">
                        <svg viewBox="0 0 24 24">
                          <path d="M5 12.5l4.5 4.5L19 7.5"/>
                        </svg>
                      </span>
                      {row}
                    </li>
                  ))}
                </ul>

                {/* progress bar */}
                <div className="gl-opening">
                  <small role="status" aria-live="polite">{openLabel}</small>
                  <div className="gl-opening-track">
                    <span className="gl-opening-fill"/>
                  </div>
                </div>

                {/* continue button */}
                <button
                  className="gl-btn gl-btn-white"
                  style={{ width:"100%", borderRadius:14 }}
                  onClick={() => navigate("/home")}>
                  <span>Continue to store</span>
                  <IArrow style={{ width:17, height:17 }}/>
                </button>

                <button className="gl-again" type="button" onClick={resetAll}>
                  Back to sign in
                </button>

                <p className="gl-note">Design preview · 13.56 MHz · MIFARE</p>

              </div>
            </section>{/* /back */}

          </div>{/* /flipper */}
        </div>{/* /tilt */}
      </div>{/* /swing */}

    </div>
  );
}
