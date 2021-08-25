import { BinaryFileWriter } from "@szydlovski/binary-file";
import { lookupColorSpaceId } from "./AcoColorSpace.js";
import { scaleAcoColorValues } from "./helpers.js";
import { Swatch } from "./types.js";

export function createAcoFile(swatches: Swatch[], preserve = false) {
	let scaledSwatches;
	if (preserve) {
		scaledSwatches = swatches;
	} else {
		scaledSwatches = swatches.map(([values, space, name]) => {
			const scaledValues = scaleAcoColorValues(values, space, true);
			return [scaledValues, space, name] as Swatch;
		});
	}
	const writer = new BinaryFileWriter();
	const length = scaledSwatches.length;
	writer.writeInt16(1);
	writer.writeInt16(length);
	for (const [values, space] of scaledSwatches) {
		const spaceId = lookupColorSpaceId(space);
		writer.writeInt16(spaceId);
		for (let v = 0; v < 4; v++) {
			const value = values[v];
			if (space === 'lab') {
				writer.writeUint16(value);
			} else {
				writer.writeInt16(value);
			}
		}
	}
	writer.writeInt16(2);
	writer.writeInt16(length);
	for (const [values, space, name] of scaledSwatches) {
		const spaceId = lookupColorSpaceId(space);
		writer.writeInt16(spaceId);
		for (let v = 0; v < 4; v++) {
			const value = values[v];
			if (space === 'lab') {
				writer.writeUint16(value);
			} else {
				writer.writeInt16(value);
			}
		}
		writeAdobeUnicodeString(writer, name);
	}
	return writer.buffer;
}

function writeAdobeUnicodeString(writer: BinaryFileWriter, value: string) {
	const length = value.length;
	writer.writeInt32(length + 1);
	writer.writeString(value, 'utf16be');
	writer.writeInt16(0);
}