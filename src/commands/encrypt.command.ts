import { Configfile, configfile } from '../lib/configfile';
import { cancelPrompt, prompt } from '../lib/utils/prompt.utils';

import { Command } from './command';
import { ConfigurationError } from '../errors/configuration.error';
import { Git } from '../lib/git';
import { Keychain } from '../lib/keychain';
import { MasterKey } from '../lib/master-key';
import { Project } from '../lib/project';
import { SSM } from '../lib/ssm';
import chalk from 'chalk';
import { encrypt } from '../lib/utils/file.utils';
import fs from 'fs-extra';
import globby from 'globby';
import { separator } from '../lib/utils/console.utils';

export interface CommitCommandOptions {
	message: string;
}

export class EncryptCommand implements Command {
	async execute(): Promise<void> {
		if (!Configfile.exists()) {
			throw new ConfigurationError(`${configfile} not found.`);
		}

		const decryptedFiles = await globby(['*/*.!(*enc)']);

		if (Project.changed(decryptedFiles)) {
			await this.encrypt(decryptedFiles);
		} else {
			console.log('Nothing to encrypt.');
		}
	}

	private async encrypt(decryptedFiles: string[]): Promise<void> {
		const key = MasterKey.generate();

		for (let decryptedFile of decryptedFiles) {
			const encryptedFile = await encrypt(decryptedFile, key);
			console.log(`Encrypted ${chalk.gray(decryptedFile)} -> ${chalk.green(encryptedFile)}`);
		}

		Keychain.putMasterKey(key);
	}
}
