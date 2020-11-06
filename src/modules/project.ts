import { cosmiconfigSync } from 'cosmiconfig';
import isEqual from 'lodash.isequal';
import path from 'path';
import { ConfigurationError } from '../errors/configuration.error';
import fs from './fs';

export const Configfile = '.munarc.json';

export interface Configuration {
    aws?: { region?: string; kms?: { key?: string } };
}

class Project {
    #config?: Configuration;

    get config(): Configuration {
        if (!this.#config) {
            const result = cosmiconfigSync('muna').search();
            this.#config = result?.config || {};
        }

        return this.#config!;
    }

    get region(): string {
        const region = this.config.aws?.region;

        if (!region) {
            throw new ConfigurationError('aws.region not defined.');
        }

        return region;
    }

    set region(region: string) {
        if (!this.config.aws) this.config.aws = {};
        this.config.aws.region = region;
    }

    get key(): string {
        const key = this.config.aws?.kms?.key;

        if (!key) {
            throw new ConfigurationError('aws.kms.key not defined.');
        }

        return key;
    }

    set key(key: string) {
        if (!this.config.aws) this.config.aws = {};
        if (!this.config.aws.kms) this.config.aws.kms = {};
        this.config.aws.kms.key = key;
    }

    configure(region: string, key: string) {
        this.region = region;
        this.key = key;
    }

    saveConfiguration() {
        if (!fs.exists(Configfile) || !isEqual(this.config, fs.readJSON(Configfile))) {
            console.log(`${!fs.exists(Configfile) ? 'Creating' : 'Updating'} ${Configfile}...`);
            fs.writeJSON(Configfile, this.config);
        }
    }

    getFileSnapshotPath(file: string): string {
        return path.join(path.dirname(file), '.muna', 'snapshot', path.basename(file));
    }

    createFileSnapshot(file: string) {
        fs.copy(file, this.getFileSnapshotPath(file));
    }

    diff(files: string[]): boolean {
        let changes = false;

        files.forEach((file) => {
            const snapshot = this.getFileSnapshotPath(file);

            fs.touch(snapshot);

            if (!fs.equals(snapshot, file)) {
                fs.diff(snapshot, file);
                changes = true;
            }
        });

        return changes;
    }
}

export default new Project();
