import kms from '../modules/kms';
import project from '../modules/project';
import BaseCommand from './base.command';

export interface ConfigureCommandOptions {
	key: string;
	region: string;
}

export class ConfigureCommand implements BaseCommand {
	async execute(options: ConfigureCommandOptions): Promise<void> {
		project.configure(options.region, options.key);

		if (!(await kms.getKeyId())) {
			await kms.create(project.key);
		}

		project.saveConfiguration();
	}
}
