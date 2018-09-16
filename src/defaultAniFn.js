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

  granularCutInLeft: function(pixel, progress, x, y, width, height) {
    if (x / width <= progress) {
      pixel.a = Math.random() < progress ? pixel.a : 0;    
    } else {
      pixel.a = 0;
    }
    return pixel;
  } 
};
