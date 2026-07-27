import Link from "next/link";
import {
  Hut,
  getElevationTier,
  hasFeature,
  getPriceBadge,
  getDifficultyTier,
  getSummitTimeTier,
  CONFIDENCE_DOT,
  DIFFICULTY_BADGE_CLASS,
} from "@/types/hut";
import { DropIcon, SignalIcon, ClockIcon, ContourPlaceholder } from "./HutVisuals";

export default function HutCard({ hut }: { hut: Hut }) {
  const tier = getElevationTier(hut.hut_elevation_text);
  const water = hasFeature(hut.water_info);
  const signal = hasFeature(hut.signal_info);
  const confidenceDot = CONFIDENCE_DOT[hut.information_confidence ?? "低"] ?? CONFIDENCE_DOT["低"];
  const priceBadge = getPriceBadge(hut.price_text);
  const difficulty = getDifficultyTier(hut);
  const summitTimeTier = getSummitTimeTier(hut.summit_time_hours_text);

  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-36 w-full overflow-hidden">
        {hut.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hut.image_url}
            alt={`${hut.name}の写真`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <ContourPlaceholder tier={tier} />
        )}

        {hut.image_url && hut.image_credit && (
          <span className="absolute bottom-1.5 right-2 rounded-sm bg-ink/50 px-1.5 py-0.5 text-[10px] text-mist/90 backdrop-blur-sm">
            Photo: {hut.image_credit}
          </span>
        )}

        <span
          className="absolute left-3 top-3 flex items-center gap-1.5 rounded-sm bg-ink/60 px-2.5 py-1 text-[11px] font-medium text-mist backdrop-blur-sm"
          title="この小屋の情報の信頼度の目安です"
        >
          <span className={`h-1.5 w-1.5 rounded-full ${confidenceDot}`} aria-hidden="true" />
          情報確度: {hut.information_confidence ?? "低"}
        </span>

        <span className="absolute right-3 top-3 rounded-sm bg-trail px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
          {priceBadge ?? "料金要確認"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-extrabold leading-snug text-ink">
          <Link href={`/huts/${hut.id}`} className="hover:text-pine hover:underline">
            {hut.name}
          </Link>
          {hut.hut_elevation_text && (
            <span className="ml-2 text-sm font-semibold text-muted">
              山小屋の標高 {hut.hut_elevation_text}m
            </span>
          )}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {hut.area}
          {hut.mountain_name ? ` ・ ${hut.mountain_name}` : ""}
          {hut.summit_elevation_text && ` ・ 山頂 ${hut.summit_elevation_text}m`}
        </p>

        {(hut.information_confidence ?? "低") === "低" && (
          <p className="mt-2 rounded-sm border border-trail/40 bg-trail/10 px-2.5 py-1.5 text-xs font-semibold text-trail">
            情報確度が低いため、必ず公式サイトでご確認ください
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-sm bg-pine/10 px-2.5 py-1 font-semibold text-pine">{tier}</span>
          {difficulty !== "不明" && (
            <span className={DIFFICULTY_BADGE_CLASS[difficulty]}>難易度: {difficulty}</span>
          )}
          {hut.operating_period && (
            <span className="rounded-sm bg-mist px-2.5 py-1 text-muted">{hut.operating_period}</span>
          )}
          {(hut.season_open_text || hut.season_close_text) && (
            <span className="rounded-sm bg-mist px-2.5 py-1 text-muted">
              2026年{hut.season_open_text ? ` ${hut.season_open_text}山開き` : ""}
              {hut.season_open_text && hut.season_close_text ? " 〜 " : ""}
              {hut.season_close_text ? `${hut.season_close_text}山閉じ` : ""}
            </span>
          )}
        </div>

        {hut.hazard_tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {hut.hazard_tags.map((tagName) => (
              <span
                key={tagName}
                className="rounded-sm border border-line bg-mist px-2 py-0.5 text-[11px] text-muted"
              >
                {tagName}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <DropIcon />
            水場 {water ? "あり" : hut.water_info === "不明" ? "不明" : "なし"}
          </span>
          <span className="flex items-center gap-1.5">
            <SignalIcon />
            電波 {signal ? "あり" : hut.signal_info === "不明" ? "不明" : "なし"}
          </span>
          {summitTimeTier !== "不明" && (
            <span className="flex items-center gap-1.5">
              <ClockIcon />
              山頂まで {summitTimeTier}
            </span>
          )}
        </div>

        {hut.features && (
          <p className="mt-3 line-clamp-2 text-sm text-ink/80">{hut.features}</p>
        )}

        <div className="mt-4 space-y-1.5 border-t border-line pt-3 text-xs text-muted">
          {hut.price_text && (
            <p className="line-clamp-1">
              <span className="font-semibold text-ink">料金: </span>
              {hut.price_text}
            </p>
          )}
          {hut.reservation_method && (
            <p className="line-clamp-1">
              <span className="font-semibold text-ink">予約: </span>
              {hut.reservation_method}
            </p>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {hut.website_url && hut.website_url !== "不明" ? (
            <a
              href={hut.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center justify-center rounded-sm bg-pine px-4 py-2.5 text-sm font-semibold text-mist transition-colors hover:bg-pine-dark"
            >
              公式サイトを見る
            </a>
          ) : (
            <p className="flex items-center justify-center text-center text-xs text-muted">公式サイト未確認</p>
          )}
          <Link
            href="/gear"
            className="focus-ring inline-flex items-center justify-center rounded-sm border border-line px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-pine hover:text-pine"
          >
            おすすめ装備を見る
          </Link>
        </div>

        {hut.correction_note && (
          <p className="mt-3 text-[11px] leading-relaxed text-muted">補足: {hut.correction_note}</p>
        )}
      </div>
    </article>
  );
}
