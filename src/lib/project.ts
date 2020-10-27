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

	static getSnapshotDirectory(): string {
		return path.join(Project.getMetadataDirectory(), 'snapshot');
	}

	static getSnapshot(file: string): string {
		return path.join(Project.getSnapshotDirectory(), file);
	}

	static didFilesChange(files: string[]): boolean {
		let changed = false;

		files.forEach((file) => {
			const snapshot = Project.getSnapshot(file);

			fs.ensureFileSync(snapshot);

			changed = changed || Git.didFileChange(snapshot, file);
		});

		return changed;
	}
}
