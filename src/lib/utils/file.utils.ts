import { Git } from '../git';
import { Keychain } from '../keychain';
import { KeychainError } from '../../errors/keychain.error';
import { MasterKey } from '../master-key';
import { Project } from '../project';
import chalk from 'chalk';
import crypto from 'crypto';
import fs from 'fs-extra';
import globby from 'globby';
import path from 'path';
import rimraf from 'rimraf';

export const decrypt = async (file: string, key: MasterKey): Promise<string> => {
	const decipher = crypto.createDecipheriv('AES-256-CBC', key.key, key.iv);

	const input = fs.createReadStream(file);
	const output = fs.createWriteStream(file.replace('.enc', ''));

	await new Promise((resolve) => input.pipe(decipher).pipe(output).on('finish', resolve));

	fs.ensureDirSync(path.join(Project.getSnapshotDirectory(), path.dirname(output.path.toString())));
	fs.copyFileSync(output.path, path.join(Project.getSnapshotDirectory(), output.path.toString()));

	return output.path.toString();
};

export const encrypt = async (file: string, key: MasterKey): Promise<string> => {
	const encipher = crypto.createCipheriv('AES-256-CBC', key.key, key.iv);

	const input = fs.createReadStream(file);
	const output = fs.createWriteStream(`${file}.enc`);

	await new Promise((resolve) => input.pipe(encipher).pipe(output).on('finish', resolve));

	return output.path.toString();
};

export const unlink = (files: string[]): void => {
	files.forEach((file) => rimraf.sync(file));
};
