import { useEffect, useRef, useState, useMemo } from "react";
import {
  motion, animate, useScroll, useTransform, useSpring,
  useMotionValue, useMotionValueEvent,
} from "framer-motion";
import {
  Play, Scissors, Palette, Layers, Aperture, Music, Sparkles,
  ArrowUpRight, Mail, Zap,
} from "lucide-react";

/* Requires: @import "tailwindcss"; (Tailwind v4) in your main CSS. */

const C = { v: "#8b5cf6", c: "#22d3ee", p: "#ff2d95" };
const U = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const glass = "bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]";
const ease = [0.16, 1, 0.3, 1];

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&family=Instrument+Serif:ital@0;1&display=swap');
.f-d{font-family:'Instrument Serif',Georgia,serif}.f-s{font-family:'Space Grotesk',system-ui,sans-serif}
.stroke-t{-webkit-text-stroke:1.5px rgba(255,255,255,.6);color:transparent}
@keyframes marq{to{transform:translateX(-50%)}}
html{scroll-behavior:smooth}
@media (prefers-reduced-motion:reduce){*{animation:none!important;scroll-behavior:auto!important}}`;

const Pic = ({ id, g, className = "", w }) => {
  const [ok, setOk] = useState(true);
  return (
    <div className={`absolute inset-0 ${className}`} style={{ background: g }}>
      {ok && (
        <img src={U(id, w)} alt="" loading="lazy" onError={() => setOk(false)}
          className="h-full w-full object-cover opacity-80 mix-blend-luminosity" />
      )}
    </div>
  );
};

const Orb = ({ c, size, x, y, d, dx = 120, dy = 90 }) => (
  <motion.div className="absolute rounded-full pointer-events-none"
    style={{ width: size, height: size, left: x, top: y, filter: "blur(70px)",
      background: `radial-gradient(circle, ${c} 0%, transparent 65%)` }}
    animate={{ x: [0, dx, -dx / 1.5, 0], y: [0, -dy, dy, 0], scale: [1, 1.3, 0.9, 1], opacity: [0.4, 0.8, 0.5, 0.4] }}
    transition={{ duration: d, repeat: Infinity, ease: "easeInOut" }} />
);

const Tilt = ({ children, className = "", glow }) => {
  const r = useRef(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sp = { stiffness: 200, damping: 20 };
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), sp);
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), sp);
  const move = (e) => {
    const b = r.current.getBoundingClientRect();
    mx.set((e.clientX - b.left) / b.width - 0.5);
    my.set((e.clientY - b.top) / b.height - 0.5);
  };
  return (
    <motion.div ref={r} onMouseMove={move} onMouseLeave={() => { mx.set(0); my.set(0); }}
      whileHover={{ scale: 1.03 }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900, "--g": glow }}
      className={`group relative transition-shadow duration-500 hover:shadow-[0_0_70px_-8px_var(--g)] ${className}`}>
      {children}
    </motion.div>
  );
};

const Split = ({ text }) => (
  <span className="inline-flex overflow-hidden pb-[.1em]">
    {[...text].map((ch, i) => (
      <motion.span key={i} className="inline-block" initial={{ y: "115%", rotate: 8 }}
        animate={{ y: 0, rotate: 0 }} transition={{ delay: 0.2 + i * 0.06, duration: 1, ease }}>
        {ch === " " ? "\u00A0" : ch}
      </motion.span>
    ))}
  </span>
);

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const rise = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease } },
};

/* ───────────── NAV ───────────── */
function Nav() {
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  const [h, setH] = useState(null);
  const links = ["Reel", "Work", "Tools", "Contact"];
  return (
    <div className="fixed inset-x-0 top-5 z-50 flex justify-center px-4">
      <motion.nav initial={{ y: -90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 1, ease }}
        className={`${glass} relative flex items-center gap-1 overflow-hidden rounded-full py-2 pl-5 pr-2 shadow-[0_10px_60px_-10px_rgba(139,92,246,.5)]`}>
        <a href="#reel" className="f-d mr-3 text-xl italic">Anand</a>
        <div className="hidden items-center sm:flex" onMouseLeave={() => setH(null)}>
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} onMouseEnter={() => setH(l)}
              className="relative px-4 py-2 text-sm text-white/70 transition hover:text-white">
              {h === l && <motion.span layoutId="pill" className="absolute inset-0 rounded-full bg-white/10" />}
              <span className="relative z-10">{l}</span>
            </a>
          ))}
        </div>
        <a href="#contact" className="ml-2 flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:shadow-[0_0_30px_#22d3ee]">
          <Zap size={14} /> Book me
        </a>
        <motion.i style={{ scaleX: bar }} className="absolute bottom-0 left-0 h-px w-full origin-left bg-linear-to-r from-violet-500 via-cyan-400 to-pink-500" />
      </motion.nav>
    </div>
  );
}

/* ───────────── HERO + TIMELINE ───────────── */
const SCENES = [
  { t: "Neon Drift", id: "1550745165-9bc0b252726f", g: `linear-gradient(135deg,${C.v},${C.p})` },
  { t: "Afterglow", id: "1563089145-599997674d42", g: `linear-gradient(135deg,${C.c},${C.v})` },
  { t: "Night Shift", id: "1478720568477-152d9b164e26", g: `linear-gradient(135deg,${C.p},${C.c})` },
];
const TRACKS = [
  { n: "V2", a: false, clips: [[4, 26, "Title", C.p], [36, 20, "Overlay", C.v], [62, 32, "LUT", C.c]] },
  { n: "V1", a: false, clips: [[0, 34, "A-roll", C.v], [34, 28, "B-roll", C.c], [62, 38, "Outro", C.p]] },
  { n: "A1", a: true, clips: [[0, 100, "Mix", C.c]] },
  { n: "A2", a: true, clips: [[8, 40, "Voice", C.p], [52, 44, "Score", C.v]] },
];

const Wave = ({ color, seed }) => {
  const bars = useMemo(() => Array.from({ length: 40 }, (_, i) =>
    18 + Math.abs(Math.sin(i * 0.7 + seed) * Math.cos(i * 0.23 + seed * 2)) * 82), [seed]);
  return (
    <div className="flex h-full items-center gap-[2px] overflow-hidden px-1">
      {bars.map((b, i) => <i key={i} className="min-w-[2px] flex-1 rounded-full" style={{ height: `${b}%`, background: color, opacity: 0.8 }} />)}
    </div>
  );
};

function Player() {
  const tl = useRef(null), ctl = useRef(null);
  const x = useMotionValue(0);
  const [p, setP] = useState(0);
  const W = () => (tl.current?.offsetWidth || 16) - 16;
  
  useMotionValueEvent(x, "change", (v) => setP(Math.min(1, Math.max(0, v / W()))));
  
  const run = () => {
    ctl.current?.stop();
    const w = W();
    if (x.get() >= w - 2) x.set(0);
    ctl.current = animate(x, w, { duration: 16 * (1 - x.get() / w), ease: "linear", onComplete: run });
  };
  
  useEffect(() => { const t = setTimeout(run, 1400); return () => { clearTimeout(t); ctl.current?.stop(); }; }, []);
  
  const f = Math.round(p * 1799);
  const tc = [Math.floor(f / 1800), Math.floor(f / 30) % 60, f % 30].map((n) => String(n).padStart(2, "0")).join(":");
  const scene = Math.min(2, Math.floor(p * 3));

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className={`${glass} relative rounded-[2rem] p-3 shadow-[0_30px_120px_-20px_rgba(34,211,238,.35)] md:p-4`}>
        <div className="mb-3 flex items-center justify-between px-2 text-xs text-white/50">
          <span className="flex items-center gap-2"><i className="h-2 w-2 animate-pulse rounded-full bg-[#ff2d95]" />reel_2026_v14</span>
          <span className="text-sm tabular-nums text-white">00:{tc}</span>
        </div>
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 md:aspect-[16/7]">
          {SCENES.map((s, i) => (
            <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === scene ? "opacity-100" : "opacity-0"}`}>
              <Pic id={s.id} g={s.g} w={1000} />
            </div>
          ))}
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-black/30" />
          <button onClick={run} aria-label="Play reel"
            className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-white/10 backdrop-blur-xl transition hover:scale-110 hover:shadow-[0_0_50px_#22d3ee] md:h-16 md:w-16">
            <Play size={20} fill="white" />
          </button>
          <p className="f-d absolute bottom-3 left-4 text-2xl italic md:text-3xl">{SCENES[scene].t}</p>
        </div>

        <div className="mt-4 flex gap-2 md:gap-3">
          <div className="flex w-6 flex-col pt-6 text-[9px] text-white/40 md:w-7 md:text-[10px]">
            {TRACKS.map((t) => <div key={t.n} className="mb-2 flex h-8 items-center md:h-10">{t.n}</div>)}
          </div>
          <div ref={tl} className="relative flex-1">
            <div className="flex h-6 items-start justify-between pr-1 text-white/30">
              {Array.from({ length: 21 }, (_, i) => <i key={i} className="w-px bg-current" style={{ height: i % 5 ? 5 : 11 }} />)}
            </div>
            {TRACKS.map((t) => (
              <div key={t.n} className="relative mb-2 h-8 md:h-10">
                {t.clips.map(([l, w, n, c], i) => (
                  <motion.div key={i} whileHover={{ y: -2, filter: "brightness(1.4)" }}
                    className="absolute top-0 h-full overflow-hidden rounded-md border text-[9px] md:text-[10px]"
                    style={{ left: `${l}%`, width: `calc(${w}% - 2px)`, background: `${c}26`, borderColor: `${c}88` }}>
                    {t.a ? <Wave color={c} seed={l + w} /> : <span className="px-1.5 leading-8 text-white/80 md:px-2 md:leading-10">{n}</span>}
                  </motion.div>
                ))}
              </div>
            ))}
            <motion.div drag="x" dragConstraints={tl} dragElastic={0} dragMomentum={false}
              onPointerDown={() => ctl.current?.stop()} style={{ x }}
              className="absolute bottom-0 left-0 top-0 z-20 w-6 cursor-ew-resize touch-none">
              <div className="mx-auto h-full w-px bg-[#ff2d95] shadow-[0_0_14px_3px_#ff2d95]" />
              <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 bg-[#ff2d95] [clip-path:polygon(0_0,100%_0,50%_100%)] md:h-4 md:w-4" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress: s } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const xa = useTransform(s, [0, 1], [0, -40]);
  const xb = useTransform(s, [0, 1], [0, 40]);
  const yp = useTransform(s, [0, 1], [0, -30]);

  return (
    <section id="reel" ref={ref} className="relative px-5 pt-32 pb-24 md:px-12 md:pt-40 max-w-7xl mx-auto">
      
      {/* ── TOP ROW: Text & Portrait ── */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-8 mb-16 lg:mb-24 mt-8">
        
        {/* Left Side: Typography */}
        <div className="w-full lg:w-1/2 z-10 flex flex-col justify-center">
          <div className="f-s pointer-events-none select-none text-[clamp(4.5rem,14vw,10rem)] font-bold leading-[0.85] tracking-tighter">
            <motion.div style={{ x: xa }}><Split text="CUT" /></motion.div>
            <motion.div style={{ x: xb }} className="f-d stroke-t ml-[8vw] font-normal italic md:ml-[4vw]"><Split text="to the" /></motion.div>
            <motion.div style={{ x: xa }} className="ml-[4vw] md:ml-[0vw]"><Split text="FEEL" /></motion.div>
          </div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 1, ease }}
            className="mt-8 max-w-[20rem] text-sm md:text-base leading-relaxed text-white/80">
            Anand is an editor and videographer. He cuts reels, ads and music videos that hit on the beat and stay in your head.
          </motion.p>
        </div>

        {/* Right Side: Clear Framed Portrait */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1.5, delay: 0.3, ease }}
            className="relative w-full max-w-[360px] aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/20 shadow-[0_0_60px_rgba(139,92,246,0.15)]"
          >
            {/* Swap this URL with Anand's actual photo */}
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80"
              alt="Anand Portrait"
              className="h-full w-full object-cover"
            />
            {/* Subtle gradient at the bottom so the name pops */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="f-d text-4xl italic text-white">Anand</p>
              <p className="mt-1 text-xs text-white/70 uppercase tracking-widest font-medium">Director / Editor</p>
            </div>
          </motion.div>
        </div>

      </div>

      {/* ── BOTTOM ROW: Video Player ── */}
      <motion.div style={{ y: yp }} className="relative z-20 w-full">
        <Player />
      </motion.div>

    </section>
  );
}

/* ───────────── WORK ───────────── */
const S = {
  big: "w-[85vw] md:w-[32vw] h-[45vh] md:h-[56vh]", sm: "w-[65vw] md:w-[22vw] h-[22vh] md:h-[26vh]",
  tall: "w-[70vw] md:w-[24vw] h-[40vh] md:h-[58vh]", wide: "w-[85vw] md:w-[36vw] h-[28vh] md:h-[34vh]",
};
const mk = (t, m, id, a, b, c, s) => ({ t, m, id, g: `linear-gradient(135deg,${a},${b})`, c, s: S[s] });
const COLS = [
  { o: "", w: [mk("Neon Drift", "Motorsport · 0:45", "1550745165-9bc0b252726f", C.v, C.p, C.p, "big")] },
  { o: "md:translate-y-12", w: [mk("Afterglow", "Music video · 3:12", "1563089145-599997674d42", C.c, C.v, C.c, "sm"), mk("Static", "Fashion · 0:30", "1519608487953-e999c86e7455", C.p, C.v, C.v, "sm")] },
  { o: "md:-translate-y-2", w: [mk("Night Shift", "Short film · 6:40", "1478720568477-152d9b164e26", C.p, C.c, C.c, "tall")] },
  { o: "md:translate-y-16", w: [mk("Reel Hours", "Studio session · 1:10", "1511671782779-c97d3d27a1d4", C.v, C.c, C.v, "wide"), mk("Projection", "Trailer · 0:58", "1485846234645-a62644f84728", C.c, C.p, C.p, "sm")] },
];

const Card = ({ w }) => (
  <Tilt glow={w.c} className={`${w.s} shrink-0 rounded-[2rem]`}>
    <div className="absolute inset-0 overflow-hidden rounded-[inherit] border border-white/10">
      <Pic id={w.id} g={w.g} className="transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
    </div>
    <div className={`${glass} absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl px-4 py-3`}>
      <div><p className="f-d text-2xl italic leading-none">{w.t}</p><p className="mt-1 text-xs text-white/50">{w.m}</p></div>
      <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition group-hover:bg-white group-hover:text-black"><ArrowUpRight size={16} /></span>
    </div>
  </Tilt>
);

function Work() {
  const ref = useRef(null), tr = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(p, (v) => -v * Math.max(0, (tr.current?.scrollWidth || 0) - window.innerWidth + 40));
  const bar = useSpring(p, { stiffness: 120, damping: 25 });
  
  return (
    <section id="work" ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mb-6 flex items-end justify-between px-5 md:px-12">
          <h2 className="f-d text-5xl italic md:text-8xl">Selected cuts</h2>
          <p className="hidden max-w-[12rem] text-right text-sm text-white/50 md:block">Keep scrolling. The reel slides sideways.</p>
        </div>
        <motion.div ref={tr} style={{ x }} className="flex items-start gap-4 pl-5 pr-12 md:gap-6 md:pl-12">
          {COLS.map((c, i) => (
            <div key={i} className={`flex shrink-0 flex-col gap-4 md:gap-6 ${c.o}`}>{c.w.map((w) => <Card key={w.t} w={w} />)}</div>
          ))}
        </motion.div>
        <motion.i style={{ scaleX: bar }} className="mx-5 mt-8 h-px origin-left bg-linear-to-r from-violet-500 via-cyan-400 to-pink-500 md:mx-12" />
      </div>
    </section>
  );
}

/* ───────────── TOOLS ───────────── */
const T = [
  { n: "Premiere Pro", I: Scissors, x: 14, y: 22, c: C.v },
  { n: "After Effects", I: Sparkles, x: 50, y: 8, c: C.p },
  { n: "DaVinci Resolve", I: Palette, x: 86, y: 24, c: C.c },
  { n: "Audition", I: Music, x: 12, y: 76, c: C.c },
  { n: "Photoshop", I: Layers, x: 50, y: 92, c: C.v },
  { n: "Cinema 4D", I: Aperture, x: 88, y: 78, c: C.p },
];

function Tools() {
  return (
    <section id="tools" className="relative mx-auto max-w-6xl px-5 py-24 md:py-32">
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
        <motion.h2 variants={rise} className="f-d text-5xl italic md:text-8xl">The toolchain</motion.h2>
        <motion.p variants={rise} className="mt-4 max-w-sm text-white/55">Six tools, one pipeline. Every frame passes through all of them before it reaches you.</motion.p>
      </motion.div>
      <div className="relative mt-10 h-[480px] md:h-[640px]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
          {T.map((t, i) => {
            const k = i % 2 ? 8 : -8;
            const d = `M${t.x} ${t.y} Q${(t.x + 50) / 2 + k} ${(t.y + 50) / 2 - k} 50 50`;
            return (
              <g key={t.n}>
                <motion.path d={d} stroke={t.c} strokeOpacity=".35" strokeWidth="1" vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, delay: i * 0.15 }} />
                <motion.path d={d} stroke={t.c} strokeWidth="2.5" strokeDasharray="2 22" strokeLinecap="round" vectorEffect="non-scaling-stroke"
                  animate={{ strokeDashoffset: [0, -48] }} transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: "linear" }}
                  style={{ filter: `drop-shadow(0 0 4px ${t.c})` }} />
              </g>
            );
          })}
        </svg>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div animate={{ scale: [1, 1.6], opacity: [0.5, 0] }} transition={{ duration: 2.4, repeat: Infinity }}
            className="absolute inset-0 rounded-full border border-cyan-400/60" />
          <div className={`${glass} f-d relative grid h-24 w-24 place-items-center rounded-full text-3xl italic shadow-[0_0_80px_rgba(139,92,246,.6)] md:h-28 md:w-28`}>Anand</div>
        </div>
        {T.map((t, i) => (
          <div key={t.n} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${t.x}%`, top: `${t.y}%` }}>
            <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.18 }} className="flex flex-col items-center gap-2">
              <div className={`${glass} grid h-14 w-14 place-items-center rounded-2xl transition-shadow hover:shadow-[0_0_45px_var(--g)] md:h-20 md:w-20`}
                style={{ "--g": t.c, color: t.c }}><t.I size={24} className="md:w-7 md:h-7" /></div>
              <span className="whitespace-nowrap text-[10px] text-white/60 md:text-xs">{t.n}</span>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────── FOOTER ───────────── */
function Footer() {
  const words = Array.from({ length: 12 }, () => "Color · Rhythm · Story ✦ ");
  return (
    <footer id="contact" className="relative overflow-hidden pb-10 pt-16 md:pt-24">
      <div className="flex overflow-hidden whitespace-nowrap border-y border-white/10 py-4 md:py-5 text-white/40">
        <div className="f-d flex shrink-0 animate-[marq_40s_linear_infinite] text-2xl md:text-3xl italic">
          {words.map((w, i) => <span key={i}>{w}</span>)}{words.map((w, i) => <span key={`b${i}`}>{w}</span>)}
        </div>
      </div>
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
        className="mx-auto mt-16 max-w-6xl px-5 md:mt-24 md:px-12">
        <motion.h2 variants={rise} className="f-s text-[clamp(2.5rem,10vw,9rem)] font-bold leading-[.9] tracking-tighter">
          Got footage?<br /><span className="f-d stroke-t font-normal italic">Let's make it hit.</span>
        </motion.h2>
        <motion.a variants={rise} href="mailto:hello@anand.studio" whileHover={{ scale: 1.04 }}
          className={`${glass} mt-8 inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-base transition-shadow hover:shadow-[0_0_60px_rgba(255,45,149,.45)] md:mt-12 md:px-7 md:py-4 md:text-lg`}>
          <Mail size={20} /> hello@anand.studio <ArrowUpRight size={18} />
        </motion.a>
        <motion.p variants={rise} className="mt-16 text-xs text-white/35 md:mt-24 md:text-sm">© 2026 Anand. Edited frame by frame.</motion.p>
      </motion.div>
    </footer>
  );
}

/* ───────────── PAGE ───────────── */
export default function AnandPortfolio() {
  return (
    <main className="f-s relative min-h-screen overflow-x-clip bg-[#030303] text-white antialiased selection:bg-pink-500/40">
      <style>{CSS}</style>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <Orb c={C.v} size={620} x="-10%" y="-8%" d={18} />
        <Orb c={C.c} size={520} x="62%" y="12%" d={22} dx={-140} />
        <Orb c={C.p} size={560} x="25%" y="58%" d={26} dy={120} />
        <div className="absolute inset-0 opacity-[.06]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "64px 64px" }} />
      </div>
      <div className="relative z-10">
        <Nav /><Hero /><Work /><Tools /><Footer />
      </div>
    </main>
  );
}