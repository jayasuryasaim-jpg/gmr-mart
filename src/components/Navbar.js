import React, {
  useState, useEffect, useRef, useLayoutEffect
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

/* ─────────────────────────────────────────
   NAV ITEMS  (paths match App.js routes)
───────────────────────────────────────── */
const NAV_ITEMS = [
  {
    to: "/home",
    label: "Home",
    hint: "Start here",
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    to: "/3d-mart",
    label: "3D Mart",
    hint: "Walk the store in 3D",
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l9 5v10l-9 5-9-5V7z"/>
        <path d="M3 7l9 5 9-5M12 12v10"/>
      </svg>
    ),
  },
  {
    to: "/heatmap",
    label: "Store Map",
    hint: "Find any aisle",
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
        <line x1="9" y1="3" x2="9" y2="18"/>
        <line x1="15" y1="6" x2="15" y2="21"/>
      </svg>
    ),
  },
  {
    to: "/availability",
    label: "Products",
    hint: "Browse every shelf",
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
  },
  {
    to: "/reminder-queue",
    label: "My List",
    hint: "Your shopping list",
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6"  x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6"  x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/>
        <line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
];

/* extra items shown only when authenticated */
const CUSTOMER_EXTRA = {
  to: "/orders",
  label: "My Orders",
  hint: "Order history",
  icon: (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
};
const ADMIN_EXTRAS = [
  {
    to: "/admin/hardware",
    label: "Hardware",
    hint: "Manage devices",
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    to: "/admin/carts",
    label: "Carts",
    hint: "Trolley management",
    icon: (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────
   ICON HELPERS
───────────────────────────────────────── */
const IMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6"  x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const IClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6"  x2="6"  y2="18"/>
    <line x1="6"  y1="6"  x2="18" y2="18"/>
  </svg>
);
const ILogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 5 7 7-7 7"/>
  </svg>
);

/* ═══════════════════════════════════════════
   NAVBAR COMPONENT
═══════════════════════════════════════════ */
export default function Navbar({ isAuth, user, onLogout, listCount = 0 }) {
  const navigate  = useNavigate();
  const location  = useLocation();

  const slotRefs  = useRef([]);
  const railRef   = useRef(null);

  const [scrolled,  setScrolled]  = useState(false);
  const [open,      setOpen]      = useState(false);
  const [lit,       setLit]       = useState(false);   // spotlight power-on
  const [hover,     setHover]     = useState(null);
  const [geo,       setGeo]       = useState([]);       // {x, w} per slot
  const [logoutErr, setLogoutErr] = useState("");

  /* build the full item list depending on auth state */
  const items = [
    ...NAV_ITEMS,
    ...(isAuth && user?.role === "customer" ? [CUSTOMER_EXTRA] : []),
    ...(isAuth && user?.role === "admin"    ? ADMIN_EXTRAS : []),
  ];

  const activeIdx = items.findIndex(item =>
    location.pathname === item.to ||
    (item.to !== "/" && location.pathname.startsWith(item.to))
  );
  const targetIdx = hover !== null ? hover : activeIdx;

  /* ── power-on animation (slight delay so fonts load first) ── */
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setLit(true))
    );
    return () => cancelAnimationFrame(id);
  }, []);

  /* ── scroll detect ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── close mobile menu on navigation ── */
  useEffect(() => { setOpen(false); }, [location.pathname]);

  /* ── Esc closes mobile menu ── */
  useEffect(() => {
    if (!open) return;
    const h = e => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open]);

  /* ── measure sign positions so the spotlight can track them ── */
  useLayoutEffect(() => {
    const measure = () => {
      if (!railRef.current) return;
      setGeo(
        slotRefs.current.map(el => {
          if (!el) return { x: 0, w: 0 };
          const sign = el.querySelector(".gnav__sign");
          return {
            x: el.offsetLeft + el.offsetWidth / 2,
            w: sign ? sign.offsetWidth : el.offsetWidth,
          };
        })
      );
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready?.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [items.length, listCount]); // re-measure if items change

  /* ── gold-foil card tilt on pointer ── */
  const tiltCard = e => {
    const r  = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top)  / r.height;
    const s  = e.currentTarget.style;
    s.setProperty("--mx", `${px * 100}%`);
    s.setProperty("--my", `${py * 100}%`);
    s.setProperty("--rx", `${(0.5 - py) * 9}deg`);
    s.setProperty("--ry", `${(px - 0.5) * 12}deg`);
  };
  const untiltCard = e => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };

  /* ── logout ── */
  const handleLogout = async () => {
    setLogoutErr("");
    try {
      await onLogout();
      navigate("/");
    } catch (err) {
      setLogoutErr(err?.message || "Could not sign out.");
    }
  };

  /* ── spotlight position ── */
  const g     = targetIdx >= 0 ? geo[targetIdx] : null;
  const g0    = geo[0];
  const lampX = lit && g ? g.x : (g0?.x ?? 0);
  const lampW = lit && g ? g.w : (g0?.w ?? 100);
  const lampOn = Boolean(g || (targetIdx >= 0 && g0));

  /* ── class string helper ── */
  const navCls = [
    "gnav",
    scrolled ? "is-scrolled" : "",
    open     ? "is-open"     : "",
    lit      ? ""            : "is-dark",
  ].filter(Boolean).join(" ");

  return (
    <header className={navCls}>
      <div className="gnav__bg" aria-hidden="true"/>

      <div className="gnav__inner">

        {/* ══ BRAND ══ */}
        <button
          className="gnav__brand"
          onClick={() => navigate(isAuth ? "/home" : "/")}
          aria-label="GMR Smart Mart home">
          <span className="gnav__logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path className="gnav__layer gnav__layer--1" d="M12 3 3 8l9 5 9-5-9-5Z"/>
              <path className="gnav__layer gnav__layer--2" d="m3 13 9 5 9-5"/>
              <path className="gnav__layer gnav__layer--3" d="m3 17.5 9 5 9-5" opacity=".55"/>
            </svg>
          </span>
          <span className="gnav__name">
            GMR <em>Smart Mart</em>
          </span>
        </button>

        {/* ══ TRACK-LIT AISLE SIGNS ══ */}
        <nav
          className="gnav__rail"
          ref={railRef}
          aria-label="Main navigation"
          onMouseLeave={() => setHover(null)}>

          <span className="gnav__beam" aria-hidden="true"/>

          {items.map((item, i) => {
            const isActive = activeIdx === i;
            const isHot    = hover === i && !isActive;
            const slotCls  = [
              "gnav__slot",
              isActive ? "is-active" : "",
              isHot    ? "is-hot"    : "",
            ].filter(Boolean).join(" ");

            return (
              <button
                key={item.to}
                ref={el => { slotRefs.current[i] = el; }}
                className={slotCls}
                aria-current={isActive ? "page" : undefined}
                onMouseEnter={() => setHover(i)}
                onFocus={()     => setHover(i)}
                onBlur={()      => setHover(null)}
                onClick={() => navigate(item.to)}>
                <span className="gnav__sign">
                  <span className="gnav__glyph">{item.icon}</span>
                  <span className="gnav__label">{item.label}</span>
                  {item.to === "/reminder-queue" && listCount > 0 && (
                    <span className="gnav__sticker" aria-label={`${listCount} items`}>
                      {listCount > 9 ? "9+" : listCount}
                    </span>
                  )}
                  <span className="gnav__led" aria-hidden="true"/>
                </span>
              </button>
            );
          })}

          {/* ── Spotlight ── */}
          <span
            className={`gnav__lamp${lit ? "" : " is-off"}`}
            style={{
              transform: `translateX(${lampX}px)`,
              "--w": `${lampW}px`,
              opacity: lampOn ? 1 : 0,
            }}
            aria-hidden="true">
            <span className="gnav__lamp-mount"/>
            <span key={targetIdx} className="gnav__lamp-head"/>
            <span className="gnav__cone" style={{ opacity: lit && g ? 1 : 0 }}/>
          </span>
        </nav>

        {/* ══ RIGHT ACTIONS ══ */}
        <div className="gnav__actions">
          {isAuth ? (
            <>
              {/* user badge */}
              <span className="gnav__user">
                <span className="gnav__avatar">
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </span>
                <span>
                  <span className="gnav__user-name">
                    {user?.email?.split("@")[0]}
                  </span>
                  <span className={`gnav__user-role${user?.role === "admin" ? " admin-role" : ""}`}>
                    {user?.role}
                  </span>
                </span>
              </span>
              {/* sign out */}
              <button className="gnav__logout" onClick={handleLogout} title="Sign out">
                <ILogout/>
                <span>Sign out</span>
              </button>
            </>
          ) : (
            /* gold-foil membership card */
            <button
              className="gnav__card"
              onClick={() => navigate("/")}
              onMouseMove={tiltCard}
              onMouseLeave={untiltCard}
              aria-label="Sign in">
              <span className="gnav__chip" aria-hidden="true"/>
              <span>Sign In</span>
            </button>
          )}

          {/* hamburger (mobile) */}
          <button
            type="button"
            className="gnav__burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="gnav-sheet"
            onClick={() => setOpen(o => !o)}>
            <span className="gnav__burger-a"><IMenu/></span>
            <span className="gnav__burger-b"><IClose/></span>
          </button>
        </div>

        {/* ══ MOBILE STORE DIRECTORY SHEET ══ */}
        <div id="gnav-sheet" className="gnav__sheet" aria-hidden={!open}>
          <p className="gnav__sheet-title">Store directory</p>
          {items.map((item, i) => {
            const isActive = activeIdx === i;
            return (
              <button
                key={item.to}
                tabIndex={open ? 0 : -1}
                style={{ "--i": i }}
                className={`gnav__row${isActive ? " is-active" : ""}`}
                onClick={() => { navigate(item.to); setOpen(false); }}>
                <span className="gnav__tile">{item.icon}</span>
                <span className="gnav__row-text">
                  <strong>{item.label}</strong>
                  <small>{item.hint}</small>
                </span>
                <span className="gnav__leader" aria-hidden="true"/>
                <span className="gnav__dot"    aria-hidden="true"/>
              </button>
            );
          })}
          {isAuth && (
            <button
              className="gnav__row"
              tabIndex={open ? 0 : -1}
              style={{ "--i": items.length, marginTop: 8, borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: 14 }}
              onClick={handleLogout}>
              <span className="gnav__tile">
                <ILogout/>
              </span>
              <span className="gnav__row-text">
                <strong>Sign out</strong>
                <small>{user?.email}</small>
              </span>
              <span className="gnav__leader" aria-hidden="true"/>
              <span className="gnav__dot"    aria-hidden="true"/>
            </button>
          )}
        </div>

      </div>

      {/* error */}
      {logoutErr && (
        <p role="alert" style={{ margin:0, padding:"6px 20px", fontSize:13, color:"#b91c1c", background:"#fde8e8", textAlign:"center" }}>
          {logoutErr}
        </p>
      )}
    </header>
  );
}
