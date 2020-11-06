import globby from 'globby';
import path from 'path';
import { KMSError } from '../errors/kms.error';
import kms from '../modules/kms';
import BaseCommand from './base.command';

export interface EncryptCommandOptions {
    path: string;
}

export class EncryptCommand implements BaseCommand {
    async execute(options: EncryptCommandOptions): Promise<any> {
        const keyId = await kms.getKeyId();

        if (!keyId) {
            throw new KMSError('Key not found.');
        }

        const decryptedFiles = await globby([options.path.split(path.sep).join('/'), '!**/*.enc']);

        for (let decryptedFile of decryptedFiles) {
            await kms.encryptFile(decryptedFile, keyId);
        }
    }
}
