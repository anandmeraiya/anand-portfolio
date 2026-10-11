import { useEffect, useRef, useState } from "react";
import {
  motion, AnimatePresence, animate, useInView, useMotionValue,
  useScroll, useSpring, useTransform,
} from "framer-motion";

import { 
  Play, Pause, ArrowUpRight, ArrowDown, Mail, Video, Film, 
  Sparkles, Palette, Plus, X, MessageCircle 
} from "lucide-react";

/* ───────── WHATSAPP CONFIGURATION ───────── */
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL;
const INSTAGRAM_URL = import.meta.env.VITE_INSTAGRAM_URL;
const WHATSAPP_MESSAGE = encodeURIComponent("Hi Anand, I'd love to discuss a video project!");
const WHATSAPP_URL = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + WHATSAPP_MESSAGE;

/* ───────── GLOBAL STYLES ───────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Inter:wght@300;400;500&family=Instrument+Serif:ital@1&display=swap');
.f-d{font-family:'Bricolage Grotesque',sans-serif}.f-b{font-family:'Inter',sans-serif}
.f-i{font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;letter-spacing:-.02em}
body{background:#F3F1EC;color:#0E0E0E;margin:0}
html{scroll-behavior:smooth}
::selection{background:#FF4D00;color:#fff}
.has-cur,.has-cur *{cursor:none!important}
@keyframes marq{to{transform:translateX(-50%)}}
@keyframes spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;scroll-behavior:auto!important}}
`;
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>")`;
const OR = "#FF4D00";
const ease = [0.16, 1, 0.3, 1];

/* ───────── LOCAL MEDIA ───────── */
const base = import.meta.env.BASE_URL;

const PORTRAIT = base + "images/anand-portrait.jpg";

const PROJECTS = [
  { t: "Urban Pulse", c: "Fashion", d: "0:42", video: base + "videos/reel1.mp4", img: base + "images/thumb1.jpg", r: "aspect-[9/16]" },
  { t: "Cinematic drive", c: "Cars", d: "1:05", video: base + "videos/reel2.mp4", img: base + "images/thumb2.jpg", r: "aspect-[9/16]" },
  { t: "Railway tracks", c: "Stories", d: "3:48", video: base + "videos/reel4.mp4", img: base + "images/thumb4.jpg", r: "aspect-[4/3]" },
  { t: "Silk Cut", c: "Fashion", d: "0:30", video: base + "videos/reel5.mp4", img: base + "images/thumb5.jpg", r: "aspect-[4/3]" },
  { t: "Low Light", c: "Music", d: "4:02", video: base + "videos/reel8.mp4", img: base + "images/thumb8.jpg", r: "aspect-[4/5]" },
  { t: "Redline", c: "Automotive", d: "0:58", video: base + "videos/reel6.mp4", img: base + "images/thumb6.jpg", r: "aspect-[4/5]" },
  { t: "The Artisan", c: "Documentary", d: "0:42", video: base + "videos/reel3.mp4", img: base + "images/thumb3.jpg", r: "aspect-[9/16]" },
  { t: "Birthday special", c: "Documentary", d: "12:10", video: base + "videos/reel7.mp4", img: base + "images/thumb7.jpg", r: "aspect-square" },
];
const FILTERS = ["All", "Fashion", "Automotive", "Documentary", "Music", "Cars", "Stories"];

/* ───────── SHARED BITS ───────── */
const Corners = ({ c = "#0E0E0E", inset = "m-4" }) => (
  <>
    {["top-0 left-0 border-t-2 border-l-2", "top-0 right-0 border-t-2 border-r-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map((k) => (
      <i key={k} className={"pointer-events-none absolute h-5 w-5 " + inset + " " + k} style={{ borderColor: c }} />
    ))}
  </>
);

function TC({ className = "" }) {
  const [f, setF] = useState(0);
  useEffect(() => { const t = setInterval(() => setF((v) => v + 1), 1000 / 24); return () => clearInterval(t); }, []);
  const p = (n) => String(n).padStart(2, "0");
  return <span className={"tabular-nums " + className}>{p(Math.floor(f / 1440) % 60)}:{p(Math.floor(f / 24) % 60)}:{p(f % 24)}</span>;
}

function Count({ to, suffix = "" }) {
  const r = useRef(null), seen = useInView(r, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => { if (seen) animate(0, to, { duration: 2, ease, onUpdate: (v) => setN(Math.round(v)) }); }, [seen, to]);
  return <span ref={r}>{n}{suffix}</span>;
}

const Line = ({ children, d = 0, className = "" }) => (
  <span className={"block overflow-hidden pb-[.08em] " + className}>
    <motion.span className="block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: d, ease }}>{children}</motion.span>
  </span>
);

function Magnet({ children, className = "", ...rest }) {
  const ref = useRef(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sp = { stiffness: 220, damping: 14 };
  const x = useSpring(mx, sp), y = useSpring(my, sp);
  return (
    <motion.a ref={ref} style={{ x, y }} {...rest} className={className}
      onMouseMove={(e) => { 
        if (!ref.current) return;
        const b = ref.current.getBoundingClientRect(); 
        mx.set((e.clientX - b.left - b.width / 2) * 0.35); 
        my.set((e.clientY - b.top - b.height / 2) * 0.35); 
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}>
      {children}
    </motion.a>
  );
}

/* ───────── DUAL ELEMENT CURSOR ───────── */
function Cursor() {
  const [on, setOn] = useState(false);
  const [label, setLabel] = useState("");
  
  const smoothX = useSpring(-100, { stiffness: 450, damping: 28, mass: 0.5 });
  const smoothY = useSpring(-100, { stiffness: 450, damping: 28, mass: 0.5 });
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  useEffect(() => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    setOn(true); document.documentElement.classList.add("has-cur");
    
    const mv = (e) => { 
      smoothX.set(e.clientX); smoothY.set(e.clientY);
      dotX.set(e.clientX); dotY.set(e.clientY);
    };
    
    const ov = (e) => {
      if (e.target && typeof e.target.closest === 'function') {
        const tgt = e.target.closest("[data-cursor]");
        setLabel(tgt ? tgt.dataset.cursor : "");
      } else {
        setLabel("");
      }
    };
    
    window.addEventListener("mousemove", mv); 
    window.addEventListener("mouseover", ov);
    
    return () => { 
      window.removeEventListener("mousemove", mv); 
      window.removeEventListener("mouseover", ov); 
      document.documentElement.classList.remove("has-cur"); 
    };
  }, [smoothX, smoothY, dotX, dotY]);

  if (!on) return null;

  return (
    <>
      <motion.div style={{ x: smoothX, y: smoothY }} className="pointer-events-none fixed left-0 top-0 z-[100]">
        <motion.div animate={{ width: label ? 84 : 40, height: label ? 84 : 40, backgroundColor: label ? "#FF4D00" : "rgba(255, 77, 0, 0.1)", borderColor: label ? "#FF4D00" : "rgba(255, 77, 0, 0.35)" }} 
          transition={{ duration: 0.35, ease }} className="absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center rounded-full border-2 backdrop-blur-[2px]">
          <AnimatePresence>
            {label && (
              <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.2 }}
                className="f-b text-[11px] font-bold uppercase tracking-widest text-white">
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <motion.div style={{ x: dotX, y: dotY }} className="pointer-events-none fixed left-0 top-0 z-[100]">
        <motion.div animate={{ scale: label ? 0 : 1, opacity: label ? 0 : 1 }} transition={{ duration: 0.2 }} className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF4D00]" />
      </motion.div>
    </>
  );
}

/* ───────── NAV ───────── */
function Navbar() {
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  return (
    <>
      <motion.i style={{ scaleX: bar }} className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-[#FF4D00]" />
      <div className="fixed inset-x-0 top-5 z-50 flex justify-center px-4">
        <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.3, ease }}
          className="f-b flex items-center gap-2 rounded-full border border-black/10 bg-white/70 py-2 pl-6 pr-2 shadow-[0_10px_40px_-12px_rgba(0,0,0,.2)] backdrop-blur-xl">
          <a href="#top" className="f-d mr-4 text-xl font-extrabold tracking-tight">Anand<span className="text-[#FF4D00]">.</span></a>
          {["Work", "Expertise", "Process"].map((l) => (
            <a key={l} href={"#" + l.toLowerCase()} className="hidden rounded-full px-4 py-2 text-sm text-black/60 transition hover:bg-black/5 hover:text-black md:block">{l}</a>
          ))}
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-full bg-[#0E0E0E] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#25D366]">
            Let's talk <ArrowUpRight size={15} />
          </a>
        </motion.nav>
      </div>
    </>
  );
}

/* ───────── HERO ───────── */
function Hero() {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [isMobile]);

  const { scrollYProgress: s } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const py = useTransform(s, [0, 1], [0, 90]);
  const ty = useTransform(s, [0, 1], [0, -60]);

  return (
    <section id="top" ref={ref} className="relative w-full overflow-hidden min-h-[90vh] flex flex-col justify-center pb-12 pt-28 md:pt-24">
      <div className="absolute inset-0 z-0 bg-black">
        <video ref={videoRef} key={isMobile ? "hero-mob" : "hero-desk"} src={isMobile ? base + "videos/showreel2.mp4" : base + "videos/hero.mp4"} autoPlay muted loop playsInline className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[#F3F1EC]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-12 mt-8 md:mt-0">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          
          <motion.div style={{ y: ty }} className="relative z-10 lg:col-span-7">
            <h1 className="f-d text-[clamp(2.8rem,7vw,7.5rem)] font-extrabold leading-[.9] tracking-[-.045em] text-white">
              <Line d={0.2}>Anand cuts</Line>
              <Line d={0.35} className="f-i ml-[6vw] text-[#FF4D00] lg:ml-[9rem]">the moments</Line>
              <Line d={0.5}>people replay.</Line>
            </h1>
            
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1, ease }} className="mt-8 flex flex-col gap-6 md:flex-row md:items-center">
              <p className="f-b max-w-sm text-base md:text-lg leading-relaxed text-white/75">
                Editor and videographer for reels, ads and music videos. Sharp pacing, honest color, and a cut that lands on the beat.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#work" data-cursor="View" className="f-b flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition hover:bg-[#FF4D00] hover:text-white">See the work <ArrowDown size={16} /></a>
                <a href="#reel" className="f-b flex items-center gap-2 rounded-full border border-white/20 text-white px-6 py-3.5 text-sm font-medium transition hover:border-white hover:bg-white/10"><Play size={14} fill="currentColor" /> Showreel</a>
              </div>
            </motion.div>
          </motion.div>

          <motion.div style={{ y: py }} initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.4, ease }}
            className="relative mx-auto w-full max-w-[460px] lg:col-span-5 mt-6 lg:mt-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-[#1A1A1A] border-[3px] border-white/15 shadow-2xl">
              <img src={PORTRAIT} alt="Anand" className="h-full w-full object-cover object-center grayscale-[.15]" />
              <Corners c="#fff" inset="m-5" />
              <div className="f-b absolute inset-x-5 bottom-5 flex items-center justify-between rounded-full bg-black/70 px-4 py-2.5 text-xs text-white backdrop-blur-md border border-white/10">
                <span className="flex items-center gap-2"><i className="h-2 w-2 animate-pulse rounded-full bg-[#FF4D00]" />REC · IN STUDIO</span>
                <TC />
              </div>
            </div>

            <div className="absolute -left-4 -top-8 md:-left-8 md:-top-8 grid h-28 w-28 md:h-32 md:w-32 place-items-center rounded-full bg-[#0E0E0E] border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,.6)]">
              <svg viewBox="0 0 120 120" className="absolute inset-0 animate-[spin_16s_linear_infinite]">
                <defs><path id="ring" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" /></defs>
                <text className="f-b fill-white/80 text-[10.5px]"><textPath href="#ring" textLength="284" lengthAdjust="spacing">Open for new projects • Open for new projects •</textPath></text>
              </svg>
              <span className="grid h-10 w-10 md:h-12 md:w-12 place-items-center rounded-full bg-[#FF4D00] text-white"><ArrowDown size={20} /></span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────── FILM STRIP ───────── */
function StripCell({ item, index }) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <div className="relative h-36 w-60 shrink-0 overflow-hidden rounded-md md:h-44 md:w-72 bg-[#1A1A1A]">
      {!imgFailed ? (
        <img src={item.img} alt={item.t} loading="lazy" className="h-full w-full object-cover opacity-90 transition duration-300 hover:opacity-100" onError={() => setImgFailed(true)} />
      ) : (
        <video src={item.video + "#t=1.0"} muted playsInline preload="metadata" className="h-full w-full object-cover opacity-85" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      <span className="f-b absolute bottom-2 left-3 text-[10px] uppercase tracking-wider text-white/80 font-medium pointer-events-none">0{((index % 8) + 1)} · {item.t}</span>
    </div>
  );
}

function Strip() {
  const row = [...PROJECTS, ...PROJECTS];
  const perf = "h-2.5 bg-[radial-gradient(#F3F1EC_32%,transparent_36%)] bg-[length:22px_10px]";
  return (
    <div className="-rotate-1 overflow-hidden bg-[#0E0E0E] py-3 mt-4">
      <div className={perf} />
      <div className="my-3 flex w-max animate-[marq_60s_linear_infinite] gap-3 hover:[animation-play-state:paused]">
        {row.map((item, i) => <StripCell key={item.t + "-" + i} item={item} index={i} />)}
      </div>
      <div className={perf} />
    </div>
  );
}

/* ───────── MAIN SHOWREEL ───────── */
function Showreel() {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
      videoRef.current.play().catch(() => {});
    }
  }, [isMobile, muted]);

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const clip = useTransform(p, [0, 0.55], ["inset(20% 24% round 56px)", "inset(0% 0% round 0px)"]);
  const scale = useTransform(p, [0, 1], [1.3, 1]);
  const head = useTransform(p, [0, 0.35], [1, 0]);

  return (
    <section id="reel" ref={ref} className="relative h-[230vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.h2 style={{ opacity: head }} className="f-d absolute inset-x-0 top-[9vh] text-center text-[clamp(3rem,11vw,10rem)] font-extrabold leading-none tracking-[-.05em] text-black/[.07]">
          Showreel 2026
        </motion.h2>

        <motion.div style={{ clipPath: clip }} className="absolute inset-0 bg-black">
          <motion.div style={{ scale }} className="absolute inset-0">
            <video ref={videoRef} key={isMobile ? "reel-mob" : "reel-desk"} src={isMobile ? base + "videos/showreel2.mp4" : base + "videos/showreel1.mp4"} autoPlay muted={muted} loop playsInline className="h-full w-full object-cover" />
          </motion.div>

          <div className="absolute inset-0 bg-black/25" />
          <Corners c="#fff" inset="m-8" />

          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <button onClick={() => setMuted(!muted)} className="pointer-events-auto rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-6 py-3 text-xs uppercase tracking-widest text-white transition hover:bg-[#FF4D00] hover:border-[#FF4D00]">
              {muted ? "Click for Audio" : "Mute Audio"}
            </button>
          </div>

          <div className="f-b absolute inset-x-10 bottom-10 text-xs text-white/80">
            <div className="mt-3 flex justify-between">
              <TC />
              <span>SHOWREEL · {isMobile ? "VERTICAL" : "4K"}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────── STATS ───────── */
function Stats() {
  const S = [
    [120, "+", "edits delivered"], 
    [8, "M+", "views across client reels"], 
    [3, "", "years on the timeline"], 
    [24, "h", "typical rough-cut turnaround"]
  ];
  return (
    <section className="mx-auto grid max-w-[1400px] grid-cols-2 gap-y-12 px-6 py-24 md:grid-cols-4 md:px-12">
      {S.map(([n, s, l], i) => (
        <motion.div key={l} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.8, ease }}>
          <p className="f-d text-5xl md:text-7xl font-extrabold tracking-tighter"><Count to={n} suffix={s} /></p>
          <p className="f-b mt-2 max-w-[11rem] text-sm text-black/55">{l}</p>
        </motion.div>
      ))}
    </section>
  );
}

/* ───────── WORK & LIGHTBOX ───────── */
/* ───────── WORK & LIGHTBOX ───────── */
function Card({ p }) {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const sx = useMotionValue(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleMouseEnter = () => { if (videoRef.current) videoRef.current.play().catch(() => {}); };
  const handleMouseLeave = () => { if (videoRef.current) videoRef.current.pause(); };

  return (
    <>
      <motion.article layout initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.7, ease }} 
        data-cursor="Preview" className="group mb-10 break-inside-avoid cursor-pointer"
        onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => setIsPreviewOpen(true)}
        onMouseMove={(e) => { 
          if (!ref.current) return;
          const b = ref.current.getBoundingClientRect(); 
          sx.set(Math.min(1, Math.max(0, (e.clientX - b.left) / b.width))); 
        }}>
        <div ref={ref} className={"relative overflow-hidden rounded-[1.75rem] bg-[#1A1A1A] " + p.r}>
          {/* Removed poster prop, changed preload to "metadata", added #t=0.1 to auto-generate thumbnail */}
          <video 
            ref={videoRef} 
            src={p.video + "#t=0.1"} 
            muted 
            loop 
            playsInline 
            preload="metadata" 
            className="h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-105" 
          />
          
          {/* Centered Glassmorphism Play Button */}
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white transition-all duration-500 ease-out group-hover:scale-110 group-hover:opacity-0 group-hover:bg-[#FF4D00]">
              <Play size={24} fill="currentColor" className="ml-1" />
            </div>
          </div>

          <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
          <div className="opacity-0 transition duration-500 group-hover:opacity-100"><Corners c="#fff" inset="m-4" /></div>
          
          <div className="f-b absolute inset-x-6 bottom-6 translate-y-3 z-20 text-xs text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="h-[3px] rounded bg-white/30"><motion.i style={{ scaleX: sx }} className="block h-full origin-left rounded bg-[#FF4D00]" /></div>
            <div className="mt-2 flex justify-between"><span>{p.d}</span><span>Tap to Expand</span></div>
          </div>
        </div>
        
        <div className="mt-4 flex items-start justify-between px-1">
          <div>
            <h3 className="f-d text-2xl font-bold tracking-tight">{p.t}</h3>
            <p className="f-b mt-0.5 text-sm text-black/50">{p.c}</p>
          </div>
          <ArrowUpRight className="mt-1 text-black/30 transition group-hover:rotate-45 group-hover:text-[#FF4D00]" />
        </div>
      </motion.article>

      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md" onClick={() => setIsPreviewOpen(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative max-h-full w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <button className="absolute right-4 top-4 z-20 rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition hover:bg-white/40" onClick={() => setIsPreviewOpen(false)}><X size={20} /></button>
              <video src={p.video} controls autoPlay className="h-full max-h-[80vh] w-full object-contain" />
              <div className="w-full bg-[#111] p-4 flex justify-between items-center text-white">
                <div><h4 className="f-d text-lg font-bold">{p.t}</h4><p className="f-b text-xs text-white/60">{p.c} · {p.d}</p></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Work() {
  const [f, setF] = useState("All");
  const list = PROJECTS.filter((p) => f === "All" || p.c === f);
  return (
    <section id="work" className="mx-auto max-w-[1400px] px-6 pb-28 md:px-12">
      <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <h2 className="f-d text-6xl font-extrabold leading-[.9] tracking-[-.045em] md:text-8xl">Selected<br /><span className="f-i text-[#FF4D00]">works</span></h2>
        <div className="f-b flex flex-wrap gap-2">
          {FILTERS.map((k) => (
            <button key={k} onClick={() => setF(k)} className="relative rounded-full px-5 py-2.5 text-sm transition hover:bg-black/5">
              {f === k && <motion.span layoutId="chip" className="absolute inset-0 rounded-full bg-[#0E0E0E]" transition={{ duration: 0.5, ease }} />}
              <span className={"relative " + (f === k ? "text-white" : "text-black/60")}>{k}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="columns-1 gap-10 md:columns-2 lg:columns-3">
        <AnimatePresence mode="popLayout">{list.map((p) => <Card key={p.t} p={p} />)}</AnimatePresence>
      </div>
    </section>
  );
}

/* ───────── EXPERTISE ───────── */
const SK = [
  { t: "Video editing", I: Video, d: "Story-first cutting: pacing, rhythm and transitions that keep people watching to the last frame.", tools: ["Premiere Pro", "Final Cut", "DaVinci Resolve"] },
  { t: "Color grading", I: Palette, d: "Mood and cinematic look, matched across every shot and every platform.", tools: ["DaVinci Resolve", "LUT design", "Film emulation"] },
  { t: "Motion graphics", I: Sparkles, d: "Kinetic type, tracking and light VFX that lift the footage without taking it over.", tools: ["After Effects", "Cinema 4D", "Photoshop"] },
  { t: "Videography", I: Film, d: "On-set shooting, lighting and direction for polished digital content.", tools: ["Cinema cameras", "Lighting", "Sound capture"] },
];

function Expertise() {
  const [open, setOpen] = useState(0);
  return (
    <section id="expertise" className="relative overflow-hidden rounded-[3rem] bg-[#0E0E0E] px-6 py-28 text-white md:px-12">
      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.25, 0.45, 0.25] }} transition={{ duration: 10, repeat: Infinity }} className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-[#FF4D00] blur-[140px]" />
      <div className="relative mx-auto flex max-w-[1400px] flex-col gap-16 lg:flex-row lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:h-fit lg:w-1/3">
          <h2 className="f-d text-6xl font-extrabold leading-[.9] tracking-[-.045em] md:text-8xl">The<br /><span className="f-i text-[#FF4D00]">toolkit</span></h2>
          <p className="f-b mt-6 max-w-xs leading-relaxed text-white/50">From the first raw clip to the final grade, every step of post-production is handled in one place.</p>
        </div>
        <div className="lg:w-2/3">
          {SK.map((s, i) => (
            <div key={s.t} onMouseEnter={() => setOpen(i)} onClick={() => setOpen(i)} className="cursor-pointer border-t border-white/15 py-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <s.I className={"h-7 w-7 transition-colors " + (open === i ? "text-[#FF4D00]" : "text-white/30")} />
                  <h3 className={"f-d text-4xl font-bold tracking-tight transition-colors duration-500 md:text-6xl " + (open === i ? "text-white" : "text-white/30")}>{s.t}</h3>
                </div>
                <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20"><Plus size={18} /></motion.span>
              </div>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.6, ease }} className="overflow-hidden">
                    <p className="f-b mt-6 max-w-lg pl-12 leading-relaxed text-white/60 md:pl-12">{s.d}</p>
                    <div className="f-b mt-5 flex flex-wrap gap-2 pl-12">{s.tools.map((t) => <span key={t} className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-white/70">{t}</span>)}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <div className="border-t border-white/15" />
        </div>
      </div>
    </section>
  );
}

/* ───────── PROCESS ───────── */
const STEPS = [
  ["Ingest", "Footage is synced, logged and organised before a single cut is made."],
  ["Rough cut", "The story takes shape. You see a first assembly fast."],
  ["Pace and polish", "Rhythm, sound, titles and motion get tightened to the beat."],
  ["Grade and deliver", "Final color, mastering and exports for every platform."],
];

function Process() {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start 75%", "end 65%"] });
  return (
    <section id="process" ref={ref} className="mx-auto max-w-[1400px] px-6 py-32 md:px-12">
      <h2 className="f-d max-w-3xl text-5xl font-extrabold leading-[.95] tracking-[-.04em] md:text-7xl">From raw footage <span className="f-i text-[#FF4D00]">to final frame</span></h2>
      <div className="relative mt-20 grid gap-12 md:grid-cols-4">
        <div className="absolute left-0 right-0 top-5 hidden h-px bg-black/10 md:block"><motion.i style={{ scaleX: p }} className="block h-full origin-left bg-[#FF4D00]" /></div>
        {STEPS.map(([t, d], i) => (
          <motion.div key={t} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: i * 0.12, duration: 0.8, ease }}>
            <motion.span whileInView={{ backgroundColor: OR, color: "#fff", borderColor: OR }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: 0.4 + i * 0.2 }} className="f-d relative grid h-10 w-10 place-items-center rounded-full border border-black/20 bg-[#F3F1EC] text-sm font-bold">{i + 1}</motion.span>
            <h3 className="f-d mt-6 text-2xl font-bold tracking-tight">{t}</h3>
            <p className="f-b mt-2 max-w-[16rem] text-sm leading-relaxed text-black/55">{d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ───────── FOOTER ───────── */
function Footer() {
  const words = Array.from({ length: 10 }, () => "Let's make something people replay ✦ ");
  return (
    <footer id="contact" className="relative mt-10 overflow-hidden rounded-t-[3rem] bg-[#0E0E0E] pb-10 pt-28 text-white">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-14 px-6 md:flex-row md:items-end md:px-12">
        <motion.h2 initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease }} className="f-d text-[clamp(3.5rem,10vw,9rem)] font-extrabold leading-[.88] tracking-[-.05em]">
          Got a story<br /><span className="f-i text-[#FF4D00]">to cut?</span>
        </motion.h2>
        
        <Magnet href={WHATSAPP_URL} target="_blank" rel="noreferrer" data-cursor="Chat" className="f-d grid h-44 w-44 shrink-0 place-items-center rounded-full bg-[#FF4D00] text-center text-xl font-bold leading-tight shadow-[0_0_100px_rgba(255,77,0,.45)] md:h-52 md:w-52 transition-transform hover:scale-105">
          Start a<br />project<ArrowUpRight className="mx-auto mt-1" />
        </Magnet>
      </div>
      
      <div className="mx-auto mt-12 flex max-w-[1400px] flex-wrap items-center gap-4 px-6 md:px-12">
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center justify-center md:justify-start gap-2 rounded-full border border-white/15 px-7 py-4 transition hover:border-[#25D366] hover:text-[#25D366] bg-white/5 md:bg-transparent">
          <MessageCircle size={18} /> Chat on WhatsApp
        </a>

        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex items-center justify-center md:justify-start gap-2 rounded-full border border-white/15 px-7 py-4 transition hover:border-[#E1306C] hover:text-[#E1306C]">
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg> 
          Instagram
        </a>

        <a href={"mailto:" + CONTACT_EMAIL} className="flex items-center justify-center md:justify-start gap-2 rounded-full border border-white/15 px-7 py-4 transition hover:border-[#FF4D00] hover:text-[#FF4D00]">
          <Mail size={18} /> {CONTACT_EMAIL}
        </a>
      </div>
      
      <div className="mt-20 flex overflow-hidden whitespace-nowrap border-y border-white/10 py-5 text-white/25">
        <div className="f-i flex shrink-0 animate-[marq_45s_linear_infinite] text-3xl">{words.map((w, i) => <span key={i}>{w}</span>)}{words.map((w, i) => <span key={"b" + i}>{w}</span>)}</div>
      </div>
      <p className="f-b mx-auto mt-8 max-w-[1400px] px-6 text-sm text-white/35 md:px-12">© 2026 Anand Studio. All rights reserved.</p>
    </footer>
  );
}

export default function AnandPortfolio() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <style>{CSS}</style>
      <div className="pointer-events-none fixed inset-0 z-[60] opacity-[.08] mix-blend-multiply" style={{ backgroundImage: GRAIN }} />
      <Cursor />
      <Navbar />
      <Hero />
      <Strip />
      <Showreel />
      <Stats />
      <Work />
      <Expertise />
      <Process />
      <Footer />
    </main>
  );
}