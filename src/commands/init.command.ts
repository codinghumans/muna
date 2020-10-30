import chalk from 'chalk';
import { InitializationError } from '../errors/initialization.error';
import { Git } from '../services/git';
import { ConfigFile, GitIgnoredFiles, GitIgnoreFile, Project } from '../services/project';
import { appendToFile, existsFile, readFile, writeFile, writeJSONFile } from '../utils/file.utils';
import { touchFolder } from '../utils/folder.utils';
import { Command } from './command';

export class InitCommand implements Command {
	execute(): void {
		if (!Git.exists()) {
			throw new InitializationError('Not in a git repository.');
		}

		console.log('Initializing...');

		this.createExampleSecretsFile();
		this.createConfigFile();
		this.createGitIgnoreFile();
	}

	private createExampleSecretsFile() {
		const exampleSecretsFile = Project.getExampleSecretsFilePath();

		if (!existsFile(exampleSecretsFile)) {
			touchFolder(Project.getSecretsFolderPath());

			writeJSONFile(exampleSecretsFile, {
				mySecretName: 'mySecretValue',
			});

			console.log(`Created ${chalk.green(exampleSecretsFile)}`);
		} else {
			console.log(`Skipped ${chalk.gray(exampleSecretsFile)}`);
		}
	}

	private createConfigFile() {
		if (!existsFile(ConfigFile)) {
			writeFile(ConfigFile, JSON.stringify({}, null, 2));
			console.log(`Created ${chalk.green(ConfigFile)}`);
		} else {
			console.log(`Skipped ${chalk.gray(ConfigFile)}`);
		}
	}

	private createGitIgnoreFile() {
		if (!existsFile(GitIgnoreFile)) {
			writeFile(GitIgnoreFile, GitIgnoredFiles);
			console.log(`Created ${chalk.green(GitIgnoreFile)}`);
		} else if (!readFile(GitIgnoreFile).toString().includes(GitIgnoredFiles)) {
			appendToFile(GitIgnoreFile, GitIgnoredFiles);
			console.log(`Updated ${chalk.green(GitIgnoreFile)}`);
		} else {
			console.log(`Skipped ${chalk.gray(GitIgnoreFile)}`);
		}
	}
}
