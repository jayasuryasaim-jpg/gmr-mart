import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { useAuth } from '../auth/AuthProvider';
import './Stock.css';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const FL = { G:['Ground floor','Ground'], F:['First floor','First'], S:['Second floor','Second'] };

const HUE = {
  'Dairy':205,'Snacks':32,'Soft Drinks':8,'Personal Care':285,
  'Men':222,'Women':335,'Footwear':160,'Accessories':45,
  'Kitchen':18,'Home Essentials':175,'Toys':268,'Furniture':28,
};

const DEMO = [
  ['Amul',           'Amul Full Cream Milk 500ml',           'Dairy',           32,  35,   'G-A1','🥛'],
  ['Mother Dairy',   'Mother Dairy Curd 400g',               'Dairy',           45,  50,   'G-A2','🫙'],
  ['Amul',           'Amul Butter 500g',                     'Dairy',          220, 240,   'G-A1','🧈'],
  ["Lay's",          "Lay's Classic Salted 55g",             'Snacks',          20,   0,   'G-B1','🍟'],
  ['Parle',          'Parle-G Biscuits 800g',                'Snacks',          52,  60,   'G-B2','🍪'],
  ['Haldiram',       'Haldiram Bhujia 400g',                 'Snacks',         115, 130,   'G-B3','🍜'],
  ['Parle',          'Hide & Seek Choco Biscuits 300g',      'Snacks',          85,  95,   'G-B2','🍫'],
  ['Coca-Cola',      'Coca-Cola 2L Pet Bottle',              'Soft Drinks',     85,  95,   'G-C1','🥤'],
  ['Pepsi',          'Pepsi 2L Pet Bottle',                  'Soft Drinks',     82,  95,   'G-C1','🥤'],
  ['Coca-Cola',      'Minute Maid Pulpy Orange 1L',          'Soft Drinks',     65,  75,   'G-C2','🍊'],
  ['Dabur',          'Real Fruit Juice Mango 1L',            'Soft Drinks',    110, 125,   'G-C2','🥭'],
  ['H&S',            'Head & Shoulders Shampoo 340ml',       'Personal Care',  245, 285,   'G-D1','🧴'],
  ['Dove',           'Dove Moisturising Bar 100g',           'Personal Care',   58,  68,   'G-D2','🧼'],
  ['Colgate',        'Colgate MaxFresh Toothpaste 150g',     'Personal Care',   95, 105,   'G-D3','🪥'],
  ["Levi's",         "Levi's 511 Slim Jeans",                'Men',           2499,3999,   'F-A1','👖'],
  ['Arrow',          'Arrow Formal Shirt XL',                'Men',           1299,1799,   'F-A2','👔'],
  ['W',              'W Women Kurta Set M',                  'Women',         1099,1499,   'F-B1','👗'],
  ['Biba',           'Biba Anarkali Suit',                   'Women',         1899,2699,   'F-B2','👘'],
  ['Nike',           'Nike Air Max 270 White',               'Footwear',      8999,10999,  'F-C1','👟'],
  ['Puma',           'Puma Softride Running Shoes',          'Footwear',      3499,4999,   'F-C2','🏃'],
  ['Bata',           'Bata Formal Oxford Shoes',             'Footwear',      1999,2599,   'F-C3','👞'],
  ['Fastrack',       'Fastrack Chronograph Watch',           'Accessories',   2995,3495,   'F-D1','⌚'],
  ['Wildcraft',      'Wildcraft 40L Backpack Navy',          'Accessories',   1799,2499,   'F-D2','🎒'],
  ['Prestige',       'Prestige Pressure Cooker 5L',          'Kitchen',       1850,2200,   'S-A1','🍲'],
  ['Milton',         'Milton Thermosteel Flask 1L',          'Kitchen',        599, 750,   'S-A2','☕'],
  ['Hawkins',        'Hawkins Classic Cooker 3L',            'Kitchen',       1299,1599,   'S-A1','🍳'],
  ['Bombay Dyeing',  'Bombay Dyeing Bath Towel Set 2pc',     'Home Essentials', 549,699,   'S-B1','🛁'],
  ['Nilkamal',       'Nilkamal Plastic Chair White',         'Home Essentials', 899,1099,  'S-B2','🪑'],
  ['LEGO',           'LEGO Classic Creative Box 484pcs',     'Toys',          3499,3999,   'S-C1','🧱'],
  ['Funskool',       "Funskool Rubik's Cube 3×3",            'Toys',           299, 399,   'S-C2','🧩'],
  ['Kurl-On',        'Kurl-On Foam Mattress Queen 6"',       'Furniture',    12999,15999,  'S-D1','🛏'],
  ['Godrej',         'Godrej Interio Study Table',           'Furniture',     6499,7999,   'S-D2','📚'],
].map(([b,n,c,pr,m,a,e],i) => ({
  id: i, b, n, c, pr, m: m||0, a, e,
  f: a[0],
  d: m ? Math.round((1-pr/m)*100) : 0,
  st: i===2 ? 6 : (i*37+11)%88+12,
}));

const CATS = ['All categories','Dairy','Snacks','Soft Drinks','Personal Care',
              'Men','Women','Footwear','Accessories','Kitchen','Home Essentials','Toys','Furniture'];

const STORAGE_KEY = 'gmr-list';

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const rs   = n => '₹' + Number(n).toLocaleString('en-IN');
const es   = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const norm = s => s.toLowerCase().replace(/[\u2019']/g,"'");

function buildBarcode(id) {
  let x=0, r='';
  for (let i=0;i<34;i++) {
    const k=(id*7+i*13+i*i)%4+1;
    if (i%2===0) r+=`<rect x="${x}" width="${k>3?2.4:k>1?1.6:1}" height="24"/>`;
    x+=k>3?3.6:k>1?2.8:2.2;
  }
  return { d: r, w: x };
}

function buildCoilRects() {
  return Array.from({length:7},(_,i)=>({
    x:14+i*11, y:12+i*8, w:172-i*22, h:102-i*16, rx:16-i,
  }));
}

/* ─────────────────────────────────────────────
   ICON (inline SVG, all stroke-based)
───────────────────────────────────────────── */
const Ico = ({d,d2,d3,children,...p}) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" {...p}>
    {children}
  </svg>
);
const ISearch = p=><Ico {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></Ico>;
const IHeart  = p=><Ico {...p}><path d="M12 21s-8-4.9-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.1-8 11-8 11z"/></Ico>;
const IArrow  = p=><Ico {...p}><path d="M5 12h14M13 6l6 6-6 6"/></Ico>;
const ILeft   = p=><Ico {...p}><path d="m15 5-7 7 7 7"/></Ico>;
const IRight  = p=><Ico {...p}><path d="m9 5 7 7-7 7"/></Ico>;
const IList   = p=><Ico {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></Ico>;
const IX      = p=><Ico {...p}><path d="M6 6l12 12M18 6 6 18"/></Ico>;
const ITag    = p=><Ico {...p}><path d="m20.6 13.4-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8zM7.5 7.5h.01"/></Ico>;
const INav    = p=><Ico {...p}><path d="m3 11 18-8-8 18-2-8z"/></Ico>;
const IInfo   = p=><Ico {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></Ico>;
const ICheck  = p=><Ico {...p}><polyline points="20 6 9 17 4 12"/></Ico>;

/* ─────────────────────────────────────────────
   STORE MAP
───────────────────────────────────────────── */
function MapSvg({ p, animKey }) {
  const codes = {};
  DEMO.filter(x=>x.f===p.f).forEach(x=>{codes[x.a]=1;});
  const cells=[], txRef={x:0,y:0};
  'ABCD'.split('').forEach((z,ci)=>{
    [1,2,3].forEach((n,ri)=>{
      const k=`${p.f}-${z}${n}`, x=20+ci*68, y=14+ri*48, t=(k===p.a);
      if(t){txRef.x=x;txRef.y=y;}
      cells.push({k,x,y,t,h:!!codes[k]});
    });
  });
  const {x:tx,y:ty}=txRef;
  const gx=tx+64>284?tx-4:tx+64;
  const cy=ty+20, cx=tx+30;
  return (
    <svg key={animKey} className="map" viewBox="0 0 304 214"
      role="img" aria-label={`Store map, aisle ${p.a}`}>
      {cells.map(({k,x,y,t,h})=>(
        <g key={k}>
          <rect className={`cell${t?' target':h?' h':''}`} x={x} y={y} width="60" height="40" rx="7"/>
          <text x={x+30} y={y+24}>{k.slice(2)}</text>
        </g>
      ))}
      <rect x="122" y="196" width="60" height="14" rx="7" fill="var(--ink)"/>
      <text x="152" y="206" style={{fill:'var(--bg)'}}>Entrance</text>
      <path className="sp-route" pathLength="1" d={`M152 194V164H${gx}V${cy}H${cx}`}/>
      <circle className="sp-pulse" cx={cx} cy={cy} r="8"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function StockPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  /* ── filter state ── */
  const [q,     setQ]     = useState('');
  const [floor, setFloor] = useState('all');
  const [cat,   setCat]   = useState('All categories');
  const [sale,  setSale]  = useState(false);
  const [sort,  setSort]  = useState('def');

  /* ── product state ── */
  const [products, setProducts] = useState(DEMO);
  const [isDemo,   setIsDemo]   = useState(true);
  const [fresh,    setFresh]    = useState(true);

  /* ── list (saved items) ── */
  const [listIds, setListIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]').filter(i=>DEMO[i]); }
    catch { return []; }
  });

  /* ── detail ── */
  const [detailId,  setDetailId]  = useState(null);
  const [mapKey,    setMapKey]    = useState(0);

  /* ── drawer ── */
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* ── toast ── */
  const [toastMsg,  setToastMsg]  = useState('');
  const [toastShow, setToastShow] = useState(false);
  const toastTimer = useRef(null);

  /* ── save list to localStorage ── */
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(listIds)); }
    catch {}
  }, [listIds]);

  /* ── load products from API ── */
  useEffect(() => {
    const ctrl = new AbortController();
    apiRequest('/api/v1/products?limit=500', { signal: ctrl.signal })
      .then(res => {
        const items = res?.products;
        if (Array.isArray(items) && items.length > 0) {
          // Map live API shape to our internal shape
          const mapped = items.map((p,i) => ({
            id: i, b: p.brand||'', n: p.name||'', c: p.category||'',
            pr: +p.price||0, m: +p.mrp||0,
            a: p.location||'G-A1', e: p.emoji||'📦',
            f: (p.location||'G')[0], d: p.mrp ? Math.round((1-p.price/p.mrp)*100) : 0,
            st: p.stock || 50,
          }));
          setProducts(mapped); setIsDemo(false);
        }
      })
      .catch(() => { /* stay on demo */ })
      .finally(() => {});
    return () => ctrl.abort();
  }, []);

  /* ── toast helper ── */
  const toast = useCallback(msg => {
    setToastMsg(msg); setToastShow(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastShow(false), 2200);
  }, []);

  /* ── toggle saved list ── */
  const toggleList = useCallback(id => {
    setListIds(prev => {
      const k = prev.indexOf(id);
      if (k > -1) { toast('Removed from My List'); return prev.filter(x=>x!==id); }
      toast('Added to My List'); return [...prev, id];
    });
  }, [toast]);

  /* ── filter + sort ── */
  let result = products.filter(p =>
    (floor==='all' || p.f===floor) &&
    (cat==='All categories' || p.c===cat) &&
    (!sale || p.d>0) &&
    (!q || norm(`${p.n} ${p.b} ${p.c} ${p.a} ${FL[p.f]?.[0]||''}`).includes(norm(q)))
  );
  const fns = {
    asc:(a,b)=>a.pr-b.pr, desc:(a,b)=>b.pr-a.pr,
    az:(a,b)=>a.n.localeCompare(b.n), off:(a,b)=>b.d-a.d||a.id-b.id,
  };
  if (fns[sort]) result = result.slice().sort(fns[sort]);

  /* ── detail product ── */
  const dp = detailId !== null ? (products.find(p=>p.id===detailId)||null) : null;
  const seq = dp ? (result.some(p=>p.id===dp.id) ? result : products) : [];
  const dix = dp ? seq.findIndex(p=>p.id===dp.id) : -1;
  const goDetail = i => {
    const next = seq[(i+seq.length)%seq.length];
    setDetailId(next.id); setMapKey(k=>k+1);
  };

  /* ── open/close detail ── */
  const openDetail = id => { setDetailId(id); setMapKey(k=>k+1); };
  const closeDetail = () => setDetailId(null);

  /* ── keyboard navigation ── */
  useEffect(() => {
    const handler = e => {
      if (e.key==='Escape') {
        if (drawerOpen) { setDrawerOpen(false); return; }
        if (detailId!==null) { closeDetail(); return; }
      }
      if (detailId!==null) {
        if (e.key==='ArrowRight') goDetail(dix+1);
        if (e.key==='ArrowLeft')  goDetail(dix-1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [detailId, dix, drawerOpen]); // eslint-disable-line

  /* ─────────────── MAP SVG helper ─────────────── */
  const mapSvg = p => <MapSvg p={p} animKey={mapKey}/>;

  /* ─────────────── BARCODE ELEMENT ─────────────── */
  const Barcode = ({ id }) => {
    const { d, w } = buildBarcode(id);
    return (
      <svg className="sp-barcode" viewBox={`0 0 ${w} 24`} aria-hidden="true" fill="currentColor"
        dangerouslySetInnerHTML={{ __html: d }}/>
    );
  };

  /* ─────────────── STOCK SEGMENTS ─────────────── */
  const StockMeter = ({ st }) => {
    const lo = st < 20;
    return (
      <div className={`sp-seg10${lo?' low':''}`}>
        {Array.from({length:10},(_,i)=>(
          <i key={i} className={i<Math.ceil(st/10)?'on':''}/>
        ))}
      </div>
    );
  };

  /* ─────────────── DETAIL INFO ─────────────── */
  const DetailInfo = ({ p }) => {
    if (!p) return null;
    const sv = listIds.includes(p.id);
    const lo = p.st < 20;
    const rel = products.filter(x=>x.id!==p.id&&(x.c===p.c||x.a.slice(0,3)===p.a.slice(0,3))).slice(0,4);
    const steps = ['Enter through the main gate']
      .concat(p.f!=='G' ? ['Take the lift or stairs to the '+((FL[p.f]||[''])[0]).toLowerCase()] : [])
      .concat(['Head to zone '+p.a[2]+', then aisle '+p.a[3]]);
    const bar = String(p.id*104729+10000000).padStart(9,'0');

    return (
      <div className="sp-dinfo">
        <div className="sp-rv" style={{'--d':0}}>
          <div className="sp-crumb">
            {(FL[p.f]||['?'])[0]}<IRight style={{width:13,height:13}}/>{p.c}
          </div>
          <div className="sp-dbrand">{es(p.b)}</div>
          <h1 className="sp-dh1">{es(p.n)}</h1>
          <div className="sp-dprice">
            <b>{rs(p.pr)}</b>
            {p.m>0 && <><s>{rs(p.m)}</s><em className="sp-save-pill">Save {rs(p.m-p.pr)}</em></>}
          </div>
          <p className="sp-desc">
            {es(p.b)} {p.c.toLowerCase()}, shelved in aisle {p.a} on the {((FL[p.f]||['?'])[0]).toLowerCase()}.
            Prices and stock update as the shelves do.
          </p>
        </div>

        <div className="sp-rv" style={{'--d':1}}>
          <div className="sp-stock">
            <div className="sp-stock-lbl">
              <span>{lo?'Low stock':'In stock'}</span>
              <b>{p.st} available</b>
            </div>
            <StockMeter st={p.st}/>
          </div>
        </div>

        <dl className="sp-specs sp-rv" style={{'--d':2}}>
          <div><dt>Category</dt><dd>{p.c}</dd></div>
          <div><dt>Location</dt><dd>Aisle {p.a}, {(FL[p.f]||['?','?'])[1]}</dd></div>
          <div><dt>SKU</dt><dd>GMR-{1000+p.id*37}</dd></div>
          <div><dt>Barcode</dt><dd>8901{bar}</dd></div>
        </dl>

        <div className="sp-rv" style={{'--d':3}}>
          <div className="sp-acts">
            <button type="button"
              className={`sp-act${sv?' in-list':''}`}
              onClick={() => toggleList(p.id)}>
              <IList style={{width:17,height:17}}/>
              {sv ? 'Saved to My List' : 'Add to My List'}
            </button>
            <button type="button" className="sp-act primary"
              onClick={() => {
                const m = document.getElementById('sp-map-card');
                if (m) m.scrollIntoView({behavior:'smooth',block:'center'});
                setMapKey(k=>k+1);
              }}>
              <INav style={{width:17,height:17}}/>Show route
            </button>
          </div>
        </div>

        <div className="sp-rv" style={{'--d':4}}>
          <div className="sp-map-card" id="sp-map-card">
            <h2>Your route to aisle {p.a}</h2>
            <p>{(FL[p.f]||['?'])[0]} layout. The highlighted aisle is where this product is shelved.</p>
            {mapSvg(p)}
            <ol className="sp-steps">
              {steps.map((s,i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
        </div>

        {rel.length > 0 && (
          <div className="sp-rv" style={{'--d':5}}>
            <div className="sp-related">
              <h3>On the same shelves</h3>
              <div className="sp-rel-grid">
                {rel.map(x=>(
                  <button key={x.id} type="button" className="sp-rel-btn"
                    onClick={() => { setDetailId(x.id); setMapKey(k=>k+1); }}>
                    <span className="sp-rel-thumb">{x.e}</span>
                    <span>
                      <b>{es(x.n)}</b>
                      <small>{rs(x.pr)} · {x.a}</small>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ─────────────── DRAWER CONTENT ─────────────── */
  const DrawerContent = () => {
    const items = listIds.map(i=>products.find(p=>p.id===i)).filter(Boolean);
    const tot = items.reduce((s,p)=>s+p.pr,0);
    const sv  = items.reduce((s,p)=>s+(p.m?p.m-p.pr:0),0);
    return (
      <>
        <button type="button" className="sp-back" onClick={()=>setDrawerOpen(false)}
          style={{marginBottom:22}}>
          <IX style={{width:17,height:17}}/><span>Close</span>
        </button>
        <h2>My List</h2>
        <p className="sub">
          {items.length
            ? `${items.length} item${items.length>1?'s':''} saved for your visit.`
            : 'Nothing saved yet. Tap the heart on any product to add it.'}
        </p>
        {items.map(p=>(
          <div key={p.id} className="sp-li">
            <span className="sp-li-thumb">{p.e}</span>
            <div>
              <b>{es(p.n)}</b>
              <small>Aisle {p.a} · {(FL[p.f]||['?','?'])[1]} · {rs(p.pr)}</small>
            </div>
            <button type="button" className="sp-li-rm"
              aria-label={`Remove ${p.n}`}
              onClick={()=>toggleList(p.id)}>
              <IX style={{width:15,height:15}}/>
            </button>
          </div>
        ))}
        {items.length > 0 && (
          <>
            <div className="sp-total">
              <span>
                Total
                {sv>0 && <><br/><small style={{color:'var(--mut)',fontWeight:400}}>You save {rs(sv)}</small></>}
              </span>
              <b>{rs(tot)}</b>
            </div>
            <button type="button" className="sp-clear-btn"
              onClick={()=>{setListIds([]);toast('List cleared');}}>
              Clear list
            </button>
          </>
        )}
      </>
    );
  };

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */
  return (
    <div className="sp-root">

      {/* ── HERO ── */}
      <section className="sp-hero">
        <svg className="sp-hero-bg" aria-hidden="true" preserveAspectRatio="xMidYMax slice">
          <defs>
            <pattern id="sp-shelf-bg" width="440" height="190" patternUnits="userSpaceOnUse">
              <g fill="currentColor">
                <rect x="6"   y="104" width="30" height="76" rx="4"/>
                <rect x="42"  y="124" width="22" height="56" rx="3"/>
                <rect x="70"  y="92"  width="34" height="88" rx="5"/>
                <rect x="82"  y="80"  width="10" height="12" rx="2"/>
                <rect x="112" y="116" width="40" height="64" rx="4"/>
                <rect x="160" y="100" width="26" height="80" rx="13"/>
                <rect x="194" y="128" width="36" height="52" rx="4"/>
                <rect x="238" y="88"  width="30" height="92" rx="5"/>
                <rect x="276" y="120" width="44" height="60" rx="6"/>
                <rect x="328" y="104" width="24" height="76" rx="4"/>
                <rect x="360" y="132" width="34" height="48" rx="4"/>
                <rect x="402" y="96"  width="28" height="84" rx="5"/>
              </g>
              <rect x="0" y="180" width="440" height="6" fill="currentColor"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sp-shelf-bg)"/>
        </svg>

        <h1>
          Find anything in
          <em>
            the store
            <svg viewBox="0 0 300 16" preserveAspectRatio="none" fill="none"
              stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M3 11C60 4 120 4 180 8s90 2 117-2"/>
            </svg>
          </em>
        </h1>
        <p>Every product comes with its aisle, live stock and a route from the entrance. Search, save to your list and walk straight to it.</p>

        <label className={`sp-search${q?' has-query':''}`} aria-label="Search products">
          <ISearch className="sp-search-ico" style={{width:19,height:19}}/>
          <input
            type="search" placeholder="Search products, brands or aisles"
            value={q} autoComplete="off"
            onChange={e => { setQ(e.target.value); setFresh(false); }}
          />
          <button type="button" className="sp-search-clear"
            aria-label="Clear search"
            onClick={() => { setQ(''); setFresh(false); }}>
            <IX style={{width:17,height:17}}/>
          </button>
        </label>
      </section>

      {/* demo notice */}
      {isDemo && (
        <p className="sp-notice">
          <IInfo style={{width:15,height:15,color:'var(--ac)'}}/>
          Showing {DEMO.length} demo products — backend not connected.
        </p>
      )}

      {/* ── FILTER BAR ── */}
      <div className="sp-filters">
        <div className="sp-filters-inner">

          {/* floor segmented control */}
          <div className="sp-seg" role="group" aria-label="Filter by floor">
            {[['all','All'],['G','Ground'],['F','First'],['S','Second']].map(([k,l])=>(
              <button key={k} type="button"
                className={`sp-seg-btn${floor===k?' active':''}`}
                aria-pressed={floor===k}
                onClick={()=>{setFloor(k);setCat('All categories');setFresh(false);}}>
                {l}
              </button>
            ))}
          </div>

          {/* category chips */}
          <div className="sp-cats" role="group" aria-label="Filter by category">
            {CATS.map(c=>(
              <button key={c} type="button"
                className={`sp-cat-btn${cat===c?' active':''}`}
                aria-pressed={cat===c}
                onClick={()=>{setCat(c);setFresh(false);}}>
                {c}
              </button>
            ))}
          </div>

          {/* sort */}
          <select className="sp-sort" value={sort}
            aria-label="Sort products"
            onChange={e=>{setSort(e.target.value);setFresh(false);}}>
            <option value="def">Featured</option>
            <option value="asc">Price: low to high</option>
            <option value="desc">Price: high to low</option>
            <option value="az">Name: A to Z</option>
            <option value="off">Biggest discount</option>
          </select>

          {/* offers toggle */}
          <button type="button"
            className={`sp-offers-btn${sale?' active':''}`}
            aria-pressed={sale}
            onClick={()=>{setSale(v=>!v);setFresh(false);}}>
            <ITag style={{width:15,height:15}}/> Offers only
          </button>
        </div>
      </div>

      {/* result count */}
      <p className="sp-count">
        Showing {result.length} of {products.length} products
        {user && <> · <button type="button"
          style={{border:0,background:'none',color:'var(--ac)',fontWeight:600,cursor:'pointer',padding:'0 4px'}}
          onClick={()=>setDrawerOpen(true)}>
          My List ({listIds.length})
        </button></>}
      </p>

      {/* ── GRID ── */}
      <div className={`sp-grid${fresh?' fresh':''}`} aria-live="polite">
        {result.length === 0 ? (
          <div className="sp-empty">
            <b>No products match</b>
            Try another search, floor or category.
            <br/>
            <button type="button" className="sp-empty-btn"
              onClick={()=>{setQ('');setFloor('all');setCat('All categories');setSale(false);setFresh(false);}}>
              Clear all filters
            </button>
          </div>
        ) : result.map((p,k) => {
          const sv = listIds.includes(p.id);
          const { d: bcPath, w: bcW } = buildBarcode(p.id);
          return (
            <div key={p.id} className="sp-wrap" style={{'--k':Math.min(k,16)}}>
              <div className="sp-card"
                role="button" tabIndex={0}
                aria-label={`View ${p.n}`}
                onClick={() => openDetail(p.id)}
                onKeyDown={e => e.key==='Enter' && openDetail(p.id)}>

                <div className="sp-stage" style={{'--h':HUE[p.c]||210}}>
                  {p.d>0 && <span className="sp-rib">−{p.d}%</span>}
                  <button type="button"
                    className={`sp-heart${sv?' saved':''}`}
                    aria-pressed={sv}
                    aria-label={sv?'Remove from My List':'Save to My List'}
                    onClick={e=>{e.stopPropagation();toggleList(p.id);}}>
                    <IHeart style={{width:16,height:16}}/>
                  </button>
                  <span className="sp-emoji" aria-hidden="true">{p.e}</span>
                  <i className="sp-shelf"/>
                </div>

                <div className="sp-tag">
                  <small>{es(p.b)}</small>
                  <h3>{es(p.n)}</h3>
                  <div className="sp-price">
                    <b>{rs(p.pr)}</b>
                    {p.m>0 && <s>{rs(p.m)}</s>}
                  </div>
                  <div className="sp-tag-foot">
                    <svg className="sp-barcode" viewBox={`0 0 ${bcW} 24`}
                      aria-hidden="true" fill="currentColor"
                      dangerouslySetInnerHTML={{ __html: bcPath }}/>
                    <span className="sp-aisle">
                      {p.a.slice(2)} · {(FL[p.f]||['?','?'])[1]}
                    </span>
                  </div>
                  <button type="button"
                    className={`sp-add-btn${sv?' in-list':''}`}
                    onClick={e=>{e.stopPropagation();toggleList(p.id);}}>
                    {sv
                      ? <><ICheck style={{width:15,height:15}}/>Saved</>
                      : <><IList style={{width:15,height:15}}/>Add to My List</>
                    }
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── DETAIL OVERLAY ── */}
      <div className={`sp-detail${dp?' open':''}`}
        role="dialog" aria-label="Product details"
        aria-modal={dp?'true':undefined}>
        {dp && (
          <>
            <div className="sp-dtoolbar">
              <button type="button" className="sp-back" onClick={closeDetail}>
                <ILeft style={{width:17,height:17}}/><span>All products</span>
              </button>
              <div className="sp-pager">
                <button type="button" aria-label="Previous product"
                  onClick={()=>goDetail(dix-1)}>
                  <ILeft style={{width:17,height:17}}/>
                </button>
                <span>{dix+1} of {seq.length}</span>
                <button type="button" aria-label="Next product"
                  onClick={()=>goDetail(dix+1)}>
                  <IRight style={{width:17,height:17}}/>
                </button>
              </div>
            </div>

            <div className="sp-dgrid">
              {/* stage */}
              <div className="sp-dstage" style={{'--h':HUE[dp.c]||210}}>
                {dp.d>0 && <span className="sp-rib">−{dp.d}% off</span>}
                <span className="sp-emoji" aria-hidden="true">{dp.e}</span>
                <i className="sp-shelf"/>
                <div className="sp-loc">
                  Aisle {dp.a}
                  <small>{(FL[dp.f]||['?'])[0]}</small>
                </div>
              </div>

              {/* info */}
              <DetailInfo p={dp}/>
            </div>
          </>
        )}
      </div>

      {/* ── DRAWER (My List) ── */}
      <div className={`sp-scrim${drawerOpen?' open':''}`}
        onClick={()=>setDrawerOpen(false)}/>
      <aside className={`sp-drawer${drawerOpen?' open':''}`}
        aria-label="My List">
        <DrawerContent/>
      </aside>

      {/* ── TOAST ── */}
      <div className={`sp-toast${toastShow?' show':''}`} role="status">
        {toastMsg}
      </div>

    </div>
  );
}
