import { Configfile, configfile } from '../lib/configfile';
import { encrypt, unlink } from '../lib/utils/file.utils';

import { Command } from './command';
import { ConfigurationError } from '../errors/configuration.error';
import { Git } from '../lib/git';
import { Keychain } from '../lib/keychain';
import { MasterKey } from '../lib/master-key';
import { Project } from '../lib/project';
import { SSM } from '../lib/ssm';
import chalk from 'chalk';
import fs from 'fs-extra';
import globby from 'globby';
import { separator } from '../lib/utils/console.utils';

export interface CommitCommandOptions {
	message: string;
}

export class ApplyCommand implements Command {
	async execute(): Promise<void> {
		if (!Configfile.exists()) {
			throw new ConfigurationError(`${configfile} not found.`);
		}

		const decryptedFiles = await globby(['*/*.!(*enc)']);

		const encryptedFiles = await this.encrypt(decryptedFiles);

		console.log('Staging...');
		this.stage(encryptedFiles);

		console.log('Committing...');
		this.commit(encryptedFiles, 'Updated');

		console.log('Pushing...');
		this.push();

		unlink([Project.getSnapshotDirectory()]);
		unlink(await globby(['*/*.!(*enc)']));
	}

	private async encrypt(decryptedFiles: string[]): Promise<string[]> {
		const key = MasterKey.generate();

		const encryptedFiles = [] as string[];

		for (let decryptedFile of decryptedFiles) {
			const encryptedFile = await encrypt(decryptedFile, key);
			console.log(`Encrypted ${chalk.gray(decryptedFile)} -> ${chalk.green(encryptedFile)}`);
			encryptedFiles.push(encryptedFile);
		}

		Keychain.putMasterKey(key);

		return encryptedFiles;
	}

	private stage(files: string[]): void {
		files.forEach((file) => {
			Git.add(file);
		});
	}

	private async commit(files: string[], message: string): Promise<void> {
		Git.commit(files, message);
	}

	private async push(): Promise<void> {
		Git.push();

		console.log(chalk.yellow(separator('*')));

		SSM.putMasterKey(
			Git.getLastCommitDate(),
			Git.getLastCommitHash(),
			(await Keychain.getMasterKey()) as MasterKey
		);

		console.log(chalk.yellow(separator('*')));
	}
}
