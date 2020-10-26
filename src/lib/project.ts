import { Git } from './git';
import path from 'path';
import { sha256 } from './utils/crypto.utils';

export class Project {
	static getRootDirectory(): string {
		return Git.getRootDirectory();
	}

	static getMetadataDirectory(): string {
		return path.join(Git.getRootDirectory(), '.muna');
	}

	static getOriginalsDirectory(): string {
		return path.join(Project.getMetadataDirectory(), 'originals');
	}

	static getOriginalFile(file: string): string {
		return path.join(Project.getOriginalsDirectory(), file);
	}
}
