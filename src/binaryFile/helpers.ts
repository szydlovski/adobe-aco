export function decodeUtf16BE(buffer: ArrayBuffer) {
	return [...new Uint16Array(buffer)]
		.map((value) => String.fromCharCode(swap16(value)))
		.join('');
}

function swap16(val: number) {
	return ((val & 0xff) << 8) | ((val >> 8) & 0xff);
}

export function encodeUtf16BE(input: string) {
	const length = input.length;
	const buffer = new ArrayBuffer(length * 2);
	const view = new Uint16Array(buffer);
	for (let i = 0; i < length; i++) {
		const value = swap16(input.charCodeAt(i));
		view[i] = value;
	}
	return view.buffer;
}

export function concatBuffers(buffer1: ArrayBuffer, buffer2: ArrayBuffer) {
	const temp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
	temp.set(new Uint8Array(buffer1), 0);
	temp.set(new Uint8Array(buffer2), buffer1.byteLength);
	return temp.buffer;
}
