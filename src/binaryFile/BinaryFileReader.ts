import { decodeUtf16BE } from "./helpers.js";

export class BinaryFileReader {
	#view: DataView;
	#position = 0;
	#savedPosition: number | undefined;
	constructor(buffer: ArrayBuffer) {
		this.#view = new DataView(buffer);
	}
	private get view() {
		return this.#view;
	}
	private get position() {
		return this.#position;
	}
	public get buffer() {
		return this.view.buffer;
	}
	public get byteLength() {
		return this.buffer.byteLength;
	}
	private read<T>(
		callback: (position: number) => T,
		offsetPosition: number
	): T {
		if (this.position + offsetPosition > this.view.buffer.byteLength) {
			throw new Error('out of bounds');
		}
		const value = callback(this.position);
		this.movePosition(offsetPosition);
		return value;
	}
	readInt32() {
		return this.read((position) => this.view.getInt32(position), 4);
	}
	readUint32() {
		return this.read((position) => this.view.getUint32(position), 4);
	}
	readInt16() {
		return this.read((position) => this.view.getInt16(position), 2);
	}
	readUint16() {
		return this.read((position) => this.view.getUint16(position), 2);
	}
	nextBytes(length: number) {
		const bytes = this.view.buffer.slice(this.position, this.position + length);
		this.movePosition(length);
		return bytes;
	}
	readAdobeUnicodeString() {
		const length = this.readInt32();
		const byteLength = length * 2 - 2;
		const bytes = this.nextBytes(byteLength);
		const text = decodeUtf16BE(bytes);
		this.movePosition(2);
		return text;
	}
	setPosition(position: number) {
		this.#position = position;
	}
	movePosition(by: number) {
		this.#position += by;
	}
	save() {
		if (this.#savedPosition !== undefined) {
			console.warn('There already is a saved position!');
		}
		this.#savedPosition = this.#position;
	}
	restore() {
		if (this.#savedPosition === undefined) {
			throw new Error(`Position must be saved before it can be restored.`);
		}
		this.#position = this.#savedPosition;
		this.#savedPosition = undefined;
	}
}