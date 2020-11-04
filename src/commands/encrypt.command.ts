import globby from 'globby';
import path from 'path';
import kms from '../services/kms';
import Command from './command';

export interface EncryptCommandOptions {
	path: string;
}

export class EncryptCommand implements Command {
	async execute(options: EncryptCommandOptions): Promise<any> {
		const decryptedFiles = await globby([options.path.split(path.sep).join('/'), '!**/*.enc']);

		for (let decryptedFile of decryptedFiles) {
			await kms.encryptFile(decryptedFile, await kms.getKeyId());
		}
	}
}
