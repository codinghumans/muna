import chalk from 'chalk';
import { MasterKey } from '../lib/master-key';
import { Git } from '../services/git';
import { Keychain } from '../services/keychain';
import { Project } from '../services/project';
import { SSM } from '../services/ssm';
import { separator } from '../utils/console.utils';
import { encryptFile } from '../utils/file.utils';
import { Command } from './command';

export interface CommitCommandOptions {
	message: string;
}

export class ApplyCommand implements Command {
	async execute(): Promise<void> {
		const decryptedFiles = await Project.getDecryptedFilePaths();

		if (decryptedFiles.length == 0) {
			console.log("Nothing to encrypt. If you have encrypted files, please run 'muna edit' first.");
			return;
		}

		const encryptedFiles = await this.encrypt(decryptedFiles);

		console.log('Staging...');
		this.stage(encryptedFiles);

		console.log('Committing...');
		this.commit(encryptedFiles, 'Updated');

		console.log('Pushing...');
		this.push();

		//remove(await Project.getIncludedFiles());
		//remove([Project.getSnapshotDirectory()]);

		return;
	}

	private async encrypt(decryptedFiles: string[]): Promise<string[]> {
		const key = MasterKey.generate();

		const encryptedFiles = [] as string[];

		for (let decryptedFile of decryptedFiles) {
			const encryptedFile = await encryptFile(decryptedFile, key);
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
