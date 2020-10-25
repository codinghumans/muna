export interface CommandOptions {}

export interface Command {
	execute(options?: CommandOptions): void;
}
