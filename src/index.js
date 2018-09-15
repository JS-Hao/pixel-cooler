import Frameani from "frameani";
import defaultAniFn from "./defaultAniFn";
console.log(defaultAniFn);

class PixelCooler {
  constructor({ canvas, type = "normal", duration = 1000 } = {}) {
    this._canvas = canvas;
    this._duration = duration;

    this._aniFn = this._getAniFn(type);
    this._getCanvasInfo(this._canvas);

    this._frameani = new Frameani({
      value: [0, 100],
      duration: this._duration,
      render: this._getFrameaniRender(this._aniFn)
    });
  }

  _getCanvasInfo(canvas) {
    this._ctx = canvas.getContext("2d");
    this._imageData = this._ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    ).data;
  }

  _getAniFn(type) {
    const func = defaultAniFn[type];
    if (!func) {
      console.error(`PixelCooler don't have this animation type!`);
    }
    return func;
  }

  _getFrameaniRender(aniFn) {
    return progress => {
      const width = this._canvas.width,
        height = this._canvas.height,
        imageData = this._imageData,
        u8cArray = new Uint8ClampedArray(imageData.length);

      for (let i = 0; i < imageData.length; i += 4) {
        const { x, y } = this._getPixelCoordinate(i, width, height);
        const curPixel = this._getCurrentPixel(imageData, i);
        const nextPixel = this._aniFn(curPixel, progress, x, y, width, height);
        this._putDataIntoU8cArray(u8cArray, nextPixel, i);
      }

      this._reDraw(u8cArray, width, height);
    };
  }

  _reDraw(u8cArray, width, height) {
    const imageData = this._ctx.createImageData(width, height);
    imageData.data.set(u8cArray);
    this._ctx.putImageData(imageData, 0, 0);
  }

  _putDataIntoU8cArray(u8cArray, pixel, i) {
    u8cArray[i] = pixel.r;
    u8cArray[i + 1] = pixel.g;
    u8cArray[i + 2] = pixel.b;
    u8cArray[i + 3] = pixel.a;
  }

  _getCurrentPixel(imageData, i) {
    return {
      r: imageData[i],
      g: imageData[i + 1],
      b: imageData[i + 2],
      a: imageData[i + 3]
    };
  }

  _getPixelCoordinate(i, width, height) {
    const index = i / 4;
    return {
      x: index % width,
      y: parseInt(index / width)
    };
  }

  play() {
    this._frameani.play();
  }

  stop() {
    this._frameani.stop();
  }

  end() {
    this._frameani.end();
  }

  reset() {
    this._frameani.reset();
  }
}

PixelCooler.custom = function(name, func) {
  if (typeof name !== "string") {
    console.error(`'PixelCooler.custom': the name's type should be a string!`);
  }

  if (typeof func !== "function") {
    console.error(
      `'PixelCooler.custom': the function's type should be a function!`
    );
  }

  defaultAniFn[name] = func;
  return true;
};

export { PixelCooler };

export default PixelCooler;
