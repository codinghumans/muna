import fs from 'fs-extra';

export const lockfile = '.muna/muna.lock';

export enum LockStatus {
	Decrypted,
	Encrypted,
}

export class EditLock {
	static async forEdit(): Promise<void> {
		await fs.ensureFile(lockfile);
	}

	static async unlock(): Promise<void> {
		await fs.unlink(lockfile);
	}
}
