const TIER_STROKE: Record<string, string> = {
  低山: "#5F8A55",
  中山: "#3A6FA0",
  高山: "#5A4C82",
  不明: "#9C978A",
};

export function DropIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path
        d="M10 2c2.5 3.2 5.5 6.8 5.5 10a5.5 5.5 0 1 1-11 0c0-3.2 3-6.8 5.5-10Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SignalIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M3 15h2v3H3v-3Z" fill="currentColor" />
      <path d="M8 11h2v7H8v-7Z" fill="currentColor" />
      <path d="M13 7h2v11h-2V7Z" fill="currentColor" />
      <path d="M18 3h2v15h-2V3Z" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

export function ClockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 等高線(トポグラフィックコンター)モチーフのプレースホルダー */
export function ContourPlaceholder({ tier }: { tier: string }) {
  const stroke = TIER_STROKE[tier] ?? TIER_STROKE["不明"];
  return (
    <svg viewBox="0 0 400 160" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="160" fill="#EDEBE6" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path
          key={i}
          d={`M-20,${150 - i * 22} C 80,${100 - i * 24} 160,${190 - i * 26} 240,${110 - i * 22} S 380,${150 - i * 20} 440,${90 - i * 22}`}
          fill="none"
          stroke={stroke}
          strokeWidth={i === 2 ? 2 : 1}
          opacity={0.18 + i * 0.1}
        />
      ))}
    </svg>
  );
}
