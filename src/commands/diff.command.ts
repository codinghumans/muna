import globby from 'globby';
import path from 'path';
import project from '../modules/project';
import BaseCommand from './base.command';

export interface DiffCommandOptions {
    path: string;
}

export class DiffCommand implements BaseCommand {
    async execute(options: DiffCommandOptions): Promise<void> {
        const decryptedFiles = await globby([options.path.split(path.sep).join('/'), '!**/*.enc']);

        const changes = project.diff(decryptedFiles);

        if (!changes) {
            console.log('Nothing to diff.');
        }
    }
}
