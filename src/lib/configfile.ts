import chalk from 'chalk';
import fs from 'fs-extra';

export const configfile = 'muna.config.json';

export class Configfile {
	static init(): void {
		if (!Configfile.exists()) {
			fs.writeFileSync(configfile, JSON.stringify({}));
			console.log(`Created ${chalk.green(configfile)}`);
		} else {
			console.log(`Skipped ${chalk.gray(configfile)}`);
		}
	}

	static exists(): boolean {
		return fs.existsSync(configfile);
	}
}
