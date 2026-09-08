import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Mountain } from "@/types/mountain";
import MountainFinder from "@/components/MountainFinder";

export const revalidate = 3600;

async function getMountains(): Promise<Mountain[]> {
  const { data, error } = await supabase
    .from("mountains")
    .select("id, name, area, elevation_text, difficulty_tier, prefecture, image_url, image_credit, huts(id, name)")
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
      <section className="bg-charcoal">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <h1 className="font-display text-3xl font-black uppercase leading-[1.1] tracking-tight text-mist sm:text-4xl">
            山から<span className="text-trail">山小屋</span>を探す
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
