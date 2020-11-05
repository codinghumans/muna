# Muna

Seamless file encryption with AWS KMS.

# Getting started

## Installation

```
$ npm install -g @codinghumans/muna
```

## Configuration

The quickest way to get started is to run the `muna configure` command with your AWS region and a key alias:

```
$ muna configure eu-west-1 muna/master-key
Creating kms key...
Creating kms alias...
Creating muna.config.json...
```

If there is any existing KMS key associated with the alias, muna will try will use it. Otherwise, muna will simply try to create a new key.

# Usage

## Encrypting one or multiple files

```
$ muna encrypt **/*.json
```

## Decrypting one or multiple files

```
$ muna decrypt **/*.json
```

## Comparing a file with it's encrypted counterpart.

```
$ muna diff **/*.json
```
