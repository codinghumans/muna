import { Git } from './git';
import { sha256 } from './utils/crypto.utils';

export class Project {
	static getRootDirectory(): string {
		return Git.getRootDirectory();
	}

	static getRootDirectoryHash(): string {
		return sha256(Project.getRootDirectory());
	}
}
