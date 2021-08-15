# adobe-aco

Read and create Adobe `.aco` color swatches. Implemented according to [official Adobe specs](https://www.adobe.com/devnet-apps/photoshop/fileformatashtml/).

# Usage
```
npm install adobe-aco
```
## Create an .aco file
```ts
import { createAcoFile } from 'adobe-aco';
import { saveAs } from 'file-saver';

const myAcoFile = createAcoFile([
  [[212, 30, 42], 'rgb', 'Hearty Red'],
  [[255, 140, 203], 'rgb', 'Luscious Pink'],
  [[40, 80, 148], 'rgb', 'Deep Navy'],
]);

saveAs(new Blob([myAcoFile]), 'MySwatches.aco')
```
## Read an .aco file
```ts
import { readAcoFile } from 'adobe-aco';

(async () => {
  const myAcoFile = await fetch('MySwatches.aco').then(response => response.arrayBuffer());
  const swatches = readAcoFile(myAcoFile);
  console.log(swatches[0]); // [[212, 30, 42], 'rgb', 'Hearty Red']
  console.log(swatches[1]); // [[255, 140, 203], 'rgb', 'Luscious Pink']
  console.log(swatches[2]); // [[40, 80, 148], 'rgb', 'Deep Navy']
})();
```
# API

## Types

- `Swatch` - `[number[], colorSpace, name]`

## `createAcoFile(swatches: Swatch[], preserve = false): ArrayBuffer`

Creates a new `.aco` file from the given swatches. Returns an `ArrayBuffer`;

By default, this function will assume that the swatches given to it are in standard ranges (i.e. 0÷255 for RGB, see [Color ranges](#color-ranges)) and normalize them to the 16-bit integer range used by `.aco` files. Optionally you may pass `true` as the second argument to disable this behavior.

## `readAcoFile(data: ArrayBuffer, preserve = false): Swatch[]`

Reads an .aco file, in the form of an `ArrayBuffer`. Returns an array of `Swatch`es.

By default, this function will normalize the extracted colors to a standard range (i.e. 0÷255 for RGB, see [Color ranges](#color-ranges)), as within `.aco` files they are stored as 16-bit integers. Optionally you may pass `true` as the second argument to disable this behavior.

## Color ranges

If you're not planning on using the `preserve` option then you only need the `Standardized range`.

|Color space|Standardized range|`.aco` range|
|-------|-------|-------|
|RGB|0÷255|0÷65535
|HSB|0÷360/0÷100|0÷65535
|CMYK|0÷1|0÷65535
|LAB|0÷100/-128÷127|0÷10000/-12800÷12700
|Grayscale|0÷1|0÷10000