---
title: 为vs2015添加vc++2012redist bootstrapper
categories: [vs]
sitemap:
lastmod: 2016-5-19T12:49:30-05:00
---

主题
=====================================================

  为vs2015添加vc++2012redist bootstrapper







场景
=====================================================

  要发布的clickonce程序依赖vc++2012redist，但vs2015中的bootstrapper只有vc++14redist







过程
=====================================================

*  下载安装微软官网的vc++2012redist
*  在注册表中搜索Visual C++ 2012 x86 Minimum Runtime，拷贝其class键值
*  将C:\Program Files (x86)\Microsoft Visual Studio 14.0\SDK\Bootstrapper\Packages\下的vcredist_x86目录拷贝为vcredist_x86_vc2012
*  更改vcredist_x86_vc2012中各文件对vcredist版本的描述，并且替换product code替换为注册表中的键值
*  将vc++2012redist文件扔到vcredist_x86_vc2012目录中
*  发布时勾选此组件即可







备注
=====================================================

*  clickonce程序对bootstrapper package的安装前检测是集成在setup.exe中，而不是.application中
*  同理可处理要修改注册表才能解决webbrowser控件默认以ie7模式渲染html的问题







参考
=====================================================

*  [Walkthrough: Creating a Custom Bootstrapper to Show a Privacy Prompt](https://msdn.microsoft.com/en-us/library/ee726596.aspx)
*  [Bootstrapper for Visual C++ runtime for Visual Studio 2012](https://social.msdn.microsoft.com/Forums/vstudio/en-US/e9ddc345-0d10-4666-a15c-166872167448/bootstrapper-for-visual-c-runtime-for-visual-studio-2012)