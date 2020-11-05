
# Muna

Seamless file encryption with AWS KMS.

## Getting Started

### Prerequisites

Muna relies on AWS KMS to store the cryptographic key that protects your files. Before you can begin encrypting, you will need to set your AWS credentials using one of the multiple ways supported by the AWS Node.js SDK.

One simple way to do it is adding them to the `~/.aws/credentials` file:

```
$ cat ~/.aws/credentials
[default]
aws_access_key_id = AKI.....
aws_secret_access_key = mw......
```

You can read more about how to set your AWS credentials for the AWS Node.js SDK [here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html).

### Installation

```
$ npm install -g @codinghumans/muna
```

### Configuration

Run the `muna configure` command to set your AWS region and the key alias to use:

```
$ muna configure eu-west-1 muna/master-key
Creating kms key...
Creating kms alias...
Creating muna.config.json...
```
If the alias is already associated with a key, Muna will use the existing key. Otherwise, it will create a new key and then will associate the alias to it.

## Usage

Encrypt one or multiple files by either supplying either path or a glob pattern:

```
$ muna encrypt **/*.json
```

Then decrypt them:

```
$ muna decrypt **/*.json
```

## License

Distributed under the MIT License. See `LICENSE` for more information.







