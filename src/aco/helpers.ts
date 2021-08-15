import { AcoColorSpaceName } from "./AcoColorSpace";

const INT_16_MAX = 65535;

function normalize(
	value: number,
	currentScale: number,
	desiredScale: number,
	reverse = false
) {
	return !reverse
		? (value / currentScale) * desiredScale
		: (value / desiredScale) * currentScale;
}

export function scaleAcoColorValues(
	inputValues: number[],
	space: AcoColorSpaceName,
	reverse = false
) {
	let values = [...inputValues];
	if (['rgb', 'hsv', 'lab'].includes(space)) {
		values = values.slice(0, 3);
		if (space === 'rgb') {
			values = values.map((value) =>
				normalize(value, INT_16_MAX, 255, reverse)
			);
		} else if (space === 'hsv') {
			const [h, s, v] = values;
			values = [
				normalize(h, INT_16_MAX, 360, reverse),
				normalize(s, INT_16_MAX, 100, reverse),
				normalize(v, INT_16_MAX, 100, reverse),
			];
		} else if (space === 'lab') {
			values = values.map((value) => normalize(value, 10000, 100, reverse));
		}
	} else if (space === 'grayscale') {
		values = values
			.slice(0, 1)
			.map((value) => normalize(value, INT_16_MAX, 1, reverse));
	} else if (space === 'cmyk') {
		values = values.map((value) => normalize(value, INT_16_MAX, 1, reverse));
	}
	return values;
}
