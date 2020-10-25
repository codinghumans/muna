import chalk from "chalk";

export class InitializationError extends Error {
    constructor(message: string) {
        super(`Initialization Error: ${message}`);
    }
}