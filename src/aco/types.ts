import { AcoColorSpaceName } from './AcoColorSpace';

export type InputSwatch = [number[], AcoColorSpaceName, string?];

export type AcoFileVersion = 1 | 2;

export type AcoColorValues = [number, number, number, number];

export type Swatch = [number[], AcoColorSpaceName, string];

export interface AcoSwatch {
	values: AcoColorValues;
	space: AcoColorSpaceName;
	name: string;
}

export interface AcoFile {
	version: AcoFileVersion;
	swatches: Swatch[];
}
