import { MasterKey } from './master-key';
import { Project } from './project';
import keytar from 'keytar';

export class Keychain {
	static async getMasterKey(): Promise<MasterKey | null> {
		const key = await keytar.getPassword('muna', Project.getRootDirectoryHash());

		if (key) {
			return MasterKey.from(key);
		} else {
			return null;
		}
	}

	static async putMasterKey(key: MasterKey): Promise<void> {
		await keytar.setPassword('muna', Project.getRootDirectoryHash(), key.toString());
	}
}
