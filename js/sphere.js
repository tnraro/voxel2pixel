const sphere = [];
const r = 10;
for (let y = -64; y < 64; y ++) {
  for (let x = -64; x < 64; x ++) {
    for (let z = -64; z < 64; z ++) {
      if (x * x + y * y + z * z <= r * r && x * x + y * y + z * z > r * (r - 4)) {
        sphere.push({
          x, y, z,
          r: (x + r / 2) / r * 0xff | 0,
          g: (y + r / 2) / r * 0xff | 0,
          b: (z + r / 2) / r * 0xff | 0,
          priority: 0,
        });
      }
    }
  }
}
export default sphere;