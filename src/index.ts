#!/usr/bin/env node

import program from 'commander';
import { ConfigureCommand } from './commands/configure.command';
import { DecryptCommand } from './commands/decrypt.command';
import { DiffCommand } from './commands/diff.command';
import { EncryptCommand } from './commands/encrypt.command';

const exec = async (fn: () => Promise<void>) => {
	try {
		await fn();
	} catch (error) {
		console.log(error.message);
	}
};

program.usage('<command> [options]');

program
	.command('configure <region> <key>')
	.description('TODO')
	.action((region: string, key: string) => {
		exec(async () => await new ConfigureCommand().execute({ region: region, key: key }));
	});

program
	.command('decrypt <path>')
	.description('TODO')
	.action(async (path: string) => {
		exec(async () => await new DecryptCommand().execute({ path: path }));
	});

program
	.command('encrypt <path>')
	.description('TODO')
	.action(async (path: string) => {
		exec(async () => await new EncryptCommand().execute({ path: path }));
	});

program
	.command('diff <path>')
	.description('TODO')
	.action(async (path: string) => {
		exec(async () => await new DiffCommand().execute({ path: path }));
	});

program.parse(process.argv);
