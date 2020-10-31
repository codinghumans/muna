import file from '../services/file';
import folder from '../services/folder';
import project from '../services/project';
import Command from './command';

export class ResetCommand implements Command {
	async execute(): Promise<void> {
		console.log('Resetting...');

		folder.delete(project.getDecryptedSnapshotFolderPath());

		(await project.getDecryptedFilePaths()).forEach((decriptedFile) => {
			file.delete(decriptedFile);
		});
	}
}
