---
title: 架构shadowsocks
categories: [net]
sitemap:
lastmod: 2016-7-4T20:03
---

主题
=====================================================

  架设ShadowSocks







买VPS
=====================================================

* virmach
* Bandwagonhost







配置系统
=====================================================

安装CentOS6.5







安装ServerSpeeder
=====================================================

*  将系统内核更换成匹配的版本
*  安装ServerSpeeder







搭shadowsocks服务
=====================================================

``` bash

wget https://bootstrap.pypa.io/get-pip.py
python get-pip.py
pip install shadowsocks

```







开启防火墙
=====================================================







运行shadowsocks服务
=====================================================

ssserver -k <密码>