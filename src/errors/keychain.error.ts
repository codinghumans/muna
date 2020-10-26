import chalk from 'chalk';

export class KeychainError extends Error {
	constructor(message: string) {
		super(`Keychain Error: ${message}`);
	}
}
