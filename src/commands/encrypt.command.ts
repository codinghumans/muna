import { Configfile, configfile } from '../lib/configfile';
import { decrypt, encrypt, encryptAll } from '../lib/utils/file.utils';

import { Command } from './command';
import { ConfigurationError } from '../errors/configuration.error';
import { Keychain } from '../lib/keychain';
import { MasterKey } from '../lib/master-key';
import fs from 'fs-extra';
import glob from 'glob';
import globby from 'globby';

export class EncryptCommand implements Command {
	async execute(): Promise<void> {
		if (!Configfile.exists()) {
			throw new ConfigurationError(`${configfile} not found.`);
		}

		await encryptAll();
	}
}
