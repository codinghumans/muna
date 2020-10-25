import { configfile, gitignore } from "../lib/constants";

import { Command } from "./command";
import { Configfile } from "../lib/configfile";
import { ConfigurationError } from "../lib/exceptions/configuration-error";
import { DecryptCommand } from "./decrypt.command";
import { Git } from "../lib/git";
import { InitializationError } from "../lib/exceptions/initialization-error";
import chalk from "chalk";
import fs from 'fs';

export class InitCommand implements Command {

	execute(): void {
		if(!Git.exists()) {
			throw new InitializationError("Not in a git repository.")
		}

		if (!fs.existsSync(gitignore)) {
			fs.writeFileSync(gitignore, '.muna\n*.*\n!.gitignore\n!*.enc');
			console.log(`Created ${chalk.green(gitignore)}`);
		}

		if (!fs.existsSync(configfile)) {
			fs.writeFileSync(configfile, '{}');
			console.log(`Created ${chalk.green(configfile)}`);
		}

		new DecryptCommand().execute();
	}
}