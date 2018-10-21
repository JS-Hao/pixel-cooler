import Frameani from "frameani";
import defaultAniFn from "./defaultAniFn";

class PixelCooler {
  constructor({ canvas, type = "normal", duration = 1000, blockWidth = 1, blockHeight = 1, timingFunction = 'linear' } = {}) {
    this._canvas = canvas;
    this._duration = duration;
    this._aniFn = this._getAniFn(type);
    this._eventsQueue = this._initEventsQueue();
    this._blockWidth = blockWidth;
    this._blockHeight = blockHeight;
    this._timingFunction = timingFunction;
    this._getCanvasInfo(this._canvas);
    this._extraProps = {};

    this._frameani = new Frameani({
      value: [0, 1],
      duration: this._duration,
      timingFunction: this._timingFunction,
      render: this._getFrameaniRender(this._aniFn)
    });
  }

  _initEventsQueue() {
    return {
      play: [],
      end: [],
      stop: [],
      reset: [],
    };
  }

  _getCanvasInfo(canvas) {
    this._ctx = canvas.getContext("2d");
    this._imageDataArr = this._ctx.getImageData(
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
        imageDataArr = this._imageDataArr,
        u8cArray = new Uint8ClampedArray(imageDataArr.length),
        blockWidth = this._blockWidth,
        blockHeight = this._blockHeight;

      const loopFn = opt => {
        const updatedBlockPixelArr = this._aniFn(opt, this._extraProps);
        this._putDataIntoU8cArray(u8cArray, updatedBlockPixelArr, opt.x, opt.y, opt.blockWidth, opt.blockHeight);
      }
      this._loopImageDataByBlockPixel(blockWidth, blockHeight, loopFn, progress);
      this._reDraw(u8cArray, width, height);
    };
  }

  _reDraw(u8cArray, width, height) {
    const imageData = this._ctx.createImageData(width, height);
    imageData.data.set(u8cArray);
    this._ctx.putImageData(imageData, 0, 0);
  }

  _getCurrentPixel(imageDataArr, i) {
    return {
      r: imageDataArr[i],
      g: imageDataArr[i + 1],
      b: imageDataArr[i + 2],
      a: imageDataArr[i + 3]
    };
  }

  /**
   * 将已更新的像素块数据写入像素暂存区中
   * @param  {Array} u8cArray             像素暂存区，每次更新canvas的过程，实际上都是将像素暂存区的数据推入canvas的ImageData的过程
   * @param  {Array} updatedBlockPixelArr 已更新的像素块
   * @param  {Number} x                   像素块的左上角x坐标
   * @param  {Number} y                   像素块的左上角y坐标
   * @param  {Number} blockWidth          像素块的宽度
   * @param  {Number} blockHeight         像素块的高度
   */
  _putDataIntoU8cArray(u8cArray, updatedBlockPixelArr, x, y, blockWidth, blockHeight) {
    for (let i = y; i < y + blockHeight; i++) {
      for (let j = x; j < x + blockWidth; j++) {
        const k = (i * this._canvas.width + j) * 4;
        const z = ((i - y) * blockWidth + (j - x));

        u8cArray[k] = updatedBlockPixelArr[z].r;
        u8cArray[k + 1] = updatedBlockPixelArr[z].g;
        u8cArray[k + 2] = updatedBlockPixelArr[z].b;
        u8cArray[k + 3] = updatedBlockPixelArr[z].a;
      }
    }
  }

  _getBlockPixel(x, y, blockWidth, blockHeight) {
    const arr = [],
      imageDataArr = this._imageDataArr;

    for (let i = y; i < y + blockHeight; i++) {
      for (let j = x; j < x + blockWidth; j++) {
        const k = (i * this._canvas.width + j) * 4;
        arr.push({
          r: imageDataArr[k],
          g: imageDataArr[k + 1],
          b: imageDataArr[k + 2],
          a: imageDataArr[k + 3],
        });
      }
    }
    return arr;
  }

  _loopImageDataByBlockPixel(blockWidth, blockHeight, loopFn, progress) {
    const imageDataArr = this._imageDataArr,
      width = this._canvas.width,
      height = this._canvas.height;
    for (let y = 0; y < height; y += blockHeight) {
      for (let x = 0; x < width; x += blockWidth) {
        const blockPixelArr = this._getBlockPixel(x, y, blockWidth, blockHeight);
        loopFn({
          progress,
          blockPixelArr,
          x,
          y, 
          width, 
          height,
          blockWidth,
          blockHeight,
        })
      }
    }
  } 

  _getPixelCoordinate(i, width, height) {
    const index = i / 4;
    return {
      x: index % width,
      y: parseInt(index / width)
    };
  }

  _fireEventsCallback(eventName) {
    this._eventsQueue[eventName].forEach(fn => fn());
  }

  play(extraProps = {}) {
    this._extraProps = extraProps;
    this._fireEventsCallback('play');
    this._frameani.play();
    return this;
  }

  stop() {
    this._fireEventsCallback('stop');
    this._frameani.stop();
    return this;
  }

  end() {
    this._fireEventsCallback('end');
    this._frameani.end();
    return this;
  }

  reset() {
    this._fireEventsCallback('reset');
    this._frameani.reset();
    return this;
  }

  on(eventName, callback) {
    if (this._eventsQueue[eventName]) {
      this._eventsQueue[eventName].push(callback);
    }
    return this;
  }

  off(eventName, callback) {
    if (callback && typeof callback === 'function') {
      const list = this._eventsQueue[eventName];
      this._eventsQueue[eventName] = list.filter(fn => fn !== callback);
    } else {
      this._eventsQueue[eventName] = [];
    }
    return this;
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
