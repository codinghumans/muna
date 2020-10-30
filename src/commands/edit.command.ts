import chalk from 'chalk';
import path from 'path';
import { KeychainError } from '../errors/keychain.error';
import { MasterKey } from '../lib/master-key';
import { Project } from '../services/project';
import { copyFile, decryptFile } from '../utils/file.utils';
import { Command } from './command';

export class EditCommand implements Command {
	async execute(): Promise<void> {
		const encryptedFiles = await Project.getEncryptedFilePaths();

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
			const decryptedFile = await decryptFile(encryptedFile, key);
			console.log(`Decrypted ${chalk.gray(encryptedFile)} -> ${chalk.green(decryptedFile)}`);

			//path.join(Project.getDecryptedSnapshotFolder(), decryptedFile)
			//touchFile()

			copyFile(decryptedFile, path.join(Project.getDecryptedSnapshotFolderPath(), decryptedFile));

			//fs.ensureDirSync(path.join(Project.getDecryptedSnapshotFolder(), path.dirname(output.path.toString())));
			//fs.copyFileSync(output.path, path.join(Project.getDecryptedSnapshotFolder(), output.path.toString()));

			decryptedFiles.push(decryptedFile);
		}

		return decryptedFiles;
	}
}
