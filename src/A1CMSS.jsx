import { useState, useEffect, useRef, useCallback } from "react";

const FLIP_WORDS = ["Rentals", "Repairs", "Spare Parts"];

const SLIDES = [
  { tag: "Auto Scrubber", title: "Walk-Behind Auto Scrubber", desc: "Cleans, scrubs, and dries in a single pass — perfect for warehouses, hospitals, and shopping centres.", badges: ["sale", "rent"], img: "/images/WalkBehindAutoScrubber_1.jpg" },
  { tag: "Auto Scrubber", title: "Ride-On Auto Scrubber", desc: "High-capacity model for large industrial spaces — reduces cleaning time with wide scrubbing paths.", badges: ["sale", "rent"], img: "/images/WalkBehindAutoScrubber.jpg" },
  { tag: "Industrial Vacuum Cleaner", title: "Heavy-Duty Vacuum Cleaner", desc: "Handles fine dust, wet spills, and heavy debris — ideal for factories, construction sites, and workshops.", badges: ["sale", "rent", "parts"], img: "/images/HeavyDutyVaccumCleaner.jpg" },
  { tag: "Single Disk Machine", title: "Single Disk Floor Machine", desc: "For scrubbing, polishing, buffing, and stripping — works on tiles, marble, granite, and hard surfaces.", badges: ["sale", "rent", "parts"], img: "/images/SingleDiskFloorMachine.png" },
];

const SERVICES = [
  { title: "Machine Sales", desc: "Buy industrial-grade vacuum cleaners, auto scrubbers, and single disk machines for long-term use.", icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" },
  { title: "Machine Rental", desc: "Short or long-term rental options for industrial cleaning equipment — ideal for projects and events.", icon: "M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" },
  { title: "Spare Parts", desc: "Genuine spare parts for vacuum cleaners, auto scrubbers, and single disk machines to keep equipment running.", icon: "M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2zm-4 10H4V5h14v14z" },
  { title: "Maintenance & Repair", desc: "Professional on-site servicing and repair to maximise the life of your cleaning equipment.", icon: "M13.78 15.3 19.78 21.3 21.89 19.14 15.89 13.14 13.78 15.3M17.5 10C17.5 7 15.21 4.54 12.5 4.5V2L8.5 6 12.5 10V7.5C14.16 7.54 15.5 8.88 15.5 10.5 15.5 12.11 14.16 13.45 12.5 13.5 11.67 13.5 11 13.17 10.5 12.67L9.07 14.1C9.9 14.95 11.1 15.5 12.5 15.5C15.26 15.5 17.5 13.26 17.5 10.5V10M6.5 10C6.5 11.29 6.94 12.5 7.69 13.46L6.25 14.9C5.07 13.59 4.5 11.88 4.5 10C4.5 7 6.79 4.54 9.5 4.5V7C7.84 7.04 6.5 8.38 6.5 10Z" },
];

const INDUSTRIES = [
  { label: "Hotels & Hospitality", icon: "M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-9c0-2.21-1.79-4-4-4z" },
  { label: "Hospitals", icon: "M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" },
  { label: "Warehouses", icon: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" },
  { label: "Factories", icon: "M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" },
  { label: "Corporate Offices", icon: "M17 11H7V9h10v2zm0-4H7V5h10v2zm0 8H7v-2h10v2zM3 3h2v18H3V3zm16 0h2v18h-2V3z" },
  { label: "Shopping Malls", icon: "M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.9 18 9 18h12v-2H9.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.43 5H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" },
];

const HOTELS = [
  { name: "JW Marriott", sub: "Hotel", logo: "/images/jwmarriott-logo.png", initials: "JW" },
  { name: "Ramada", sub: "Hotel", logo: "/images/ramada-logo.png", initials: "R" },
  { name: "Sea Prince", sub: "Hotel", logo: "/images/seaprince-logo.png", initials: "SP" },
];

const WHY_ITEMS = [
  { title: "100+ Clients Served", desc: "Trusted by over 100 businesses — from warehouses to hospitals to newly built offices." },
  { title: "Sales & Rentals", desc: "Flexible options — buy outright or rent short/long-term based on your needs." },
  { title: "Genuine Spare Parts", desc: "Original spare parts for all machines we sell and service — fast availability." },
  { title: "All Industries Served", desc: "From warehouses, hospitals, hotels to factories and brand new offices — we serve them all." },
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

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
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
    galleryImgBg: dark ? "#0E1014" : "#EEF3FF",
    serif: { fontFamily: "'Libre Baskerville', serif" },
  };

  const goTo = useCallback((n) => setSlide(((n % SLIDES.length) + SLIDES.length) % SLIDES.length), []);
  useEffect(() => { const id = setInterval(() => goTo(slide + 1), 4500); return () => clearInterval(id); }, [slide, goTo]);

  const sp = mob ? "48px 5%" : "72px 5%";
  const checkPath = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z";
  const navLinks = ["Services", "Products", "Gallery", "Clients", "Contact"];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        a { text-decoration: none; color: inherit; }
        .c-card { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease !important; }
        .c-card:hover { transform: translateY(-5px) !important; box-shadow: 0 16px 40px rgba(0,0,0,0.22) !important; border-color: rgba(91,159,212,0.5) !important; }
        .nav-link { position: relative; transition: color 0.2s; }
        .nav-link::after { content: ''; position: absolute; bottom: -3px; left: 0; width: 0; height: 1.5px; background: currentColor; transition: width 0.22s ease; border-radius: 2px; }
        .nav-link:hover::after { width: 100%; }
        @keyframes wa-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(37,211,102,0.6); } 70% { box-shadow: 0 0 0 16px rgba(37,211,102,0); } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .marquee-track { display: flex; gap: 16px; animation: marquee 22s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>

      <div style={{ fontFamily: "'Nunito Sans',sans-serif", color: T.text, background: T.bg, transition: "background 0.3s,color 0.3s" }}>

        {/* NAV */}
        <nav style={{ position: "sticky", top: 0, zIndex: 100, background: T.nav, borderBottom: `0.5px solid ${T.border}`, padding: "0 5%", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, backdropFilter: "blur(10px)" }}>
          <div style={{ ...T.serif, fontSize: 20, fontWeight: 700 }}>
            <span style={{ color: dark ? "#7BB8E8" : T.blueDark }}>A1</span><span style={{ color: T.teal }}>CMSS</span>
          </div>
          {!mob && (
            <div style={{ display: "flex", gap: 24 }}>
              {navLinks.map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} className="nav-link" style={{ fontSize: 14, color: T.gray, fontWeight: 500 }}>{l}</a>
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
            {navLinks.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)} style={{ display: "block", fontSize: 15, color: T.text, fontWeight: 500, padding: "13px 0", borderBottom: `0.5px solid ${T.border}` }}>{l}</a>
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
            <p style={{ fontSize: 15, color: T.gray, lineHeight: 1.8, marginBottom: 26, fontWeight: 300 }}>Sales, service &amp; spare parts — industrial vacuum cleaners, auto scrubbers and floor machines for businesses across Mumbai.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#products" style={{ background: dark ? "#2A5F8A" : T.blue, color: dark ? "#D0E8FF" : "#fff", padding: "11px 22px", borderRadius: 8, fontWeight: 500, fontSize: 14 }}>View Products</a>
              <a href="https://wa.me/918108576115" target="_blank" rel="noreferrer" style={{ background: "#25D366", color: "#fff", padding: "11px 22px", borderRadius: 8, fontWeight: 500, fontSize: 14, display: "flex", alignItems: "center", gap: 7 }}>
                <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: "#fff" }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[["100+", "Businesses successfully served"], ["Rent", "Flexible short & long term rentals"], ["Parts", "Genuine spare parts available"], ["Service", "On-site maintenance & repair"]].map(([num, lbl]) => (
                <div key={lbl} className="c-card" style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 10, padding: "14px 16px" }}>
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
          {[["100+", "Clients\nServed"], ["3+", "Machine\nCategories"], ["Sale", "Outright\nPurchase"], ["Rent", "Flexible\nRental"]].map(([num, lbl], i, arr) => (
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
                <div className="c-card" style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 14, padding: "22px 18px", height: "100%" }}>
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

        {/* INDUSTRIES */}
        <section style={{ padding: `28px 5%`, background: T.products, borderTop: `0.5px solid ${T.border}`, borderBottom: `0.5px solid ${T.border}` }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.muted, textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap" }}>Industries We Serve</div>
              <div style={{ flex: 1, height: "0.5px", background: T.border, minWidth: 20 }} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {INDUSTRIES.map(ind => (
                <div key={ind.label} style={{ display: "flex", alignItems: "center", gap: 8, background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 30, padding: "8px 16px" }}>
                  <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, fill: T.teal, flexShrink: 0 }}><path d={ind.icon} /></svg>
                  <span style={{ fontSize: 13, fontWeight: 500, color: T.text, whiteSpace: "nowrap" }}>{ind.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* PRODUCTS */}
        <section id="products" style={{ padding: sp, background: T.bg }}>
          <Reveal><div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: T.teal, marginBottom: 8 }}>Our Equipment</div></Reveal>
          <Reveal delay={0.05}><div style={{ ...T.serif, fontSize: mob ? 26 : 34, fontWeight: 700, color: T.text, marginBottom: 10 }}>Industrial Cleaning Machines</div></Reveal>
          <Reveal delay={0.1}><div style={{ fontSize: 15, color: T.gray, lineHeight: 1.8, maxWidth: 520, fontWeight: 300, marginBottom: 36 }}>Available for sale, rent, and with spare parts support across all categories.</div></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(4,1fr)", gap: 14 }}>
            {[
              { name: "Single Disk Machine",      desc: "For scrubbing, polishing and stripping — works on tiles, marble, granite and all hard floors.", img: "/images/SingleDisk-removebg-preview.png",  bg: dark ? "#16151C" : "#EEF3FF" },
              { name: "Pressure Washer",           desc: "High-pressure cleaning for heavy-duty industrial and commercial cleaning tasks.",                 img: "/images/JetPressur-removebg-preview.png",  bg: dark ? "#141620" : "#EEF3FF" },
              { name: "Industrial Vacuum Cleaner", desc: "Heavy-duty vacuums for factories and warehouses. Handles dust, debris, and liquid spills.",      img: "/images/Vaccum-removebg-preview.png",      bg: dark ? "#141820" : "#EEF3FF" },
              { name: "Auto Scrubber",             desc: "Ride-on and walk-behind scrubbers for efficient large-area floor cleaning in any setting.",       img: "/images/Scrubber-removebg-preview.png",   bg: dark ? "#14181C" : "#EEF3FF" },
            ].map((p, i) => (
              <Reveal key={p.name} delay={mob ? 0 : i * 0.08}>
                <div className="c-card" style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 14, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ height: 160, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                    <img
                      src={p.img}
                      alt={p.name}
                      style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", transition: "transform 0.3s ease" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
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
        <section id="gallery" style={{ background: T.products, padding: sp, borderTop: `0.5px solid ${T.border}`, borderBottom: `0.5px solid ${T.border}` }}>
          <Reveal><div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: T.teal, marginBottom: 8 }}>Our Machines</div></Reveal>
          <Reveal delay={0.05}><div style={{ ...T.serif, fontSize: mob ? 26 : 34, fontWeight: 700, color: T.text, marginBottom: 10 }}>See the Equipment Up Close</div></Reveal>
          <Reveal delay={0.1}><div style={{ fontSize: 15, color: T.gray, lineHeight: 1.8, maxWidth: 520, fontWeight: 300, marginBottom: 36 }}>Browse through our range of industrial cleaning machines.</div></Reveal>
          <Reveal>
            <div style={{ borderRadius: 14, border: `0.5px solid ${T.border}`, overflow: "hidden" }}>
              <div style={{ overflow: "hidden" }}>
                <div style={{ display: "flex", transform: `translateX(-${slide * 100}%)`, transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)" }}>
                  {SLIDES.map(s => (
                    <div key={s.title} style={{ minWidth: "100%" }}>
                      <div style={{ display: "flex", flexDirection: mob ? "column" : "row" }}>
                        <div style={{
                          flex: mob ? "none" : "0 0 55%",
                          height: mob ? 260 : 400,
                          overflow: "hidden",
                          position: "relative",
                          background: T.galleryImgBg
                        }}>
                          {/* Blurred backdrop fill */}
                          <div style={{
                            position: "absolute",
                            inset: 0,
                            backgroundImage: `url(${s.img})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: "blur(28px) brightness(0.55) saturate(1.1)",
                            transform: "scale(1.15)"
                          }} />
                          {/* Dark vignette overlay */}
                          <div style={{
                            position: "absolute",
                            inset: 0,
                            background: dark
                              ? "linear-gradient(135deg, rgba(0,0,0,0.45), rgba(0,0,0,0.25))"
                              : "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.05))"
                          }} />
                          {/* Foreground image (full, contained) */}
                          <div style={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: mob ? 16 : 24,
                            zIndex: 1
                          }}>
                            <img
                              src={s.img}
                              alt={s.title}
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                width: "auto",
                                height: "auto",
                                objectFit: "contain",
                                display: "block",
                                borderRadius: 8,
                                boxShadow: "0 14px 40px rgba(0,0,0,0.45)"
                              }}
                            />
                          </div>
                        </div>
                        <div style={{ flex: 1, padding: mob ? "20px 18px" : "0 32px", display: "flex", flexDirection: "column", justifyContent: "center", background: T.card, minHeight: mob ? "auto" : 400 }}>
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

        {/* CLIENTS — Hotel marquee */}
        <section id="clients" style={{ padding: sp, background: T.products, borderTop: `0.5px solid ${T.border}`, borderBottom: `0.5px solid ${T.border}` }}>
          <Reveal><div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: T.teal, marginBottom: 8 }}>Our Clients</div></Reveal>
          <Reveal delay={0.05}><div style={{ ...T.serif, fontSize: mob ? 26 : 34, fontWeight: 700, color: T.text, marginBottom: 10 }}>Trusted by Leading Hotels</div></Reveal>
          <Reveal delay={0.1}><div style={{ fontSize: 15, color: T.gray, lineHeight: 1.8, maxWidth: 520, fontWeight: 300, marginBottom: 36 }}>Our machines keep some of Mumbai's finest hospitality spaces spotless every day.</div></Reveal>

          {/* Auto-scrolling marquee */}
          <div style={{ overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 60, zIndex: 1, background: `linear-gradient(to right, ${T.products}, transparent)`, pointerEvents: "none" }} />
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 60, zIndex: 1, background: `linear-gradient(to left, ${T.products}, transparent)`, pointerEvents: "none" }} />
            <div className="marquee-track">
              {[...HOTELS, { name: "& Many More", sub: "Across Mumbai", logo: null, initials: "+" }, ...HOTELS, { name: "& Many More", sub: "Across Mumbai", logo: null, initials: "+" }].map((h, i) => (
                <div key={i} className="c-card" style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 16, padding: "20px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, minWidth: 160, flexShrink: 0 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 12, background: dark ? "#1E2228" : "#F0F4FA", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: `0.5px solid ${T.border}` }}>
                    {h.logo ? (
                      <>
                        <img src={h.logo} alt={h.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }}
                          onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }} />
                        <div style={{ display: "none", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", ...T.serif, fontSize: 18, fontWeight: 700, color: dark ? "#7BB8E8" : T.blueDark }}>{h.initials}</div>
                      </>
                    ) : (
                      <div style={{ ...T.serif, fontSize: 22, fontWeight: 700, color: T.muted }}>+</div>
                    )}
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text, lineHeight: 1.3 }}>{h.name}</div>
                    <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{h.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ background: dark ? "#161B24" : T.blueDark, color: "#fff", textAlign: "center", padding: sp }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "#9FE1CB", marginBottom: 8 }}>Get In Touch</div>
          <div style={{ ...T.serif, fontSize: mob ? 26 : 32, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Ready to Clean Smarter?</div>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, marginBottom: 32 }}>Contact us for sales, rentals, spare parts, or servicing.</p>

          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
            <a href="https://wa.me/918108576115" target="_blank" rel="noreferrer" style={{ background: "#25D366", color: "#fff", padding: "13px 28px", borderRadius: 10, fontWeight: 600, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
              <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "#fff" }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat on WhatsApp
            </a>
            <a href="tel:+918108576115" style={{ background: "rgba(255,255,255,0.12)", border: "0.5px solid rgba(255,255,255,0.25)", color: "#fff", padding: "13px 28px", borderRadius: 10, fontWeight: 600, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
              <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "#fff" }}><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
              Call Now
            </a>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {[
              { label: "Phone", val: "+91 81085 76115", href: "tel:+918108576115", icon: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" },
              { label: "Email", val: "sales@a1cmss.com", href: "mailto:sales@a1cmss.com", icon: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" },
              { label: "Location", val: "Mumbai, India", href: "https://maps.google.com/?q=Mumbai,India", icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" },
            ].map(c => (
              <a key={c.label} href={c.href} target={c.label === "Location" ? "_blank" : undefined} rel="noreferrer" style={{ background: "rgba(255,255,255,0.1)", border: "0.5px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "20px 26px", minWidth: mob ? "100%" : 170, display: "block", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.15)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                  <svg viewBox="0 0 24 24" style={{ width: 17, height: 17, fill: "#fff" }}><path d={c.icon} /></svg>
                </div>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", color: "rgba(255,255,255,0.55)", marginBottom: 5 }}>{c.label}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>{c.val}</div>
              </a>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ padding: mob ? "28px 5%" : "32px 5%", borderTop: `0.5px solid ${T.border}`, background: T.bg }}>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: mob ? 28 : 40, marginBottom: 24 }}>
            <div>
              <div style={{ ...T.serif, fontWeight: 700, fontSize: 18, marginBottom: 10 }}>
                <span style={{ color: dark ? "#7BB8E8" : T.blueDark }}>A1</span><span style={{ color: T.teal }}>CMSS</span>
              </div>
              <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.7 }}>A-1 Cleaning Machines Sales And Service — Mumbai's trusted partner for industrial cleaning equipment.</p>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: T.muted, marginBottom: 12 }}>Quick Links</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[["Services", "#services"], ["Products", "#products"], ["Gallery", "#gallery"], ["Clients", "#clients"], ["Contact", "#contact"]].map(([label, href]) => (
                  <a key={label} href={href} style={{ fontSize: 13, color: T.gray, fontWeight: 500, transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = T.blue}
                    onMouseLeave={e => e.currentTarget.style.color = T.gray}>{label}</a>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: T.muted, marginBottom: 12 }}>Contact</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <a href="tel:+918108576115" style={{ fontSize: 13, color: T.gray, fontWeight: 500 }}>+91 81085 76115</a>
                <a href="mailto:sales@a1cmss.com" style={{ fontSize: 13, color: T.gray, fontWeight: 500 }}>sales@a1cmss.com</a>
                <span style={{ fontSize: 13, color: T.gray }}>Mumbai, India</span>
                <a href="https://wa.me/918108576115" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 4, background: "#25D366", color: "#fff", padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, width: "fit-content" }}>
                  <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, fill: "#fff" }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
          <div style={{ borderTop: `0.5px solid ${T.border}`, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12, color: T.muted }}>© 2025 A-1 Cleaning Machines Sales And Service. All rights reserved.</span>
            <span style={{ fontSize: 12, color: T.muted }}>Mumbai, India</span>
          </div>
        </footer>

        {/* WhatsApp FAB */}
        <a href="https://wa.me/918108576115" target="_blank" rel="noreferrer"
          title="Chat on WhatsApp"
          style={{ position: "fixed", bottom: 24, right: 24, zIndex: 200, width: 56, height: 56, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(37,211,102,0.45)", animation: "wa-pulse 2.5s infinite", cursor: "pointer" }}>
          <svg viewBox="0 0 24 24" style={{ width: 28, height: 28, fill: "#fff" }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>

      </div>
    </>
  );
}