import { KeychainError } from '../../errors/keychain.error';
import { MasterKey } from '../master-key';
import chalk from 'chalk';
import crypto from 'crypto';
import fs from 'fs';
import globby from 'globby';
import rimraf from 'rimraf';

export const encryptAll = async (): Promise<string[]> => {
	const key = MasterKey.generate();

	const files = await globby(['*/*.!(*enc)']);

	files.map((file) => {
		return encrypt(file, key);
	});

	return files;
};

export const decryptAll = async (): Promise<string[]> => {
	const key = await MasterKey.fetch();

	if (!key) {
		throw new KeychainError('Master key not found.');
	}

	const files = await globby(['**/*.enc']);

	files.map((file) => {
		return decrypt(file, key);
	});

	return files;
};

export const encrypt = (file: string, key: MasterKey): string => {
	const encipher = crypto.createCipheriv('AES-256-CBC', key.key, key.iv);

	const input = fs.createReadStream(file);
	const output = fs.createWriteStream(`${file}.enc`);

	input.pipe(encipher).pipe(output);

	console.log(`Encrypted ${chalk.gray(file)} -> ${chalk.green(output.path)}`);

	return output.path.toString();
};

export const decrypt = (file: string, key: MasterKey) => {
	const decipher = crypto.createDecipheriv('AES-256-CBC', key.key, key.iv);

	const input = fs.createReadStream(file);
	const output = fs.createWriteStream(file.replace('.enc', ''));

	input.pipe(decipher).pipe(output);

	console.log(`Decrypted ${chalk.gray(file)} -> ${chalk.green(output.path)}`);

	return output.path;
};

export const unlink = (files: string[]): void => {
	files.forEach((file) => rimraf.sync(file));
};
