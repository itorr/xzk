# 👀「斜着看生成器」充电口斜着看文字图片生成工具
充电口斜着看文字图片生成器

https://lab.magiconch.com/xzk/

写了个很老的东西😨

## GitHub
https://github.com/itorr/xzk

## 使用了

 - 锐字真言体免费商用 [http://reeji.com/](http://reeji.com/font/da832bda4ceec4dfa51419a0bb6b467c)
 - GLFX.js [@evanw/glfx.js](https://github.com/evanw/glfx.js)

## 记录
一直想实现透视变形，看到斜着看里正好需要用到于是再试试。

基础的 canvas 2D API 并没有办法实现透视扭曲，考虑实现效率至少需要用到 webGL，找了一圈 暂时用的 `glfx.js` 
<!-- [demo](https://evanw.github.io/glfx.js/demo/#perspective) -->

但这个库封装的比较彻底，没法指定画布长宽之类的任何细节，只能生成纹理时确定宽高之后透视变形，再把透视变形过的画布画到最终输出画面中
