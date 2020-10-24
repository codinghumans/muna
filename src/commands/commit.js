const glob = require('glob');
const chalk = require('chalk');
const { execSync } = require('child_process');

module.exports = async function commit(message) {
	glob('**/*.enc', async function (error, files) {
		files.map((file) => gitAdd(file));

		gitCommit(message);

		files.forEach((file) => {
			console.log(`Committed ${chalk.green(file)}`);
		});
	});
};

const gitAdd = (file) => {
	execSync(`git add ${file}`);
};

const gitCommit = (message) => {
	execSync(`git commit -m "${message}"`);
};
