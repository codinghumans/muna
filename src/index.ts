#!/usr/bin/env node 

import chalk = require('chalk');
import yargs = require('yargs/yargs');

import { CommitCommand } from './commands/commit.command';
import { DecryptCommand } from './commands/decrypt.command';
import { EncryptCommand } from './commands/encrypt.command';
import { InitCommand } from './commands/init.command';
import { push } from './commands/push';

yargs(process.argv.slice(2))
	.scriptName('muna')
	.command(
		'init',
		'TODO',
		() => {},
		async () => {
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
		async () => {
			new DecryptCommand().execute();
		}
	)
	.command(
		'commit <message>',
		'TODO',
		() => {},
		async (argv: any) => {
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
	.fail((message, error) => {
		console.log(chalk.red(error.message));
	})
	.help()
	.argv;
