import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // 開発中に環境変数の設定漏れへ気づけるようにするための警告。
  // ビルド自体は止めない（Vercelのプレビュー等で環境変数未設定のまま走るケースを避ける）。
  console.warn(
    "[supabase] NEXT_PUBLIC_SUPABASE_URL または NEXT_PUBLIC_SUPABASE_ANON_KEY が設定されていません。"
  );
}

export const supabase = createClient(
  supabaseUrl ?? "",
  supabaseAnonKey ?? ""
);
