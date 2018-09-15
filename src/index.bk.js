const { Frameani } = require("frameani");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = require("./image/timg.jpg");
img.onload = function() {
  console.log(canvas.width);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  console.time("getImageData");
  console.log(ctx.getImageData(0, 0, canvas.width, canvas.height));
  console.timeEnd("getImageData");

  console.time("createImageData");
  console.log(ctx.createImageData(canvas.width, canvas.height));
  console.timeEnd("createImageData");

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  console.log(imageData);

  const frameani = new Frameani({
    value: [0, 255],
    duration: 3000,
    onEnd: () => {
      frameani.reset();
      frameani.play();
    },
    render: function(value) {
      const u8cArray = new Uint8ClampedArray(imageData.length);
      const width = canvas.width,
        height = canvas.height;

      for (let i = 0; i < imageData.length; i += 4) {
        const index = i / 4;
        const x = index % width;
        const y = parseInt(index / width);

        const { r, g, b, a } = updateOnePixel(x, y, width, height, value, {
          r: imageData[i],
          g: imageData[i + 1],
          b: imageData[i + 2],
          a: imageData[i + 3]
        });

        u8cArray[i] = r;
        u8cArray[i + 1] = g;
        u8cArray[i + 2] = b;
        u8cArray[i + 3] = a;
      }

      const tempData = ctx.createImageData(canvas.width, canvas.height);
      tempData.data.set(u8cArray);
      // console.log(tempData);
      ctx.putImageData(tempData, 0, 0);
    }
  });

  frameani.play();
};

function updateOnePixel(x, y, width, height, value, pixel) {
  // const rx = Math.abs(width / 2 - x) / (width / 2);
  // const ry = Math.abs(height / 2 - y) / (height / 2);
  if (
    y / height < value / 255 &&
    parseInt(y / 2) % 2 === 0 &&
    x / width < value / 255 &&
    parseInt(x / 2) % 2 === 0
  ) {
    pixel.a = value;
  } else {
    pixel.a = 0;
  }
  // if (parseInt(y / 5) % 2 === 0) {
  //   // pixel.a = value - rx * ry * 255;
  //   const temp = value * (1 + parseInt(y / 5) / (height / 10));
  //   pixel.a = temp > 0 ? temp : 0;
  // } else {
  //   pixel.a = 0;
  // }

  return pixel;
}
