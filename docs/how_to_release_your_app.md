# How to release your app

- [How to release your app](#how-to-release-your-app)
  - [前提](#前提)
  - [ツールインストール](#ツールインストール)
  - [プロジェクト全体像](#プロジェクト全体像)
    - [HTTPサーバーのディレクトリ構造](#httpサーバーのディレクトリ構造)
  - [配信データの準備](#配信データの準備)
    - [アプリの準備](#アプリの準備)
      - [コア部分のダウンロード](#コア部分のダウンロード)
      - [アプリのプロジェクト生成](#アプリのプロジェクト生成)
      - [config JSON作成](#config-json作成)
      - [アプリのビルド](#アプリのビルド)
      - [配信ファイルをHTTPサーバーに設置](#配信ファイルをhttpサーバーに設置)
      - [コンポーネントやリソースのカスタマイズ](#コンポーネントやリソースのカスタマイズ)
    - [薄片画像関連データの準備](#薄片画像関連データの準備)

## 前提

- HTML及び薄片画像等を静的配信可能なHTTPサーバーはセットアップ済みとする

## ツールインストール

- git
  - [ここ](https://git-scm.com)を参考にアプリのビルドを実行するOSに合わせた方法でインストールする
- Node.js
  - ソースコードをビルドし, 配信可能なHTMLファイルやJavaScriptファイルを生成するために使用する
  - [ここ](https://nodejs.org/ja/)から**バージョン16系**の最新のものをダウンロードし, インストールする
  - `node -v`コマンドで`v16.x.y`のようにインストールしたバージョンが表示されることを確認する
- yarn
  - 依存ライブラリのインストールのために使用する
  - バージョン1系を使用する
  - コマンド`npm install --global yarn`を実行する
  - `yarn -v`を実行し, `v1.x.y`のようにバージョンが表示されることを確認する

## プロジェクト全体像

関係するコンポーネント

- アプリのコアとなる`microscope_simulator`
- アプリ個別のプロジェクトである`scopin-example`
- HTTPサーバー
- クライアント

単純化したコンポーネント間の関係は以下の図のようになる。
![Directory structures](/docs/images/direcotry_structures.png)

### HTTPサーバーのディレクトリ構造

- アプリ本体の配信ファイル一式(ex. `http_root/`)と, 薄片画像関連データ(ex. `path/to/sample_image_repo/`)用の2つのディレクトリを設置する。
  - エンドユーザーがアプリを使用するため最初にダウンロードするのは, `http_root/index.html`
  - なお、`http_root/`の下位に`sample_image_packages/`が含まれている必要はない。

```raw
${http_root}}/
|- css/
|- images/
|- js/
|- index.html

${path/to/sample_image_repo}/
|- category/
|   |- default.json
|   |- <level1.json> # 閲覧者のレベルなどによってにカテゴリを変える場合、ここにサンプルリストを追加する
|   |- <level2.json>
|   |- <level3.json>
|- packages/
|   |- sample_1/
|   |- sample_2/
|- sample_list/
    |- default.json
    |- <level1.json> # 閲覧者のレベルなどによって見せるサンプルを変える場合、ここにサンプルリストを追加する
    |- <level2.json>
    |- <lavel3.json>
    |- rock_of_prefectures.json
```

## 配信データの準備

[アプリの準備](#アプリの準備)と, [薄片画像等のデータの準備](#薄片画像関連データの準備)を行う。

### アプリの準備

#### コア部分のダウンロード

- 適当なディレクトリにGitHubからファイル一式をダウンロードする
  - `git clone https://github.com/Fumipo-Theta/microscope_simulator.git`
  - `microscope_simulator`という名前のディレクトリが存在し, ファイル一式がその中に含まれていることを確認する

#### アプリのプロジェクト生成

フッターやアプリロゴなど, アプリのコア機能に直接関係ない部分はカスタマイズできるようになっている。
カスタマイズ部分の変更をコア機能とは別にバージョン管理できるよう、アプリごとに新しいプロジェクトを生成するようになっている。

- ターミナルで`microscope_simulator/`ディレクトリに移動する
- `npm run new -- <app-name: ここでは scopin-example>`を実行する
  - `app-name`はスペースを含まないようにすること
  - `microscope_simulator`と同階層に`scopin-example/`というディレクトリが作成されていることを確認する

`scopin-example`のディレクトリ構造は 最終的に下記のようになる。
アプリカスタマイズのために編集が必要なのは, 基本的に`vender/`ディレクトリのファイルである。

```raw
scopin-example/
    _src/                       # microscope_simulatorのうちアプリのビルドに必要なコードが含まれる
    deps/microscope_simulator/  # microscope_simulatorのファイル一式。デフォルトではreleaseブランチの最新のコミット時点
    example_image_package_root/ # テスト用の薄片画像パッケージ等
    node_modules/               # (初期状態では存在せず自動的に作成される)依存ライブラリの保存場所
    release/                    # (初期状態では存在せず自動的に作成される) ビルド生成物が配置される
    script/npm/                 # アプリの運用に必要なスクリプト一式。手動での編集不要
    test/                       # テストファイルを配置する
    vender/                     # アプリをカスタマイズするためのファイルを設置する
    .babelrc                    # ビルド設定ファイルの一つ
    .gitignore                  # バージョン管理の例外を設定する
    config.example.json         # アプリの振る舞いを変えるための設定ファイル。デフォルトで使用される
    jest.config.js              # 自動テストのための設定ファイル
    package.json                # アプリのバージョンや依存ライブラリ等のメタデータ
    tsconfig.json               # ビルド設定ファイルの一つ
    webpack.config.js           # ビルド設定ファイルの一つ
```

#### config JSON作成

`scopin-example/`で作業を行う。

- アプリのビルド時にアプリの振る舞いを変更したり, (今の所定義されていないが) 秘匿情報をレポジトリに含めることなくアプリに設定を適用するため, 環境変数`CONFIG_JSON`を用いる
  - `CONFIG_JSON`はJSON形式の文字列でなければならない。
- 予め`config.json`のようなJSONファイルを作成しておくと, ビルド時に生のJSONを入力しなくて良くなる
  - ファイル名が`config*.json`のようなパターンのファイルは, デフォルトでgitの追跡対象外になる
- 設定できるフィールドや形式の例は[`config.example.json`](/config.example.json)を参照
  - 今の所, `"package_endpoint"`で薄片画像関連データを格納したディレクトリへのパスかURLを指定するようになっている([HTTPサーバーのディレクトリ構造](#HTTPサーバーのディレクトリ構造)の`${path/to/sample_image_repo}/`を指定する)

#### アプリのビルド

`scopin-example/`で作業を行う。

- 依存ライブラリのインストールを行う
  - `yarn install`
- 必要があればコアとなるmicroscope_simulatorを更新する
  - 初期状態ではmicroscope_simulatorの`release`ブランチの, アプリプロジェクト作成時点での最新が使われるようになっている
  - microscope_simulatorのブランチを最新にしたり, masterなど別のブランチや, 特定のバージョンを使用したりしたい場合`yarn update:core`コマンドを使用する
    - `yarn update:core`: 現在のmicroscope_simulatorのブランチ(初期状態では`release`)の最新にする
    - `yarn update:core -- origin/master`: `--`の後に指定したブランチの最新にする
    - `yarn update:core -- 2.3.0`: `--`の後に指定したバージョンにする
- 配信ファイル生成のためのビルドを行う
  - 環境変数`CONFIG_JSON`を指定して`yarn build:prod`コマンドを実行する
  - `scopin-example/config.json`の中身を`{"package_endpoint":"/path/to/sample_image_repo"}`としておくとする
    - Windows 環境 (Powershell)
      - `$env:CONFIG_JSON=cat config.json; yarn build:prod`
    - Mac, Linux 環境
      - `CONFIG_JSON=$(cat config.json) yarn build:prod`
  - ビルドの結果, 配信用のファイル群が`scopin-example/release/`ディレクトリに生成されていることを確認する

開発用コマンド

- 開発環境での動作確認方法
  - ローカルサーバーを起動しつつビルドを行う。コードが変更されるたびに自動でビルドが行われる
    - `yarn start`コマンドを実行する
    - このコマンドでも上と同様に`CONFIG_JSON`を指定してアプリの振る舞いを変えることができる(指定しなければ`config.example.json`が読み込まれる)
      - Windows 環境 (Powershell)
        - `$env:CONFIG_JSON=cat config.json; yarn start`
      - Mac, Linux 環境
        - `CONFIG_JSON=$(cat config.json) yarn start`
  - ターミナルに`webpack 5.64.2 compiled successfully in 342 ms`のように表示されれば, [http:localhost:8080/](http:localhost:8080/)でローカルサーバーにアクセスできる
  - このコマンドでは, ビルド生成物が`release/`に生成されることはない

#### 配信ファイルをHTTPサーバーに設置

- `yarn build:prod`の結果できた`release/`ディレクトリの中身を全てHTTPサーバーにコピーし設置する

#### コンポーネントやリソースのカスタマイズ

- カスタマイズ可能なファイルは, 基本的に`vender/`ディレクトリ下に存在する。
- `vender/`ディレクトリを編集した場合, 変更の反映のために再度[アプリのビルド](#アプリのビルド)を行う必要がある
- `vender/`ディレクトリは下記のような構造を持つ。

```raw
vender/
  component/
    app_logo/default/app_logo.tsx
    footer/default/footer.tsx
    social/default/social.tsx
  html_fragment/
    prod/
      CUSTOM_META.fragment.html
    CUSTOM_META.fragment.html
    PRE_HOOKS.fragment.html
    POST_HOOKS.fragment.html
    SERVICE_WORKER.fragment.html
  i18n/
    message.ts
  resource/
    images/
      favicon.png
    root/
    sw/
    service_worker.js
  custom_components.ts
```

- [`vender/component/`](/vender/component/)で下記のReact componentを任意に定義可能
  - app_logo: アプリ起動直後の初期画面などに表示される, アプリのロゴ
  - footer: フッター
  - social: SNSでリンクを共有するためのボタン等
- [`vender/custom_components.ts`](/vender/custom_components.ts)
  - 具体的にどのカスタムコンポーネントの実装を使うか定義するファイル
  - `*/default/*`を流用する場合は変更する必要はない
- [`vender/html_fragment/`](/vender/html_fragment/)で[メインとなるHTMLファイル](https://github.com/Fumipo-Theta/microscope_simulator/blob/master/src/html/index.html)の決まった場所(`@CUSTOM_META@`)のような記法で指定されている部分に任意のHTML要素を追加可能
  - `prod` | `dev` | `local`といったruntimeごとに追加するHTML要素を変えることも可能
  - 例えば`prod`環境のみで使用する場合は[`vender/html_fragment/prod/`](/vender/html_fragment/prod/)にファイルを配置する
    - `CUSTOM_META.fragment.html`: 主にtitleやfaviconなどを`<header>`要素内に定義する要素を挟み込む
    - `PRE_HOOKS.fragment.html`: body要素の直下の先頭に挟み込む
    - `POST_HOOKS.fragment.html`: body要素直下の末尾に挟み込む
    - `SERVICE_WORKER.fragment.html`: service workerを使用する場合に, 登録などの処理を行うスクリプトを定義する
- [`vender/i18n/`](/vender/i18m/)でアプリ上の文言を定義可能
  - 日本語・英語の文言切り替えに対応
- [`vender/resource/`](/vender/resource/)でコアに含まれないリソースをアプリ内で使用可能にする
  - [`vender/resource/images/`](/vender/resource/images/)
    - カスタム画像を設置する。[readme](https://github.com/Fumipo-Theta/microscope_simulator/blob/master/vender/resource/images/readme.md)を参照
    - ビルド時に`release/images/`にコピーされる
  - [`vender/resource/root/`](/vender/resource/root/)
    - アプリのエントリポイント(`release/index.html`)と同階層に置くべきファイルを設置する
    - 例えばProgressive Web Application化する際の`manifest.json`など
  - [`vender/resource/sw/`](/vender/resource/sw/)
    - service workerを使用する場合は`vender/resource/sw/service_worker.js`として定義する

### 薄片画像関連データの準備

- HTTPサーバーに薄片画像関連ファイルを設置する
  - ディレクトリ構成の例は[`example_image_package_root/`](/example_image_package_root/)を参照
  - 詳細は[別ドキュメント](./how_to_prepare_sample_images.md)を参照
