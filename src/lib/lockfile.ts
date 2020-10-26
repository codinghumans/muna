import fs from 'fs-extra';

export const lockfile = '.muna/muna.lock';

export class Lockfile {
	static async lock(): Promise<void> {
		await fs.ensureFile(lockfile);
	}

	static async unlock(): Promise<void> {
		await fs.unlink(lockfile);
	}

	static exists(): boolean {
		return fs.existsSync(lockfile);
	}
}
