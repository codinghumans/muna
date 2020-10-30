import globby from 'globby';
import path from 'path';
import { touchFile } from '../utils/file.utils';
import { Git } from './git';

export const ConfigFile = 'muna.config.json';
export const GitIgnoreFile = '.gitignore';
export const GitIgnoredFiles = '\n# Added by Muna\n.muna\n*.*\n!*.enc\n!.gitignore\n!muna.config.json';

export class Project {
	static getAbsoluteRootFolderPath(): string {
		return Git.getAbsoluteRootFolderPath();
	}

	static getSecretsFolderPath(): string {
		return path.join('secrets');
	}

	static getExampleSecretsFilePath(): string {
		return path.join(Project.getSecretsFolderPath(), 'example.yml');
	}

	static getDecryptedSnapshotFolderPath(): string {
		return path.join('.muna', 'snapshot');
	}

	static getDecryptedSnapshotFilePath(file: string): string {
		return path.join(Project.getDecryptedSnapshotFolderPath(), file);
	}

	static async getDecryptedFilePaths(): Promise<string[]> {
		return await globby(['secrets/**/*.!(*enc)']);
	}

	static async getEncryptedFilePaths(): Promise<string[]> {
		return await globby(['secrets/**/*.enc']);
	}

	static didFilesChange(files: string[]): boolean {
		let changed = false;

		files.forEach((file) => {
			const decryptedSnapshotFile = Project.getDecryptedSnapshotFilePath(file);

			touchFile(decryptedSnapshotFile);

			changed = changed || Git.didFileChange(decryptedSnapshotFile, file);
		});

		return changed;
	}
}
