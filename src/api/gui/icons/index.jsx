function Svg({ size = 16, className = "", children, viewBox = "0 0 24 24" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function ChevronIcon({ size = 16, className = "", open = false }) {
  return (
    <Svg size={size} className={className + " transition-transform duration-150 " + (open ? "rotate-90" : "")}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function SearchIcon({ size = 16, className = "" }) {
  return (
    <Svg size={size} className={className}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function CloseIcon({ size = 16, className = "" }) {
  return (
    <Svg size={size} className={className}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

export function MovementIcon({ size = 16, className = "" }) {
  return (
    <Svg size={size} className={className}>
      <path d="M4 12h10M4 7h14M4 17h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 14l4-2-4-2v4z" fill="currentColor" />
    </Svg>
  );
}

export function NetworkIcon({ size = 16, className = "" }) {
  return (
    <Svg size={size} className={className}>
      <circle cx="12" cy="5" r="2.4" stroke="currentColor" strokeWidth="2" />
      <circle cx="5" cy="18" r="2.4" stroke="currentColor" strokeWidth="2" />
      <circle cx="19" cy="18" r="2.4" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7.4v3.6M12 11l-5 4.8M12 11l5 4.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function HudIcon({ size = 16, className = "" }) {
  return (
    <Svg size={size} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M6 9h6M6 13h8M6 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function SlidersIcon({ size = 16, className = "" }) {
  return (
    <Svg size={size} className={className}>
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="7" r="2.4" stroke="currentColor" strokeWidth="2" />
      <circle cx="8" cy="17" r="2.4" stroke="currentColor" strokeWidth="2" />
    </Svg>
  );
}

export function GearIcon({ size = 16, className = "" }) {
  return (
    <Svg size={size} className={className}>
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="2" />
      <path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M18.4 18.4l-2.1-2.1M7.7 7.7L5.6 5.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function CopyIcon({ size = 16, className = "" }) {
  return (
    <Svg size={size} className={className}>
      <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function UploadIcon({ size = 16, className = "" }) {
  return (
    <Svg size={size} className={className}>
      <path d="M12 16V4M8 8l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export const CATEGORY_ICON = {
  Movement: MovementIcon,
  HUD: HudIcon,
  Network: NetworkIcon,
};
