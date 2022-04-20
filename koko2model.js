const fs = require("fs");

const name = "dai";

const buffer = fs.readFileSync(`./${name}.bmp`);

console.log(buffer);

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

// 원래라면 padding 계산해야하지만 난 천재라서 4로 딱 나누어 떨어지게 만들었지 하하.
// 그래서 padding 없습니다.
const w = 10;
const vertices = [];
for (let i = 0; i < (size / 3); i++) {
  const b = raw.readUInt8(i * 3);
  const g = raw.readUInt8(i * 3 + 1);
  const r = raw.readUInt8(i * 3 + 2);
  console.log(r, g, b);
  const isBackground = r === 0xb5 && g === 0xe6 && b === 0x1d;
  if (isBackground) continue;
  const x = (i % width) % w - 2;
  const y = (i / width | 0) - 4;
  const z = ((i % width) / w | 0) - 4;
  // const isEye = r === 0 && g === 0 && b === 0;
  vertices.push(
    `{ x: ${x}, y: ${y}, z: ${z}, r: ${r}, g: ${g}, b: ${b}, priority: ${0} }`
  );
}
fs.writeFileSync(`${name}.js`, `var ${name} = [${vertices.join(",")}]`);