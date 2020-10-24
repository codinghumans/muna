const glob = require('glob');
const chalk = require('chalk');
const { execSync } = require('child_process');

module.exports = async function push() {
	gitPush();
};

const gitPush = () => {
	execSync('git push');
};
