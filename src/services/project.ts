import globby from 'globby';
import path from 'path';
import file from './file';
import Git from './git';

export const ConfigFile = 'muna.config.json';
export const GitIgnoreFile = '.gitignore';
export const GitIgnoredFiles = '\n# Added by Muna\n.muna\n*.*\n!*.enc\n!.gitignore\n!muna.config.json';

class Project {
	getAbsoluteRootFolderPath(): string {
		return Git.getAbsoluteRootFolderPath();
	}

	getSecretsFolderPath(): string {
		return path.join('secrets');
	}

	getExampleSecretsFilePath(): string {
		return path.join(this.getSecretsFolderPath(), 'example.yml');
	}

	getDecryptedSnapshotFolderPath(): string {
		return path.join('.muna', 'snapshot');
	}

	getDecryptedSnapshotFilePath(file: string): string {
		return path.join(this.getDecryptedSnapshotFolderPath(), file);
	}

	async getDecryptedFilePaths(): Promise<string[]> {
		return await globby(['secrets/**/*.!(*enc)']);
	}

	async getEncryptedFilePaths(): Promise<string[]> {
		return await globby(['secrets/**/*.enc']);
	}

	didFilesChange(decryptedFiles: string[]): boolean {
		let changed = false;

		decryptedFiles.forEach((decryptedFile) => {
			const decryptedSnapshotFile = this.getDecryptedSnapshotFilePath(decryptedFile);

			file.touch(decryptedSnapshotFile);

			changed = changed || Git.didFileChange(decryptedSnapshotFile, decryptedFile);
		});

		return changed;
	}
}

export default new Project();
