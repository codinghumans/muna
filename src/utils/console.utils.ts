export const separator = (char: string = '-', length: number = 50) => {
	let sep = '';

	for (let i = 0; i < length; i++) {
		sep += char;
	}

	return sep;
};
