const fs = require('fs');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');
const crypto = require('crypto');
const rimraf = require('rimraf');

const key = Buffer.from('1bc32f1091c8bda0920252e233388a2b8b1be03054a5250852cca74b3d12c4d5', 'hex');
const iv = Buffer.from('c679c428b7957303fe95a9c7d909cb49', 'hex');

module.exports = function decrypt() {
	glob('**/*.enc', function (error, files) {
		files.map((file) => {
			decryptFile(file, Buffer.from(key), Buffer.from(iv));
		});
	});
};

function decryptFile(file, key, iv) {
	const decipher = crypto.createDecipheriv('AES-256-CBC', key, iv);

	const input = fs.createReadStream(file);
	const output = fs.createWriteStream(file.replace('.enc', ''));

	input.pipe(decipher).pipe(output);

	console.log(`Decrypted ${chalk.gray(file)} -> ${chalk.green(output.path)}`);

	return output.path;
}
