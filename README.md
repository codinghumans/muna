# Muna

Seamless file encryption with AWS KMS.

# Getting started

## Configuration

The quickest way to get started is to run the `muna configure` command with your AWS region and a key alias:

```
$ npx muna configure eu-west-1 muna/master-key
Creating kms key...
Creating kms alias...
Creating muna.config.json...
```

If there is any existing KMS key associated with the alias, muna will try will use it. Otherwise, muna will simply try to create a new key.

## Encrypting files

```
$ npx muna encrypt **/*.json
```

## Decrypting files

```
$ npx muna decrypt **/*.json
```
