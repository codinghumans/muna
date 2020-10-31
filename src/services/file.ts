import crypto from 'crypto';
import fs from 'fs-extra';
import path from 'path';
import rimraf from 'rimraf';
import MasterKey from '../lib/master-key';
import folder from './folder';

class File {
	async decrypt(file: string, key: MasterKey): Promise<string> {
		const decipher = crypto.createDecipheriv('AES-256-CBC', key.key, key.iv);

		const input = fs.createReadStream(file);
		const output = fs.createWriteStream(file.replace('.enc', ''));

		await new Promise((resolve) => input.pipe(decipher).pipe(output).on('finish', resolve));

		return output.path.toString();
	}

	async encrypt(file: string, key: MasterKey): Promise<string> {
		const encipher = crypto.createCipheriv('AES-256-CBC', key.key, key.iv);

		const input = fs.createReadStream(file);
		const output = fs.createWriteStream(`${file}.enc`);

		await new Promise((resolve) => input.pipe(encipher).pipe(output).on('finish', resolve));

		return output.path.toString();
	}

	read(file: string): string {
		return fs.readFileSync(file).toString();
	}

	copy(source: string, destination: string): void {
		folder.touch(path.dirname(destination));
		fs.copyFileSync(source, destination);
	}

	write(file: string, data: any): void {
		folder.touch(path.dirname(file));
		fs.writeFileSync(file, data);
	}

	writeJSON(file: string, data: any): void {
		folder.touch(path.dirname(file));
		fs.writeJSONSync(file, data);
	}

	exists(file: string): boolean {
		return fs.existsSync(file);
	}

	append(file: string, data: any) {
		fs.appendFileSync(file, data);
	}

	touch(file: string): void {
		fs.ensureFileSync(file);
	}

	delete(file: string): void {
		rimraf.sync(file);
	}
}

export default new File();
