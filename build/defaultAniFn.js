export default {
  normal: function normal() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        progress = _ref.progress,
        blockPixelArr = _ref.blockPixelArr,
        x = _ref.x,
        y = _ref.y,
        width = _ref.width,
        height = _ref.height,
        blockWidth = _ref.blockWidth,
        blockHeight = _ref.blockHeight;

    return blockPixelArr;
  },

  wave: function wave() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        progress = _ref2.progress,
        blockPixelArr = _ref2.blockPixelArr,
        x = _ref2.x,
        y = _ref2.y,
        width = _ref2.width,
        height = _ref2.height,
        blockWidth = _ref2.blockWidth,
        blockHeight = _ref2.blockHeight;

    var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        preColor = _ref3.preColor,
        nextColor = _ref3.nextColor;

    var color = void 0;
    if (x / width - progress <= 0 && Math.random() - Math.pow(progress, 6) < Math.abs(x / width - progress) * 2) {
      color = {
        r: nextColor[0],
        g: nextColor[1],
        b: nextColor[2],
        a: nextColor[3]
      };
    } else {
      color = {
        r: preColor[0],
        g: preColor[1],
        b: preColor[2],
        a: preColor[3]
      };
    }

    return blockPixelArr.map(function (pixel) {
      return color;
    });
  },

  fadeIn: function fadeIn(opt) {
    var progress = opt.progress,
        blockPixelArr = opt.blockPixelArr,
        x = opt.x,
        y = opt.y,
        width = opt.width,
        height = opt.height,
        blockWidth = opt.blockWidth,
        blockHeight = opt.blockHeight;

    var a = Math.random() < progress ? 0 : 255;
    blockPixelArr.forEach(function (pixel) {
      return pixel.a = a;
    });
    return blockPixelArr;
  },

  granularCutInLeft: function granularCutInLeft(opt) {
    var progress = opt.progress,
        blockPixelArr = opt.blockPixelArr,
        x = opt.x,
        y = opt.y,
        width = opt.width,
        height = opt.height,
        blockWidth = opt.blockWidth,
        blockHeight = opt.blockHeight;


    var a = Math.random() < progress ? 255 : 0;
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    var shouldChange = x / width <= progress;

    blockPixelArr.forEach(function (pixel) {
      pixel.r = shouldChange ? r : pixel.r;
      pixel.g = shouldChange ? g : pixel.g;
      pixel.b = shouldChange ? b : pixel.b;
      pixel.a = shouldChange ? a : 0;
    });

    return blockPixelArr;
  }
};