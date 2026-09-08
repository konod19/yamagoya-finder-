import Link from "next/link";
import { DIFFICULTY_BADGE_CLASS, DifficultyTier, getElevationTier } from "@/types/hut";
import { Mountain } from "@/types/mountain";
import { ContourPlaceholder } from "./HutVisuals";
import { HutElevationProfile } from "./MountainVisuals";

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
        <h2 className="font-display text-lg font-extrabold leading-snug text-ink">
          <Link href={`/mountains/${mountain.id}`} className="hover:text-pine hover:underline">
            {mountain.name}
          </Link>
        </h2>
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
