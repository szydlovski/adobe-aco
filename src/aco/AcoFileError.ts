export class AcoFileError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'AcoFileError';
	}
	static WrongVersionNumber() {
		return new AcoFileError('Invalid .aco file, wrong version number');
	}
	static InvalidFile() {
		return new AcoFileError('Invalid .aco file');
	}
	static UnsupportedColorSpaceId(id: number) {
		return new AcoFileError(`Unsupported color space id: ${id}`);
	}
	static UnsupportedColorSpaceName(name: string) {
		return new AcoFileError(`Unsupported color space name: ${name}`);
	}
}
