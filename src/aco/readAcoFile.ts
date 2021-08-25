import { BinaryFileReader } from "@szydlovski/binary-file";
import { AcoColorSpace, lookupColorSpaceName } from "./AcoColorSpace.js";
import { AcoFileError } from "./AcoFileError.js";
import { scaleAcoColorValues } from "./helpers.js";
import { Swatch, AcoFileVersion, AcoColorValues } from "./types.js";

export function readAcoFile(data: ArrayBuffer, preserve = false): Swatch[] {
	if (!(data instanceof ArrayBuffer)) {
		throw AcoFileError.NotArrayBuffer();
	}
	try {
		const reader = new BinaryFileReader(data);
		let version: AcoFileVersion;
		const version1 = reader.readInt16();
		const length = reader.readInt16();
		let version2;
		const version2Position = 4 + length * 10;
		if (reader.byteLength > version2Position) {
			reader.setPosition(version2Position);
			version2 = reader.readInt16();
		}
		if (version1 === 1) version = 1;
		if (version2 === 2) version = 2;
		if (version! === undefined) {
			throw AcoFileError.WrongVersionNumber();
		}
		reader.setPosition(version === 1 ? 4 : 8 + length * 10);
		const swatches: Swatch[] = [];
		for (let i = 0; i < length; i++) {
			const colorSpaceIndex = reader.readInt16() as AcoColorSpace;
			const space = lookupColorSpaceName(colorSpaceIndex);
			let values = [];
			for (let v = 0; v < 4; v++) {
				if (space === 'lab') {
					values.push(reader.readInt16());
				} else {
					values.push(reader.readUint16());
				}
			}
			values = values as AcoColorValues;
			let name = '';
			if (version === 2) {
				name = readAdobeUnicodeString(reader);
			}
			swatches.push([values, space, name]);
		}
		if (preserve) {
			return swatches;
		} else {
			return swatches.map(([values, space, name]) => {
				const scaledValues = scaleAcoColorValues(values, space);
				return [scaledValues, space, name];
			});
		}
	} catch (error) {
		if (error instanceof AcoFileError) throw error;
		console.error(error);
		throw AcoFileError.InvalidFile();
	}
}

function readAdobeUnicodeString(reader: BinaryFileReader) {
	const length = reader.readInt32();
	return reader.readString(length, 'utf16be').slice(0, -1);
}