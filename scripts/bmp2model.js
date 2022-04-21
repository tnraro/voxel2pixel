const fs = require("fs");
const path = require("path");

const [_, __, name, _w] = process.argv;

const w = parseInt(_w);

const buffer = fs.readFileSync(path.join(__dirname, `../assets/${name}.bmp`));

console.log(buffer.slice(0, 2).toString("ascii"));
console.log("size", buffer.readInt32LE(2));
const offset = buffer.readInt32LE(10);
console.log("offset", offset);

const width = buffer.readInt32LE(18);
const height = buffer.readInt32LE(22);
const bpp = buffer.readInt16LE(28);
const size = buffer.readInt32LE(34);
const Bpp = bpp / 8;

console.log("width", width);
console.log("height", height);
console.log("bpp", bpp);
console.log("size", size);

const raw = buffer.slice(offset, offset + size);

const widthWithPadding = size / height;

const vertices = [];
for (let k = 0; k < height; k ++) {
  for (let j = 0; j < width; j ++) {
    const i = k * widthWithPadding + j * Bpp;
    const b = raw.readUInt8(i);
    const g = raw.readUInt8(i + 1);
    const r = raw.readUInt8(i + 2);
    const isBackground = r === 0xb5 && g === 0xe6 && b === 0x1d;
    if (isBackground) continue;
    const x = j % w - (w / 2 | 0);
    const y = k - (height / 2 | 0);
    const z = (j / w | 0) - (width / w / 2 | 0);
    vertices.push(
      `{ x: ${x}, y: ${y}, z: ${z}, r: ${r}, g: ${g}, b: ${b}, priority: ${0} }`
    );
  }
}
fs.writeFileSync(path.join(__dirname, `../js/${name}.js`), `export default [
  ${vertices.join(",\n\t")},
];`);