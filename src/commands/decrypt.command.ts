import globby from 'globby';
import path from 'path';
import { KMSError } from '../errors/kms.error';
import kms from '../modules/kms';
import project from '../modules/project';
import BaseCommand from './base.command';

export interface DecryptCommandOptions {
	path: string;
}

export class DecryptCommand implements BaseCommand {
	async execute(options: DecryptCommandOptions): Promise<any> {
		const encryptedFiles = await globby([options.path.split(path.sep).join('/')]);

		const keyId = await kms.getKeyId();

		if (!keyId) {
			throw new KMSError('Key not found.');
		}

		for (let encryptedFile of encryptedFiles) {
			const decryptedFile = await kms.decryptFile(encryptedFile, keyId);
			project.createFileSnapshot(decryptedFile);
		}
	}
}
