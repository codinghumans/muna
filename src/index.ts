#!/usr/bin/env node 

import chalk = require('chalk');
import yargs = require('yargs/yargs');

import { CommitCommand } from './commands/commit.command';
import { DecryptCommand } from './commands/decrypt.command';
import { EncryptCommand } from './commands/encrypt.command';
import { InitCommand } from './commands/init.command';
import { push } from './commands/push';

process.on('uncaughtException', function (error) {
	console.error(chalk.red(error.message));
	process.exit(1);
});

yargs(process.argv.slice(2))
	.scriptName('muna')
	.fail((message, error) => {
		console.log(chalk.red(error.message));
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
		'encrypt',
		'TODO',
		() => {},
		() => {
			new EncryptCommand().execute();
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
		'commit <message>',
		'TODO',
		() => {},
		(argv: any) => {
			new CommitCommand().execute(argv.message);
		}
	)
	.command(
		'push',
		'TODO',
		() => {},
		async () => {
			await push();
		}
	)
	.help()
	.argv;
