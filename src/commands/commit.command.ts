import { Command, CommandOptions } from './command';

import chalk from 'chalk';
import { commit } from '../lib/utils/git.utils';
import glob from 'glob';

export interface CommitCommandOptions {
	message: string;
}

export class CommitCommand implements Command {

	execute(options: CommitCommandOptions): void {
		glob('**/*.enc', async (_error, files) => {
			commit(files, options.message);
		});
	}
}
