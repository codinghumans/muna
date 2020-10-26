import { Configfile, configfile } from '../lib/configfile';

import { Command } from './command';
import { ConfigurationError } from '../errors/configuration.error';
import { encryptAll } from '../lib/utils/file.utils';

export class EncryptCommand implements Command {
	async execute(): Promise<void> {
		if (!Configfile.exists()) {
			throw new ConfigurationError(`${configfile} not found.`);
		}

		await encryptAll();
	}
}
