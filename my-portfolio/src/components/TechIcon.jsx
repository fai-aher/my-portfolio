import { memo } from "react";
import {
  siLinux,
  siReact,
  siAngular,
  siTailwindcss,
  siDjango,
  siPython,
  siRos,
  siJavascript,
  siTypescript,
  siHtml5,
  siCss,
  siVite,
  siSpringboot,
  siNestjs,
  siFastapi,
  siPostman,
  siPostgresql,
  siMysql,
  siAuth0,
  siJsonwebtokens,
  siDigitalocean,
  siWordpress,
  siScikitlearn,
  siFigma,
  siPytorch,
  siNumpy,
  siFramer,
  siNodedotjs,
  siFlask,
  siPhp,
} from "simple-icons";

const fallbackClass =
  "grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/5 text-xs text-white/60";

// Map of icon slugs to their simple-icons objects
const iconMap = {
  linux: siLinux,
  react: siReact,
  angular: siAngular,
  tailwindcss: siTailwindcss,
  django: siDjango,
  python: siPython,
  ros: siRos,
  ros2: siRos, // Using ROS icon for ROS 2
  javascript: siJavascript,
  typescript: siTypescript,
  html5: siHtml5,
  css3: siCss,
  vite: siVite,
  springboot: siSpringboot,
  nestjs: siNestjs,
  fastapi: siFastapi,
  flask: siFlask,
  postman: siPostman,
  postgresql: siPostgresql,
  mysql: siMysql,
  auth0: siAuth0,
  jsonwebtokens: siJsonwebtokens,
  // aws: use custom SVG in /assets/icons/aws.svg or fallback
  digitalocean: siDigitalocean,
  // heroku: use custom SVG in /assets/icons/heroku.svg or fallback
  wordpress: siWordpress,
  php: siPhp,
  scikitlearn: siScikitlearn,
  figma: siFigma,
  pytorch: siPytorch,
  numpy: siNumpy,
  framer: siFramer,
  nodejs: siNodedotjs,
  // openai: not available in simple-icons, will use fallback
  // Note: elementor not available in simple-icons, will use fallback
};

// Size presets for different contexts
const SIZE_PRESETS = {
  sm: { container: "h-6 w-6", icon: "h-5 w-5" },
  md: { container: "h-8 w-8", icon: "h-6 w-6" },
  lg: { container: "h-12 w-12", icon: "h-10 w-10" },
};

// Map of custom SVG icons (not available in simple-icons)
const customIconPaths = {
  aws: "/assets/icons/aws.svg",
  heroku: "/assets/icons/heroku.svg",
  openai: "/assets/icons/openai.svg",
  oracle: "/assets/icons/oracle.svg",
  sql: "/assets/icons/sql.svg",
};

/**
 * TechIcon component
 * Displays technology icons using simple-icons library or custom SVG files
 *
 * @param {string} iconSlug - The simple-icons slug (e.g., "react", "python", "django")
 * @param {string} logo - Optional custom logo path (e.g., "/assets/icons/aws.svg")
 * @param {string} alt - Alt text for accessibility
 * @param {string} customColor - Optional custom color (defaults to cyan-300: #67e8f9)
 * @param {string} size - Size preset: "sm" (24px), "md" (32px), "lg" (48px, default)
 */
function TechIcon({ iconSlug, logo, alt, customColor, size = "lg" }) {
  const sizeClasses = SIZE_PRESETS[size] || SIZE_PRESETS.lg;
  const lowerSlug = iconSlug ? iconSlug.toLowerCase() : null;

  // Get the icon from our simple-icons map
  const icon = lowerSlug ? iconMap[lowerSlug] : null;

  // Check if we have a custom SVG for this icon slug
  const customIconPath = lowerSlug ? customIconPaths[lowerSlug] : null;

  // Priority 1: If icon found in simple-icons, render it
  if (icon) {
    const fillColor = customColor || "#67e8f9";

    return (
      <div
        className={`${sizeClasses.container} rounded-xl flex items-center justify-center`}
        aria-label={alt || icon.title}
        title={icon.title}
      >
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className={sizeClasses.icon}
          fill={fillColor}
        >
          <path d={icon.path} />
        </svg>
      </div>
    );
  }

  // Priority 2: Use custom SVG path for icons not in simple-icons (aws, heroku, openai, etc.)
  if (customIconPath) {
    return (
      <div
        className={`${sizeClasses.container} rounded-xl flex items-center justify-center`}
        aria-label={alt || "Technology icon"}
      >
        <img
          src={customIconPath}
          alt={alt || ""}
          className={`${sizeClasses.icon} object-contain`}
          style={{ filter: "brightness(0) saturate(100%) invert(87%) sepia(14%) saturate(1087%) hue-rotate(146deg) brightness(99%) contrast(96%)" }}
        />
      </div>
    );
  }

  // Priority 3: Use custom logo path if provided (for backwards compatibility)
  if (logo) {
    return (
      <div
        className={`${sizeClasses.container} rounded-xl flex items-center justify-center`}
        aria-label={alt || "Technology icon"}
      >
        <img
          src={logo}
          alt={alt || ""}
          className={`${sizeClasses.icon} object-contain`}
          style={{ filter: "brightness(0) saturate(100%) invert(87%) sepia(14%) saturate(1087%) hue-rotate(146deg) brightness(99%) contrast(96%)" }}
        />
      </div>
    );
  }

  // Final fallback: show placeholder
  return (
    <div className={`${fallbackClass} ${sizeClasses.container}`} aria-label={alt || "Icon placeholder"}>
      {iconSlug ? iconSlug.slice(0, 2).toUpperCase() : "?"}
    </div>
  );
}

export default memo(TechIcon);
