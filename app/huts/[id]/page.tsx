import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
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
import { DropIcon, SignalIcon, ClockIcon, ContourPlaceholder } from "@/components/HutVisuals";

export const revalidate = 3600;

async function getHut(id: number): Promise<Hut | null> {
  const { data, error } = await supabase.from("huts").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data as Hut;
}

export async function generateStaticParams() {
  const { data } = await supabase.from("huts").select("id");
  return (data ?? []).map((h) => ({ id: String(h.id) }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const hut = await getHut(Number(params.id));
  if (!hut) {
    return { title: "山小屋が見つかりません | 山小屋ファインダー" };
  }
  const areaLabel = [hut.area, hut.mountain_name].filter(Boolean).join(" ・ ");
  return {
    title: `${hut.name}(${areaLabel}) | 山小屋ファインダー`,
    description: `${hut.name}の標高・難易度・水場・電波・料金・予約方法をまとめました。${areaLabel}にある山小屋です。`,
  };
}

export default async function HutDetailPage({ params }: { params: { id: string } }) {
  const hut = await getHut(Number(params.id));
  if (!hut) notFound();

  const tier = getElevationTier(hut.hut_elevation_text);
  const water = hasFeature(hut.water_info);
  const signal = hasFeature(hut.signal_info);
  const confidenceDot = CONFIDENCE_DOT[hut.information_confidence ?? "低"] ?? CONFIDENCE_DOT["低"];
  const priceBadge = getPriceBadge(hut.price_text);
  const difficulty = getDifficultyTier(hut);
  const summitTimeTier = getSummitTimeTier(hut.summit_time_hours_text);

  return (
    <main>
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring text-sm text-muted hover:text-pine">
          ← 山小屋一覧に戻る
        </Link>
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative h-64 w-full overflow-hidden rounded-card sm:h-96">
          {hut.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hut.image_url} alt={`${hut.name}の写真`} className="h-full w-full object-cover" />
          ) : (
            <ContourPlaceholder tier={tier} />
          )}

          {hut.image_url && hut.image_credit && (
            <span className="absolute bottom-2 right-3 rounded-sm bg-ink/50 px-1.5 py-0.5 text-[11px] text-mist/90 backdrop-blur-sm">
              Photo: {hut.image_credit}
            </span>
          )}

          <span
            className="absolute left-3 top-3 flex items-center gap-1.5 rounded-sm bg-ink/60 px-2.5 py-1 text-xs font-medium text-mist backdrop-blur-sm"
            title="この小屋の情報の信頼度の目安です"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${confidenceDot}`} aria-hidden="true" />
            情報確度: {hut.information_confidence ?? "低"}
          </span>

          <span className="absolute right-3 top-3 rounded-sm bg-trail px-2.5 py-1 text-sm font-bold uppercase tracking-wide text-white shadow-sm">
            {priceBadge ?? "料金要確認"}
          </span>
        </div>

        <h1 className="mt-6 font-display text-3xl font-black leading-snug text-ink sm:text-4xl">{hut.name}</h1>
        <p className="mt-1 text-base text-muted">
          {hut.area}
          {hut.mountain_name ? ` ・ ${hut.mountain_name}` : ""}
        </p>

        {(hut.information_confidence ?? "低") === "低" && (
          <p className="mt-3 rounded-sm border border-trail/40 bg-trail/10 px-3 py-2 text-sm font-semibold text-trail">
            情報確度が低いため、必ず公式サイトでご確認ください
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="rounded-sm bg-pine/10 px-3 py-1.5 font-semibold text-pine">
            {tier}
            {hut.hut_elevation_text ? `(山小屋 ${hut.hut_elevation_text}m)` : ""}
          </span>
          {hut.summit_elevation_text && (
            <span className="rounded-sm bg-mist px-3 py-1.5 text-muted">山頂 {hut.summit_elevation_text}m</span>
          )}
          {difficulty !== "不明" && (
            <span className={DIFFICULTY_BADGE_CLASS[difficulty]}>難易度: {difficulty}</span>
          )}
          {hut.operating_period && (
            <span className="rounded-sm bg-mist px-3 py-1.5 text-muted">{hut.operating_period}</span>
          )}
          {(hut.season_open_text || hut.season_close_text) && (
            <span className="rounded-sm bg-mist px-3 py-1.5 text-muted">
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
                className="rounded-sm border border-line bg-mist px-2.5 py-1 text-xs text-muted"
              >
                {tagName}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-muted">
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

        {hut.features && <p className="mt-5 whitespace-pre-wrap text-base leading-relaxed text-ink/80">{hut.features}</p>}

        <div className="mt-6 space-y-2 rounded-card border border-line bg-surface p-5 text-sm">
          {hut.price_text && (
            <p>
              <span className="font-semibold text-ink">料金: </span>
              <span className="text-muted">{hut.price_text}</span>
            </p>
          )}
          {hut.reservation_method && (
            <p>
              <span className="font-semibold text-ink">予約: </span>
              <span className="text-muted">{hut.reservation_method}</span>
            </p>
          )}
          {hut.capacity_text && (
            <p>
              <span className="font-semibold text-ink">収容人数: </span>
              <span className="text-muted">{hut.capacity_text}</span>
            </p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {hut.website_url && hut.website_url !== "不明" ? (
            <a
              href={hut.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center justify-center rounded-sm bg-pine px-4 py-3 text-sm font-semibold text-mist transition-colors hover:bg-pine-dark"
            >
              公式サイトを見る
            </a>
          ) : (
            <p className="flex items-center justify-center text-center text-xs text-muted">公式サイト未確認</p>
          )}
          <Link
            href="/gear"
            className="focus-ring inline-flex items-center justify-center rounded-sm border border-line px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-pine hover:text-pine"
          >
            おすすめ装備を見る
          </Link>
        </div>

        {hut.correction_note && (
          <p className="mt-4 text-xs leading-relaxed text-muted">補足: {hut.correction_note}</p>
        )}

        <p className="mt-8 border-t border-line pt-4 text-xs text-muted">
          料金・予約方法・営業期間は変更されることがあります。最終的な判断は必ず公式情報でご確認ください。
          情報の誤りに気づいた方は
          <Link href="/contact" className="text-trail underline underline-offset-2 hover:text-trail-dark">
            こちら
          </Link>
          からお知らせください。
        </p>
      </div>
    </main>
  );
}
