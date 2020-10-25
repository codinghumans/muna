import { Command, CommandOptions } from './command';
import { digestSHA256, encrypt, unlink } from '../lib/utils/file.utils';

import { Console } from 'console';
import { LockNotFound } from '../lib/exceptions/lockfile-not-found';
import { Lockfile } from '../lib/lockfile';
import { MasterKey } from '../lib/master-key';
import chalk from 'chalk';
import { error } from '../lib/utils/console.utils';
import glob from 'glob';
import keytar from 'keytar';

export class EncryptCommand implements Command {

	execute(): void {
		if (!Lockfile.exists()) {
			console.log('Files already encrypted. Skipping...');
			return;
		}
		else {
			console.log('Switching to encrypted mode...');
			
		}

		const masterKey = new MasterKey(Buffer.from('c679c428b7957303fe95a9c7d909cb49', 'hex'), Buffer.from('1bc32f1091c8bda0920252e233388a2b8b1be03054a5250852cca74b3d12c4d5', 'hex'))
	
		glob('**/*.!(*enc)', (_error, files) => {
			const encryptedFiles = files.map((file) => {
				return encrypt(file, masterKey.key, masterKey.iv);
			});

			keytar.setPassword("muna", digestSHA256(encryptedFiles), masterKey.toString());

			unlink(files);

			Lockfile.unlock();
		});
	}
}
