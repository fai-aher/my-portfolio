import { motion } from "framer-motion";
import { HiOutlineMapPin } from "react-icons/hi2";

/**
 * MapPoint
 * - Reusable point for the WorldMapSection
 * - Fully interactive (hover, tap)
 * - Mobile-friendly (larger hit area)
 * - Theme-aware (dark/light via Tailwind)
 * - Data-ready (receives all content via props)
 *
 * Props:
 * - x, y: percentage positions on the map (0–100)
 * - title: string (country / city)
 * - subtitle: string (short description)
 * - onClick: function (open modal / panel)
 * - active: boolean (highlight current point)
 */

export default function MapPoint({
  x,
  y,
  title,
  subtitle,
  onClick,
  active = false,
  className,
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={
        "group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none " +
        "z-[1] hover:z-[60] focus-within:z-[60] " +
        (active ? "z-[70] " : "") +
        (className || "")
      }
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-label={title}
    >
      {/* Glow ring */}
      <span
        aria-hidden="true"
        className={
          "absolute inset-0 rounded-full blur-md transition " +
          (active
            ? "bg-cyan-400/40"
            : "bg-cyan-500/15 dark:bg-cyan-400/20 group-hover:bg-cyan-500/25 dark:group-hover:bg-cyan-400/40")
        }
      />

      {/* Pin body */}
      <span
        className={
          "relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border ring-1 transition " +
          (active
            ? "bg-cyan-400 text-slate-900 border-cyan-300 ring-cyan-300/50"
            : "bg-white/80 dark:bg-slate-950/80 text-cyan-700 dark:text-cyan-300 border-black/10 dark:border-white/20 ring-black/10 dark:ring-white/10 hover:bg-white/90 dark:hover:bg-slate-900")
        }
      >
        <HiOutlineMapPin className="h-5 w-5" />
      </span>

      {/* Tooltip */}
      <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap">
        <span className="relative block rounded-xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-slate-950/90 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 shadow-lg">
          <span className="block font-semibold text-cyan-700 dark:text-cyan-300">{title}</span>
          {subtitle && (
            <span className="mt-0.5 block text-slate-700 dark:text-slate-300/80">{subtitle}</span>
          )}
          {/* Tooltip arrow */}
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rotate-45 bg-white/95 dark:bg-slate-950/90 border-l border-t border-black/10 dark:border-white/10"
          />
        </span>
      </span>
    </motion.button>
  );
}
