cd checkov-run
tsc
cd ..
tfx extension create --manifest-globs vss-extension.json
tfx extension publish --manifest-globs vss-extension.json --share-with akram-el-gaouny