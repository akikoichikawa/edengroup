# EDEN Group コーポレートサイト

EDEN Group 様コーポレートサイトの制作リポジトリです。

## 構成

- ルート直下：静的ページ（HTML / CSS / JavaScript）。ご提供いただいた参考サイトのデータを流用
- `assets/`：画像・ロゴ・動画
- `news/`：ブログ（NEWS）。WordPress を導入予定

## ローカル確認（MAMP）

MAMP を起動し、次の URL を開きます。

- http://localhost:8888/edengroup/

## お客様確認用プレビュー（GitHub Pages）

- https://akikoichikawa.github.io/edengroup/
- 静的ページのみ表示されます。ブログ（WordPress）は表示されません

## お問い合わせのメールアドレス（未確定）

お問い合わせボタンとフッターのリンクは、クリックするとメールソフトが開きます（mailto）。
メールアドレスは仮に `contact@example.com` としています。確定したら、全ページの `contact@example.com` を一括で置き換えてください。

```sh
grep -l "contact@example.com" *.html | xargs sed -i '' 's/contact@example.com/（確定したアドレス）/g'
```

## 公開前の対応

- お問い合わせのメールアドレス（仮：contact@example.com）を確定したアドレスに置き換える
- 全ページの `<meta name="robots">` をプレビュー用の noindex から `index,follow` に戻す（best-of-miss-fukuoka.html は元々指定なしのため行ごと削除）
- canonical・OGP・構造化データ・sitemap.xml・robots.txt のURLを新ドメインに更新
- BEST OF MISS FUKUOKA ページの外部画像（Wix）17点を有料画像に差し替え
