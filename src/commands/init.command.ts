import { Command } from './command';
import { Configfile } from '../lib/configfile';
import { EditCommand } from './edit.command';
import { Git } from '../lib/git';
import { Gitignore } from '../lib/gitignore';
import { InitializationError } from '../errors/initialization.error';

export class InitCommand implements Command {
	execute(): void {
		console.log('Initializing Muna...');

		if (!Git.exists()) {
			throw new InitializationError('Not in a git repository.');
		}

		Configfile.init();
		Gitignore.init();
	}
}
