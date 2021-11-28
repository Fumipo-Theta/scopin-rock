# Setup Circle CI

## Environmental variables

- `AWS_ACCESS_KEY_ID`: CircleCIがAWSリソースにアクセスする際のアクセスキーID
- `AWS_SECRET_ACCESS_KEY`: CircleCIがAWSリソースにアクセスする際のアクセスキー
- `AWS_DEFAULT_REGION`: AWSリソースを作成したリージョン
- `CF_DIST_ID_DEV`: dev環境のreleaseを配信するCloudFrontディストリビューション
  - デプロイ時のinvalidationのために必要
- `CF_DIST_ID_PROD`: prod環境のreleaseを配信するCloudFrontディストリビューション
  - デプロイ時のinvalidationのために必要
- `CONFIG_JSON_DEV`
- `CONFIG_JSON_PROD`
