import Link from "next/link";
import { DIFFICULTY_BADGE_CLASS, DifficultyTier, getElevationTier, parseElevationMeters } from "@/types/hut";
import { Mountain, MountainHut } from "@/types/mountain";
import { ContourPlaceholder } from "./HutVisuals";

/** 標高が高い順(山頂側が先)に並べ替える */
function sortHutsByElevationDesc(huts: MountainHut[]): MountainHut[] {
  return [...huts].sort((a, b) => {
    const ea = parseElevationMeters(a.hut_elevation_text) ?? -Infinity;
    const eb = parseElevationMeters(b.hut_elevation_text) ?? -Infinity;
    return eb - ea;
  });
}

/** 小屋が複数ある山向け: 標高の相対位置を縦のプロファイルで見せる */
function HutElevationProfile({ huts }: { huts: MountainHut[] }) {
  const sorted = sortHutsByElevationDesc(huts);
  const elevations = sorted.map((h) => parseElevationMeters(h.hut_elevation_text));
  const known = elevations.filter((e): e is number => e !== null);
  const max = known.length ? Math.max(...known) : 0;
  const min = known.length ? Math.min(...known) : 0;
  const range = max - min;

  return (
    <div className="relative" style={{ height: `${Math.max(sorted.length, 2) * 32}px` }}>
      <div className="absolute left-2 top-1.5 bottom-1.5 w-0.5 -translate-x-1/2 bg-line" aria-hidden="true" />
      {sorted.map((hut, i) => {
        const elev = elevations[i];
        const top =
          elev === null || range === 0 ? (i / Math.max(sorted.length - 1, 1)) * 100 : ((max - elev) / range) * 100;
        return (
          <div key={hut.id}>
            <span
              className="absolute left-2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pine"
              style={{ top: `${top}%` }}
              aria-hidden="true"
            />
            <Link
              href={`/huts/${hut.id}`}
              className="focus-ring absolute left-5 flex -translate-y-1/2 items-baseline gap-1.5 whitespace-nowrap text-xs text-ink transition-colors hover:text-pine"
              style={{ top: `${top}%` }}
            >
              <span className="font-semibold">{hut.name}</span>
              {elev !== null && <span className="text-[11px] text-muted">約{elev}m</span>}
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default function MountainCard({ mountain }: { mountain: Mountain }) {
  const tier = getElevationTier(mountain.elevation_text);
  const difficulty = (mountain.difficulty_tier ?? "不明") as DifficultyTier;
  const hasMultipleHuts = mountain.huts.length > 1;

  return (
    <article className="flex flex-col overflow-hidden rounded-card border border-line bg-surface">
      <div className="relative h-36 w-full overflow-hidden">
        {mountain.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mountain.image_url}
            alt={`${mountain.name}の写真`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <ContourPlaceholder tier={tier} />
        )}

        {mountain.image_url && mountain.image_credit && (
          <span className="absolute bottom-1.5 right-2 rounded-sm bg-ink/50 px-1.5 py-0.5 text-[10px] text-mist/90 backdrop-blur-sm">
            Photo: {mountain.image_credit}
          </span>
        )}

        <span className="absolute right-3 top-3 rounded-sm bg-ink/60 px-2.5 py-1 text-xs font-semibold text-mist backdrop-blur-sm">
          小屋{mountain.huts.length}件
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-display text-lg font-extrabold leading-snug text-ink">{mountain.name}</h2>
        <p className="mt-1 text-sm text-muted">
          {[mountain.prefecture, mountain.area].filter(Boolean).join(" ・ ")}
        </p>

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {mountain.elevation_text && (
            <span className="rounded-sm bg-pine/10 px-2.5 py-1 font-semibold text-pine">
              標高{mountain.elevation_text}m
            </span>
          )}
          {difficulty !== "不明" && (
            <span className={DIFFICULTY_BADGE_CLASS[difficulty]}>難易度: {difficulty}</span>
          )}
        </div>

        <div className="mt-4 border-t border-line pt-4">
          {hasMultipleHuts ? (
            <>
              <p className="mb-2 text-[11px] text-muted">小屋の標高(山頂側が上)</p>
              <HutElevationProfile huts={mountain.huts} />
            </>
          ) : (
            <div className="flex flex-wrap gap-2">
              {mountain.huts.map((hut) => (
                <Link
                  key={hut.id}
                  href={`/huts/${hut.id}`}
                  className="focus-ring rounded-sm border border-line bg-mist px-2.5 py-1 text-xs text-ink transition-colors hover:border-pine hover:text-pine"
                >
                  {hut.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
