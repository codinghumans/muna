import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import folder from './folder';

class Fs {
	read(file: string): Buffer {
		return fs.readFileSync(file);
	}

	readJSON(file: string): any {
		return JSON.parse(this.read(file).toString());
	}

	copy(source: string, destination: string): void {
		folder.touch(path.dirname(destination));
		fs.copyFileSync(source, destination);
	}

	write(file: string, data: any): void {
		folder.touch(path.dirname(file));
		fs.writeFileSync(file, data);
	}

	writeJSON(file: string, data: any): void {
		folder.touch(path.dirname(file));
		fs.writeFileSync(file, JSON.stringify(data, null, 2));
	}

	exists(file: string): boolean {
		return fs.existsSync(file);
	}

	touch(file: string): void {
		fs.ensureFileSync(file);
	}

	equals(file1: string, file2: string): boolean {
		return fs.readFileSync(file1).toString() != fs.readFileSync(file2).toString();
	}

	diff(file1: string, file2: string): void {
		console.log(chalk.cyan('**************************************************'));
		console.log(chalk.cyan(`# ${file2}`));
		try {
			execSync(`git diff --no-index "${file1}" "${file2}"`, { stdio: 'inherit' });
		} catch (error) {
			// Apparently git diff always returns with exit code 1 if there are changes. We can just ignore it.
		}
		console.log(chalk.cyan('**************************************************'));
	}
}

export default new Fs();
