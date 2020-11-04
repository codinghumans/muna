import kms from '../services/kms';
import project from '../services/project';
import Command from './command';

export interface ConfigureCommandOptions {
	key: string;
	region: string;
}

export class ConfigureCommand implements Command {
	async execute(options: ConfigureCommandOptions): Promise<void> {
		await kms.create(options.key, options.region);
		project.saveConfiguration();
	}
}
