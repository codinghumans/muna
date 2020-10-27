import { Configfile, configfile } from '../lib/configfile';

import { Command } from './command';
import { ConfigurationError } from '../errors/configuration.error';
import { KeychainError } from '../errors/keychain.error';
import { MasterKey } from '../lib/master-key';
import chalk from 'chalk';
import { decrypt } from '../lib/utils/file.utils';
import globby from 'globby';

export class EditCommand implements Command {
	async execute(): Promise<void> {
		if (!Configfile.exists()) {
			throw new ConfigurationError(`${configfile} not found.`);
		}

		const encryptedFiles = await globby(['**/*.enc']);

		await this.decrypt(encryptedFiles);
	}

	private async decrypt(encryptedFiles: string[]): Promise<string[]> {
		const key = await MasterKey.fetch();

		if (!key) {
			throw new KeychainError('Master key not found.');
		}

		if (encryptedFiles.length == 0) {
			console.log('No files to decrypt.');
		}

		const decryptedFiles = [] as string[];

		for (let encryptedFile of encryptedFiles) {
			const decryptedFile = await decrypt(encryptedFile, key);
			console.log(`Decrypted ${chalk.gray(encryptedFile)} -> ${chalk.green(decryptedFile)}`);
			decryptedFiles.push(decryptedFile);
		}

		return decryptedFiles;
	}
}
