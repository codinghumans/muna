import globby from 'globby';
import path from 'path';
import kms from '../services/kms';
import project from '../services/project';
import Command from './command';

export interface DecryptCommandOptions {
	path: string;
}

export class DecryptCommand implements Command {
	async execute(options: DecryptCommandOptions): Promise<any> {
		const encryptedFiles = await globby([options.path.split(path.sep).join('/')]);

		for (let encryptedFile of encryptedFiles) {
			const decryptedFile = await kms.decryptFile(encryptedFile, await kms.getKeyId());
			project.createFileSnapshot(decryptedFile);
		}
	}
}
