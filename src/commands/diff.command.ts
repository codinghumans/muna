import globby from 'globby';
import path from 'path';
import project from '../services/project';
import Command from './command';

export interface DiffCommandOptions {
	path: string;
}

export class DiffCommand implements Command {
	async execute(options: DiffCommandOptions): Promise<void> {
		const decryptedFiles = await globby([options.path.split(path.sep).join('/'), '!**/*.enc']);

		const changes = project.diff(decryptedFiles);

		if (!changes) {
			console.log('Nothing to diff.');
		}
	}
}
