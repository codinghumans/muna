import chalk from "chalk";

export class ConfigurationError extends Error {
    constructor(message: string) {
        super(`Configuration Error: ${message}`);
    }
}