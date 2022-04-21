const randomModel = ((...a) => a[Math.random() * a.length | 0])("koko", "dai", "sphere", "room");
const { default: model } = await import(`./${randomModel}.js`);

const $canvas = document.querySelector('canvas');
const canvasContext = $canvas.getContext("2d");
const $framebuffer = document.createElement("canvas");
const context = $framebuffer.getContext('2d');

const width = 128;
const height = 128;

$canvas.width = width * 4;
$canvas.height = height * 4;
$framebuffer.width = width;
$framebuffer.height = height;

function vertexShader(rot) {
  const p = Math.PI / 2;
  const r = Math.round(rot / p);
  return model.map(vertex => {
    return {
      ...vertex,
      z: -Math.sin(r) * vertex.x + Math.cos(r) * vertex.z,
      x: Math.cos(r) * vertex.x + Math.sin(r) * vertex.z,
    };
  });
}

let rot = 0;

function render() {
  context.clearRect(0, 0, width, height);
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;
  let vertices = vertexShader(rot);
  vertices = vertices.map(vertex => ({
    ...vertex,
    x: vertex.x + width / 2,
    y: height - (vertex.y + height / 2),
  }));
  const vm = new Map();
  vertices.forEach(vertex => {
    const key = `${Math.round(vertex.x)}|${Math.round(vertex.y)}`;
    if (!vm.has(key)) {
      vm.set(key, vertex);
    } else {
      const v = vm.get(key);
      if (v.z > vertex.z) {
        vm.set(key, vertex);
      }
    }
  });
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (x + y * width) * 4;
      const v = vm.get(`${x}|${y}`);
      if (!v) continue;
      data[index + 0] = v.r;
      data[index + 1] = v.g;
      data[index + 2] = v.b;
      data[index + 3] = 255;
    }
  }
  rot += 0.05;
  context.putImageData(imageData, 0, 0);
  canvasContext.imageSmoothingEnabled = false;
  canvasContext.clearRect(0, 0, width * 4, height * 4);
  canvasContext.drawImage($framebuffer, 0, 0, width * 4, height * 4);
  requestAnimationFrame(render);
}

render();