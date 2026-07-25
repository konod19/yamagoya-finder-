import {
  Hut,
  getElevationTier,
  hasFeature,
  getPriceBadge,
  getDifficultyTier,
  DifficultyTier,
  getSummitTimeTier,
} from "@/types/hut";

const CONFIDENCE_DOT: Record<string, string> = {
  高: "bg-blaze-high",
  中: "bg-blaze-mid",
  低: "bg-blaze-low",
};

const DIFFICULTY_BADGE_CLASS: Record<DifficultyTier, string> = {
  初級: "rounded-sm bg-pine/10 px-2.5 py-1 font-semibold text-pine",
  中級: "rounded-sm bg-mist px-2.5 py-1 font-semibold text-ink",
  上級: "rounded-sm bg-trail/10 px-2.5 py-1 font-semibold text-trail",
  不明: "",
};

const TIER_STROKE: Record<string, string> = {
  低山: "#5F8A55",
  中山: "#3A6FA0",
  高山: "#5A4C82",
  不明: "#9C978A",
};

function DropIcon() {
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

function SignalIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M3 15h2v3H3v-3Z" fill="currentColor" />
      <path d="M8 11h2v7H8v-7Z" fill="currentColor" />
      <path d="M13 7h2v11h-2V7Z" fill="currentColor" />
      <path d="M18 3h2v15h-2V3Z" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 等高線(トポグラフィックコンター)モチーフのプレースホルダー */
function ContourPlaceholder({ tier }: { tier: string }) {
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
          {hut.name}
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

        {hut.website_url && hut.website_url !== "不明" ? (
          <a
            href={hut.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring mt-4 inline-flex items-center justify-center rounded-sm bg-pine px-4 py-2.5 text-sm font-semibold text-mist transition-colors hover:bg-pine-dark"
          >
            公式サイトを見る
          </a>
        ) : (
          <p className="mt-4 text-center text-xs text-muted">公式サイト未確認</p>
        )}

        {hut.correction_note && (
          <p className="mt-3 text-[11px] leading-relaxed text-muted">補足: {hut.correction_note}</p>
        )}
      </div>
    </article>
  );
}
