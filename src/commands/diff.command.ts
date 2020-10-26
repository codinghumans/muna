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

		this.diff(await globby(['*/*.!(*enc)']));
	}

	private diff(files: string[]): void {
		files.forEach((file) => {
			const originalFile = Project.getOriginalFile(file);

			fs.ensureFileSync(originalFile);

			console.log(chalk.cyan(`# ${file}`));

			Git.diff(originalFile, file);

			console.log(separator());
		});
	}
}
