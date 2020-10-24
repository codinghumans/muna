#!/usr/bin/env node
const yargs = require('yargs/yargs');

const init = require('./src/commands/init');
const encrypt = require('./src/commands/encrypt');
const decrypt = require('./src/commands/decrypt');

const argv = require('yargs/yargs')(process.argv.slice(2))
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
		async (argv) => {
			await encrypt(argv.message);
		}
	)
	.command(
		'decrypt',
		'TODO',
		() => {},
		async (argv) => {
			await decrypt(argv.message);
		}
	)
	.help().argv;
