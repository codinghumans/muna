import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs';
import { separator } from '../utils/console.utils';

class Git {
	exists(): boolean {
		try {
			execSync(`git status`, { stdio: 'ignore' });
			return true;
		} catch (error) {
			return false;
		}
	}

	getAbsoluteRootFolderPath(): string {
		return execSync(`git rev-parse --show-toplevel`).toString().trim();
	}

	getLastCommitHash(): string {
		return execSync('git rev-parse --short HEAD').toString().trim();
	}

	getLastCommitDate(): string {
		return execSync('git log -1 --date=short --pretty=format:%cd').toString().trim();
	}

	add(file: string): void {
		execSync(`git add "${file}"`);
		console.log(`Staged ${chalk.green(file)}`);
	}

	commit(files: string[], message: string) {
		execSync(`git commit -m "${message}"`, { stdio: 'inherit' });

		files.forEach((file) => {
			console.log(`Committed ${chalk.green(file)}`);
		});
	}

	push() {
		execSync(`git push origin`, { stdio: 'inherit' });
	}

	didFileChange(file1: string, file2: string): boolean {
		return fs.readFileSync(file1).toString() != fs.readFileSync(file2).toString();
	}

	diff(file1: string, file2: string): void {
		console.log(chalk.cyan(separator()));
		console.log(chalk.cyan(`# ${file2}`));
		try {
			execSync(`git diff --no-index "${file1}" "${file2}"`, { stdio: 'inherit' });
		} catch (error) {
			// Apparently git diff always returns with exit code 1 if there are changes. We can just ignore it.
		}
		console.log(chalk.cyan(separator()));
	}
}

export default new Git();
