# UI Design Tutorial

“借鉴”流行的大众化 APP 应用是非常有必要的，设计规范与交互模式值得参考，皆因其被养成的**用户习惯**。包括但不限于：

+ [Material Design](https://material.io/design)
+ Bootstrap Layout/Content
+ 某些坐拥巨大用户的 APP；安卓系统、Feedly、Feedme、RSS阅读器等。
+ 某处看到的不知名设计...

## Principles

**Simple, simple and simple!**

用户体验至上。系统原生，技术限制之外。

As a real user. 不应该把功能“设计”（塞）给用户，而是把自己当成真正的用户，我需要这样的功能，于是这样设计。

Progressive enhancement. 事实上，很多时候仅仅有这个功能就够了，大家并不关心其它的各种“奇奇怪怪的东西”。产品的核心功能 > 便捷的、可简化的设计 > ~~增强体验才必要添加的~~ > ~~所谓的“闭环”、丰富多彩化~~ > ~~商业化、广告~~。

标准化。成套的颜色体系主题，排版...

## Start

Use html and css to design directly. All in one `html`.

Start a local server, auto reload `.html` after it changes:

```bash
$ node UIDesign/server.js
  UIDesignServer start ==> http://localhost:8010 +0ms
  UIDesignServer GET / +4s
  UIDesignServer GET /livereload +271ms
  UIDesignServer watch '/index.html' +4ms
  UIDesignServer reload +15s
```
