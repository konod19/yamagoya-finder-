import { supabase } from "@/lib/supabase";
import { Hut } from "@/types/hut";
import HutFinder from "@/components/HutFinder";

export const revalidate = 3600; // 1時間ごとに再取得(データ更新を反映)

async function getHuts(): Promise<Hut[]> {
  const { data, error } = await supabase
    .from("huts")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("[getHuts] Supabase error:", error.message);
    return [];
  }
  return (data ?? []) as Hut[];
}

export default async function Home() {
  const huts = await getHuts();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-trail/10 px-3 py-1 text-xs font-semibold text-trail-dark">
          <span className="h-1.5 w-1.5 rounded-full bg-trail" aria-hidden="true" />
          日本の山小屋データベース ・ {huts.length}件掲載中
        </div>
        <h1 className="font-display text-4xl font-extrabold leading-[1.15] tracking-tight text-ink sm:text-5xl">
          あなたに合う山小屋を、
          <span className="text-pine">迷わず見つける。</span>
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted">
          エリア・標高・水場・電波の条件で絞り込んで、次の登山で泊まりやすい山小屋を探せます。
        </p>
      </header>

      <HutFinder huts={huts} />

      <footer className="mt-16 border-t border-line pt-6 text-xs text-muted">
        <p>
          料金・予約方法・営業期間は変更されることがあります。最終的な判断は必ず各山小屋の公式情報でご確認ください。
        </p>
      </footer>
    </main>
  );
}
