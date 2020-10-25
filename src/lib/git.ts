import chalk from 'chalk';
import { dir } from 'console';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { pathToFileURL } from 'url';

const lockfile = './.muna/muna.lock';

export class Git {
  static exists(): boolean {
    try {
      execSync(`git status`, { stdio: 'ignore' });
      return true;
    } catch (error) {
      return false;
    }
  }

  static getTopLevel(): string {
    return execSync(`git rev-parse --show-toplevel`).toString().trim();
  }

  static commit(files: string[], message: string) {
    files.forEach((file) => this.add(file));
    execSync(`git commit -m "${message}"`);

    files.forEach((file) => {
      console.log(`Committed ${chalk.green(file)}`);
    });
  }

  static add(file: string): void {
    execSync(`git add ${file}`);
  }
}
