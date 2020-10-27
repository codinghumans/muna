import { Git } from './git';
import fs from 'fs-extra';
import path from 'path';

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

	static changed(files: string[]): boolean {
		let changed = false;

		files.forEach((file) => {
			const originalFile = Project.getOriginalFile(file);

			fs.ensureFileSync(originalFile);

			changed = changed || Git.changed(originalFile, file);
		});

		return changed;
	}
}
