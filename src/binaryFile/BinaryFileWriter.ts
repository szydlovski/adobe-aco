import { concatBuffers, encodeUtf16BE } from "./helpers.js";

export class BinaryFileWriter {
	#buffer: ArrayBuffer;
	#view: DataView;
	#position = 0;
	public constructor() {
		this.#buffer = new ArrayBuffer(0);
		this.#view = new DataView(this.#buffer);
	}
	public get buffer() {
		return this.#buffer;
	}
	public logpos() {
		console.log(this.position);
		
	}
	private get view() {
		if (this.#view.buffer !== this.#buffer) {
			this.#view = new DataView(this.#buffer);
		}
		return this.#view;
	}
	private get position() {
		return this.#position;
	}
	public movePosition(by: number) {
		this.#position += by;
	}
	public setPosition(position: number) {
		this.#position = position;
	}
	private enlarge(bytes: number) {
		this.#buffer = concatBuffers(this.#buffer, new ArrayBuffer(bytes));
	}
	private write(performWrite: () => void, requiredBytes: number) {
		const bytesAfterWrite = this.position + requiredBytes;
		const freeBytes = this.view.byteLength - bytesAfterWrite;
		if (freeBytes < 0) {
			this.enlarge(Math.abs(freeBytes));
		}
		performWrite();
		this.movePosition(requiredBytes);
	}
	public writeInt8(value: number) {
		this.write(() => this.view.setInt8(this.position, value), 1);
	}
	public writeUint8(value: number) {
		this.write(() => this.view.setUint8(this.position, value), 1);
	}
	public writeInt16(value: number) {
		this.write(() => this.view.setInt16(this.position, value), 2);
	}
	public writeUint16(value: number) {
		this.write(() => this.view.setUint16(this.position, value), 2);
	}
	public writeInt32(value: number) {
		this.write(() => this.view.setInt32(this.position, value), 4);
	}
	public writeUint32(value: number) {
		this.write(() => this.view.setUint32(this.position, value), 4);
	}
	public writeBytes(buffer: ArrayBuffer) {
		const bytesView = new Uint8Array(buffer);
		for (const byte of bytesView) {
			this.writeUint8(byte);
		}
	}
	public writeAdobeUnicodeString(value: string) {
		const length = value.length;
		this.writeInt32(length + 1);
		this.writeBytes(encodeUtf16BE(value));
		this.writeInt16(0);
	}
}