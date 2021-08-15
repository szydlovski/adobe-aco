import { AcoFileError } from "./AcoFileError.js";

export type AcoColorSpaceName = keyof typeof AcoColorSpace;

export enum AcoColorSpace {
	rgb = 0,
	hsv = 1,
	cmyk = 2,
	lab = 7,
	grayscale = 8,
}

export function lookupColorSpaceName(id: AcoColorSpace): AcoColorSpaceName {
	if (AcoColorSpace[id] === undefined) {
		throw AcoFileError.UnsupportedColorSpaceId(id);
	}
	return AcoColorSpace[id] as AcoColorSpaceName;
}

export function lookupColorSpaceId(name: AcoColorSpaceName): AcoColorSpace {
	if (AcoColorSpace[name] === undefined) {
		throw AcoFileError.UnsupportedColorSpaceName(name);
	}
	return AcoColorSpace[name];
}
