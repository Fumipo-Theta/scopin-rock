# How to release your app

## 前提

- HTML及び薄片画像等を静的配信可能なHTTPサーバーはセットアップ済みとする

## ツールインストール

- git
  - [ここ](https://git-scm.com)を参考にアプリのビルドを実行するOSに合わせた方法でインストールする
- Node.js
  - ソースコードをビルドし, 配信可能なHTMLファイルやJavaScriptファイルを生成するために使用する
  - [ここ](https://nodejs.org/ja/)から**バージョン16系**の最新のものをダウンロードし, インストールする
  - `node -v` コマンドで `v16.x.y` のようにインストールしたバージョンが表示されることを確認する
- yarn
  - 依存ライブラリのインストールのために使用する
  - バージョン1系を使用する
  - コマンド `npm install --global yarn` を実行する
  - `yarn -v` を実行し, `v1.x.y` のようにバージョンが表示されることを確認する

## 配信データの準備

アプリ本体の準備と, 薄片画像等のデータの準備を行う。

### 最終的なディレクトリ構造

アプリ本体の配信ファイルの配置場所 (ex. `public/`) と, 薄片画像関連ファイルの配置場所 (ex. `sample_image_packages/`) はともにHTTPサーバーがファイルへのアクセス権限を持っているディレクトリでなければならない。
なお、`public/` の下位に `sample_image_packages/` が含まれている必要はない。

```
${public}/
|- css/
|- images/
|- js/
|   |- lib/<外部ライブラリ等>
|   |- app.js
|- index.html
|- make_package.html # アプリからは参照できなくても良い
|- <その他このアプリについて表示するためのHTMLなど、あれば>

${sample_image_packages}/
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

### アプリの準備

#### OSS部分のソースコードのダウンロード

- 適当なディレクトリにGitHubからファイル一式をダウンロードする
  - `git clone https://github.com/Fumipo-Theta/microscope_simulator.git`
- `microscope_simulator` という名前のディレクトリが存在し, ファイル一式がその中に含まれていることを確認する

#### アプリ作成

1. アプリのプロジェクト生成
2. config JSON作成
3. アプリのビルド
4. 配信ファイルをHTTPサーバーに設置
5. アプリの一部のコンポーネントやリソースのカスタマイズ

##### アプリのプロジェクト生成

アプリをバージョン管理できるよう、別ディレクトリにプロジェクトを生成する。

- ターミナルで `microscope_simulator/` ディレクトリに移動する
- `npm run new:app -- <app-name: ここでは scopin-example>` を実行する
  - `app-name` はスペースを含まないようにすること
- `microscope_simulator` と同階層に `scopin-example/` というディレクトリが作成されていることを確認する

`scopin-example` のディレクトリ構造は以下のようになっている。

```
scopin-example/
    _src/                       # microscope_simulatorのファイルのうちアプリのビルドに必要なコードが含まれる。手動での編集不要
    deps/microscope_simulator/  # microscope_simulatorのファイル一式。デフォルトではreleaseブランチの最新のコミット時点。手動での編集不要
    example_image_package_root/ # テスト用の薄片画像パッケージ等
    node_modules/               # 依存ライブラリの保存場所。(初期状態では存在せず自動的に作成される)。手動での編集不要
    release/                    # ビルド生成物が配置される (初期状態では存在せず自動的に作成される)。手動での編集不要
    script/npm/                 # アプリの運用に必要なスクリプト一式。手動での編集不要
    test/                       # テストファイルを配置する
    vender/                     # アプリをカスタマイズするためのファイルを設置する
    .babelrc                    # ビルド設定ファイルの一つ。手動での編集不要
    .gitignore                  # バージョン管理の例外を設定する
    config.example.json         # アプリの振る舞いを変えるための設定ファイル
    jest.config.js              # 自動テストのための設定ファイル
    package.json                # アプリのバージョンや依存ライブラリ等のメタデータ
    tsconfig.json               # ビルド設定ファイルの一つ。基本的に手動での編集不要
    webpack.config.js           # ビルド設定ファイルの一つ。基本的に手動での編集不要
```

##### config JSON作成

アプリのビルド時に,
(今の所薄片画像パッケージの参照先設定だけだが) アプリの振る舞いを変更したり,
(今の所定義されていないが) 秘匿情報をレポジトリに含めることなくアプリに設定するため,
環境変数`CONFIG_JSON`を用いる。`CONFIG_JSON`はJSON形式の文字列でなければならない。

予め`config.json`のようなJSONファイルを作成しておくと設定が簡便であるが,
もし秘匿情報を含む場合は`.gitignore`に登録してバージョン追跡対象外にする必要がある。

設定できるフィールドや形式の例は[`config.example.json`](/config.example.json)を参照のこと。
今の所, `"package_endpoint"`として薄片画像パッケージを格納したディレクトリへのパスかURLを指定するようになっている。

##### アプリのビルド

- 必要があればcoreとなるmicroscope_simulatorを更新する
  - 初期状態ではアプリプロジェクト作成時点でのmicroscope_simulatorの`release`ブランチの最新になっている
  ― microscope_simulatorのブランチを最新にしたり, 特定のブランチや特定のバージョンを使用したりしたい場合`npm run update:core`コマンドを使用する
    - `npm run update:core`: 現在のmicroscope_simulatorのブランチ(初期状態では`release`)の最新にする
    - `npm run update:core -- master`: `--`の後に指定したブランチの最新にする
    - `npm run update:core -- 2.3.0`: `--`の後に指定したバージョンにする
- 配信ファイル生成のためのビルド
  - 環境変数`CONFIG_JSON`を指定して`yarn build:prod`コマンドを実行する
  - コマンド実行の簡便化のため, `config.json`に`{"package_endpoint":"/path/to/sample_image_packages"}`と記入しておくとする
    - Windows 環境 (Powershell): `$env:CONFIG_JSON=cat config.json; yarn build:prod`
    - Mac, Linux 環境: `CONFIG_JSON=$(cat config.json) yarn build:prod`
  - ビルドの結果, 配信用のファイル群が`release/`ディレクトリに生成されていることを確認する
- 開発環境での動作確認方法
  - ローカルサーバーを起動しつつビルドを行う。コードが変更されるたびに自動でビルドが行われる
    - `yarn start`コマンドを実行する
    - もちろん, このコマンドでも上と同様に`CONFIG_JSON`を指定してアプリの振る舞いを変えることができる
  - ターミナルに`webpack 5.64.2 compiled successfully in 342 ms`のように表示されれば, [http:localhost:8080/](http:localhost:8080/)でローカルサーバーにアクセスできる
  - なお, ビルド生成物が`release/`に生成されることはない

##### 配信ファイルをHTTPサーバーに設置

- `yarn build:prod`の結果できた`release/`ディレクトリの中身を全てHTTPサーバーにコピーし設置する
- HTTPサーバーに薄片画像関連ファイルを設置する
  - ディレクトリ構成の例は[`example_image_package_root/`](/example_image_package_root/)を参照

##### アプリの一部のコンポーネントやリソースのカスタマイズ

アプリ作成者が編集可能なファイルは, 基本的に`vender/`ディレクトリ下に存在する。
`vender/`ディレクトリは下記のような構造を持つ。

```
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
  - 例えば`prod`環境のみで使用する場合は[`vender/`](/vender/html_fragment/prod/)にファイルを配置する
    - `CUSTOM_META.fragment.html`: 主にtitleやfaviconなどを指定する
    - `PRE_HOOKS.fragment.html`: body要素の直下の先頭に挟み込む
    - `POST_HOOKS.fragment.html`: body要素直下の末尾に挟み込む
    - `SERVICE_WORKER.fragment.html`: service workerを使用する場合に登録などの処理を行うスクリプトを定義する
- [`vender/i18n/`](/vender/i18m/)でアプリ上の文言を定義可能
  - 日本語・英語の文言切り替えに対応
- [`vender/resource/`](/vender/resource/)でその他のリソースを使用可能
  - [`vender/resource/images/`](/vender/resource/images/)
    - オリジナル画像を設置する。[readme](https://github.com/Fumipo-Theta/microscope_simulator/blob/master/vender/resource/images/readme.md)を参照
    - ビルド時に`release/images/`にコピーされる
  - [`vender/resource/root/`](/vender/resource/root/)
    - アプリのエントリポイント(`release/index.html`)と同階層に置くべきファイルを設置する
    - 例えばProgressive Web Application化する際の`manifest.json`など
  - [`vender/resource/sw/`](/vender/resource/sw/)
    - service workerを使用する場合は`vender/resource/sw/service_worker.js`として定義する
