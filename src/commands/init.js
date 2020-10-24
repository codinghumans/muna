const fs = require('fs').promises;
const chalk = require('chalk');

module.exports = async function init() {
	await fs.writeFile('.gitignore', '.muna\n*.*\n!.gitignore\n!*.enc');
	console.log(`Created ${chalk.green('.gitignore')}`);
};
