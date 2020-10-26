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

export class CommitCommand implements Command {
	async execute(options: CommitCommandOptions): Promise<void> {
		if (!Configfile.exists()) {
			throw new ConfigurationError(`${configfile} not found.`);
		}

		const files = await globby(['*/*.!(*enc)']);

		this.diff(files);

		if (this.changed(files)) {
			let encryptedFiles = [] as string[];

			if (await prompt('Do you want to encrypt this changes?', 'confirm')) {
				encryptedFiles = await this.encrypt();
			} else {
				cancelPrompt();
			}

			if (await prompt('Do you want to stage this changes?', 'confirm')) {
				this.stage(encryptedFiles);
			} else {
				cancelPrompt();
			}

			if (await prompt('Do you want to commit this changes?', 'confirm')) {
				this.commit(encryptedFiles, options.message);
			} else {
				cancelPrompt();
			}
		} else {
			console.log('Nothing to commit.');
		}
	}

	private diff(files: string[]): void {
		console.log('Generating git diff...');

		console.log(separator());

		files.forEach((file) => {
			const originalFile = Project.getOriginalFile(file);

			fs.ensureFileSync(originalFile);

			console.log(chalk.cyan(`Found changes to "${file}"`));

			Git.diff(originalFile, file);

			console.log(separator());
		});
	}

	private changed(files: string[]): boolean {
		let hasChanges = false;

		files.forEach((file) => {
			const originalFile = Project.getOriginalFile(file);

			fs.ensureFileSync(originalFile);

			hasChanges = hasChanges || Git.hasChanges(originalFile, file);
		});

		return hasChanges;
	}

	private async encrypt(): Promise<string[]> {
		const key = MasterKey.generate();

		const files = await globby(['*/*.!(*enc)']);

		const encryptedFiles = [];

		for (let file of files) {
			encryptedFiles.push(await encrypt(file, key));
		}

		Keychain.putMasterKey(key);

		return encryptedFiles;
	}

	private stage(files: string[]): void {
		files.forEach((file) => {
			Git.add(file);
		});

		console.log('Generating git status...');
		Git.summary();
	}

	private async commit(files: string[], message: string): Promise<void> {
		Git.commit(files, message);

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
