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
        <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-wider text-ochre">
          <span className="h-2 w-2 rounded-full bg-ochre" aria-hidden="true" />
          日本の山小屋データベース
        </div>
        <h1 className="font-display text-4xl italic leading-tight text-ink sm:text-5xl">
          あなたに合う山小屋を、
          <br />
          迷わず見つける。
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted">
          エリア・標高・水場・電波の条件で絞り込んで、次の登山で泊まりやすい山小屋を探せます。
          全国 {huts.length} 件の山小屋データを掲載中。
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
