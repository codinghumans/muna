import { Command } from './command';
import { Git } from '../lib/git';
import { Keychain } from '../lib/keychain';
import { KeychainError } from '../errors/keychain.error';
import { SSM } from '../lib/ssm';
import glob from 'glob';

export interface CommitCommandOptions {
	message: string;
}

export class CommitCommand implements Command {
	async execute(options: CommitCommandOptions): Promise<void> {
		const key = await Keychain.getMasterKey();

		if (!key) {
			throw new KeychainError("Master key not found. Please run 'muna encrypt --force' and try again.");
		}

		glob('**/*.enc', (_error, files) => {
			Git.commit(files, options.message);
			SSM.putMasterKey(Git.getLastCommitDate(), Git.getLastCommitHash(), key);
		});
	}
}
