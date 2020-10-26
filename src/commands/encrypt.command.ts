import { Configfile, configfile } from '../lib/configfile';
import { encrypt, unlink } from '../lib/utils/file.utils';

import { Command } from './command';
import { ConfigurationError } from '../errors/configuration.error';
import { DecryptCommand } from './decrypt.command';
import { Keychain } from '../lib/keychain';
import { Lockfile } from '../lib/lockfile';
import { MasterKey } from '../lib/master-key';
import fs from 'fs-extra';
import glob from 'glob';
import chalk from 'chalk';

export class EncryptCommand implements Command {
	execute(): void {
		if (!Configfile.exists()) {
			throw new ConfigurationError(`${configfile} not found.`);
		}

		const key = MasterKey.generate();

		glob('*/*.!(*enc)', (_error, files) => {
			console.log('Encrypting files...');

			files.map((file) => {
				return encrypt(file, key);
			});

			Keychain.putMasterKey(key);

			files.forEach(file => {
				fs.unlinkSync(file);
			}
		});
	}
}
