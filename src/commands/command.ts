export interface CommandOptions {}

export default interface Command {
	execute(options?: CommandOptions): void;
}
