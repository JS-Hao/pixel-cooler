# PixelCooler

PixelCooler是一个轻量的canvas像素动画库，它可以帮助你实现像素级别的炫酷动画特效！

PixelCooler具备以下特征：

* 已内置多种动画特效类型，开箱即用
* 高自由度，你完全可以自定义一个属于你自己的动画特效
* 具备基本的动画事件和回调

关键词：animation canvas pixel

## DEMO

[在线demo展示(拓展中)](https://js-hao.github.io/pixel-cooler)

## 快速开始

### 安装

```
npm i pixel-cooler
```

### 代码示例

以下简单的代码即可在canvas画布上实现一个“wave粒子切入”的动画特效：

```javascript
import PixelCooler from 'pixel-cooler';

const canvas = document.querySelector('#canvas');
const pixelCooler = new PixelCooler({
	canvas: canvas,
	type: 'wave',
	duration: 3000,
});

pixelCooler.play({
  preColor: [255, 165, 0, 255],
  nextColor: [0, 0, 128, 255]
});

```

## 自定义像素动画特效

如果你对内置的动画特效不满意，或者想创建一个独一无二的属于你自己的动画特效，PixelCooler能够满足你，你唯一需要做的，就是阅读这篇文档[如何创建属于自己的像素动画特效？(施工中...)](https://github.com/JS-Hao/pixel-cooler)，跟着实例走，即可逐步实现。

## API

### Class: PixelCooler

#### new PixelCooler(options)

* **options**  `object` 参数如下：
  * **canvas** `object` 用于渲染动画的canvas元素
  * **type** `string` 动画特效类型，**Default: ** `normal`
  * **duration** `number` 动画时长，**Default: ** `1000`ms
* **returns** `PixelCooler` 创建一个PixelCooler实例


### pixelCooler.on(name, callback)

* **name** `string` 事件名称
* **callback** `function` 响应事件
* **returns** `PixelCooler` pixelCooler自身

可监听事件且响应回调函数

### pixelCooler.off(name, [callback])

* **name** 要移除的事件名
* ***callback* [可选] 移除的函数，若指定了函数，则移除该函数，若无该参数，则默认移除掉该事件上所有监听的回调函数
* **returns** `PixelCooler` pixelCooler自身

移除指定事件下的回调函数

### pixelCooler.play([options])

* **options** 动画播放相关参数，不同种类动画的参数可能不同
* **returns**  `PixelCooler` pixelCooler自身

播放动画


### pixelCooler.stop()

* **returns**  `PixelCooler` pixelCooler自身

暂停动画


### pixelCooler.end()

* **returns**  `PixelCooler` pixelCooler自身

结束动画


### pixelCooler.reset()

* **returns**  `PixelCooler` pixelCooler自身

重置动画


### PixelCooler.custom(type, renderFunction)

* **type** `string` 自定义动画特效名称
* **renderFunction** `Function` 自定义像素渲染函数

