export interface BaseCommandOptions {}

export default interface BaseCommand {
	execute(options?: BaseCommandOptions): void;
}
