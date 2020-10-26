import { Configfile, configfile } from '../lib/configfile';

import { Command } from './command';
import { ConfigurationError } from '../errors/configuration.error';
import { Git } from '../lib/git';
import { Keychain } from '../lib/keychain';
import { KeychainError } from '../errors/keychain.error';
import { Lockfile } from '../lib/lockfile';
import { MasterKey } from '../lib/master-key';
import { SSM } from '../lib/ssm';
import { decrypt } from '../lib/utils/file.utils';
import { glob } from 'glob';

export class DecryptCommand implements Command {
	async execute(): Promise<void> {
		if (!Configfile.exists()) {
			throw new ConfigurationError(`${configfile} not found.`);
		}

		const key = await MasterKey.fetch();

		if (!key) {
			throw new KeychainError('Master key not found.');
		}

		glob('**/*.enc', (_error, files) => {
			console.log('Decrypting files...');

			files.map((file) => {
				decrypt(file, key);
			});
		});
	}
}
