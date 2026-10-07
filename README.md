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

## 公開前の対応

- 全ページの `<meta name="robots">` をプレビュー用の noindex から `index,follow` に戻す（best-of-miss-fukuoka.html は元々指定なしのため行ごと削除）
- canonical・OGP・構造化データ・sitemap.xml・robots.txt のURLを新ドメインに更新
- BEST OF MISS FUKUOKA ページの外部画像（Wix）17点を有料画像に差し替え
