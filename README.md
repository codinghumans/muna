# Muna

Seamless file encryption with AWS KMS.

# Getting started

1. Configure muna with your AWS region and a key alias.

```
$ npx muna configure eu-west-1 muna/master-key
Creating kms key...
Creating kms alias...
Creating muna.config.json...
```

If there is an existing KMS key associated with the alias, muna will try will use it. Otherwise, it will try to create a new one.

2. Encrypt one or multiple files:

```
$ npx muna encrypt **/*.json
```

3. Then decrypt:

```
$ npx muna decrypt **/*.json
```
