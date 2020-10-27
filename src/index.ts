#!/usr/bin/env node

import chalk = require('chalk');

import { ApplyCommand } from './commands/apply.command';
import { DiffCommand } from './commands/diff.command';
import { EditCommand } from './commands/edit.command';
import { InitCommand } from './commands/init.command';
import { help } from 'yargs';

import yargs = require('yargs/yargs');

process.on('uncaughtException', function (error) {
	console.error(chalk.red(error.message));
	process.exit(1);
});

yargs(process.argv.slice(2))
	.scriptName('muna')
	.usage('Usage: $0 <command> [options]')
	.command(
		'init',
		'Initializes a muna project.',
		() => {},
		() => {
			new InitCommand().execute();
		}
	)
	.command(
		'diff',
		'Generates a git diff between the encrypted and non-encrypted versions of all the non-encrypted files included in the project.',
		() => {},
		async (argv: any) => {
			await new DiffCommand().execute();
		}
	)
	.command(
		'edit',
		'Decrypts all the encrypted files and allows the user to edit them.',
		() => {},
		async () => {
			await new EditCommand().execute();
		}
	)
	.command(
		'apply -r <reason>',
		'Encrypts, commits, and pushes to the remote git repository all the non-encrypted files included in the project. The master key is also automatically added to the SSM Parameter Store.',
		(yargs) => {
			return yargs
				.group(['r'], "Options for 'apply':")
				.option('reason', {
					type: 'string',
					alias: 'r',
					describe: 'The reason of this change.',
				})
				.demandOption(['r']);
		},
		async (argv: any) => {
			console.log(argv);
			await new ApplyCommand().execute();
		}
	)
	.demandCommand()

	.epilog('Copyright 2020, Coding Humans. All rights reserved.').argv;
