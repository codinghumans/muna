import { configfile } from './constants';
import fs from 'fs-extra';

export class Configfile {
    static exists(): boolean {
        return fs.existsSync(configfile);
    }
}

