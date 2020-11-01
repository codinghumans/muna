import chalk from 'chalk';
import MasterKey from '../lib/master-key';
import file from '../services/file';
import git from '../services/git';
import keychain from '../services/keychain';
import project from '../services/project';
import ssm from '../services/ssm';
import { separator } from '../utils/console.utils';
import Command from './command';
import { EditCommand } from './edit.command';
import { ResetCommand } from './reset.command';

export interface ApplyCommandOptions {
	reason: string;
}

export class ApplyCommand implements Command {
	async execute(options: ApplyCommandOptions): Promise<void> {
		const decryptedFiles = await project.getDecryptedFilePaths();

		if (decryptedFiles.length == 0) {
			console.log('Nothing to encrypt.');
			return;
		}

		console.log('Ensuring all encrypted files are decrypted before re-encrypting...');
		await new EditCommand().execute();

		const encryptedFiles = await this.encrypt(decryptedFiles);

		console.log('Cleaning up decrypted files...');
		await new ResetCommand().execute();

		console.log('Staging...');
		this.stage(encryptedFiles);

		console.log('Committing...');
		this.commit(encryptedFiles, options.reason);

		console.log('Pushing...');
		await this.push();

		console.log('Pushing to SSM...');
		await this.pushSSM();

		return;
	}

	private async encrypt(decryptedFiles: string[]): Promise<string[]> {
		const key = MasterKey.generate();

		const encryptedFiles = [] as string[];

		console.log('Encrypting...');

		for (let decryptedFile of decryptedFiles) {
			const encryptedFile = await file.encrypt(decryptedFile, key);
			console.log(`Encrypted ${decryptedFile} -> ${chalk.green(encryptedFile)}`);
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
	}

	private async pushSSM() {
		console.log(chalk.yellow(separator('*', 66)));

		await ssm.putMasterKey(
			git.getLastCommitDate(),
			git.getLastCommitHash(),
			(await keychain.getMasterKey()) as MasterKey
		);

		console.log(chalk.yellow(separator('*', 66)));
	}
}
