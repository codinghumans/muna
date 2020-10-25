import chalk from 'chalk';

export class LockNotFound extends Error {
	constructor(message: string) {
		super(chalk.red(message));
	}
}
