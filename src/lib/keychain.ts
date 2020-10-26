import { MasterKey } from './master-key';
import { Project } from './project';
import keytar from 'keytar';
import { sha256 } from './utils/crypto.utils';

export class Keychain {
	static async getMasterKey(): Promise<MasterKey | null> {
		const key = await keytar.getPassword('muna', sha256(Project.getRootDirectory()));

		if (key) {
			return MasterKey.from(key);
		} else {
			return null;
		}
	}

	static async putMasterKey(key: MasterKey): Promise<void> {
		await keytar.setPassword('muna', sha256(Project.getRootDirectory()), key.toString());
	}
}
