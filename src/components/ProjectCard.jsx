import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineCodeBracket,
  HiOutlineArrowTopRightOnSquare,
  HiOutlinePhoto,
  HiOutlineXMark,
  HiOutlineCpuChip,
} from "react-icons/hi2";
import { SiGithub, SiReact, SiDjango, SiTailwindcss } from "react-icons/si";

/**
 * ProjectCard
 * - Reusable card for ProjectsSection
 * - Responsive, animated
 * - Fully light/dark friendly
 * - i18n-ready (text passed from parent)
 * - Supports gallery modal + external links
 */

const STACK_ICON = {
  react: SiReact,
  django: SiDjango,
  tailwind: SiTailwindcss,
};

function StackIcon({ name }) {
  const Icon = STACK_ICON[name];
  if (!Icon) return null;
  return <Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-300" title={name} />;
}

function GalleryModal({ open, onClose, title, images = [] }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="absolute left-1/2 top-1/2 w-[94vw] max-w-4xl -translate-x-1/2 -translate-y-1/2"
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-slate-950/90 shadow-2xl">
              <div className="flex items-center justify-between gap-3 border-b border-black/10 dark:border-white/10 px-4 py-3">
                <p className="text-xs uppercase tracking-widest text-cyan-700 dark:text-cyan-200/70">
                  {title}
                </p>
                <button
                  onClick={onClose}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-900 dark:text-slate-100 hover:bg-white/80 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  aria-label="Close"
                >
                  <HiOutlineXMark className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 sm:p-6 grid gap-4 sm:grid-cols-2">
                {images.length === 0 && (
                  <div className="col-span-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6 text-center text-slate-700 dark:text-slate-300">
                    Gallery placeholder — add project screenshots later
                  </div>
                )}
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="group relative overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5"
                  >
                    <div className="aspect-[16/10] w-full bg-gradient-to-br from-cyan-400/10 via-white/5 to-indigo-400/10" />
                    <div className="absolute inset-0 flex items-end">
                      <div className="w-full bg-black/60 backdrop-blur px-3 py-2">
                        <p className="text-xs text-slate-200/90">{img.caption}</p>
                      </div>
                    </div>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition"
                    >
                      <div className="absolute -inset-24 bg-gradient-to-r from-cyan-400/0 via-cyan-400/15 to-indigo-400/0 blur-2xl" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ProjectCard({
  title,
  subtitle,
  description,
  tags = [],
  stack = [],
  images = [],
  liveUrl,
  repoUrl,
}) {
  const [openGallery, setOpenGallery] = useState(false);

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.35 }}
        className="group relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5"
      >
        {/* glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition"
        >
          <div className="absolute -inset-24 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-indigo-400/0 blur-2xl" />
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-widest text-cyan-700 dark:text-cyan-200/70">
                {subtitle}
              </p>
              <h3 className="mt-1 truncate text-lg font-semibold text-slate-900 dark:text-white">
                {title}
              </h3>
            </div>
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-slate-950/20">
              <HiOutlineCpuChip className="h-5 w-5 text-cyan-600 dark:text-cyan-300/90" />
            </span>
          </div>

          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300/85">{description}</p>

          {/* tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-black/10 dark:border-white/10 bg-white/60 dark:bg-slate-950/20 px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100/90"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* stack */}
          <div className="mt-4 flex items-center gap-2">
            {stack.map((s) => (
              <StackIcon key={s} name={s} />
            ))}
          </div>

          {/* actions */}
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOpenGallery(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 hover:bg-white/80 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            >
              <HiOutlinePhoto className="h-4 w-4" />
              Gallery
            </button>

            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 hover:bg-white/80 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
                Live
              </a>
            )}

            {repoUrl && (
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 hover:bg-white/80 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              >
                <SiGithub className="h-4 w-4" />
                Code
              </a>
            )}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-cyan-400/0 via-cyan-400/35 to-indigo-400/0" />
      </motion.article>

      <GalleryModal
        open={openGallery}
        onClose={() => setOpenGallery(false)}
        title={title}
        images={images}
      />
    </>
  );
}