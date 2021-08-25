import { createAcoFile, readAcoFile } from '../build/index.js';
import * as fs from 'fs';
import assert from 'assert';

const testFileBuffer = fs.readFileSync('./test/swatches.aco');
const testFileArrayBuffer = testFileBuffer.buffer.slice(
	testFileBuffer.byteOffset,
	testFileBuffer.byteOffset + testFileBuffer.byteLength
);
const testFileContents = [
  [[212, 30, 42], 'rgb', 'Hearty Red'],
  [[255, 140, 203], 'rgb', 'Luscious Pink'],
  [[40, 80, 148], 'rgb', 'Deep Navy'],
];

describe('readAcoFile', () => {
	it('reads the contents of an .aco file', () => {
		const parsedData = readAcoFile(testFileArrayBuffer);
		assert.deepStrictEqual(parsedData, testFileContents);
	});
});

describe('createAcoFile', () => {
	it('creates binary data of an .aco file', () => {
		const createdData = createAcoFile(testFileContents);
		assert.deepStrictEqual(createdData, testFileArrayBuffer);
	});
});
