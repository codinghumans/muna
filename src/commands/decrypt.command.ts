import { Command } from './command';
import { Lockfile } from '../lib/lockfile';
import chalk from 'chalk';
import { decrypt } from '../lib/utils/file.utils';
import { glob } from 'glob';

const key = Buffer.from('1bc32f1091c8bda0920252e233388a2b8b1be03054a5250852cca74b3d12c4d5', 'hex');
const iv = Buffer.from('c679c428b7957303fe95a9c7d909cb49', 'hex');


export class DecryptCommand implements Command {

	execute(): void {
		if (Lockfile.exists()) {
			console.log('Files already decrypted. Skipping...');
			return;
		}
		else {
			console.log('Switching to decrypted mode...');
			
		}

		glob('**/*.enc', (_error, files) => {
			files.map((file) => {
				decrypt(file, key, iv);
			});		
		});

		Lockfile.lock();
	}
}

