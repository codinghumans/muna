import chalk from "chalk";
import { execSync } from "child_process";

export const commit = (files: string[], message: string) => {
    files.forEach(file => add(file));
    execSync(`git commit -m "${message}"`);
    
    files.forEach((file) => {
        console.log(`Committed ${chalk.green(file)}`);
    });
};

const add = (file: string) => {
	execSync(`git add ${file}`);
};
