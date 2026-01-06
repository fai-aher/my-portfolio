import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * MapPoint
 * - Interactive pin for the WorldMapSection
 * - Hover (desktop) and tap/selection (mobile) expandable info card
 * - Color modes: professional (cyan) vs personal (orange)
 *
 * Props:
 * - x, y: percentage positions on the map (0–100)
 * - label: translated country label
 * - subtitle: city / short label
 * - flag: emoji string
 * - count: number of experiences for the current mode
 * - experiencesLabel: localized label for "experiences"
 * - detailsLabel: localized label for the details button
 * - mode: "professional" | "personal"
 * - canHover: boolean (true if device supports hover)
 * - selected: boolean (selected in touch mode)
 * - onSelect: function (toggle selected)
 * - onOpenDetails: function (open modal)
 */

const cardMotion = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 8, scale: 0.98 },
};

export default function MapPoint({
  x,
  y,
  label,
  subtitle,
  flag,
  count = 0,
  experiencesLabel,
  detailsLabel,
  mode = "professional",
  canHover = true,
  selected = false,
  onSelect,
  onOpenDetails,
  className,
}) {
  const [hovered, setHovered] = useState(false);
  const open = canHover ? hovered : selected;

  const wrapRef = useRef(null);
  const cardRef = useRef(null);
  const [align, setAlign] = useState({ side: "right", v: "top" });

  const tone = useMemo(() => {
    if (mode === "personal") {
      return {
        ring: "bg-orange-500/15 dark:bg-orange-400/20",
        activeGlow: "bg-orange-400/40",
        pinActive: "bg-orange-400 text-slate-900 border-orange-300 ring-orange-300/50",
        pinIdle:
          "bg-white/80 dark:bg-slate-950/80 text-orange-700 dark:text-orange-300 border-black/10 dark:border-white/20 ring-black/10 dark:ring-white/10 hover:bg-white/90 dark:hover:bg-slate-900",
        badge: "bg-orange-400/15 text-orange-700 dark:text-orange-200 border-orange-300/25",
        button:
          "bg-orange-400/15 text-orange-800 dark:text-orange-100 border-orange-300/25 hover:bg-orange-400/20",
      };
    }

    return {
      ring: "bg-cyan-500/15 dark:bg-cyan-400/20",
      activeGlow: "bg-cyan-400/40",
      pinActive: "bg-cyan-400 text-slate-900 border-cyan-300 ring-cyan-300/50",
      pinIdle:
        "bg-white/80 dark:bg-slate-950/80 text-cyan-700 dark:text-cyan-300 border-black/10 dark:border-white/20 ring-black/10 dark:ring-white/10 hover:bg-white/90 dark:hover:bg-slate-900",
      badge: "bg-cyan-400/10 text-cyan-700 dark:text-cyan-200 border-cyan-300/30",
      button:
        "bg-cyan-400/10 text-cyan-800 dark:text-cyan-100 border-cyan-300/30 hover:bg-cyan-400/15",
    };
  }, [mode]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setHovered(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    const el = wrapRef.current;
    const card = cardRef.current;
    if (!el || !card) return;

    const raf = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const side = typeof x === "number" && x >= 50 ? "left" : "right";
      const v = r.top + c.height + 24 > vh ? "bottom" : "top";
      setAlign({ side, v });
    });

    return () => cancelAnimationFrame(raf);
  }, [open, label, subtitle, count, x]);

  const cardPos = useMemo(() => {
    const sideClass = align.side === "left" ? "right-full mr-3" : "left-full ml-3";
    const vClass = align.v === "bottom" ? "bottom-1/2 translate-y-1/2" : "top-1/2 -translate-y-1/2";
    return sideClass + " " + vClass;
  }, [align]);

  return (
    <motion.div
      ref={wrapRef}
      className={
        "group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none " +
        "z-[2] hover:z-[60] focus-within:z-[60] " +
        (open ? "z-[70] " : "") +
        (className || "")
      }
      style={{ left: `${x}%`, top: `${y}%` }}
      onMouseEnter={() => canHover && setHovered(true)}
      onMouseLeave={() => canHover && setHovered(false)}
    >
      <motion.button
        type="button"
        onClick={() => {
          if (!canHover && onSelect) onSelect();
          if (canHover) setHovered(true);
        }}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={canHover ? { scale: 1.15 } : undefined}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        aria-label={`${flag || ""} ${label}`.trim()}
        className="relative"
      >
        <span
          aria-hidden="true"
          className={
            "absolute inset-0 rounded-full blur-md transition " +
            (open ? tone.activeGlow : tone.ring + " group-hover:opacity-100")
          }
        />

        <span
          className={
            "relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border ring-1 transition select-none " +
            (open ? tone.pinActive : tone.pinIdle)
          }
        >
          <span
            aria-hidden="true"
            className="text-lg sm:text-xl leading-none"
          >
            {flag || "🌍"}
          </span>
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            {...cardMotion}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className={"absolute " + cardPos + " w-[260px] sm:w-[280px] max-w-[72vw]"}
            onMouseEnter={() => canHover && setHovered(true)}
            onMouseLeave={() => canHover && setHovered(false)}
            ref={cardRef}
          >
            <div className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-slate-950/92 shadow-2xl">
              <div aria-hidden="true" className="pointer-events-none absolute -inset-24 opacity-80">
                <div
                  className={
                    "absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl " +
                    (mode === "personal" ? "bg-orange-400/12" : "bg-cyan-400/12")
                  }
                />
              </div>

              <div className="relative p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white break-words">
                      {label}
                    </p>

                    {subtitle && (
                      <p className="mt-0.5 text-xs text-slate-700 dark:text-slate-300/80">
                        {subtitle}
                      </p>
                    )}

                    <div className="mt-2">
                      <span
                        className={
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] " +
                          tone.badge
                        }
                      >
                        {count} {experiencesLabel}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenDetails && onOpenDetails()}
                      className={
                        "mt-3 inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-cyan-400/50 " +
                        tone.button
                      }
                    >
                      {detailsLabel}
                    </button>
                  </div>

                  <div className="shrink-0 text-3xl leading-none">
                    <span aria-hidden="true">{flag || "🌍"}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}