# Muna

Seamless file encryption with AWS KMS.

# Getting started

1. Configure muna with your AWS region and a key alias.

```
npx muna configure eu-west-1 muna/master-key
```

If muna is not able to find any key, it will try to create it.

2. Encrypt one or multiple files:

```
npx muna encrypt **/*.json
```

3. Then decrypt:

```
npx muna decrypt **/*.json
```
