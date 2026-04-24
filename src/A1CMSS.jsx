import { useState, useEffect, useRef, useCallback } from "react";

const FLIP_WORDS = ["Rentals", "Deep Cleaning", "Repairs", "Spare Parts"];

const SLIDES = [
  { tag: "Auto Scrubber", title: "Walk-Behind Auto Scrubber", desc: "Cleans, scrubs, and dries in a single pass — perfect for warehouses, hospitals, and shopping centres.", badges: ["sale", "rent"], label: "Auto Scrubber — Photo 1" },
  { tag: "Auto Scrubber", title: "Ride-On Auto Scrubber", desc: "High-capacity model for large industrial spaces — reduces cleaning time with wide scrubbing paths.", badges: ["sale", "rent"], label: "Auto Scrubber — Photo 2" },
  { tag: "Industrial Vacuum Cleaner", title: "Heavy-Duty Vacuum Cleaner", desc: "Handles fine dust, wet spills, and heavy debris — ideal for factories, construction sites, and workshops.", badges: ["sale", "rent", "parts"], label: "Industrial Vacuum — Photo" },
  { tag: "Single Disk Machine", title: "Single Disk Floor Machine", desc: "For scrubbing, polishing, buffing, and stripping — works on tiles, marble, granite, and hard surfaces.", badges: ["sale", "rent", "parts"], label: "Single Disk Machine — Photo" },
];

const SERVICES = [
  
  { title: "Machine Sales", desc: "Buy industrial-grade vacuum cleaners, auto scrubbers, and single disk machines for long-term use.", icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" },
  { title: "Machine Rental", desc: "Short or long-term rental options for industrial cleaning equipment — ideal for projects and events.", icon: "M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" },
  { title: "Spare Parts", desc: "Genuine spare parts for vacuum cleaners, auto scrubbers, and single disk machines to keep equipment running.", icon: "M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2zm-4 10H4V5h14v14z" },
  { title: "Maintenance & Repair", desc: "Professional on-site servicing and repair to maximise the life of your cleaning equipment.", icon: "M13.78 15.3 19.78 21.3 21.89 19.14 15.89 13.14 13.78 15.3M17.5 10C17.5 7 15.21 4.54 12.5 4.5V2L8.5 6 12.5 10V7.5C14.16 7.54 15.5 8.88 15.5 10.5 15.5 12.11 14.16 13.45 12.5 13.5 11.67 13.5 11 13.17 10.5 12.67L9.07 14.1C9.9 14.95 11.1 15.5 12.5 15.5C15.26 15.5 17.5 13.26 17.5 10.5V10M6.5 10C6.5 11.29 6.94 12.5 7.69 13.46L6.25 14.9C5.07 13.59 4.5 11.88 4.5 10C4.5 7 6.79 4.54 9.5 4.5V7C7.84 7.04 6.5 8.38 6.5 10Z" },
];

const WHY_ITEMS = [
  { title: "100+ Clients Served", desc: "Trusted by over 100 businesses — from warehouses to hospitals to newly built offices." },
  { title: "Sales & Rentals", desc: "Flexible options — buy outright or rent short/long-term based on your needs." },
  { title: "Genuine Spare Parts", desc: "Original spare parts for all machines we sell and service — fast availability." },
  { title: "All Industries Served", desc: "From warehouses, hospitals, hotels to factories and brand new offices — we serve them all." },
];

const DC_STEPS = [
  { n: 1, title: "Initial Assessment", desc: "We visit the office, understand the space size, and plan the cleaning scope." },
  { n: 2, title: "Deep Dust & Debris Removal", desc: "Post-construction dust, debris, and material residue cleared using industrial vacuums." },
  { n: 3, title: "Floor Scrubbing & Polishing", desc: "Auto scrubbers and single disk machines used to clean and polish all floor surfaces." },
  { n: 4, title: "Final Handover", desc: "A spotless, move-in ready office handed over to you — right on time." },
];



// ── Hooks ─────────────────────────────────────────────────────────────────────
function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ── Components ────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, style = {} }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.65s cubic-bezier(0.4,0,0.2,1) ${delay}s, transform 0.65s cubic-bezier(0.4,0,0.2,1) ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

function FlipWord({ blue }) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("visible");
  useEffect(() => {
    const id = setInterval(() => {
      setPhase("out");
      setTimeout(() => { setIdx(i => (i + 1) % FLIP_WORDS.length); setPhase("in"); setTimeout(() => setPhase("visible"), 350); }, 300);
    }, 2500);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{ display: "inline-block", color: blue, transformOrigin: "center bottom", transformStyle: "preserve-3d", transform: phase === "out" ? "rotateX(90deg)" : phase === "in" ? "rotateX(-90deg)" : "rotateX(0deg)", opacity: phase === "visible" ? 1 : 0, transition: phase === "out" ? "transform 0.35s ease,opacity 0.2s" : phase === "visible" ? "transform 0.35s ease,opacity 0.25s" : "none" }}>
      {FLIP_WORDS[idx]}
    </span>
  );
}

function Tag({ type, dark }) {
  const s = { sale: { bg: dark ? "rgba(91,159,212,0.15)" : "#E6F1FB", color: dark ? "#7BB8E8" : "#0C447C" }, rent: { bg: dark ? "rgba(59,191,160,0.15)" : "#E1F5EE", color: dark ? "#3BBFA0" : "#0F6E56" }, parts: { bg: dark ? "rgba(160,90,20,0.2)" : "#FFF3E0", color: dark ? "#C4884A" : "#BF6E00" } }[type];
  return <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: s.bg, color: s.color, whiteSpace: "nowrap" }}>{type === "sale" ? "For Sale" : type === "rent" ? "For Rent" : "Spare Parts"}</span>;
}

// ── Before / After Slider ─────────────────────────────────────────────────────
function BeforeAfterSlider({ beforeSrc, afterSrc, beforeLabel = "Before", afterLabel = "After" }) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef(null);

  const updatePos = (clientX) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPos((x / rect.width) * 100);
  };

  const onMouseDown = (e) => { e.preventDefault(); setDragging(true); };
  const onMouseMove = useCallback((e) => { if (dragging) updatePos(e.clientX); }, [dragging]);
  const onMouseUp = useCallback(() => setDragging(false), []);
  const onTouchMove = (e) => updatePos(e.touches[0].clientX);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, onMouseMove, onMouseUp]);

  const Placeholder = ({ label, color }) => (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, background: color }}>
      <svg viewBox="0 0 24 24" style={{ width: 40, height: 40, fill: "rgba(255,255,255,0.35)" }}><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>Upload {label} photo</span>
    </div>
  );

  return (
    <div ref={containerRef} onTouchMove={onTouchMove} onTouchEnd={onMouseUp}
      style={{ position: "relative", width: "100%", height: 200, borderRadius: 14, overflow: "hidden", cursor: "ew-resize", userSelect: "none", border: "0.5px solid rgba(255,255,255,0.2)" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        {afterSrc ? <img src={afterSrc} alt="After" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Placeholder label="After" color="rgba(15,110,86,0.65)" />}
      </div>
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {beforeSrc ? <img src={beforeSrc} alt="Before" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Placeholder label="Before" color="rgba(80,40,10,0.6)" />}
      </div>
      <div style={{ position: "absolute", top: 12, left: 14, background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, letterSpacing: "0.5px", textTransform: "uppercase", backdropFilter: "blur(4px)" }}>{beforeLabel}</div>
      <div style={{ position: "absolute", top: 12, right: 14, background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, letterSpacing: "0.5px", textTransform: "uppercase", backdropFilter: "blur(4px)" }}>{afterLabel}</div>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 2, background: "#fff", transform: "translateX(-50%)", pointerEvents: "none" }} />
      <div onMouseDown={onMouseDown} style={{ position: "absolute", top: "50%", left: `${pos}%`, transform: "translate(-50%,-50%)", width: 42, height: 42, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "ew-resize", boxShadow: "0 2px 14px rgba(0,0,0,0.35)" }}>
        <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: "#0C447C" }}><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12zM8.59 7.41L10 6l6 6-6 6-1.41-1.41L13.17 12z"/></svg>
      </div>
      <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.45)", color: "#fff", fontSize: 11, padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap", backdropFilter: "blur(4px)", pointerEvents: "none" }}>← Drag to compare →</div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(false);
  const [slide, setSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const w = useWidth();
  const mob = w < 768;
  const tab = w < 1024;

  const T = {
    blue: dark ? "#5B9FD4" : "#185FA5",
    blueDark: dark ? "#5B9FD4" : "#0C447C",
    blueLight: dark ? "rgba(91,159,212,0.14)" : "#E6F1FB",
    teal: dark ? "#3BBFA0" : "#0F6E56",
    tealLight: dark ? "rgba(59,191,160,0.14)" : "#E1F5EE",
    gray: dark ? "#9A9A94" : "#5F5E5A",
    grayLight: dark ? "#232323" : "#F1EFE8",
    text: dark ? "#E8E7E2" : "#2C2C2A",
    muted: dark ? "#6A6A64" : "#888780",
    border: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)",
    bg: dark ? "#111214" : "#fff",
    card: dark ? "#1C1D20" : "#fff",
    nav: dark ? "rgba(17,18,20,0.96)" : "rgba(255,255,255,0.95)",
    products: dark ? "#161719" : "#F6F9FF",
    hero: dark ? "linear-gradient(135deg,#13161C,#111613)" : "linear-gradient(135deg,#F6FAFF,#E9F5EE)",
    milestone: dark ? "#161B24" : "#0C447C",
    serif: { fontFamily: "'Libre Baskerville', serif" },
  };

  const goTo = useCallback((n) => setSlide(((n % SLIDES.length) + SLIDES.length) % SLIDES.length), []);
  useEffect(() => { const id = setInterval(() => goTo(slide + 1), 4500); return () => clearInterval(id); }, [slide, goTo]);

  const sp = mob ? "48px 5%" : "72px 5%";
  const checkPath = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z";

  return (
    <>
      <style>{`
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        a { text-decoration: none; color: inherit; }
      `}</style>

      <div style={{ fontFamily: "'Nunito Sans',sans-serif", color: T.text, background: T.bg, transition: "background 0.3s,color 0.3s" }}>

        {/* NAV */}
        <nav style={{ position: "sticky", top: 0, zIndex: 100, background: T.nav, borderBottom: `0.5px solid ${T.border}`, padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, backdropFilter: "blur(10px)" }}>
          <div style={{ ...T.serif, fontSize: 20, fontWeight: 700 }}>
            <span style={{ color: dark ? "#7BB8E8" : T.blueDark }}>A1</span><span style={{ color: T.teal }}>CMSS</span>
          </div>
          {!mob && (
            <div style={{ display: "flex", gap: 24 }}>
              {["Services", "Products", "Gallery", "Deep Cleaning", "Contact"].map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(" ", "")}`} style={{ fontSize: 14, color: T.gray, fontWeight: 500 }}>{l}</a>
              ))}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!mob && <a href="#contact" style={{ background: dark ? "#2A5F8A" : T.blue, color: dark ? "#D0E8FF" : "#fff", padding: "9px 20px", borderRadius: 8, fontSize: 14, fontWeight: 500 }}>Get a Quote</a>}
            <button onClick={() => setDark(d => !d)} style={{ width: 36, height: 36, borderRadius: "50%", border: `0.5px solid ${T.border}`, background: "transparent", cursor: "pointer", fontSize: 16 }}>{dark ? "☀️" : "🌙"}</button>
            {mob && (
              <button onClick={() => setMenuOpen(o => !o)} style={{ width: 36, height: 36, borderRadius: 8, border: `0.5px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, padding: 8 }}>
                <span style={{ width: 18, height: 1.5, background: T.text, borderRadius: 2, display: "block" }} />
                <span style={{ width: 18, height: 1.5, background: T.text, borderRadius: 2, display: "block" }} />
                <span style={{ width: 18, height: 1.5, background: T.text, borderRadius: 2, display: "block" }} />
              </button>
            )}
          </div>
        </nav>

        {/* Mobile drawer */}
        {mob && menuOpen && (
          <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, background: T.nav, borderBottom: `0.5px solid ${T.border}`, padding: "8px 5% 16px", backdropFilter: "blur(10px)" }}>
            {["Services", "Products", "Gallery", "Deep Cleaning", "Contact"].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(" ", "")}`} onClick={() => setMenuOpen(false)} style={{ display: "block", fontSize: 15, color: T.text, fontWeight: 500, padding: "13px 0", borderBottom: `0.5px solid ${T.border}` }}>{l}</a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)} style={{ display: "block", marginTop: 14, background: dark ? "#2A5F8A" : T.blue, color: dark ? "#D0E8FF" : "#fff", padding: "12px 0", borderRadius: 8, fontSize: 15, fontWeight: 500, textAlign: "center" }}>Get a Quote</a>
          </div>
        )}

        {/* HERO */}
        <section style={{ padding: mob ? "40px 5%" : "64px 5%", display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: mob ? 32 : 48, alignItems: "center", background: T.hero, borderBottom: `0.5px solid ${T.border}` }}>
          <div>
            <div style={{ display: "inline-block", background: T.blueLight, color: dark ? "#7BB8E8" : T.blueDark, fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 20, marginBottom: 16, letterSpacing: "0.5px", textTransform: "uppercase" }}>Industrial Cleaning Solutions</div>
            <h1 style={{ ...T.serif, fontSize: mob ? 36 : 50, fontWeight: 700, lineHeight: 1.1, color: T.text, marginBottom: 16 }}>
              Trusted<br />for <FlipWord blue={T.blue} />
            </h1>
            <p style={{ fontSize: 15, color: T.gray, lineHeight: 1.8, marginBottom: 26, fontWeight: 300 }}>Sales, service, spare parts &amp; deep cleaning — industrial vacuum cleaners, auto scrubbers and floor machines for businesses across Mumbai.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#products" style={{ background: dark ? "#2A5F8A" : T.blue, color: dark ? "#D0E8FF" : "#fff", padding: "11px 22px", borderRadius: 8, fontWeight: 500, fontSize: 14 }}>View Products</a>
              <a href="#contact" style={{ color: dark ? "#7BB8E8" : T.blue, border: `1.5px solid ${dark ? "rgba(91,159,212,0.5)" : T.blue}`, padding: "11px 22px", borderRadius: 8, fontWeight: 500, fontSize: 14 }}>Get in Touch</a>
            </div>
          </div>
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[["100+", "Businesses successfully served"], ["Rent", "Flexible short & long term rentals"], ["Parts", "Genuine spare parts available"], ["Service", "On-site maintenance & repair"]].map(([num, lbl]) => (
                <div key={lbl} style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ ...T.serif, fontSize: 22, fontWeight: 700, color: dark ? "#7BB8E8" : T.blueDark }}>{num}</div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{lbl}</div>
                </div>
              ))}
            </div>
            <div style={{ background: dark ? "#1A2535" : T.blueDark, borderRadius: 14, padding: mob ? 16 : 24, display: "flex", alignItems: "center", gap: 14, marginTop: 12 }}>
              <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, fill: "#fff" }}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" /></svg>
              </div>
              <div>
                <strong style={{ color: "#fff", fontWeight: 600, display: "block", marginBottom: 3, fontSize: 13 }}>Trusted by 100+ Businesses Across Industries</strong>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: 1.5 }}>From warehouses to hospitals — we keep your floors clean.</p>
              </div>
            </div>
          </div>
        </section>

        {/* MILESTONE */}
        <div style={{ background: T.milestone, padding: "20px 5%", display: "flex", alignItems: "center", justifyContent: "center", gap: mob ? 16 : 0, flexWrap: "wrap", rowGap: 12 }}>
          {[["100+", "Clients\nServed"], ["3+", "Machine\nCategories"], ["Sale", "Outright\nPurchase"], ["Rent", "Flexible\nRental"], ["Deep", "Office Deep\nCleaning"]].map(([num, lbl], i, arr) => (
            <div key={num} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: mob ? "0 10px" : "0 28px" }}>
                <div style={{ ...T.serif, fontSize: mob ? 22 : 34, fontWeight: 700, color: "#fff" }}>{num}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.4, whiteSpace: "pre-line" }}>{lbl}</div>
              </div>
              {!mob && i < arr.length - 1 && <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.2)" }} />}
            </div>
          ))}
        </div>

        {/* SERVICES */}
        <section id="services" style={{ padding: sp }}>
          <Reveal><div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: T.teal, marginBottom: 8 }}>What We Do</div></Reveal>
          <Reveal delay={0.05}><div style={{ ...T.serif, fontSize: mob ? 26 : 34, fontWeight: 700, color: T.text, marginBottom: 10 }}>Sales, Rental &amp; Repairs</div></Reveal>
          <Reveal delay={0.1}><div style={{ fontSize: 15, color: T.gray, lineHeight: 1.8, maxWidth: 520, fontWeight: 300, marginBottom: 36 }}>Whether you need a machine for a day or a decade, we've got you covered.</div></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(4,1fr)", gap: 14 }}>
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={mob ? 0 : i * 0.08}>
                <div style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 14, padding: "22px 18px", height: "100%" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: T.blueLight, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: T.blue }}><path d={s.icon} /></svg>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: T.text }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: T.gray, lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* PRODUCTS */}
        <section id="products" style={{ padding: sp, background: T.products, borderTop: `0.5px solid ${T.border}`, borderBottom: `0.5px solid ${T.border}` }}>
          <Reveal><div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: T.teal, marginBottom: 8 }}>Our Equipment</div></Reveal>
          <Reveal delay={0.05}><div style={{ ...T.serif, fontSize: mob ? 26 : 34, fontWeight: 700, color: T.text, marginBottom: 10 }}>Industrial Cleaning Machines</div></Reveal>
          <Reveal delay={0.1}><div style={{ fontSize: 15, color: T.gray, lineHeight: 1.8, maxWidth: 520, fontWeight: 300, marginBottom: 36 }}>Available for sale, rent, and with spare parts support across all categories.</div></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(4,1fr)", gap: 14 }}>
            {[
              { name: "Single Disk Machine",      desc: "For scrubbing, polishing and stripping — works on tiles, marble, granite and all hard floors.", img: "/images/SingleDisk-removebg-preview.png",  bg: dark ? "#16151C" : "#EEF3FF" },
              { name: "Pressure Washer",           desc: "High-pressure cleaning for heavy-duty industrial and commercial deep cleaning tasks.",           img: "/images/JetPressur-removebg-preview.png",  bg: dark ? "#141620" : "#EEF3FF" },
              { name: "Industrial Vacuum Cleaner", desc: "Heavy-duty vacuums for factories and warehouses. Handles dust, debris, and liquid spills.",      img: "/images/Vaccum-removebg-preview.png",      bg: dark ? "#141820" : "#EEF3FF" },
              { name: "Auto Scrubber",             desc: "Ride-on and walk-behind scrubbers for efficient large-area floor cleaning in any setting.",       img: "/images/Scrubber-removebg-preview.png",   bg: dark ? "#14181C" : "#EEF3FF" },
            ].map((p, i) => (
              <Reveal key={p.name} delay={mob ? 0 : i * 0.08}>
                <div style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 14, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ height: 160, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                    <img
                      src={p.img}
                      alt={p.name}
                      style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", transition: "transform 0.3s ease" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    />
                  </div>
                  <div style={{ padding: "16px 16px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: T.text }}>{p.name}</h3>
                    <p style={{ fontSize: 13, color: T.gray, lineHeight: 1.6, marginBottom: 12, flex: 1 }}>{p.desc}</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <Tag type="sale" dark={dark} />
                      <Tag type="rent" dark={dark} />
                      <Tag type="parts" dark={dark} />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* GALLERY */}
        <section id="gallery" style={{ background: T.bg, padding: sp }}>
          <Reveal><div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: T.teal, marginBottom: 8 }}>Our Machines</div></Reveal>
          <Reveal delay={0.05}><div style={{ ...T.serif, fontSize: mob ? 26 : 34, fontWeight: 700, color: T.text, marginBottom: 10 }}>See the Equipment Up Close</div></Reveal>
          <Reveal delay={0.1}><div style={{ fontSize: 15, color: T.gray, lineHeight: 1.8, maxWidth: 520, fontWeight: 300, marginBottom: 36 }}>Browse through our range of industrial cleaning machines.</div></Reveal>
          <Reveal>
            <div style={{ borderRadius: 14, border: `0.5px solid ${T.border}`, overflow: "hidden" }}>
              <div style={{ overflow: "hidden" }}>
                <div style={{ display: "flex", transform: `translateX(-${slide * 100}%)`, transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)" }}>
                  {SLIDES.map(s => (
                    <div key={s.title} style={{ minWidth: "100%" }}>
                      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1.1fr 1fr" }}>
                        <div style={{ background: T.grayLight, display: "flex", alignItems: "center", justifyContent: "center", padding: mob ? 16 : 28, borderBottom: mob ? `0.5px solid ${T.border}` : "none", borderRight: mob ? "none" : `0.5px solid ${T.border}` }}>
                          <div style={{ width: "100%", height: mob ? 160 : 240, borderRadius: 10, background: dark ? "#1E2228" : "#E8EEF5", border: `2px dashed ${dark ? "#2E3A48" : "#B5D4F4"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                            <svg viewBox="0 0 24 24" style={{ width: 30, height: 30, fill: dark ? "#5B9FD4" : "#378ADD", opacity: 0.5 }}><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>
                            <span style={{ fontSize: 12, color: dark ? "#6A6A64" : "#888" }}>{s.label}</span>
                          </div>
                        </div>
                        <div style={{ padding: mob ? 18 : "28px 28px", display: "flex", flexDirection: "column", justifyContent: "center", background: T.card }}>
                          <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", color: T.teal, marginBottom: 8 }}>{s.tag}</div>
                          <h3 style={{ ...T.serif, fontSize: mob ? 18 : 22, fontWeight: 700, marginBottom: 10, color: T.text }}>{s.title}</h3>
                          <p style={{ fontSize: 13, color: T.gray, lineHeight: 1.7, marginBottom: 14 }}>{s.desc}</p>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{s.badges.map(b => <Tag key={b} type={b} dark={dark} />)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
              <div style={{ display: "flex", gap: 8 }}>
                {SLIDES.map((_, i) => <button key={i} onClick={() => goTo(i)} style={{ width: i === slide ? 24 : 8, height: 8, borderRadius: i === slide ? 4 : "50%", background: i === slide ? T.blue : T.border, border: "none", cursor: "pointer", padding: 0, transition: "all 0.2s" }} />)}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[[-1, "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"], [1, "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"]].map(([d, p]) => (
                  <button key={d} onClick={() => goTo(slide + d)} style={{ width: 36, height: 36, borderRadius: "50%", border: `0.5px solid ${T.border}`, background: T.card, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: T.blueDark }}><path d={p} /></svg>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* DEEP CLEAN */}
        <section id="deepcleaning" style={{ background: "linear-gradient(135deg,#0C447C,#085041)", padding: sp, color: "#fff" }}>

          {/* Header — full width */}
          <div style={{ textAlign: "center", marginBottom: mob ? 32 : 48 }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "#9FE1CB", marginBottom: 8 }}>New Service</div>
            <div style={{ ...T.serif, fontSize: mob ? 28 : 38, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Office Deep Cleaning</div>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.7, maxWidth: 580, margin: "0 auto" }}>We specialise in deep cleaning newly built and newly set-up offices — getting your space spotless, construction-dust free, and move-in ready before your team walks in on Day 1.</p>
          </div>

          {/* Body — steps left, sliders right */}
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1.6fr", gap: mob ? 32 : 48, alignItems: "start" }}>

            {/* Left — steps + CTA */}
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
                {DC_STEPS.map(s => (
                  <div key={s.n} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", ...T.serif, fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{s.n}</div>
                    <div style={{ paddingTop: 6 }}>
                      <h4 style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{s.title}</h4>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Feature pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
                {["Newly Built Offices", "Thorough & Safe", "Quick Turnaround", "Experienced Team"].map(f => (
                  <span key={f} style={{ fontSize: 12, fontWeight: 500, padding: "6px 14px", borderRadius: 20, background: "rgba(255,255,255,0.12)", border: "0.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.85)" }}>{f}</span>
                ))}
              </div>

              <a href="#contact" style={{ display: "inline-block", background: "#fff", color: "#0C447C", padding: "12px 28px", borderRadius: 8, fontWeight: 600, fontSize: 15 }}>Book a Deep Clean</a>
            </div>

            {/* Right — 2x2 slider grid */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Before &amp; After Results</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { before: null, after: null, label: "Office Floor" },
                  { before: null, after: null, label: "Lobby Area" },
                  { before: null, after: null, label: "Workspace" },
                  { before: null, after: null, label: "Common Area" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <BeforeAfterSlider
                      beforeSrc={item.before}
                      afterSrc={item.after}
                      beforeLabel="Before"
                      afterLabel="After"
                    />
                    <div style={{ textAlign: "center", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.55)", letterSpacing: "0.3px" }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* WHY US */}
        <section style={{ padding: sp }}>
          <Reveal><div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: T.teal, marginBottom: 8 }}>Why Choose Us</div></Reveal>
          <Reveal delay={0.05}><div style={{ ...T.serif, fontSize: mob ? 26 : 34, fontWeight: 700, color: T.text, marginBottom: 10 }}>Built on Trust &amp; Expertise</div></Reveal>
          <Reveal delay={0.1}><div style={{ fontSize: 15, color: T.gray, lineHeight: 1.8, maxWidth: 520, fontWeight: 300, marginBottom: 36 }}>A-1 Cleaning Machines is a one-stop-shop for all your industrial floor cleaning needs.</div></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(4,1fr)", gap: 22 }}>
            {WHY_ITEMS.map((wi, i) => (
              <Reveal key={wi.title} delay={mob ? 0 : i * 0.08}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: dark ? "rgba(91,159,212,0.14)" : T.blueLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: T.blue }}><path d={checkPath} /></svg>
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: T.text }}>{wi.title}</h4>
                    <p style={{ fontSize: 13, color: T.gray, lineHeight: 1.6 }}>{wi.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ background: dark ? "#161B24" : T.blueDark, color: "#fff", textAlign: "center", padding: sp }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "#9FE1CB", marginBottom: 8 }}>Get In Touch</div>
          <div style={{ ...T.serif, fontSize: mob ? 26 : 32, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Ready to Clean Smarter?</div>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, marginBottom: 32 }}>Contact us for sales, rentals, spare parts, servicing, or to book an office deep clean.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {[
              { label: "Phone", val: "+91 81085 76115", icon: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" },
              { label: "Email", val: "sales@a1cmss.com", icon: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" },
              { label: "Location", val: "Mumbai, India", icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" },
            ].map(c => (
              <div key={c.label} style={{ background: "rgba(255,255,255,0.1)", border: "0.5px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "20px 26px", minWidth: mob ? "100%" : 170 }}>
                <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.15)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                  <svg viewBox="0 0 24 24" style={{ width: 17, height: 17, fill: "#fff" }}><path d={c.icon} /></svg>
                </div>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", color: "rgba(255,255,255,0.55)", marginBottom: 5 }}>{c.label}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>{c.val}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ padding: "22px 5%", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `0.5px solid ${T.border}`, fontSize: 13, color: T.muted, flexWrap: "wrap", gap: 8, background: T.bg }}>
          <div style={{ ...T.serif, fontWeight: 700, fontSize: 15 }}>
            <span style={{ color: dark ? "#7BB8E8" : T.blueDark }}>A1</span><span style={{ color: T.teal }}>CMSS</span>
          </div>
          <div>© 2025 A-1 Cleaning Machines Sales And Service. All rights reserved.</div>
        </footer>

      </div>
    </>
  );
}
