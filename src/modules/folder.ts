import fs from 'fs-extra';

class Folder {
    create(folder: string): void {
        fs.mkdirSync(folder, { recursive: true });
    }

    exists(folder: string): boolean {
        return fs.pathExistsSync(folder);
    }

    touch(folder: string): void {
        if (!this.exists(folder)) {
            this.create(folder);
        }
    }
}

export default new Folder();
