import chalk from 'chalk';
import { execSync } from 'child_process';

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

	static commit(files: string[], message: string) {
		files.forEach((file) => this.add(file));
		execSync(`git commit -m "${message}"`);

		files.forEach((file) => {
			console.log(`Committed ${chalk.green(file)}`);
		});
	}

	static add(file: string): void {
		execSync(`git add ${file}`);
	}
}
