var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import Frameani from "frameani";
import defaultAniFn from "./defaultAniFn";

var PixelCooler = function () {
  function PixelCooler() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        canvas = _ref.canvas,
        _ref$type = _ref.type,
        type = _ref$type === undefined ? "normal" : _ref$type,
        _ref$duration = _ref.duration,
        duration = _ref$duration === undefined ? 1000 : _ref$duration,
        _ref$blockWidth = _ref.blockWidth,
        blockWidth = _ref$blockWidth === undefined ? 1 : _ref$blockWidth,
        _ref$blockHeight = _ref.blockHeight,
        blockHeight = _ref$blockHeight === undefined ? 1 : _ref$blockHeight,
        _ref$timingFunction = _ref.timingFunction,
        timingFunction = _ref$timingFunction === undefined ? 'linear' : _ref$timingFunction;

    _classCallCheck(this, PixelCooler);

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

  _createClass(PixelCooler, [{
    key: "_initEventsQueue",
    value: function _initEventsQueue() {
      return {
        play: [],
        end: [],
        stop: [],
        reset: []
      };
    }
  }, {
    key: "_getCanvasInfo",
    value: function _getCanvasInfo(canvas) {
      this._ctx = canvas.getContext("2d");
      this._imageDataArr = this._ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    }
  }, {
    key: "_getAniFn",
    value: function _getAniFn(type) {
      var func = defaultAniFn[type];
      if (!func) {
        console.error("PixelCooler don't have this animation type!");
      }
      return func;
    }
  }, {
    key: "_getFrameaniRender",
    value: function _getFrameaniRender(aniFn) {
      var _this = this;

      return function (progress) {
        var width = _this._canvas.width,
            height = _this._canvas.height,
            imageDataArr = _this._imageDataArr,
            u8cArray = new Uint8ClampedArray(imageDataArr.length),
            blockWidth = _this._blockWidth,
            blockHeight = _this._blockHeight;

        var loopFn = function loopFn(opt) {
          var updatedBlockPixelArr = _this._aniFn(opt, _this._extraProps);
          _this._putDataIntoU8cArray(u8cArray, updatedBlockPixelArr, opt.x, opt.y, opt.blockWidth, opt.blockHeight);
        };
        _this._loopImageDataByBlockPixel(blockWidth, blockHeight, loopFn, progress);
        _this._reDraw(u8cArray, width, height);
      };
    }
  }, {
    key: "_reDraw",
    value: function _reDraw(u8cArray, width, height) {
      var imageData = this._ctx.createImageData(width, height);
      imageData.data.set(u8cArray);
      this._ctx.putImageData(imageData, 0, 0);
    }
  }, {
    key: "_getCurrentPixel",
    value: function _getCurrentPixel(imageDataArr, i) {
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

  }, {
    key: "_putDataIntoU8cArray",
    value: function _putDataIntoU8cArray(u8cArray, updatedBlockPixelArr, x, y, blockWidth, blockHeight) {
      for (var i = y; i < y + blockHeight; i++) {
        for (var j = x; j < x + blockWidth; j++) {
          var k = (i * this._canvas.width + j) * 4;
          var z = (i - y) * blockWidth + (j - x);

          u8cArray[k] = updatedBlockPixelArr[z].r;
          u8cArray[k + 1] = updatedBlockPixelArr[z].g;
          u8cArray[k + 2] = updatedBlockPixelArr[z].b;
          u8cArray[k + 3] = updatedBlockPixelArr[z].a;
        }
      }
    }
  }, {
    key: "_getBlockPixel",
    value: function _getBlockPixel(x, y, blockWidth, blockHeight) {
      var arr = [],
          imageDataArr = this._imageDataArr;

      for (var i = y; i < y + blockHeight; i++) {
        for (var j = x; j < x + blockWidth; j++) {
          var k = (i * this._canvas.width + j) * 4;
          arr.push({
            r: imageDataArr[k],
            g: imageDataArr[k + 1],
            b: imageDataArr[k + 2],
            a: imageDataArr[k + 3]
          });
        }
      }
      return arr;
    }
  }, {
    key: "_loopImageDataByBlockPixel",
    value: function _loopImageDataByBlockPixel(blockWidth, blockHeight, loopFn, progress) {
      var imageDataArr = this._imageDataArr,
          width = this._canvas.width,
          height = this._canvas.height;
      for (var y = 0; y < height; y += blockHeight) {
        for (var x = 0; x < width; x += blockWidth) {
          var blockPixelArr = this._getBlockPixel(x, y, blockWidth, blockHeight);
          loopFn({
            progress: progress,
            blockPixelArr: blockPixelArr,
            x: x,
            y: y,
            width: width,
            height: height,
            blockWidth: blockWidth,
            blockHeight: blockHeight
          });
        }
      }
    }
  }, {
    key: "_getPixelCoordinate",
    value: function _getPixelCoordinate(i, width, height) {
      var index = i / 4;
      return {
        x: index % width,
        y: parseInt(index / width)
      };
    }
  }, {
    key: "_fireEventsCallback",
    value: function _fireEventsCallback(eventName) {
      this._eventsQueue[eventName].forEach(function (fn) {
        return fn();
      });
    }
  }, {
    key: "play",
    value: function play() {
      var extraProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this._extraProps = extraProps;
      this._fireEventsCallback('play');
      this._frameani.play();
      return this;
    }
  }, {
    key: "stop",
    value: function stop() {
      this._fireEventsCallback('stop');
      this._frameani.stop();
      return this;
    }
  }, {
    key: "end",
    value: function end() {
      this._fireEventsCallback('end');
      this._frameani.end();
      return this;
    }
  }, {
    key: "reset",
    value: function reset() {
      this._fireEventsCallback('reset');
      this._frameani.reset();
      return this;
    }
  }, {
    key: "on",
    value: function on(eventName, callback) {
      if (this._eventsQueue[eventName]) {
        this._eventsQueue[eventName].push(callback);
      }
      return this;
    }
  }, {
    key: "off",
    value: function off(eventName, callback) {
      if (callback && typeof callback === 'function') {
        var list = this._eventsQueue[eventName];
        this._eventsQueue[eventName] = list.filter(function (fn) {
          return fn !== callback;
        });
      } else {
        this._eventsQueue[eventName] = [];
      }
      return this;
    }
  }]);

  return PixelCooler;
}();

PixelCooler.custom = function (name, func) {
  if (typeof name !== "string") {
    console.error("'PixelCooler.custom': the name's type should be a string!");
  }

  if (typeof func !== "function") {
    console.error("'PixelCooler.custom': the function's type should be a function!");
  }

  defaultAniFn[name] = func;
  return true;
};

export { PixelCooler };

export default PixelCooler;