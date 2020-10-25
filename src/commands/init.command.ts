import { Command } from "./command";
import { DecryptCommand } from "./decrypt.command";
import chalk from "chalk";
import fs from 'fs';

const gitignore = '.gitignore'

export class InitCommand implements Command {

	execute(): void {
		if (!fs.existsSync(gitignore)) {
			fs.writeFileSync(gitignore, '.muna\n*.*\n!.gitignore\n!*.enc');
			console.log(`Created ${chalk.green(gitignore)}`);
		}

		new DecryptCommand().execute();
	}
}