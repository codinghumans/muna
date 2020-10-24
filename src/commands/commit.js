const fs = require('fs');
const glob = require('glob');
const crypto = require('crypto');
const map = require('lodash/map');
const inquirer = require('inquirer');
const rimraf = require('rimraf');
const chalk = require('chalk');
const { execSync } = require('child_process');

module.exports = async function commit(message) {
	const iv = crypto.randomBytes(16);
	const key = crypto.randomBytes(32);

	console.log('key: ' + key.toString('hex'));
	console.log('iv: ' + iv.toString('hex'));

	glob('**/*.!(*enc)', async function (error, files) {
		map(files, (file) => {
			const encryptedFile = encryptFile(file, key, iv).path;
			execSync(`git add ${encryptedFile}`);
		});

		execSync(`git status`, { stdio: 'inherit' });

		const commit = await promptDoCommit();

		if (commit) {
			//const message = await promptCommitMessage();
			//execSync(`git commit -m ${message}`, { stdio: 'inherit' });
			//execSync(`git push`, { stdio: 'inherit' });
		} else {
			cleanup();
		}
	});
};

function encryptFile(path, key, iv) {
	const input = fs.createReadStream(path);
	const output = fs.createWriteStream(`${path}.enc`);

	input.pipe(crypto.createCipheriv('AES-256-CBC', key, iv)).pipe(output);

	return output;
}

function cleanup() {
	console.log('Cleaning up...');
	execSync(`git reset --hard`, { stdio: 'inherit' });
}

async function promptDoCommit() {
	return prompt('Do you want to commit this changes?', 'confirm');
}

async function promptCommitMessage() {
	return prompt('Enter a commit message:', 'input', (message) => (message ? true : false));
}

async function prompt(message, type, validate) {
	const stdin = process.stdin;

	stdin.on('data', (key) => {
		// Catch ctrl+c and clean up.
		if (key == '\u0003') {
			console.warn(chalk.red('\nCancelled.'));
			cleanup();
		}
	});

	const answers = await inquirer.prompt(
		{
			type: type,
			name: 'response',
			message: message,
			validate: validate,
		},
		{ input: stdin }
	);

	return answers['response'];
}
