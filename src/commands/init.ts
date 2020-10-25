import chalk from "chalk";
import fs from 'fs';
import { Command } from "./command";
import { DecryptCommand } from "./decrypt.command";

const gitignore = '.gitignore'

export class EncryptCommand implements Command {

	execute(): void {
		if (!fs.existsSync(gitignore)) {
			fs.writeFileSync(gitignore, '.muna\n*.*\n!.gitignore\n!*.enc');
			console.log(`Created ${chalk.green(gitignore)}`);
		}

		new DecryptCommand().execute();
	}