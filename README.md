# Blue Soul Project

## セットアップ手順

1. 依存パッケージのインストール

```bash
npm install
```

2. 環境変数の設定

プロジェクトのルートに`.env.local`ファイルを作成し、Firebase設定を追加してください。

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. 開発サーバーの起動

```bash
npm run dev
```

---

## ディレクトリ構成

- `src/app/chant_current/page.tsx` … 現在の応援歌ページ
- `src/app/chant_search/page.tsx` … 応援歌検索ページ
- `src/components/common/` … 共通コンポーネント（Header, Footerなど）
- `src/components/chantCurrent/` … 応援歌表示関連コンポーネント
- `src/features/votes/` … 投票機能関連のロジック
- `src/features/chants/` … 応援歌データ管理関連のロジック
- `src/lib/` … ユーティリティとFirebase設定
- `functions/` … Firebase Cloud Functions

---

## Firebase連携について

このプロジェクトはFirebaseを使用しています。

### Firestoreコレクション構造

- `chants`: 応援歌データを保存
- `votes`: ユーザーの投票データを保存
- `currentChant`: 現在表示中の応援歌情報

### Cloud Functions

毎分実行される`updateCurrentChant`関数で投票集計を行っています。ローカルで関数をテストする場合:

```bash
cd functions
npm run serve
```

---

## 共通コンポーネントの使い方

各ページで以下のようにインポートして使います。

```tsx
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function SomePage() {
  return (
    <div className="relative h-screen bg-[#F1F2F6]">
      <Header />
      {/* ページ固有の内容 */}
      <Footer />
    </div>
  );
}
```

---

## 開発時の注意事項

### コンソールエラーについて

開発サーバー実行時に以下のエラーが表示されることがありますが、アプリケーションの動作に影響はありません。

```
localhost/:1 Unchecked runtime.lastError: The message port closed before a response was received.
```

これはブラウザの拡張機能とNext.jsの開発モードの相互作用によるものです。本番環境では発生しません。

### フッターのナビゲーション

フッターのナビゲーションは、現在のページに応じてアイコンの色が自動で切り替わります。

### 新規ページ作成

- 新しいページを追加する場合は`src/app/`配下にディレクトリを作成し、`page.tsx`を配置してください。
- クライアントサイドのインタラクションを含むページには`'use client'`ディレクティブを追加してください。

---

## チャント投票サイクル

1. 毎分0〜5秒：集計結果表示（投票不可）
2. 毎分5〜60秒：投票可能時間
3. 1分経過後に最も投票数の多いチャントが表示される

---

## 本番ビルド

```bash
npm run build
npm start
```

---

## その他

- 質問や不明点があれば、開発メンバーにご相談ください。

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
