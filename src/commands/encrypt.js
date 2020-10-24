const fs = require('fs');
const glob = require('glob');
const chalk = require('chalk');
const rimraf = require('rimraf');
const crypto = require('crypto');

module.exports = async function encrypt() {
	const key = Buffer.from('1bc32f1091c8bda0920252e233388a2b8b1be03054a5250852cca74b3d12c4d5', 'hex');
	const iv = Buffer.from('c679c428b7957303fe95a9c7d909cb49', 'hex');

	console.log(iv.toString('hex'));
	console.log(key.toString('hex'));

	glob('**/*.!(*enc)', function (error, files) {
		files.map((file) => {
			encryptFile(file, key, iv);
			rimraf.sync(file);
		});
	});
};

function encryptFile(file, key, iv) {
	const encipher = crypto.createCipheriv('AES-256-CBC', key, iv);

	const input = fs.createReadStream(file);
	const output = fs.createWriteStream(`${file}.enc`);

	console.log(`Encrypted ${chalk.gray(file)} -> ${chalk.green(output.path)}`);

	input.pipe(encipher).pipe(output);

	return output.path;
}
