import fs from 'fs-extra';

export class Lockfile {
    static lock(): void {
        fs.ensureFileSync('./.muna/muna.lock');
        
    }

    static unlock():void  {
        fs.unlinkSync('./.muna/muna.lock');
    }

    static exists(): boolean {
        return fs.existsSync('./.muna/muna.lock');
    }
}

