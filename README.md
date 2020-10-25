# muna

Seamless encryption of secret files in git. Suports AWS KMS.

key, iv.

-> encrypto the files.

-> git commit hash.

---- pipeline

-> get key & iv from secret manager.

-> clone production repo.

-> decrypto the .

-> run cdk.

-> clone the repo
-> get the hash
-> with the hash, retrieve master from SSM (/secrets/839rfjfw9939393/key)

/secrets/839rfjfw9939393/key
/secrets/839rfjfw9939393/iv



-> /secrets/key
-> /secrets/iv
