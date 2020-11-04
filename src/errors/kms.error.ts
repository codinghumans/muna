export class KMSError extends Error {
	constructor(message: string) {
		super(`KMS Error: ${message}`);
	}
}
