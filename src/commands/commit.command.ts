import { Command, CommandOptions } from './command';

import { Git } from '../lib/git';
import glob from 'glob';

export interface CommitCommandOptions {
	message: string;
}

export class CommitCommand implements Command {

	execute(options: CommitCommandOptions): void {
		glob('**/*.enc', async (_error, files) => {
			Git.commit(files, options.message);
		});
	}
}
