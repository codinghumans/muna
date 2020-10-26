import inquirer, { QuestionCollection } from 'inquirer';

import chalk from 'chalk';

export const prompt = async (message: string, type: string, validate: string | null = null): Promise<unknown> => {
	const stdin = process.stdin;

	stdin.on('data', (key: string) => {
		// Catch ctrl+c and clean up.
		if (key == '\u0003') {
			cancelPrompt();
		}
	});

	const answers = await inquirer.prompt(
		[
			{
				type: type,
				name: 'response',
				message: message,
				validate: validate,
			},
		],
		{ input: stdin }
	);

	return answers['response'];
};

export const cancelPrompt = (): void => {
	console.warn(chalk.red('\nCancelled.'));
	process.exit(1);
};
