import crypto from 'crypto';
import git from '../services/git';
import keychain from '../services/keychain';
import ssm from '../services/ssm';

export default class MasterKey {
	#key: Buffer;
	#iv: Buffer;

	static from(masterKey: string): MasterKey {
		const parts = masterKey.split('-');
		return new MasterKey(parts[0], parts[1]);
	}

	static generate(): MasterKey {
		console.log('Generating new master key...');
		return new MasterKey(crypto.randomBytes(32), crypto.randomBytes(16));
	}

	static async fetch(): Promise<MasterKey | null> {
		console.log('Fetching master key...');

		let key = await keychain.getMasterKey();

		if (key) {
			console.log('Master key fetched from keychain.');
			return key;
		} else {
			key = await ssm.getMasterKey(git.getLastCommitDate(), git.getLastCommitHash());
		}

		if (key) {
			console.log('Master key fetched from SSM.');
		}

		return key;
	}

	constructor(key: string | Buffer, iv: string | Buffer) {
		this.#key = key instanceof Buffer ? key : Buffer.from(key as string, 'hex');
		this.#iv = iv instanceof Buffer ? iv : Buffer.from(iv as string, 'hex');
	}

	get key(): Buffer {
		return this.#key;
	}

	get iv(): Buffer {
		return this.#iv;
	}

	toString(): string {
		return `${this.key.toString('hex')}-${this.iv.toString('hex')}`;
	}
}
