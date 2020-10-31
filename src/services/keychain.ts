import keytar from 'keytar';
import MasterKey from '../lib/master-key';
import { sha256 } from '../utils/crypto.utils';
import project from './project';

class Keychain {
	async getMasterKey(): Promise<MasterKey | null> {
		const key = await keytar.getPassword('muna', sha256(project.getAbsoluteRootFolderPath()));

		if (key) {
			return MasterKey.from(key);
		} else {
			return null;
		}
	}

	async putMasterKey(key: MasterKey): Promise<void> {
		await keytar.setPassword('muna', sha256(project.getAbsoluteRootFolderPath()), key.toString());
	}
}

export default new Keychain();
