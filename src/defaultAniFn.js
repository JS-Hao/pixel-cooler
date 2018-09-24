export default {
  normal: function(pixel) {
    return pixel;
  },

  gridCutIn: function(pixel, progress, x, y, width, height) {
    const value = progress * 255;
    if (
      y / height < value / 255 &&
      parseInt(y / 5) % 2 === 0 &&
      x / width < value / 255 &&
      parseInt(x / 5) % 2 === 0
    ) {
      pixel.a = value;
    } else {
      pixel.a = 0;
    }
    return pixel;
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
