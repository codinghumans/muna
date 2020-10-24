#!/usr/bin/env node
const yargs = require('yargs/yargs');

const commit = require('./src/commands/commit');
const encrypt = require('./src/commands/encrypt');
const decrypt = require('./src/commands/decrypt');
const init = require('./src/commands/init');
const push = require('./src/commands/push');

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
			await encrypt();
		}
	)
	.command(
		'decrypt',
		'TODO',
		() => {},
		async (argv) => {
			await decrypt();
		}
	)
	.command(
		'commit <message>',
		'TODO',
		() => {},
		async (argv) => {
			await commit(argv.message);
		}
	)
	.command(
		'push',
		'TODO',
		() => {},
		async (argv) => {
			await push();
		}
	)
	.help().argv;
