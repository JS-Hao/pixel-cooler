export default {
  normal: function({
    progress,
    blockPixelArr,
    x,
    y, 
    width, 
    height,
    blockWidth,
    blockHeight,
  } = {}) {
    return blockPixelArr;
  },

  wave: function({
    progress,
    blockPixelArr,
    x,
    y, 
    width, 
    height,
    blockWidth,
    blockHeight,
  } = {}, {
    preColor,
    nextColor
  } = {}) {
    let color;
    if (x / width - progress <= 0 && (Math.random() - Math.pow(progress, 6)) < Math.abs(x / width - progress) * 2) {
      color = {
        r: nextColor[0],
        g: nextColor[1],
        b: nextColor[2],
        a: nextColor[3],
      };
    } else {
      color = {
        r: preColor[0],
        g: preColor[1],
        b: preColor[2],
        a: preColor[3],
      };
    }

    return blockPixelArr.map(pixel => color);
  },

  fadeIn: function(opt) {
    const {
      progress,
      blockPixelArr,
      x,
      y, 
      width, 
      height,
      blockWidth,
      blockHeight,
    } = opt;
    const a = Math.random() < progress ? 255 : 0;
    blockPixelArr.forEach(pixel => (pixel.a = a));
    return blockPixelArr;
  },

  granularCutInLeft: function(opt) {
    const {
      progress,
      blockPixelArr,
      x,
      y, 
      width, 
      height,
      blockWidth,
      blockHeight,
    } = opt;

    const a = Math.random() < progress ? 255 : 0;
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    const shouldChange = x / width <= progress;

    blockPixelArr.forEach(pixel => {
      pixel.r = shouldChange ? r : pixel.r;
      pixel.g = shouldChange ? g : pixel.g;
      pixel.b = shouldChange ? b : pixel.b;
      pixel.a = shouldChange ? a : 0;
    })
  
    return blockPixelArr;
  } 
};
