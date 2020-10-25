import fs from 'fs-extra';

export const lockfile = '.muna/muna.lock';

export class Lockfile {
    static lock(): void {
        fs.ensureFileSync(lockfile);
    }

    static unlock():void  {
        fs.unlinkSync(lockfile);
    }

    static exists(): boolean {
        return fs.existsSync(lockfile);
    }
}

