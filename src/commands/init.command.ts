import { Command } from './command';
import { Configfile } from '../lib/configfile';
import { DecryptCommand } from './decrypt.command';
import { Git } from '../lib/git';
import { Gitignore } from '../lib/gitignore';
import { InitializationError } from '../lib/exceptions/initialization-error';

export class InitCommand implements Command {
  execute(): void {
    if (!Git.exists()) {
      throw new InitializationError('Not in a git repository.');
    }

    console.log('Initializing Muna...');

    Configfile.init();
    Gitignore.init();

    new DecryptCommand().execute();
  }
}
