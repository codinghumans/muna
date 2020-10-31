import chalk from 'chalk';
import path from 'path';
import { KeychainError } from '../errors/keychain.error';
import MasterKey from '../lib/master-key';
import file from '../services/file';
import folder from '../services/folder';
import project from '../services/project';
import Command from './command';

export class EditCommand implements Command {
	async execute(): Promise<void> {
		const encryptedFiles = await project.getEncryptedFilePaths();

		if (encryptedFiles.length == 0) {
			console.log('Nothing to decrypt.');
			return;
		}

		await this.decrypt(encryptedFiles);
		return;
	}

	private async decrypt(encryptedFiles: string[]): Promise<string[]> {
		const key = await MasterKey.fetch();

		if (!key) {
			throw new KeychainError('Master key not found.');
		}

		const decryptedFiles = [] as string[];

		for (let encryptedFile of encryptedFiles) {
			const decryptedFile = await file.decrypt(encryptedFile, key);
			console.log(`Decrypted ${chalk.gray(encryptedFile)} -> ${chalk.green(decryptedFile)}`);

			this.takeDecryptedFileSnapshot(decryptedFile);

			decryptedFiles.push(decryptedFile);
		}

		return decryptedFiles;
	}

	private takeDecryptedFileSnapshot(decryptedFile: string) {
		folder.touch(project.getDecryptedSnapshotFolderPath());
		file.copy(decryptedFile, path.join(project.getDecryptedSnapshotFolderPath(), decryptedFile));
	}
}
