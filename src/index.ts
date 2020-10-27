#!/usr/bin/env node

import chalk = require('chalk');
import yargs = require('yargs/yargs');

import { ApplyCommand } from './commands/apply.command';
import { DecryptCommand } from './commands/decrypt.command';
import { DiffCommand } from './commands/diff.command';
import { EncryptCommand } from './commands/encrypt.command';
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
		'diff',
		'TODO',
		() => {},
		async (argv: any) => {
			await new DiffCommand().execute();
		}
	)
	.command(
		'decrypt',
		'TODO',
		() => {},
		() => {
			new DecryptCommand().execute();
		}
	)
	.command(
		'encrypt',
		'TODO',
		() => {},
		async (argv: any) => {
			await new EncryptCommand().execute();
		}
	)
	.command(
		'apply',
		'TODO',
		() => {},
		async (argv: any) => {
			await new ApplyCommand().execute();
		}
	)

	.help().argv;
