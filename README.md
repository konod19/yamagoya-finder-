# 山小屋ファインダー

登山初心者〜中級者向けに「あなたに合う山小屋」を提案するサイトです。Next.js + Supabase構成。

## 公開までの手順(ローカル環境なしでOK)

1. このフォルダをZIPのまま展開する
2. GitHubで新しいリポジトリを作成し、「Add file → Upload files」で展開したフォルダの中身を全部アップロードする
   (`.gitignore`に書かれているnode_modulesや.envはそもそも含まれていないので、そのままで大丈夫です)
3. [Vercel](https://vercel.com) にGitHubアカウントでログインし、「Add New → Project」で今作ったリポジトリを選ぶ
4. デプロイ設定画面の「Environment Variables」に以下の2つを追加する
   - `NEXT_PUBLIC_SUPABASE_URL` : SupabaseのProject Settings → API にある「Project URL」
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` : 同じ画面にある「anon public」キー
5. 「Deploy」を押すと数分でビルドが終わり、公開URLが発行されます

## データの更新方法

SupabaseのTable Editorで`huts`テーブルの中身を直接編集するだけで反映されます(最大1時間でキャッシュが更新されます。すぐ反映したい場合はVercelで再デプロイしてください)。

## 今後の拡張について

- **予約機能を追加する場合**: Supabaseに`reservations`テーブルを新規作成し、`huts.id`と紐づける形で予約データを持たせます。ログインが必要になった時点でSupabase Authを有効化してください。
- **ユーザー投稿を受け付ける場合**: `hut_reviews`のようなテーブルを追加し、投稿フォームのページを1つ足す形になります。既存の一覧表示部分には影響しません。
- 今のままだと`huts`テーブルは誰でも読み書きできる状態(RLS未設定)です。書き込み機能を追加するタイミングで、必ずSupabaseのRow Level Securityを設定してください。
