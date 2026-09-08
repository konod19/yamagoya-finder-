import Link from "next/link";
import { parseElevationMeters } from "@/types/hut";
import { MountainHut } from "@/types/mountain";

/** 標高が高い順(山頂側が先)に並べ替える */
export function sortHutsByElevationDesc(huts: MountainHut[]): MountainHut[] {
  return [...huts].sort((a, b) => {
    const ea = parseElevationMeters(a.hut_elevation_text) ?? -Infinity;
    const eb = parseElevationMeters(b.hut_elevation_text) ?? -Infinity;
    return eb - ea;
  });
}

/**
 * 小屋が複数ある山向け: 標高の相対位置を縦のプロファイルで見せる。
 * 標高が近い小屋のラベルが重ならないよう、最低間隔(MIN_GAP_PX)を確保しつつ
 * ドット位置は極力実際の標高差に比例させる(順序は保ったまま下方向にのみ調整)。
 */
export function HutElevationProfile({ huts }: { huts: MountainHut[] }) {
  const sorted = sortHutsByElevationDesc(huts);
  const elevations = sorted.map((h) => parseElevationMeters(h.hut_elevation_text));
  const known = elevations.filter((e): e is number => e !== null);
  const max = known.length ? Math.max(...known) : 0;
  const min = known.length ? Math.min(...known) : 0;
  const range = max - min;

  const UNIT_PX = 34; // 標高差が均等だった場合の基準間隔
  const MIN_GAP_PX = 22; // ラベルが重ならないための最低間隔
  const nominalHeight = Math.max(sorted.length - 1, 1) * UNIT_PX;

  const positions: number[] = [];
  sorted.forEach((_, i) => {
    const elev = elevations[i];
    const raw =
      elev === null || range === 0
        ? (i / Math.max(sorted.length - 1, 1)) * nominalHeight
        : ((max - elev) / range) * nominalHeight;
    const prev = positions[i - 1];
    positions.push(prev !== undefined && raw - prev < MIN_GAP_PX ? prev + MIN_GAP_PX : raw);
  });

  const containerHeight = positions[positions.length - 1] + 8;

  return (
    <div className="relative" style={{ height: `${containerHeight}px` }}>
      <div
        className="absolute left-2 w-0.5 -translate-x-1/2 bg-line"
        style={{ top: "4px", height: `${Math.max(positions[positions.length - 1] - 4, 0)}px` }}
        aria-hidden="true"
      />
      {sorted.map((hut, i) => {
        const elev = elevations[i];
        const top = positions[i];
        return (
          <div key={hut.id}>
            <span
              className="absolute left-2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pine"
              style={{ top: `${top}px` }}
              aria-hidden="true"
            />
            <Link
              href={`/huts/${hut.id}`}
              className="focus-ring group absolute left-5 flex -translate-y-1/2 items-baseline gap-1.5 whitespace-nowrap text-xs"
              style={{ top: `${top}px` }}
            >
              <span className="font-semibold text-pine underline decoration-pine/40 underline-offset-2 group-hover:text-pine-dark">
                {hut.name}
              </span>
              {elev !== null && <span className="text-[11px] text-muted">約{elev}m</span>}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
