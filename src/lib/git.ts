import { Console } from 'console';
import { Project } from './project';
import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { separator } from './utils/console.utils';
import { string } from 'yargs';

export class Git {
	static exists(): boolean {
		try {
			execSync(`git status`, { stdio: 'ignore' });
			return true;
		} catch (error) {
			return false;
		}
	}

	static getRootDirectory(): string {
		return execSync(`git rev-parse --show-toplevel`).toString().trim();
	}

	static getLastCommitHash(): string {
		return execSync('git rev-parse --short HEAD').toString().trim();
	}

	static getLastCommitDate(): string {
		return execSync('git log -1 --date=short --pretty=format:%cd').toString().trim();
	}

	static add(file: string): void {
		execSync(`git add "${file}"`);
		console.log(`Staged ${chalk.green(file)}`);
	}

	static commit(files: string[], message: string) {
		execSync(`git commit -m "${message}"`, { stdio: 'inherit' });

		files.forEach((file) => {
			console.log(`Committed ${chalk.green(file)}`);
		});
	}

	static push() {
		execSync(`git push origin`, { stdio: 'inherit' });
	}

	static didFileChange(file1: string, file2: string): boolean {
		return fs.readFileSync(file1).toString() != fs.readFileSync(file2).toString();
	}

	static diff(file1: string, file2: string): void {
		console.log(chalk.cyan(separator()));
		console.log(chalk.cyan(`# ${file2}`));
		try {
			execSync(`git diff --no-index "${file1}" "${file2}"`, { stdio: 'inherit' });
		} catch (error) {
			// Apparently git diff always returns with exit code 1 if there are changes. We can just ignore it.
		}
		console.log(chalk.cyan(separator()));
	}

	static summary() {
		execSync(`git diff --compact-summary master .`, { stdio: 'inherit' });
	}
}
