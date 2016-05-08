---
title: 包管理工具
categories: [开发工具]
sitemap:
lastmod: 2015-9-21T12:49:30-05:00
---


# 操作系统类：软件包

## windows

* chocolatey

* PowerShell的[PackageManagement模块](https://technet.microsoft.com/en-us/library/dn890706.aspx)

获取所有可用包源：

``` powershell
Get-PackageSource
```

获取所有可安装的包：

``` powershell
Find-Package -ProviderName chocolatey
```

包管理相关命令查询：

``` powershell
man package
```

## mac

* homebrew

## linux

* yum
* apt


# 软件类：插件包

## vim

* vundle


# 编程语言类：第三方库包

## c＃

* nuget

## python

* pip
* easy_install

## js

* npm（用于服务端）
* bower（用于前端）