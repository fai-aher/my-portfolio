import { memo, useState } from "react";

const fallbackClass =
  "grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/5 text-xs text-white/60";

function SkillLogo({ src, alt }) {
  const [broken, setBroken] = useState(false);

  // If no icon is available yet, show a clean placeholder.
  if (!src || broken) {
    return (
      <div className={fallbackClass} aria-label={alt || "Logo placeholder"}>
        icon
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ""}
      className="h-12 w-12 rounded-xl object-contain"
      loading="lazy"
      onError={() => setBroken(true)}
    />
  );
}

export default memo(SkillLogo);