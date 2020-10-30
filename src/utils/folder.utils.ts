import fs from 'fs-extra';

export const touchFolder = (folder: string): void => {
	if (!fs.pathExistsSync(folder)) {
		fs.mkdirSync(folder);
	}
};
