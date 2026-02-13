# 学校ポータルサイト

## プロジェクト概要

学校向けのポータルサイト。お知らせ表示と時間割表示の機能を持つ。
フレームワーク不使用のHTML/CSS/JavaScriptで構成される静的サイト。
外部依存なし。ビルドツール・パッケージマネージャー不使用。

## ディレクトリ構成

```
/
├── index.html          # メインページ（エントリーポイント）
├── css/
│   └── style.css       # スタイルシート（BEM命名規則）
├── js/
│   ├── data.js         # サンプルデータ定義（お知らせ・時間割・時限ラベル）
│   └── app.js          # アプリケーションロジック（描画・初期化・XSS対策）
└── CLAUDE.md           # このファイル
```

## 技術スタック

- **HTML5**: セマンティック要素（header, main, section, footer, nav, article）
- **CSS3**: メディアクエリによるレスポンシブ対応（ブレークポイント: 600px）
- **JavaScript (ES5)**: フレームワーク不使用。IIFE + strict mode
- **フォント**: Hiragino Kaku Gothic ProN, Noto Sans JP, Meiryo

ビルドツール、パッケージマネージャー、テストフレームワーク、リンター、CI/CDは一切使用していない。

## 開発方法

### ローカルでの確認

ビルドステップは不要。`index.html` をブラウザで直接開くか、任意のHTTPサーバーで配信する。

```sh
# Python 3 の場合
python3 -m http.server 8000

# Node.js (npx) の場合
npx serve .
```

### テスト・リント

テストフレームワーク・リンターは未導入。動作確認はブラウザで手動で行う。

### コーディング規約

- **HTML**: セマンティックな要素を使用。BEM風のクラス命名（`block__element--modifier`）
- **CSS**: コンポーネント単位でセクション分け。`/* === セクション名 === */` コメントで区切りを明示
- **JavaScript**: 即時実行関数(IIFE)でグローバル汚染を防止。`"use strict"` を使用。ES5構文を維持（`var`、`function`宣言、`for`ループ等）。ユーザー入力やデータの描画時は必ず `escapeHtml()` でXSS対策を行う
- **データファイル**: `js/data.js` ではグローバル変数（`var`）でデータを定義。モジュールシステム不使用

### 言語

UIテキストはすべて日本語。コード中のコメントも日本語で記述する。

## アーキテクチャ

### スクリプト読み込み順序

`index.html` の末尾で以下の順に読み込む（順序が重要）:
1. `js/data.js` — グローバル変数としてデータを定義
2. `js/app.js` — IIFEでラップされたアプリケーションロジック。data.js のグローバル変数を参照

### 主要関数 (`js/app.js`)

| 関数名 | 説明 |
|--------|------|
| `renderAnnouncements()` | `announcements` 配列を読み取り、`#announcement-list` にHTML挿入 |
| `renderSchedule(classId)` | 指定クラスIDの時間割を `#schedule-body` にHTML挿入 |
| `escapeHtml(str)` | `&`, `<`, `>`, `"`, `'` をHTMLエンティティに変換。XSS防止用 |
| `init()` | DOMContentLoaded時に呼ばれる初期化関数。描画とイベント登録を行う |

### DOM構成

- `#announcement-list` — お知らせ一覧の挿入先（`renderAnnouncements()`で生成）
- `#schedule-body` — 時間割テーブルのtbody（`renderSchedule()`で生成）
- `#class-select` — クラス選択セレクトボックス。changeイベントで時間割を再描画

## 機能一覧

| 機能 | 説明 |
|------|------|
| お知らせ | カテゴリ（重要・全般・行事）付きのお知らせ一覧を表示 |
| 時間割 | クラス別（1A, 1B, 2A, 2B）の週間時間割を表示。セレクトボックスで切替 |

## データ構造

### お知らせ (`announcements` in `js/data.js`)

```js
{
  date: "YYYY-MM-DD",       // 日付
  category: "important",    // カテゴリID: important | general | event
  categoryLabel: "重要",    // 表示用ラベル
  title: "タイトル",
  body: "本文"
}
```

### 時間割 (`schedules` in `js/data.js`)

クラスIDをキーとするオブジェクト。値は `[時限][曜日(月〜金)]` の2次元配列。
6時限 × 5曜日の構成。空文字列は授業なしを表す。

### 時限ラベル (`periodLabels` in `js/data.js`)

`["1限", "2限", "3限", "4限", "5限", "6限"]` — 時間割テーブルの行ヘッダーに使用。

## CSSの構成

スタイルシートは以下のセクションに分かれている:

| セクション | 説明 |
|------------|------|
| リセット・ベース | ボックスモデル正規化、body基本スタイル |
| ヘッダー | ナビゲーションバー（背景色: `#1a5276`） |
| メインコンテンツ | 中央寄せコンテナ（max-width: 960px） |
| セクション共通 | 白背景カード、影、下線付きタイトル |
| お知らせ | カード一覧、カテゴリバッジ色（重要:赤、全般:青、行事:緑） |
| 時間割 | セレクト、テーブルスタイル、ホバー効果 |
| フッター | 中央寄せ、グレー文字 |
| レスポンシブ | 600px以下でヘッダー縦並び、テーブル文字縮小 |

## セキュリティ

- HTMLに動的コンテンツを挿入する際は **必ず** `escapeHtml()` を通す（XSS対策）
- `escapeHtml()` は `&`, `<`, `>`, `"`, `'` の5文字をエスケープする
- 外部CDNやサードパーティスクリプトは不使用

## 変更時の注意

- 新しいカテゴリを追加する場合は `css/style.css` に対応する `.announcement-item__category--<name>` クラスを追加する
- 新しいクラスを追加する場合は `js/data.js` の `schedules` オブジェクトと `index.html` の `<select>` にオプションを追加する
- HTMLに動的コンテンツを挿入する際は必ず `escapeHtml()` を通す
- スクリプトの読み込み順序（data.js → app.js）を変更しないこと
- JavaScript は ES5 構文を維持すること（アロー関数、`let`/`const`、テンプレートリテラル等は使用しない）
- CSS のセクションコメント形式 `/* === セクション名 === */` を維持すること
