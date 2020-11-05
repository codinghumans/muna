
# Muna

Seamless file encryption with AWS KMS.

## Getting Started

### Installation

```
$ npm install -g @codinghumans/muna
```

### Configuration

Muna relies on AWS KMS to encrypt and decrypt files. You'll need to supply your AWS credentials through any of the [configuration methods](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html) supported by the AWS Node.js SDK.

One simple way to do it is adding them to the `~/.aws/credentials` file:

```
$ cat ~/.aws/credentials
[default]
aws_access_key_id = AKI.....
aws_secret_access_key = mw......
```

Then simply run the `muna configure` command to set your AWS region and the key alias to use:

```
$ muna configure eu-west-1 muna/master-key
Creating kms key...
Creating kms alias...
Creating muna.config.json...
```
If the alias is already associated with a key, Muna will use the existing key instead of trying to create a new one.

## Usage

Encrypt one or multiple files by either supplying a path or a glob:

```
$ muna encrypt **/*.json
```

Then decrypt them:

```
$ muna decrypt **/*.json
```

## License

Distributed under the MIT License. See `LICENSE` for more information.







