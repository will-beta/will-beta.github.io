---
title: 安装DSM
categories: [网络]
tags: [NAS]
---

背景
==============================================

  极路由1S为2.4G
-------------------------------------

*    周围WIFI多，抗干扰能力弱，有时网速莫名慢，不能立即确定是外网还是内网的问题
    
    
    
        
  多个路由的SMB共享无法流畅播放某些高清电影，如FriendsXX.mkv
-------------------------------------

*    小米路由MINI
*    极路由3
*    奇怪极路由1S的SMB共享却可以流畅播放，但由于它是2.4G，而且存储也只能接SD卡，只能放弃
    
    
    
        
  购置新路由5G
-------------------------------------

*    去广告能力强
*    但SMB共享依然稍慢
    
    
        
    
  网络功能最好与NAS功能分离，另外像迅雷与百度云这些的远程下载功能最好由它们自己的客户端软件完成，功能与性能都能达到最强
-------------------------------------











平台
==============================================

  MAC的parallel










安装
==============================================

  资源
-------------------------------------

*    XPEnoboot5.5592.iso
*    DSM5.5592.PAT
*    没必要SynologyAssistant
    
    
        
    
  设置
-------------------------------------

*    网卡类型改为intel，不能用默认的virtio
*    去除连接所有打印机
    
    
        
    
  安装
-------------------------------------

*    从XPEnoboot5.5592.iso启动看到屏幕上出现从DHCP自动获取的IP后
*    若失败则重启重试
*    从网页进入http://<ip>:5000安装PAT文件










配置
==============================================

  SMB共享
-------------------------------------
    
    启用GUEST用户
    移动硬盘自动识别
    主动为有名用户与匿名用户开放不同的权限
    
        
    
  DLNA共享
-------------------------------------
    
        
    
  DOCKER
-------------------------------------










使用
==============================================

*  所有设备，包括电脑手机投影仪全都通过SMB或DLNA连接访问文件，包括播放与存储