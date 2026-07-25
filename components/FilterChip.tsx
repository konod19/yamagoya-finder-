"use client";

export function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`focus-ring rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-pine bg-pine/10 text-pine"
          : "border-line bg-mist text-muted hover:border-pine hover:text-pine"
      }`}
    >
      {label}
    </button>
  );
}
