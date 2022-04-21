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

console.log("width", width);
console.log("height", height);
console.log("bpp", bpp);
console.log("size", size);

const raw = buffer.slice(offset, offset + size);

// TODO: padding 고려
const vertices = [];
for (let i = 0; i < (size / 3); i++) {
  const b = raw.readUInt8(i * 3);
  const g = raw.readUInt8(i * 3 + 1);
  const r = raw.readUInt8(i * 3 + 2);
  const isBackground = r === 0xb5 && g === 0xe6 && b === 0x1d;
  if (isBackground) continue;
  const x = (i % width) % w - 2;
  const y = (i / width | 0) - 4;
  const z = ((i % width) / w | 0) - 4;
  vertices.push(
    `{ x: ${x}, y: ${y}, z: ${z}, r: ${r}, g: ${g}, b: ${b}, priority: ${0} }`
  );
}
fs.writeFileSync(path.join(__dirname, `../js/${name}.js`), `export default [
  ${vertices.join(",\n\t")},
];`);