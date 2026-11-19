export function SantaHat({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 90"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="santaRed" x1="20" y1="20" x2="80" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ef4444" />
          <stop offset="1" stopColor="#b91c1c" />
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Red Cap Cone curving to the right */}
      <path
        d="M24 64 C28 32 46 16 68 20 C78 22 86 34 82 46 C78 52 70 48 68 40 C52 24 38 42 24 64 Z"
        fill="url(#santaRed)"
        filter="url(#softShadow)"
      />

      {/* Fluffy Pom-Pom Ball */}
      <circle cx="84" cy="46" r="9" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
      <circle cx="82" cy="44" r="3" fill="#f8fafc" opacity="0.8" />

      {/* Fluffy White Brim / Band */}
      <rect
        x="14"
        y="58"
        width="60"
        height="15"
        rx="7.5"
        fill="#ffffff"
        stroke="#e2e8f0"
        strokeWidth="1.5"
        filter="url(#softShadow)"
      />
      {/* Texture bumps on brim */}
      <circle cx="22" cy="65.5" r="4" fill="#f1f5f9" opacity="0.6" />
      <circle cx="36" cy="65.5" r="4.5" fill="#f1f5f9" opacity="0.6" />
      <circle cx="50" cy="65.5" r="4" fill="#f1f5f9" opacity="0.6" />
      <circle cx="64" cy="65.5" r="4.5" fill="#f1f5f9" opacity="0.6" />
    </svg>
  );
}

export default SantaHat;
