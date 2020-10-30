import { ConfigurationError } from '../errors/configuration.error';
import { Git } from '../services/git';
import { ConfigFile, Project } from '../services/project';
import { existsFile, touchFile } from '../utils/file.utils';
import { Command } from './command';

export class DiffCommand implements Command {
	async execute(): Promise<void> {
		if (!existsFile(ConfigFile)) {
			throw new ConfigurationError(`${ConfigFile} not found.`);
		}

		const files = await Project.getDecryptedFilePaths();

		if (Project.didFilesChange(files)) {
			this.diff(files);
		} else {
			console.log('Nothing to diff.');
		}
	}

	private diff(files: string[]): void {
		files.forEach((file) => {
			const decriptedSnapshotFile = Project.getDecryptedSnapshotFilePath(file);

			touchFile(decriptedSnapshotFile);

			if (Git.didFileChange(decriptedSnapshotFile, file)) {
				Git.diff(decriptedSnapshotFile, file);
			}
		});
	}
}
