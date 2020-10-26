#!/usr/bin/env node

import chalk = require('chalk');
import yargs = require('yargs/yargs');

import { CommitCommand } from './commands/commit.command';
import { DiffCommand } from './commands/diff.command';
import { EditCommand } from './commands/edit.command';
import { InitCommand } from './commands/init.command';

process.on('uncaughtException', function (error) {
	console.error(chalk.red(error.message));
	process.exit(1);
});

yargs(process.argv.slice(2))
	.scriptName('muna')
	.fail((_message, error) => {
		console.error(chalk.red(error.message));
	})
	.command(
		'init',
		'TODO',
		() => {},
		() => {
			new InitCommand().execute();
		}
	)
	.command(
		'edit',
		'TODO',
		() => {},
		() => {
			new EditCommand().execute();
		}
	)
	.command(
		'diff',
		'TODO',
		() => {},
		async (argv: any) => {
			await new DiffCommand().execute();
		}
	)
	.command(
		'commit <message>',
		'TODO',
		() => {},
		async (argv: any) => {
			await new CommitCommand().execute(argv);
		}
	)

	.help().argv;
