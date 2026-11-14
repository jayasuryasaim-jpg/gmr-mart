import React, {
  useState, useEffect, useRef, useCallback
} from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

/* ─────────────────────────────────────────────────────────────
   ICON COMPONENTS  (inline SVG, stroke-based)
───────────────────────────────────────────────────────────── */
const Icon = ({ d, d2, circle, children, ...props }) => (
  <svg
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" focusable="false"
    {...props}
  >
    {children}
  </svg>
);
const ICube    = (p) => <Icon {...p}><path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M3 7l9 5 9-5"/><path d="M12 12v10"/></Icon>;
const IMap     = (p) => <Icon {...p}><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14"/><path d="M15 6v14"/></Icon>;
const IBag     = (p) => <Icon {...p}><path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></Icon>;
const IList    = (p) => <Icon {...p}><path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4" cy="6" r=".5" fill="currentColor"/><circle cx="4" cy="12" r=".5" fill="currentColor"/><circle cx="4" cy="18" r=".5" fill="currentColor"/></Icon>;
const ICart    = (p) => <Icon {...p}><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 12h11l2-8H6"/></Icon>;
const IArrow   = (p) => <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6"/></Icon>;
const IScan    = (p) => <Icon {...p}><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M4 12h16"/></Icon>;
const IShield  = (p) => <Icon {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><polyline points="9 12 11 14 15 10"/></Icon>;
const ICheck   = (p) => <Icon {...p}><polyline points="5 12 9 16 19 7"/></Icon>;
const IBox     = (p) => <Icon {...p}><path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/></Icon>;
const ILeaf    = (p) => <Icon {...p}><path d="M12 7c-2-2-7-1-7 5 0 5 3 9 5 9 1 0 1.5-.5 2-.5s1 .5 2 .5c2 0 5-4 5-9 0-6-5-7-7-5z"/></Icon>;
const IDrop    = (p) => <Icon {...p}><path d="M12 3c0 0-7 7-7 12a7 7 0 0 0 14 0c0-5-7-12-7-12z"/></Icon>;
const IWheat   = (p) => <Icon {...p}><path d="M12 21V8"/><path d="M12 8c-3 0-4-2-4-4 3 0 4 2 4 4z"/><path d="M12 8c3 0 4-2 4-4-3 0-4 2-4 4z"/><path d="M12 14c-3 0-4-2-4-4 3 0 4 2 4 4z"/><path d="M12 14c3 0 4-2 4-4-3 0-4 2-4 4z"/></Icon>;

/* ─────────────────────────────────────────────────────────────
   QR CODE GENERATOR  (seeded PRNG → no external lib needed)
───────────────────────────────────────────────────────────── */
function buildQRPath(seed) {
  const N = 25;
  let s = seed | 0;
  const rand = () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 0xFFFFFFFF;
  };
  const inFinder = (x, y) =>
    [[0,0],[N-7,0],[0,N-7]].some(([a,b]) => x >= a-1 && x <= a+7 && y >= b-1 && y <= b+7);
  let d = "";
  const box = (ox, oy) => {
    for (let y = 0; y < 7; y++)
      for (let x = 0; x < 7; x++) {
        if ((x===0||y===0||x===6||y===6) || (x>1&&x<5&&y>1&&y<5))
          d += `M${ox+x} ${oy+y}h1v1h-1z`;
      }
  };
  box(0,0); box(N-7,0); box(0,N-7);
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++)
      if (!inFinder(x,y) && rand() > 0.5) d += `M${x} ${y}h1v1h-1z`;
  return d;
}

function QRCode({ seed = 7913 }) {
  const d = buildQRPath(seed);
  return (
    <svg viewBox={`0 0 25 25`} shapeRendering="crispEdges" style={{ display:"block", width:"100%", height:"100%" }}>
      <path d={d} fill="#0b1f4b" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   HERO CANVAS  (drifting supermarket shelves)
───────────────────────────────────────────────────────────── */
const PALETTE  = ["#1647a8","#3f7fe0","#0b1f4b","#7aa7ea","#2a62c9","#c0d8f8","#4a7fcf"];
const SHAPES   = ["bottle","can","box","jar","bag"];

function useHeroCanvas(heroRef, canvasRef) {
  const reduced = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  useEffect(() => {
    const hero   = heroRef.current;
    const canvas = canvasRef.current;
    if (!hero || !canvas || reduced) return;
    const ctx = canvas.getContext("2d");
    const rn  = (a,b) => a + Math.random() * (b - a);

    let W=0, H=0, rows=[], trolleyX=-180, running=false, rafId=null;

    function makeRow(rowH, canvasW) {
      const items=[]; let x=0;
      const count = Math.ceil((canvasW * 1.6) / (rowH * 0.5)) + 6;
      for (let i=0; i<count; i++) {
        const shape = SHAPES[Math.floor(Math.random()*SHAPES.length)];
        const w = rowH * rn(0.30,0.54);
        const h = rowH * rn(0.60,1.00);
        items.push({ shape, x, w, h, color: PALETTE[Math.floor(Math.random()*PALETTE.length)] });
        x += w + rowH * rn(0.04,0.16);
      }
      return { items, totalW: x };
    }

    function resize() {
      const rect = hero.getBoundingClientRect();
      const dpr  = Math.min(devicePixelRatio || 1, 2);
      W = rect.width; H = rect.height;
      canvas.width  = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const numRows = H > 850 ? 5 : 4;
      rows = Array.from({ length: numRows }, (_,i) => {
        const depth = (i+1)/numRows;
        const rH    = 44 + depth * 56;
        const baseY = H * (0.11 + i * (0.82/numRows)) + rH;
        const speed = (i%2===0 ? 1 : -1) * (0.14 + depth * 0.24);
        return { ...makeRow(rH,W), rH, baseY, depth, offset: rn(0,500), speed };
      });
    }

    function drawItem(o, x, baseY) {
      const { w, h, shape, color } = o;
      ctx.fillStyle = color;
      ctx.beginPath();
      if (shape==="bottle") {
        const nw = w*.38;
        ctx.roundRect(x, baseY-h*.72, w, h*.72, 5);
        ctx.roundRect(x+(w-nw)/2, baseY-h, nw, h*.3, 3);
      } else if (shape==="can") {
        ctx.roundRect(x, baseY-h*.78, w, h*.78, 5);
      } else if (shape==="jar") {
        ctx.roundRect(x, baseY-h*.65, w, h*.65, 7);
        ctx.roundRect(x+2, baseY-h*.76, w-4, h*.13, 3);
      } else if (shape==="bag") {
        ctx.moveTo(x,baseY); ctx.lineTo(x+w*.09,baseY-h*.9);
        ctx.lineTo(x+w*.91,baseY-h*.9); ctx.lineTo(x+w,baseY); ctx.closePath();
      } else {
        ctx.roundRect(x, baseY-h, w, h, 3);
      }
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillRect(x+w*.14, baseY-h*.52, w*.72, h*.15);
    }

    function drawScene() {
      ctx.clearRect(0,0,W,H);
      const pY = window.scrollY * 0.11;
      rows.forEach(row => {
        const by    = row.baseY - pY * row.depth;
        const alpha = 0.18 + row.depth * 0.22;
        ctx.globalAlpha = alpha;
        row.items.forEach(item => {
          let x = ((item.x + row.offset) % row.totalW + row.totalW) % row.totalW - row.rH;
          if (x < W + 80) drawItem(item, x, by);
          x -= row.totalW;
          if (x + item.w > -20) drawItem(item, x, by);
        });
        ctx.globalAlpha = 1;
        const sg = ctx.createLinearGradient(0,by,0,by+18);
        sg.addColorStop(0,"rgba(11,31,75,0.32)"); sg.addColorStop(1,"rgba(11,31,75,0)");
        ctx.fillStyle = sg; ctx.fillRect(0,by,W,18);
        ctx.fillStyle = `rgba(11,31,75,${0.26+row.depth*0.2})`; ctx.fillRect(0,by-1,W,2.5);
      });
      // trolley
      if (rows.length > 0) {
        const bot = rows[rows.length-1];
        const ty  = bot.baseY - pY*bot.depth - 28;
        const bobY = Math.sin(trolleyX/38)*2;
        ctx.save(); ctx.globalAlpha = 0.7;
        ctx.translate(trolleyX, ty+bobY); ctx.scale(5.4,5.4); ctx.translate(-12,-12);
        ctx.strokeStyle="rgba(11,31,75,0.72)"; ctx.fillStyle="rgba(63,127,224,0.32)";
        ctx.lineWidth=1.1; ctx.lineCap="round"; ctx.lineJoin="round";
        ctx.fillRect(7,8,3,6); ctx.fillRect(11,6,3,8); ctx.fillRect(15,9,3,5);
        ctx.beginPath();
        ctx.arc(9,20,1.5,0,Math.PI*2); ctx.arc(18,20,1.5,0,Math.PI*2); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(2,3); ctx.lineTo(5,3); ctx.lineTo(7.5,15);
        ctx.lineTo(18.5,15); ctx.lineTo(20.5,7); ctx.lineTo(6,7); ctx.stroke();
        ctx.restore();
      }
    }

    function step() {
      if (!running) return;
      rows.forEach(r => r.offset += r.speed);
      trolleyX += 1.1;
      if (trolleyX > W + 170) trolleyX = -170;
      drawScene(); rafId = requestAnimationFrame(step);
    }

    function startAnim(on) {
      running = on && !document.hidden;
      cancelAnimationFrame(rafId);
      if (running) step();
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", drawScene, { passive:true });

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(([e]) => startAnim(e.isIntersecting));
      io.observe(hero);
      document.addEventListener("visibilitychange", () =>
        startAnim(hero.getBoundingClientRect().bottom > 0)
      );
      return () => {
        io.disconnect();
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", drawScene);
      };
    } else {
      startAnim(true);
      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", drawScene);
      };
    }
  }, []); // eslint-disable-line
}

/* ─────────────────────────────────────────────────────────────
   DIRECTION-AWARE REVEAL HOOK
───────────────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    const els = document.querySelectorAll(".gmr-reveal");
    if (reduced) { els.forEach(el => el.classList.add("in")); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const el = entry.target;
        if (entry.isIntersecting) {
          el.classList.remove("out-up");
          el.classList.add("in");
        } else {
          el.classList.remove("in");
          el.classList.toggle("out-up", entry.boundingClientRect.top < 0);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─────────────────────────────────────────────────────────────
   SCROLL DRIVER HOOK  (sheets + tour + scroll-prog)
───────────────────────────────────────────────────────────── */
function useScrollDriver({ sheetRefs, tourRef, bldgRef, floorCallback, dotCallback, progRef }) {
  useEffect(() => {
    let scheduled = false;
    function frame() {
      scheduled = false;
      const scrollY = window.scrollY;
      const docH    = document.documentElement.scrollHeight - window.innerHeight;
      const vh      = window.innerHeight;

      // scroll progress bar
      if (progRef.current) {
        const pct = docH > 0 ? (scrollY / docH) : 0;
        progRef.current.style.transform = `scaleX(${pct.toFixed(4)})`;
      }

      // stacked sheet scale/dim
      const sheets = sheetRefs.current || [];
      sheets.forEach((sheet, i) => {
        const next = sheets[i+1];
        if (!next || !sheet) return;
        const nextTop   = next.getBoundingClientRect().top;
        const stickyTop = parseFloat(getComputedStyle(next).top) || 0;
        const h         = sheet.offsetHeight;
        const q         = Math.min(1, Math.max(0, 1 - (nextTop - stickyTop) / h));
        sheet.style.setProperty("--s", (1 - 0.045 * q).toFixed(4));
        sheet.style.setProperty("--b", (1 - 0.10  * q).toFixed(3));
      });

      // pinned 3D tour
      const tourEl = tourRef.current;
      if (tourEl && bldgRef.current) {
        const rect = tourEl.getBoundingClientRect();
        const p    = Math.min(1, Math.max(0, -rect.top / (rect.height - vh)));
        const f    = Math.min(2, Math.floor(p * 3 + 0.0001) | 0);
        bldgRef.current.style.setProperty("--spin", ((p - 0.5) * 52).toFixed(1));
        dotCallback(p);
        floorCallback(f);
      }
    }
    function onScroll() {
      if (!scheduled) { scheduled = true; requestAnimationFrame(frame); }
    }
    window.addEventListener("scroll", onScroll, { passive:true });
    window.addEventListener("resize", frame);
    frame();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", frame);
    };
  }, []); // eslint-disable-line
}

/* ─────────────────────────────────────────────────────────────
   COUNT-UP HOOK
───────────────────────────────────────────────────────────── */
function useCountUp(target, start = false) {
  const [val, setVal] = useState(0);
  const ran = useRef(false);
  useEffect(() => {
    if (!start || ran.current) return;
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) {
      setVal(target); return;
    }
    ran.current = true;
    const dur = 1700, t0 = performance.now();
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [start, target]);
  return val;
}

/* ─────────────────────────────────────────────────────────────
   LIST TICK-OFF
───────────────────────────────────────────────────────────── */
const LIST_DATA = [
  { name: "Basmati Rice · 5 kg",   price: 640 },
  { name: "Toned Milk · 1 L",      price: 56  },
  { name: "Fresh Tomatoes · 1 kg", price: 42  },
  { name: "Olive Oil · 500 ml",    price: 549 },
];
function useListCycle() {
  const [done, setDone] = useState([]);
  const reduced = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  useEffect(() => {
    if (reduced) { setDone([0, 1, 2, 3]); return; }
    let k = 0;
    const id = setInterval(() => {
      if (k > LIST_DATA.length + 1) {
        k = 0;
        setDone([]);          // reset first, fresh cycle starts next tick
      } else if (k < LIST_DATA.length) {
        const idx = k;        // capture before increment
        setDone(prev => prev.includes(idx) ? prev : [...prev, idx]);
      }
      k++;
    }, 1350);
    return () => clearInterval(id);
  }, []); // eslint-disable-line
  // Guard: only sum indices that are valid LIST_DATA positions
  const total = done.reduce((s, i) => {
    const item = LIST_DATA[i];
    return item ? s + item.price : s;
  }, 0);
  return { done, total };
}

/* ─────────────────────────────────────────────────────────────
   STRIP DATA
───────────────────────────────────────────────────────────── */
const STRIP_ITEMS = [
  "Live inventory","Smart trolleys active","Three shopping floors",
  "Scan · Shop · Go","Real-time store map","AI-powered navigation",
];
const CAT_ITEMS = [
  "Fresh Produce","Dairy & Eggs","Bakery","Beverages",
  "Staples & Grains","Snacks & Confectionery","Personal Care",
  "Household","Frozen Foods","Organic Range",
];

/* ═══════════════════════════════════════════════════════════
   HOME COMPONENT
═══════════════════════════════════════════════════════════ */
export default function Home() {
  const navigate = useNavigate();

  /* refs */
  const heroRef    = useRef(null);
  const canvasRef  = useRef(null);
  const progRef    = useRef(null);
  const sheetRefs  = useRef([]);
  const tourRef    = useRef(null);
  const bldgRef    = useRef(null);

  /* tour state */
  const [floor, setFloor]   = useState(0);
  const [dotP,  setDotP]    = useState(0);
  const lastFloor = useRef(-1);
  const dotCallback = useCallback(p => setDotP(p), []);
  const floorCallback = useCallback(f => {
    if (f !== lastFloor.current) { lastFloor.current = f; setFloor(f); }
  }, []);

  /* ribbon count-up — fires once ribbon is visible */
  const ribbonRef  = useRef(null);
  const [ribbonVis, setRibbonVis] = useState(false);
  const count500   = useCountUp(500, ribbonVis);
  useEffect(() => {
    const el = ribbonRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setRibbonVis(true); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* scroll-driven logic */
  useScrollDriver({ sheetRefs, tourRef, bldgRef, floorCallback, dotCallback, progRef });

  /* hero canvas */
  useHeroCanvas(heroRef, canvasRef);

  /* direction-aware reveal */
  useReveal();

  /* list animation */
  const { done: listDone, total: listTotal } = useListCycle();

  /* ── render ── */
  const floorTexts = [
    {
      h: <>3D Virtual <em>Store Tour</em><br />Ground floor</>,
      p: "Walk through GMR Smart Mart in an immersive 3D environment. Start with groceries and fresh produce before you even step inside.",
    },
    {
      h: <>Every aisle, <em>first floor</em></>,
      p: "Household goods and personal care, laid out aisle by aisle. Explore every section and plan your route in advance.",
    },
    {
      h: <>Upper floor, <em>lifestyle</em></>,
      p: "Lifestyle and electronics on the top level. Explore every floor and section, then walk in knowing exactly where to go.",
    },
  ];

  return (
    <div className="gmr-home">

      {/* ════════════════════════════════
          TICKER STRIP
      ════════════════════════════════ */}
      <div className="gmr-strip" aria-label="Live store updates">
        <div className="gmr-strip-track" aria-hidden="true">
          {[...STRIP_ITEMS, ...STRIP_ITEMS].map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════
          SCROLL PROGRESS BAR
          (injected under the app Navbar)
      ════════════════════════════════ */}
      <div
        style={{
          position: "fixed", top: 68, left: 0, right: 0, height: 2.5,
          background: "rgba(11,31,75,.1)", zIndex: 79, pointerEvents: "none",
        }}
      >
        <div
          ref={progRef}
          style={{
            height: "100%", background: "linear-gradient(90deg,#3f7fe0,#1647a8)",
            transformOrigin: "left", transform: "scaleX(0)", willChange: "transform",
          }}
        />
      </div>

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <section
        className="gmr-hero"
        id="home"
        ref={heroRef}
        aria-labelledby="hero-heading"
      >
        <canvas ref={canvasRef} className="gmr-hero-canvas" aria-hidden="true" />
        <div className="gmr-hero-veil" aria-hidden="true" />
        <div className="gmr-hero-laser" aria-hidden="true" />

        <div className="gmr-wrap gmr-hero-in">
          <span className="gmr-kicker gmr-reveal" style={{ "--d":"0s" }}>
            GMR Smart Mart · AI-powered retail
          </span>

          <h1 id="hero-heading">
            <span className="gmr-hero-line"><span>The smarter</span></span>
            <span className="gmr-hero-line"><span>way to</span></span>
            <span className="gmr-hero-line"><span><em>shop in-store</em></span></span>
          </h1>

          <svg
            className="gmr-flourish"
            viewBox="0 0 440 20"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M4 11 C 72 2, 148 17, 220 10 S 368 3, 436 11" />
          </svg>

          <p className="gmr-hero-sub gmr-reveal" style={{ "--d":".2s" }}>
            Navigate, scan, browse and check out seamlessly with our IoT-enabled
            smart cart system and real-time inventory platform.
          </p>

          <div className="gmr-cta-row gmr-reveal" style={{ "--d":".32s" }}>
            <button
              className="gmr-btn gmr-btn-navy"
              onClick={() => navigate("/availability")}
            >
              <IBag style={{ width:17,height:17 }} />
              Browse Products
              <IArrow className="gmr-go" style={{ width:17,height:17 }} />
            </button>
            <button
              className="gmr-btn gmr-btn-line"
              onClick={() => navigate("/heatmap")}
            >
              <IMap style={{ width:17,height:17 }} />
              View Store Map
            </button>
            <button
              className="gmr-btn gmr-btn-azure"
              onClick={() => navigate("/3d-mart")}
            >
              <ICube style={{ width:17,height:17 }} />
              Explore in 3D
              <span className="gmr-new-badge">NEW</span>
            </button>
          </div>

          {/* Stats ribbon */}
          <div
            className="gmr-ribbon gmr-reveal"
            style={{ "--d":".22s" }}
            ref={ribbonRef}
            aria-label="Key statistics"
          >
            <div className="gmr-rb">
              <div className="gmr-num">
                <span>{ribbonVis ? count500 : 0}</span>
                <sup>+</sup>
              </div>
              <div className="gmr-lbl">Products in stock</div>
            </div>
            <div className="gmr-rb">
              <div className="gmr-num">3</div>
              <div className="gmr-lbl">Shopping floors</div>
            </div>
            <div className="gmr-rb">
              <div className="gmr-num">
                24<sup style={{ fontSize:".58em",color:"#8fb4ee",margin:"0 2px" }}>/</sup>7
              </div>
              <div className="gmr-lbl">Live inventory</div>
            </div>
            <div className="gmr-rb">
              <div className="gmr-num">IoT</div>
              <div className="gmr-lbl">Smart trolleys</div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          CATEGORY TICKER
      ════════════════════════════════ */}
      <div className="gmr-cat-ticker" aria-hidden="true">
        <div className="gmr-cat-track">
          {[...CAT_ITEMS, ...CAT_ITEMS].map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════
          FEATURES — stacked sheets
      ════════════════════════════════ */}
      <section className="gmr-features" id="features" aria-labelledby="features-heading">
        <div className="gmr-wrap">
          <div className="gmr-section-head">
            <span className="gmr-kicker gmr-reveal">Features</span>
            <h2
              className="gmr-section-title gmr-reveal"
              id="features-heading"
              style={{ "--d":".09s" }}
            >
              Everything you need to <em>shop smarter</em>
            </h2>
            <p className="gmr-section-lede gmr-reveal" style={{ "--d":".18s" }}>
              One unified platform connecting navigation, inventory, smart carts and checkout.
            </p>
          </div>

          <div className="gmr-stack">

            {/* Sheet 1 — Store Map */}
            <article
              className="gmr-sheet gmr-s1"
              id="map"
              style={{ "--n":0 }}
              ref={el => { sheetRefs.current[0] = el; }}
            >
              <div className="gmr-sheet-txt">
                <span className="gmr-sheet-tag">
                  <IMap style={{ width:20,height:20 }} /> Navigate
                </span>
                <h3>Interactive <em>Store Map</em></h3>
                <p>Navigate every aisle with our real-time crowd heatmap and AI-powered zone routing. Find any product in seconds.</p>
                <button
                  className="gmr-sheet-more"
                  onClick={() => navigate("/heatmap")}
                >
                  Open Map <IArrow style={{ width:17,height:17 }} />
                </button>
              </div>
              <div className="gmr-sheet-vis" aria-label="Store map preview">
                <svg className="gmr-map-svg" viewBox="0 0 400 300">
                  <defs>
                    <radialGradient id="heat1"><stop offset="0%" stopColor="#3f7fe0" stopOpacity=".6"/><stop offset="100%" stopColor="#3f7fe0" stopOpacity="0"/></radialGradient>
                    <radialGradient id="heat2"><stop offset="0%" stopColor="#1647a8" stopOpacity=".5"/><stop offset="100%" stopColor="#1647a8" stopOpacity="0"/></radialGradient>
                  </defs>
                  <rect x="12" y="12" width="376" height="276" rx="11" fill="#fff" stroke="#0b1f4b" strokeOpacity=".2" strokeWidth="1.5"/>
                  <g fill="#cfe0fa" stroke="#1647a8" strokeOpacity=".3" strokeWidth="1">
                    <rect x="56" y="52" width="30" height="156" rx="4"/>
                    <rect x="130" y="52" width="30" height="156" rx="4"/>
                    <rect x="204" y="80" width="30" height="156" rx="4"/>
                    <rect x="278" y="52" width="30" height="156" rx="4"/>
                    <rect x="56" y="232" width="124" height="26" rx="4"/>
                    <rect x="318" y="234" width="52" height="26" rx="4"/>
                  </g>
                  <circle cx="145" cy="128" r="68" fill="url(#heat1)"/>
                  <circle cx="293" cy="148" r="56" fill="url(#heat2)"/>
                  <circle cx="220" cy="202" r="44" fill="url(#heat1)" opacity=".7"/>
                  <path className="gmr-aisle-route" d="M34 272 V42 H116 V224 H188 V58 H258 V224 H328 V42"/>
                  <circle cx="34" cy="272" r="8" fill="#0b1f4b" opacity=".9"/>
                  <circle className="gmr-map-pulse" cx="328" cy="42" r="10" fill="#3f7fe0" opacity=".6"/>
                  <circle cx="328" cy="42" r="9" fill="#1647a8" stroke="#fff" strokeWidth="3"/>
                </svg>
                <span className="gmr-vis-cap" aria-hidden="true">Sample floor plan</span>
              </div>
            </article>

            {/* Sheet 2 — Products */}
            <article
              className="gmr-sheet gmr-s2"
              id="products"
              style={{ "--n":1 }}
              ref={el => { sheetRefs.current[1] = el; }}
            >
              <div className="gmr-sheet-txt">
                <span className="gmr-sheet-tag">
                  <IBag style={{ width:20,height:20 }} /> Discover
                </span>
                <h3>Browse <em>Products</em></h3>
                <p>Explore real-time inventory across all floors. Filter by category, check live stock and find the best deals.</p>
                <button
                  className="gmr-sheet-more"
                  onClick={() => navigate("/availability")}
                >
                  Shop Now <IArrow style={{ width:17,height:17 }} />
                </button>
              </div>
              <div className="gmr-sheet-vis" aria-label="Product categories preview">
                <div className="gmr-chips">
                  {[
                    { icon: <ILeaf style={{ width:18,height:18 }} />, name:"Fresh Produce", w:"86%" },
                    { icon: <IDrop style={{ width:18,height:18 }} />, name:"Dairy & Eggs",   w:"64%" },
                    { icon: <IWheat style={{ width:18,height:18 }} />, name:"Staples & Grains", w:"92%" },
                    { icon: <IBox  style={{ width:18,height:18 }} />, name:"Household",      w:"48%" },
                  ].map((chip, i) => (
                    <div className="gmr-chip" key={i}>
                      <div className="gmr-chip-name">{chip.icon}{chip.name}</div>
                      <div className="gmr-stock-bar">
                        <i style={{ "--w": chip.w }} />
                      </div>
                      <small>{chip.w} in stock</small>
                    </div>
                  ))}
                </div>
                <span className="gmr-vis-cap" aria-hidden="true">Live inventory view</span>
              </div>
            </article>

            {/* Sheet 3 — Smart Cart */}
            <article
              className="gmr-sheet gmr-s3"
              id="smartcart"
              style={{ "--n":2 }}
              ref={el => { sheetRefs.current[2] = el; }}
            >
              <div className="gmr-sheet-txt">
                <span className="gmr-sheet-tag">
                  <ICart style={{ width:20,height:20 }} /> Check out
                </span>
                <h3>Smart <em>Cart</em></h3>
                <p>Scan the trolley QR code and let our IoT system automatically track every item you place in your cart.</p>
                <button
                  className="gmr-sheet-more"
                  onClick={() => navigate("/scan-cart")}
                >
                  Scan Trolley <IArrow style={{ width:17,height:17 }} />
                </button>
              </div>
              <div className="gmr-sheet-vis" aria-label="Smart cart session preview">
                <div className="gmr-cart-vis">
                  <div className="gmr-qr-box">
                    <QRCode seed={7913} />
                    <span className="gmr-qr-line" aria-hidden="true" />
                  </div>
                  <div className="gmr-sess">
                    <div><ICart style={{ width:18,height:18 }} />Trolley T-07</div>
                    <div><span className="gmr-active-dot" aria-hidden="true" />Session active</div>
                    <div><IShield style={{ width:18,height:18 }} />Authenticated</div>
                  </div>
                </div>
                <span className="gmr-vis-cap" aria-hidden="true">Sample session</span>
              </div>
            </article>

            {/* Sheet 4 — My List */}
            <article
              className="gmr-sheet gmr-s4"
              id="mylist"
              style={{ "--n":3 }}
              ref={el => { sheetRefs.current[3] = el; }}
            >
              <div className="gmr-sheet-txt">
                <span className="gmr-sheet-tag">
                  <IList style={{ width:20,height:20 }} /> Plan
                </span>
                <h3>My Shopping <em>List</em></h3>
                <p>Save items to your personal list, set quantities and track your estimated total before you even arrive at checkout.</p>
                <button
                  className="gmr-sheet-more"
                  onClick={() => navigate("/reminder-queue")}
                >
                  View My List <IArrow style={{ width:17,height:17 }} />
                </button>
              </div>
              <div className="gmr-sheet-vis" aria-label="Shopping list preview">
                <div className="gmr-list-vis">
                  {LIST_DATA.map((item, i) => (
                    <div
                      className={`gmr-list-item${listDone.includes(i) ? " done" : ""}`}
                      key={i}
                    >
                      <span className="gmr-check-box">
                        <ICheck style={{ width:14,height:14 }} />
                      </span>
                      <span className="gmr-item-name">{item.name}</span>
                      <span className="gmr-item-price">₹&nbsp;{item.price}</span>
                    </div>
                  ))}
                  <div className="gmr-list-total">
                    <small>Estimated cost</small>
                    <strong>₹&nbsp;{listTotal.toLocaleString("en-IN")}</strong>
                  </div>
                </div>
                <span className="gmr-vis-cap" aria-hidden="true">Sample list</span>
              </div>
            </article>

          </div>{/* /stack */}
        </div>
      </section>

      {/* ════════════════════════════════
          3D TOUR — PINNED
      ════════════════════════════════ */}
      <section
        className="gmr-tour"
        id="tour"
        ref={tourRef}
        aria-labelledby="tour-heading"
      >
        <div className="gmr-tour-pin">
          <div className="gmr-wrap">
            <div className="gmr-tour-grid">

              <div style={{ position:"relative" }}>
                <span
                  className="gmr-big-floor"
                  aria-hidden="true"
                >
                  F{floor + 1}
                </span>
                <span className="gmr-kicker gmr-kicker-light left" style={{ color:"#a9c8ff",position:"relative" }}>
                  3D experience
                </span>

                <div className="gmr-floor-texts">
                  {floorTexts.map((ft, i) => (
                    <div
                      key={i}
                      className={[
                        "gmr-floor-txt",
                        floor === i ? "on" : "",
                        floor  >  i ? "past" : "",
                      ].filter(Boolean).join(" ")}
                    >
                      <h2 id={i === 0 ? "tour-heading" : undefined}>{ft.h}</h2>
                      <p>{ft.p}</p>
                    </div>
                  ))}
                </div>

                <div className="gmr-floor-dots">
                  <span>F1</span>
                  <span
                    className="gmr-dot-bar"
                    style={{ "--f": Math.min(1, Math.max(0, dotP * 3)).toFixed(3) }}
                  />
                  <span>F2</span>
                  <span
                    className="gmr-dot-bar"
                    style={{ "--f": Math.min(1, Math.max(0, dotP * 3 - 1)).toFixed(3) }}
                  />
                  <span>F3</span>
                </div>

                <div className="gmr-tour-btn">
                  <button
                    className="gmr-btn gmr-btn-white"
                    onClick={() => navigate("/3d-mart")}
                  >
                    <ICube style={{ width:17,height:17 }} />
                    Enter 3D Mart
                    <IArrow className="gmr-go" style={{ width:17,height:17 }} />
                  </button>
                </div>
              </div>

              {/* Isometric building */}
              <div className="gmr-iso" aria-hidden="true">
                <div
                  className="gmr-bldg"
                  ref={bldgRef}
                  style={{ "--spin": 0 }}
                >
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className={`gmr-slab${floor === i ? " on" : ""}`}
                      style={{ "--i": i, "--lift": floor === i ? "38px" : "0px" }}
                    >
                      <div className="gmr-slab-lines" />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          CTA — ACTIVATE SMART CART
      ════════════════════════════════ */}
      <section className="gmr-cta" id="cart" aria-labelledby="cta-heading">
        <div className="gmr-wrap">
          <div className="gmr-cta-grid">
            <div>
              <span
                className="gmr-kicker gmr-reveal"
                style={{ "--d":"0s", color:"#a9c8ff" }}
              >
                Smart trolley system
              </span>
              <h2
                id="cta-heading"
                className="gmr-reveal"
                style={{ "--d":".09s" }}
              >
                Activate your <em>smart cart</em>
              </h2>
              <p
                className="gmr-cta-desc gmr-reveal"
                style={{ "--d":".18s" }}
              >
                Scan the QR code on any GMR trolley to start an authenticated session.
                Items are tracked automatically as you shop.
              </p>
              <div
                className="gmr-cta-row-left gmr-reveal"
                style={{ "--d":".26s" }}
              >
                <button
                  className="gmr-btn gmr-btn-white"
                  onClick={() => navigate("/scan-cart")}
                >
                  <IScan style={{ width:17,height:17 }} />
                  Start Scanning
                </button>
                <button
                  className="gmr-btn gmr-btn-outline-w"
                  onClick={() => navigate("/rules")}
                >
                  <IShield style={{ width:17,height:17 }} />
                  Read Policies
                </button>
              </div>
              <div
                className="gmr-flow gmr-reveal"
                style={{ "--d":".34s" }}
              >
                <span>Scan</span>
                <IArrow style={{ width:15,height:15 }} />
                <span>Shop</span>
                <IArrow style={{ width:15,height:15 }} />
                <span>Check out</span>
              </div>
            </div>

            <div className="gmr-arch-wrap gmr-reveal" style={{ "--d":".16s" }} aria-hidden="true">
              <span className="gmr-spin-ring r1" />
              <span className="gmr-spin-ring r2" />
              <div className="gmr-arch">
                <div className="gmr-arch-inner">
                  <div className="gmr-qr-box">
                    <QRCode seed={2347} />
                    <span className="gmr-qr-line" />
                  </div>
                  <small>Scan to begin</small>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FOOTER
      ════════════════════════════════ */}
      <footer className="gmr-footer">
        <div className="gmr-wrap">
          <div className="gmr-footer-grid">
            <div className="gmr-footer-brand">
              <strong>GMR <em>Smart Mart</em></strong>
              <p>An AI-powered, IoT-enabled retail experience. Navigate, scan, browse and check out — all in one place.</p>
            </div>
            <div>
              <h4>Explore</h4>
              <ul>
                <li><button onClick={() => navigate("/3d-mart")}>3D Mart</button></li>
                <li><button onClick={() => navigate("/heatmap")}>Store Map</button></li>
                <li><button onClick={() => navigate("/availability")}>Products</button></li>
                <li><button onClick={() => navigate("/reminder-queue")}>My List</button></li>
              </ul>
            </div>
            <div>
              <h4>Smart Cart</h4>
              <ul>
                <li><button onClick={() => navigate("/scan-cart")}>Scan Trolley</button></li>
                <li><button onClick={() => navigate("/rules")}>Policies</button></li>
                <li><button onClick={() => navigate("/")}>Sign In</button></li>
              </ul>
            </div>
          </div>
          <div className="gmr-footer-legal">
            <span>© 2026 GMR Smart Mart. All rights reserved.</span>
            <span>Live inventory · Smart trolleys · Three floors</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
