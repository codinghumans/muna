import keytar from 'keytar';
import { MasterKey } from '../lib/master-key';
import { sha256 } from '../utils/crypto.utils';
import { Project } from './project';

export class Keychain {
	static async getMasterKey(): Promise<MasterKey | null> {
		const key = await keytar.getPassword('muna', sha256(Project.getAbsoluteRootFolderPath()));

		if (key) {
			return MasterKey.from(key);
		} else {
			return null;
		}
	}

	static async putMasterKey(key: MasterKey): Promise<void> {
		await keytar.setPassword('muna', sha256(Project.getAbsoluteRootFolderPath()), key.toString());
	}
}
