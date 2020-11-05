import aws from 'aws-sdk';
import chalk from 'chalk';
import { KMSError } from '../errors/kms.error';
import fs from './fs';
import project from './project';

class KMS {
	#kms?: aws.KMS;

	private get kms(): aws.KMS {
		if (!this.#kms) {
			this.#kms = new aws.KMS({
				region: project.region,
			});
		}

		return this.#kms;
	}

	async getKeyId(): Promise<string | null> {
		let keyId = null;

		try {
			keyId = (await this.kms.describeKey({ KeyId: `alias/${project.key}` }).promise()).KeyMetadata!.KeyId;
		} catch (error) {}

		try {
			keyId = (await this.kms.describeKey({ KeyId: project.key }).promise()).KeyMetadata!.KeyId;
		} catch (error) {}

		return keyId;
	}

	async create(key: string): Promise<void> {
		let keyId = null;

		try {
			keyId = (await this.kms.describeKey({ KeyId: `alias/${key}` }).promise()).KeyMetadata!.KeyId;
		} catch (error) {}

		if (keyId) {
			throw new KMSError('Key already exists.');
		}

		console.log(`Creating kms key...`);

		keyId = (
			await this.kms
				.createKey({
					KeyUsage: 'ENCRYPT_DECRYPT',
				})
				.promise()
		).KeyMetadata!.KeyId;

		console.log(`Creating kms alias...`);

		await this.kms
			.createAlias({
				AliasName: `alias/${key}`,
				TargetKeyId: keyId,
			})
			.promise();
	}

	async decryptFile(path: string, keyId: string): Promise<string> {
		let outputPath = path.replace('.enc', '');

		fs.write(outputPath, await this.decrypt(fs.read(path).toString(), keyId));

		console.log(`Decrypted ${path} -> ${chalk.green(outputPath)}`);

		return outputPath;
	}

	async encryptFile(path: string, keyId: string): Promise<string> {
		let outputPath = `${path}.enc`;

		fs.write(outputPath, await this.encrypt(fs.read(path).toString(), keyId));

		console.log(`Encrypted ${path} -> ${chalk.green(outputPath)}`);

		return outputPath;
	}

	async decrypt(encryptedText: string, keyId: string): Promise<string | void> {
		const params = { CiphertextBlob: Buffer.from(encryptedText, 'base64'), KeyId: keyId };
		return (await this.kms.decrypt(params).promise()).Plaintext!.toString('utf-8');
	}

	async encrypt(decryptedText: string, keyId: string): Promise<string> {
		const params = { Plaintext: decryptedText, KeyId: keyId };
		return (await this.kms.encrypt(params).promise()).CiphertextBlob!.toString('base64');
	}
}

export default new KMS();
