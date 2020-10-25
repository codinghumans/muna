import chalk from 'chalk';
import crypto from 'crypto';
import fs from 'fs';
import rimraf from "rimraf";

/**
 * 
 * @param file 
 * @param key 
 * @param iv 
 */
export const encrypt = (file: string, key: Buffer, iv: Buffer): string => {
	const encipher = crypto.createCipheriv('AES-256-CBC', key, iv);

	const input = fs.createReadStream(file);
	const output = fs.createWriteStream(`${file}.enc`);

	input.pipe(encipher).pipe(output);

	console.log(`Encrypted ${chalk.gray(file)} -> ${chalk.green(output.path)}`);

	return output.path.toString();
};

/**
 * 
 * @param file 
 * @param key 
 * @param iv 
 */
export const decrypt = (file: string, key: Buffer, iv: Buffer) => {
	const decipher = crypto.createDecipheriv('AES-256-CBC', key, iv);

	const input = fs.createReadStream(file);
	const output = fs.createWriteStream(file.replace('.enc', ''));

	input.pipe(decipher).pipe(output);

	console.log(`Decrypted ${chalk.gray(file)} -> ${chalk.green(output.path)}`);

	return output.path;
};

/**
 * 
 * @param files 
 */
export const digestSHA256 = (files: string[]) : string => {
	const hash = crypto.createHash('sha256');

	files.forEach(file => {
		hash.update(fs.readFileSync(file));
	});

	return hash.digest('hex');
}

/**
 * 
 * @param files 
 */
export const unlink = (files: string[]): void => {
	files.forEach(file => rimraf.sync(file));
}