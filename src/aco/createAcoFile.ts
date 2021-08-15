import { BinaryFileWriter } from "../binaryFile";
import { lookupColorSpaceId } from "./AcoColorSpace";
import { scaleAcoColorValues } from "./helpers";
import { Swatch } from "./types";

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
	writer.movePosition(2);
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
		writer.writeAdobeUnicodeString(name);
	}
	return writer.buffer;
}