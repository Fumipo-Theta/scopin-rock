# 薄片写真データの準備方法

## パッケージを格納するディレクトリ構造

下記のようなディレクトリ構造とすること。

```raw
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

### `packages`サブディレクトリ

[後述の薄片画像パッケージ](#薄片画像パッケージについて)を格納する。

### `sample_list`

アプリのサンプルリストに表示するパッケージ一覧を定義したJSONファイルを配置する。
サンプルリストはクエリパラメータ`?sample_list=sample_list_definition_file_name`のように指定して使用できる。
クエリパラメータを指定しない場合, `default.json`が使用される。

### `category`サブディレクトリ

[後述のカテゴリ情報](#カテゴリ情報に関して)を定義したJSONファイルを格納する。
サンプルリストはクエリパラメータ`?category=category_definition_file_name`のように指定して使用できる。
クエリパラメータを指定しない場合, `default.json`が使用される。

## 薄片画像パッケージについて

- 静的配信の場合、薄片画像パッケージは下のようなディレクトリ構造をもつ。
  - `manifest.json`、`o1.jpg`、`c1.jpg`、`jpg.zip`は必須である。
- 薄片画像はオープンニコル下の写真 (ファイル名`o1`～連番) とクロスニコル下の写真 (ファイル名 `c1`～連番) をzip形式でまとめる必要がある
- zipファイルの名前は`${画像フォーマット名}.zip`とする
  - 使用できるフォーマットは次の3種
    - `jpg`
    - `webp`
    - `jp2`
- なお, パッケージを読み込む際のアプリの動作は次の流れ
  1. `manifest.json`と`o1.jpg`, `c1.jpg`をダウンロード
  1. `o1.jpg`, `c1.jpg`をビューワーに表示
  1. バックグラウンドで`${image format}.zip`をダウンロード
      - ブラウザが対応しているフォーマットのうち, `manifest.json`の`"image_formats"`フィールドの最も先頭に近いもの
  1. ダウンロードが完了したらビューワーに表示

```raw
${sample_package_id}/
    |- manifest.json  # メタデータ
    |- o1.jpg         # サムネイル(オープン用)
    |- c1.jpg         # サムネイル(クロス用)
    |
    |- jpg.zip/
    |   |- o1.jpg
    |   |- o2.jpg
    |   |- o19.jpg
    |   |- c1.jpg
    |   |- c2.jpg
    |   |- c19.jpg
    |
    |- webp.zip/
    |   |- o1.webp
    |   |- o19.webp
    |   |- c1.webp
    |   |- c19.webp
    |
    |- jp2.zip/
    |   |- o1.jp2
    |   |- o19.jp2
    |   |- c1.jp2
    |   |- c19.jp2
    |
    |- layers.json
```

## 薄片写真の撮影

### 前提

- 撮影時の視野の回転中心は、光軸と一致する必要はないが固定されている必要がある
- 連続する画像間の回転角は一定である
- オープンニコル、クロスニコルそれぞれ画像枚数は(360の約数)+1である
  - パッケージ作成ツールの都合による。例えば回転角0°～180°まで10°刻みで撮影したとき、原理的には0°～170°までの18枚だけでいいが、現状180°の写真も必要。

### 撮影方法

- 薄片写真としては180°分の画像があれば十分で、多色性がなければ90°分でも十分である
  - 多色性の様子は2回対称、消光の様子は4回対称であるため
- 画像枚数はパッケージのデータサイズ、ネットワーク負荷、アプリ操作時の応答速度とのトレードオフなのでユースケースに合わせて決定する

- 画像サイズやアスペクト比に制約はない
- スケール情報を入れたい場合、画像のピクセルあたりの長さが分かるようにしておく
  - 例えば、薄片画像と同じ倍率でスケールを撮影するなどしておく

## メタデータの作成とパッケージ化

- パッケージのメタデータはJSON形式で、[このような](https://github.com/Fumipo-Theta/microscope_simulator/blob/master/docs/manifest.json)構造を持つ
- 薄片画像データパッケージ作成ツール [薄片画像データパッケージ作成ツール](https://microscope.fumipo-theta.com/make_package.html) を使用する
  - このツールはパッケージのメタデータ作成と、薄片写真の回転中心の調整を担う
  - なおメタデータの更新を行う場合、現状ではこのツールで新規にパッケージ作成して古いパッケージと置き換えるか、メタデータを直接編集する必要がある

TODO: 更新を楽にするため、既存のパッケージを読み込めるようにする。

### 前提

- マウス/トラックパッドなど、左クリック・右クリックが可能な入力機器の使用
  - 回転中心合わせのため、右クリックに相当する操作ができる必要
  - コンテキストメニューを呼び出せれば良い
- webp形式の薄片画像を作成する場合、Google Chromeなどwebp形式のイメージフォーマットをサポートしたwebブラウザの使用
  - 画質に対する圧縮効率が高いので、積極的にwebp形式を使いたい
  - Safariはバージョン14以降でサポート予定

### 必須項目の入力

- Package ID
  - 重複すると `rock_list.json` のパースに失敗する
- Each rotation degrees
  - 連続する画像間の回転角 [°]
- 回転方向
  - 連続する画像間の回転方向
- 薄片画像1枚あたりのデータサイズ
  - 必ずしも希望する値になるわけではない
- サムネイル画像1枚あたりのデータサイズ
  - サムネイルはjpeg形式、データサイズが小さすぎると極端に画質が低下する

### 画像選択

- 必須項目を入力すると、薄片画像を選択できるようになる
  - オープンニコル、クロスニコルそれぞれ別セットとして画像を選択する
  - このときパッケージ内の画像は選択順に格納されるので、視野を連続的に回転させながら撮影した場合は最初に撮影したものから順に選択するよう注意する。
- ファイル名はパッケージングされるとき自動的に変更される
- 画像を選択した段階で、ページ下部にプレビュー画面が表示される

### サンプル情報を入力

#### サンプルの説明

以下は日本語と英語に対応。
ビューワーで表示言語を切り替えると各言語での記述が反映される。

- サンプルタイトル (list-name)
  - サンプル選択リストの表示名として使用
- サンプル採取地 (location)
  - サンプル説明で表示
- サンプル所有者 (owner)
  - サンプル説明で表示
- 岩石名・鉱物名 (rock_type)
  - 現状サンプル説明で表示するのみだが、サンプルの絞り込みに使用する可能性があるため統一的なルールを用意しておくことが望ましい
- サンプルの説明 (description)
  - サンプル説明の本文

#### スケール情報

ビューワーの薄片写真下部に表示されるスケールの設定。

- スケールの初期ラベル (scale-unit)
  - サンプル画像の初期表示に使われる
  - 数値+単位で入力する
    - アプリでは入力文字列が数値とそれ以外の文字列に分割されて解釈される
- スケールの初期ラベルの長さに対応するピクセル数 (scale-length)

#### その他の項目

主に管理用で、アプリ内では未使用。

- 視野倍率 (magnify)
- サンプルラベル (sample_label)
- 採取地座標 (geographic-coordinate)
  - パッケージ作成ツールからの入力未対応

### 回転中心の調整

[#画像選択](#画像選択) で選択した画像のプレビューを元に、ビューワーと画像の回転中心を一致させる。

調整方法

1. 画像上の回転中心の座標を入力する
   - Rotation center from left (px)
   - Rotation center from top (px)
2. 画像上で右クリックすると、その座標に画像の回転中心が移動する

コツ

- 隣り合う2枚の画像が半透明で評されるようにし重なり合うように調節
- 1の方法で座標を1ずつ変化させるほうが調整しやすいかもしれない

### パッケージの作成

`Create package` ボタンを押すと、画像と `manifest.json` からなるzipファイルが生成される。

静的配信の場合、薄片画像用のディレクトリにzipファイルを展開して配置すればいい。

また、静的配信で使用する`sample_list/*.json` の `"list_of_sample"` フィールドに追加するjson文字列も生成される。

### カテゴリ情報に関して

カテゴリでサンプルを絞り込めるようにする場合、`rock_list.json` に登録するJSONに、手動でカテゴリ情報を書き込む必要がある。
カテゴリは、パッケージディレクトリのcategory JSONの定義内容(例えば[category/default.json](../example_image_package_root/category/default.json))と整合的である必要がある。

上の例では、以下のような階層構造でカテゴリを定義している。

```
|-rock
|  |-igneous_rock
|  |  |-volcanic_rock
|  |  |-plutonic_rock
|  |-metamorphic_rock
|  |  |-regional_metamorphic_rock
|  |  |-contact_metamorphic_rock
|  |-sedimentary_rock
|     |-clastic_rock
|     |-biochemical_rocks
|     |-chemical_rocks
|
|-sediment
   |-clastic_sediment
      |-gravel
      |-sand
      |-mud
      |-bioclastic_sediment
      |-sediment_others
```

- `rock_list.json`に登録する際, `volcanic_rock`であるサンプルのカテゴリリストは、category JSONに定義された`volcanic_rock`を表す階層構造のリストのスーパーセットでなければならない。
- category JSONに定義された`volcanic_rock`の階層構造は `['rock', 'igneous_rock', 'volcanic_rock']`に相当する
  - サンプルのカテゴリがそのスーパーセットであるとは以下のように定義されているということ
    - `['rock', 'igneous_rock', 'volcanic_rock']`
    - `['rock', 'igneous_rock', 'volcanic_rock', 'rhyolite']`
    - `['rock', 'igneous_rock', 'volcanic_rock', 'lava', 'rhyolite']`

- 次のようにカテゴリ定義されたサンプルは`volcanic_rock`と認識されない
  - `['rock', 'volcanic_rock', 'lava', 'rhyolite']`

### 画像データの変換

必要であれば、画像変換ツール([python script (準備中)](../script/tools/make_package.md))を使用し、画像フォーマットを変換したり、ファイルサイズを縮小したりする。

### サンプル画像上にレイヤー表示する追加情報

`layers.json`として定義する。詳細は[このドキュメント](/docs/design/spec_for_layer_on_the_viewer.md)を参照。
