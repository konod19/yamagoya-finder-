import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Mountain } from "@/types/mountain";
import MountainFinder from "@/components/MountainFinder";

export const revalidate = 3600;

async function getMountains(): Promise<Mountain[]> {
  const { data, error } = await supabase
    .from("mountains")
    .select(
      "id, name, area, elevation_text, difficulty_tier, prefecture, image_url, image_credit, huts(id, name, hut_elevation_text)"
    )
    .order("name", { ascending: true });

  if (error) {
    console.error("[getMountains] Supabase error:", error.message);
    return [];
  }
  const mountains = (data ?? []) as Mountain[];
  // 小屋が複数ある山(比較価値が高い)を先に、写真がある山を先に表示
  return [...mountains].sort((a, b) => {
    const photoDiff = (a.image_url ? 0 : 1) - (b.image_url ? 0 : 1);
    if (photoDiff !== 0) return photoDiff;
    return b.huts.length - a.huts.length;
  });
}

export default async function Home() {
  const mountains = await getMountains();

  return (
    <main>
      <section className="relative overflow-hidden bg-charcoal">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://sysyrgcmltiwgdfitgno.supabase.co/storage/v1/object/public/hut-photos/hero-mountains.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-charcoal/55" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-sm border border-trail/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-trail-light">
            <span className="h-1.5 w-1.5 bg-trail" aria-hidden="true" />
            山からさがす ・ {mountains.length}座掲載中
          </div>
          <h1 className="font-display text-3xl font-black uppercase leading-[1.15] tracking-tight text-mist sm:text-6xl sm:leading-[1.05]">
            山から<span className="text-trail">山小屋</span>
            <br />
            を探す。
          </h1>
          <p className="mt-5 max-w-xl text-base text-mist/70">
            登る山が決まっている方向けに、山ごとに山小屋をまとめました。同じ山にある小屋同士を比較したいときにご利用ください。
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href="/huts"
              className="focus-ring inline-block text-sm text-trail-light underline underline-offset-4 hover:text-trail"
            >
              → 山小屋一覧から探す
            </Link>
            <Link
              href="/gear"
              className="focus-ring inline-block text-sm text-trail-light underline underline-offset-4 hover:text-trail"
            >
              → コスパ最強装備一覧を見る
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <MountainFinder mountains={mountains} />

        <footer className="mt-16 border-t border-line pt-6 text-xs text-muted">
          <p>
            料金・予約方法・営業期間は変更されることがあります。最終的な判断は必ず各山小屋の公式情報でご確認ください。
          </p>
          <p className="mt-2">
            情報の誤りに気づいた方は
            <Link href="/contact" className="text-trail underline underline-offset-2 hover:text-trail-dark">
              こちら
            </Link>
            からお知らせください。
          </p>
        </footer>
      </div>
    </main>
  );
}
