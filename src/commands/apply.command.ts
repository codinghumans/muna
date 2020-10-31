import chalk from 'chalk';
import MasterKey from '../lib/master-key';
import file from '../services/file';
import git from '../services/git';
import keychain from '../services/keychain';
import project from '../services/project';
import ssm from '../services/ssm';
import { separator } from '../utils/console.utils';
import Command from './command';
import { ResetCommand } from './reset.command';

export interface CommitCommandOptions {
	message: string;
}

export class ApplyCommand implements Command {
	async execute(): Promise<void> {
		const decryptedFiles = await project.getDecryptedFilePaths();

		if (decryptedFiles.length == 0) {
			console.log('Nothing to encrypt.');
			return;
		}

		const encryptedFiles = await this.encrypt(decryptedFiles);

		console.log('Staging...');
		this.stage(encryptedFiles);

		console.log('Committing...');
		this.commit(encryptedFiles, 'Updated');

		console.log('Pushing...');
		await this.push();

		await new ResetCommand().execute();

		return;
	}

	private async encrypt(decryptedFiles: string[]): Promise<string[]> {
		const key = MasterKey.generate();

		const encryptedFiles = [] as string[];

		for (let decryptedFile of decryptedFiles) {
			const encryptedFile = await file.encrypt(decryptedFile, key);
			console.log(`Encrypted ${chalk.gray(decryptedFile)} -> ${chalk.green(encryptedFile)}`);
			encryptedFiles.push(encryptedFile);
		}

		await keychain.putMasterKey(key);

		return encryptedFiles;
	}

	private stage(files: string[]): void {
		files.forEach((file) => {
			git.add(file);
		});
	}

	private commit(files: string[], message: string): void {
		git.commit(files, message);
	}

	private async push(): Promise<void> {
		git.push();

		console.log(chalk.yellow(separator('*')));

		await ssm.putMasterKey(
			git.getLastCommitDate(),
			git.getLastCommitHash(),
			(await keychain.getMasterKey()) as MasterKey
		);

		console.log(chalk.yellow(separator('*')));
	}
}
