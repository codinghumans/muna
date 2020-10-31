import chalk from 'chalk';
import { InitializationError } from '../errors/initialization.error';
import file from '../services/file';
import folder from '../services/folder';
import git from '../services/git';
import Project, { ConfigFile, GitIgnoredFiles, GitIgnoreFile } from '../services/project';
import Command from './command';

export class InitCommand implements Command {
	execute(): void {
		if (!git.exists()) {
			throw new InitializationError('Not in a git repository.');
		}

		console.log('Initializing...');

		this.createExampleSecretsFile();
		this.createConfigFile();
		this.createGitIgnoreFile();
	}

	private createExampleSecretsFile() {
		const exampleSecretsFile = Project.getExampleSecretsFilePath();

		if (!file.exists(exampleSecretsFile)) {
			folder.touch(Project.getSecretsFolderPath());

			file.writeJSON(exampleSecretsFile, {
				mySecretName: 'mySecretValue',
			});

			console.log(`Created ${chalk.green(exampleSecretsFile)}`);
		} else {
			console.log(`Skipped ${chalk.gray(exampleSecretsFile)}`);
		}
	}

	private createConfigFile() {
		if (!file.exists(ConfigFile)) {
			file.writeJSON(ConfigFile, {});
			console.log(`Created ${chalk.green(ConfigFile)}`);
		} else {
			console.log(`Skipped ${chalk.gray(ConfigFile)}`);
		}
	}

	private createGitIgnoreFile() {
		if (!file.exists(GitIgnoreFile)) {
			file.write(GitIgnoreFile, GitIgnoredFiles);
			console.log(`Created ${chalk.green(GitIgnoreFile)}`);
		} else if (!file.read(GitIgnoreFile).toString().includes(GitIgnoredFiles)) {
			file.append(GitIgnoreFile, GitIgnoredFiles);
			console.log(`Updated ${chalk.green(GitIgnoreFile)}`);
		} else {
			console.log(`Skipped ${chalk.gray(GitIgnoreFile)}`);
		}
	}
}
