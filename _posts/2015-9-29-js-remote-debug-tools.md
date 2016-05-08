---
title: js远程调试工具
categories: [开发工具]
tags: [js, 调试]
sitemap:
    lastmod: 2015-9-29T12:49:30-05:00
---


# weinre

##  安装
    npm install weinre -g

##  启动服务端
    weinre --httpPort 7123 --boundHost -all-

##  启动客户端

*    在客户端页面中嵌入服务端页面所提示的脚本

*    打开客户端页面

##  调试

*    打开页面
      http://localhost:7123

*    选择连接后即可在各选项卡中查看各类信息


# jsconsole

##  免安装

##  启动服务端

*    打开页面
      http://jsconsole.com

*    在页面中输入指令
      :listen

##  启动客户端

*    在客户端页面中嵌入服务端页面所提示的脚本

*    打开客户端页面

##  调试

    在服务端页面中输入js对象名会得到相应的信息