import crypto from 'crypto';
import fs from 'fs-extra';
import rimraf from 'rimraf';
import { MasterKey } from '../lib/master-key';

export const decryptFile = async (file: string, key: MasterKey): Promise<string> => {
	const decipher = crypto.createDecipheriv('AES-256-CBC', key.key, key.iv);

	const input = fs.createReadStream(file);
	const output = fs.createWriteStream(file.replace('.enc', ''));

	await new Promise((resolve) => input.pipe(decipher).pipe(output).on('finish', resolve));

	return output.path.toString();
};

export const encryptFile = async (file: string, key: MasterKey): Promise<string> => {
	const encipher = crypto.createCipheriv('AES-256-CBC', key.key, key.iv);

	const input = fs.createReadStream(file);
	const output = fs.createWriteStream(`${file}.enc`);

	await new Promise((resolve) => input.pipe(encipher).pipe(output).on('finish', resolve));

	return output.path.toString();
};

export const copyFile = (source: string, destination: string): void => {
	fs.copyFileSync(source, destination);
};

export const appendToFile = (file: string, data: any): void => {
	fs.appendFileSync(file, data);
};

export const writeFile = (file: string, data: any): void => {
	fs.writeFileSync(file, data);
};

export const writeJSONFile = (file: string, data: any): void => {
	fs.writeJSONSync(file, data);
};

export const readFile = (file: string): string => {
	return fs.readFileSync(file).toString();
};

export const existsFile = (file: string): boolean => {
	return fs.existsSync(file);
};

export const touchFile = (file: string): void => {
	fs.ensureFileSync(file);
};

export const removeFile = (file: string): void => {
	rimraf.sync(file);
};
