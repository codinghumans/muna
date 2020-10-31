import { ConfigurationError } from '../errors/configuration.error';
import file from '../services/file';
import git from '../services/git';
import project, { ConfigFile } from '../services/project';
import Command from './command';

export class DiffCommand implements Command {
	async execute(): Promise<void> {
		if (!file.exists(ConfigFile)) {
			throw new ConfigurationError(`${ConfigFile} not found.`);
		}

		const decryptedFiles = await project.getDecryptedFilePaths();

		if (project.didFilesChange(decryptedFiles)) {
			this.diff(decryptedFiles);
		} else {
			console.log('Nothing to diff.');
		}
	}

	private diff(decryptedFiles: string[]): void {
		decryptedFiles.forEach((decryptedFile) => {
			const decriptedSnapshotFile = project.getDecryptedSnapshotFilePath(decryptedFile);

			file.touch(decriptedSnapshotFile);

			if (git.didFileChange(decriptedSnapshotFile, decryptedFile)) {
				git.diff(decriptedSnapshotFile, decryptedFile);
			}
		});
	}
}
