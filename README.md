# Blue Soul - カターレ富山応援歌アプリ

リアルタイム投票機能付きのサッカー応援歌（チャント）アプリです。観客の投票に基づいて現在歌われているチャントを表示し、チャント検索・再生機能も提供します。

## 🚀 技術スタック

- **フロントエンド**: Next.js 15.3.1 (App Router), React 19, TypeScript
- **スタイリング**: Tailwind CSS 4, Radix UI
- **バックエンド**: Firebase (Firestore, Cloud Functions)
- **アイコン**: Lucide React, React Icons
- **開発ツール**: ESLint, Husky, Lint-staged

## 📋 セットアップ手順

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

プロジェクトのルートに`.env.local`ファイルを作成し、Firebase設定を追加してください。

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは [http://localhost:3000](http://localhost:3000) で起動します。

## 📁 プロジェクト構造

```
blue-soul/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # ルートレイアウト（サーバーコンポーネント）
│   │   ├── ClientLayout.tsx    # クライアント側レイアウト
│   │   ├── page.tsx           # ホームページ（chant_currentにリダイレクト）
│   │   ├── chant_current/     # 現在のチャントページ
│   │   ├── chant_search/      # チャント検索ページ
│   │   ├── share/             # 共有機能ページ
│   │   └── globals.css        # グローバルスタイル
│   ├── components/
│   │   ├── common/            # 共通コンポーネント（Header, Footer）
│   │   ├── chantCurrent/      # 現在チャント表示関連コンポーネント
│   │   ├── appShare/          # 共有機能関連コンポーネント
│   │   └── ui/                # 基本UIコンポーネント
│   ├── features/              # 機能別ロジック
│   │   ├── chants/           # チャント関連
│   │   │   ├── types.ts      # 型定義
│   │   │   ├── fetchChants.ts      # 全チャント取得
│   │   │   ├── fetchTeamChants.ts  # チームチャント取得
│   │   │   └── useChantData.ts     # データ取得カスタムフック
│   │   └── votes/            # 投票関連
│   │       ├── types.ts      # 型定義
│   │       ├── generateFingerprint.ts  # ユーザー識別
│   │       ├── sendVote.ts   # 投票送信
│   │       └── useVoting.ts  # 投票ロジックカスタムフック
│   ├── context/
│   │   └── ChantContext.tsx  # グローバル状態管理（React Context）
│   └── lib/
│       ├── firebase.ts       # Firebase設定
│       └── utils.ts          # ユーティリティ関数
├── functions/                # Firebase Cloud Functions
├── public/                   # 静的ファイル
├── package.json             # 依存関係と npm スクリプト
└── README.md               # このファイル
```

## 🎯 主要機能

### 1. リアルタイム投票システム
- **投票サイクル**: 毎分5秒〜60秒が投票時間、0秒〜5秒が集計・表示時間
- **重複防止**: フィンガープリント技術でユーザー識別
- **リアルタイム更新**: Firestoreリスナーで即座に結果反映

### 2. チャント検索・再生
- **テキスト検索**: チャント名・歌詞での検索
- **カテゴリフィルター**: チーム・個人でのフィルタリング
- **YouTube連携**: 楽曲の自動再生機能

### 3. レスポンシブデザイン
- **モバイルファースト**: スマートフォン最適化
- **タブレット対応**: 中サイズ画面にも対応

## 🔥 Firebase連携

### Firestoreコレクション構造

```
collections:
├── chants/           # 応援歌マスターデータ
│   ├── {chantId}
│   │   ├── name: string
│   │   ├── lyrics: string
│   │   ├── tags: string[]
│   │   ├── playTime?: number
│   │   ├── year?: number
│   │   └── youtubeUrl?: string
├── votes/            # 投票データ
│   ├── {voteId}
│   │   ├── chantId: string
│   │   ├── fingerprint: string
│   │   └── timestamp: Timestamp
└── currentChant/     # 現在表示中のチャント
    ├── {currentId}
    │   ├── chantId: string
    │   ├── name: string
    │   ├── lyrics: string
    │   ├── tags: string[]
    │   ├── voteCount: number
    │   └── updatedAt: Timestamp
```

### Cloud Functions

```bash
# ローカルでのFunction開発
cd functions
npm install
npm run serve
```

- **updateCurrentChant**: 毎分実行される投票集計関数

## 🛠️ 開発ガイド

### カスタムフックの活用

プロジェクトでは機能別にカスタムフックを分離しています：

```tsx
// 投票機能の利用
import { useVoting } from '@/features/votes/useVoting';

const { cooldown, isVoting, canVote, hasVoted, handleVote } = useVoting();

// データ取得の利用
import { useChantData } from '@/features/chants/useChantData';

const { teamChants, latestCurrentChant, isLoading } = useChantData();
```

### 新規ページの追加

1. `src/app/` 配下に新しいディレクトリを作成
2. `page.tsx` ファイルを配置
3. クライアント機能が必要な場合は `'use client'` を追加

```tsx
'use client'

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export default function NewPage() {
  return (
    <div className="relative h-screen bg-[#F1F2F6]">
      <Header />
      {/* ページ固有の内容 */}
      <Footer />
    </div>
  );
}
```

### コンポーネントの命名規則

- **Pages**: `PascalCase` + `Page` suffix
- **Components**: `PascalCase`
- **Hooks**: `use` + `PascalCase`
- **Utils**: `camelCase`

## 📱 UI/UX仕様

### カラーパレット
- **プライマリー**: `#0D277E` (カターレ富山公式カラー)
- **背景**: `#F1F2F6` (明るいグレー)
- **テキスト**: 黒・白・グレー系

### レスポンシブブレークポイント
- **モバイル**: `max-width: 768px`
- **タブレット**: `768px - 1024px`
- **デスクトップ**: `1024px+`

## 🚀 本番デプロイ

### ビルドと起動

```bash
# プロダクションビルド
npm run build

# 本番サーバー起動
npm start
```

### Vercelでのデプロイ

推奨プラットフォームは [Vercel](https://vercel.com) です。

1. GitHubリポジトリをVercelに接続
2. 環境変数を設定
3. 自動デプロイを有効化

## 🔧 よくある問題と解決方法

### 開発時のコンソールエラー

```
localhost/:1 Unchecked runtime.lastError: The message port closed before a response was received.
```

これはブラウザ拡張機能との競合によるもので、アプリの動作には影響しません。

### React Hooks エラー

Hooksは常にコンポーネントのトップレベルで呼び出し、条件分岐内では使用しないでください。

### Firebase接続エラー

環境変数が正しく設定されているか確認してください。

## 📋 開発チェックリスト

- [ ] TypeScriptエラーが解消されている
- [ ] ESLintチェックをパスしている
- [ ] モバイル・デスクトップでのレスポンシブ確認
- [ ] 投票機能の動作確認
- [ ] Firebase設定の動作確認

## 🤝 コントリビューション

1. featureブランチを作成
2. 変更をコミット
3. プルリクエストを作成
4. コードレビュー後にマージ

## 📄 ライセンス

このプロジェクトはプライベートです。

---

**作成者**: Blue Soul Development Team  
**最終更新**: 2024年
