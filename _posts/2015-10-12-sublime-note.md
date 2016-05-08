---
title: sublime笔记
categories: [开发工具]
tags: [sublime]
sitemap:
   lastmod: 2015-9-18T12:49:30-05:00
---


先安装Package Control
=====================================================================

* 参考 [Package Control插件官网](https://packagecontrol.io/installation)
* 之后就可以按ctrl+shift+p调出超级对话框






推荐插件
=====================================================================

Emmet
-----------------------------------

zencoding



SublimeLinter
-----------------------------------

语法检查



SideBarEnhancements
-----------------------------------

增加的文件浏览侧边栏



Git
-----------------------------------

* 若操作系统中未安装git，则需在插件的配置文件中为“git_command”配置git程序所在的路径
* 按ctrl+shift+p，输入git后，选择相应的子命令即可调用



MarkdownEditing
-----------------------------------

安装后配置

* 关联md

打开一篇md文档后，选择菜单 View > Syntax > Open all with current extension as 关联至此插件

* 配置

选择菜单Preferences > Package Settings > Markdown Editing > Markdown GFM Editing - Users，增加以下配置
```json
//使用黑色皮肤
"color_scheme": "Packages/MarkdownEditing/MarkdownEditor-Dark.tmTheme",

//全屏显示
"draw_centered": false,

//不限行宽
"wrap_width": null,
```






参考
=====================================================================

[Sublime Text 3 支持的热门插件推荐](http://www.imjeff.cn/blog/146/)