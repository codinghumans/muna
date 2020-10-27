import { Configfile, configfile } from '../lib/configfile';

import { Command } from './command';
import { ConfigurationError } from '../errors/configuration.error';
import { Git } from '../lib/git';
import { Project } from '../lib/project';
import chalk from 'chalk';
import fs from 'fs-extra';
import globby from 'globby';
import { separator } from '../lib/utils/console.utils';

export class DiffCommand implements Command {
	async execute(): Promise<void> {
		if (!Configfile.exists()) {
			throw new ConfigurationError(`${configfile} not found.`);
		}

		const files = await globby(['*/*.!(*enc)']);

		if (Project.didFilesChange(files)) {
			this.diff(files);
		} else {
			console.log('Nothing to diff.');
		}
	}

	private diff(files: string[]): void {
		files.forEach((file) => {
			const snapshot = Project.getSnapshot(file);

			fs.ensureFileSync(snapshot);

			if (Git.didFileChange(snapshot, file)) {
				Git.diff(snapshot, file);
			}
		});
	}
}
