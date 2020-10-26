import { Console } from 'console';
import { Project } from './project';
import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
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

	static summary() {
		execSync(`git diff --compact-summary master .`, { stdio: 'inherit' });
	}

	static add(file: string): void {
		execSync(`git add "${file}"`);
		console.log(`Staged ${chalk.green(file)}`);
	}

	static commit(files: string[], message: string) {
		console.log('Commiting changes...');

		files.forEach((file) => {
			console.log(`Committed ${chalk.green(file)}`);
		});

		execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
	}

	static push() {
		console.log('Pushing changes to origin...');
		execSync(`git push origin`, { stdio: 'inherit' });
	}

	static diff(file1: string, file2: string): void {
		try {
			execSync(`git diff --no-index "${file1}" "${file2}"`, { stdio: 'inherit' });
		} catch (error) {
			// Apparently git diff always returns with exit code 1 if there are changes. We can just ignore it.
		}
	}

	static hasChanges(file1: string, file2: string): boolean {
		try {
			execSync(`git diff --no-index "${file1}" "${file2}"`, { stdio: 'ignore' });
			return false;
		} catch (error) {
			return true;
		}
	}

	static status(): void {
		execSync(`git status`, { stdio: 'inherit' });
	}
}
