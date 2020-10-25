import chalk from 'chalk';
import fs from 'fs-extra';

export const gitignore  = '.gitignore'
export const gitIgnoredFiles = '\n# Added by Muna\n.muna\n*.*\n!.gitignore\n!*.enc';

export class Gitignore {

    static init(): void {
        if (!Gitignore.exists()) {
			fs.writeFileSync(gitignore, gitIgnoredFiles);
			console.log(`Created ${chalk.green(gitignore)}`);
		}
		else if (!fs.readFileSync(gitignore).toString().includes(gitIgnoredFiles)) {
            fs.appendFileSync(gitignore, gitIgnoredFiles)
			console.log(`Updated ${chalk.green(gitignore)}`);
        }
        else {
            console.log(`Skipped ${chalk.gray(gitignore)}`);
        }
    }

    static exists(): boolean {
        return fs.existsSync(gitignore);
    }
}

