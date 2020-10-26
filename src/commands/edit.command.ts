import { Configfile, configfile } from '../lib/configfile';

import { Command } from './command';
import { ConfigurationError } from '../errors/configuration.error';
import { KeychainError } from '../errors/keychain.error';
import { Lockfile } from '../lib/lockfile';
import { MasterKey } from '../lib/master-key';
import { decrypt } from '../lib/utils/file.utils';
import globby from 'globby';

export class EditCommand implements Command {
	async execute(): Promise<void> {
		if (!Configfile.exists()) {
			throw new ConfigurationError(`${configfile} not found.`);
		}

		await this.decryptAll();
	}

	private async decryptAll(): Promise<string[]> {
		const key = await MasterKey.fetch();

		if (!key) {
			throw new KeychainError('Master key not found.');
		}

		const files = await globby(['**/*.enc']);

		if (files.length == 0) {
			console.log('No files to decrypt.');
		}

		const decryptedFiles = [];

		for (let file of files) {
			decryptedFiles.push(await decrypt(file, key));
		}

		return decryptedFiles;
	}
}
