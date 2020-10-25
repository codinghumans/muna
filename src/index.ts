#!/usr/bin/env node 

import yargs = require('yargs/yargs');

import { CommitCommand } from './commands/commit.command';
import { DecryptCommand } from './commands/decrypt.command';
import { EncryptCommand } from './commands/encrypt.command';
import { init } from './commands/init';
import { push } from './commands/push';

yargs(process.argv.slice(2))
	.scriptName('muna')
	.command(
		'init',
		'TODO',
		() => {},
		async () => {
			await init();
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
	.help().argv;
