---
title: LINUX-网络管理
tags: [linux]
sitemap:
    lastmod: 2015-10-24T12:49:30-05:00
---

[TOC]





路由
=====================================================================

概述
------------------------------------------

*    路由器在不同的网络之间传输数据包
*    主机需要一个默认网关来访问本网络之外的主机



用route命令可以设置临时附加路由
------------------------------------------

*    route -n
      列表所有的路由条目
*    route add -net 192.168.10.0/24 gw 192.168.0.0
      新增网段路由
      flags段显示为UG
*    route add -host 192.168.5.2 gw 192.168.0.7
      新增主机路由
      flags段显示为UGH
*    重启网络后临时附加路由丢失
      system restart network



编辑指定的网络接口的route文件：/etc/sysconfig/network-scripts/route-<接口名>
------------------------------------------

      192.168.5.2 via 192.168.0.7
      192.168.10.0/24 via 192.168.0.3






NetFilter
=====================================================================

总览
------------------------------------------

*    在内核中过滤：有守护进程
*    在OSI参考模型的第2、3、4层插入策略
*    只查看数据包标题
*    由内核中的netfilter模块和iptables用户空间软件



链
------------------------------------------

*      OUTPUT
*      POSTROUTING
*      PREROUTING
*      FORWARD
*      POSTROUTING
*      INPUT



表
------------------------------------------

*    filter
*    nat
*    mangle



匹配规则
------------------------------------------

*    按顺序配列的规则
*    按规则顺序测试数据包
*    首次匹配后会评估目标，      通常退出链
*    规则可以指定多个匹配条件
*    必须满足规则说明中的每个条件才算是匹配
*    如果无匹配规则应用链策略



规则目标
------------------------------------------

###    内置目标

*      DROP
*      ACCEPT


###    扩展目标

*      LOG
        连接系统日志内核工具
        匹配不会从链中退出
*      REJECT
        给发送者返回一个通知
*      custom chain


###    目标是可选的，但是每条规则最多只能有一个目标

      iptables -t filter -A INPUT -s 192.168.0.1 -j DROP



编辑规则
------------------------------------------

###      表名

*        -t
          filter
          nat
          mangle


###      对指定链的规则操作

*        列出
          -L或-vL
          -n
            显示数字，而不是友好名称
          例
            iptables -L -n INPUT --line-number
*        附加
          -A
*        插入
          -I
            -I CHAIN
              作为第1条规则插入
            -I CHAIN 3
              作为第3条规则插入
*        删除
          -D
            -D CHAIN 3
              删除链中的第3条规则
            -D CHAIN RULE
              明确删除规则


###      源
 
*        -s


###      规则目标

*        -j
          DROP
          ACCEPT
          LOG
          REJECT
          custom chain


###    清除某个链的所有规则

      -F



额外的链操作
------------------------------------------

###    分配链策略

*      语法
        -P CHAIN TARGET
*      目标
        ACCEPT
          默认
        DROP
        REJECT
          不允许，是扩展目标
*      例
        iptables -P INPUT ACCEPT


###    把字节和数据包计算器重设为零

      -Z [CHAIN]


###    管理定制链

*      新建
        -N
*      删除
        -X



适用于几乎关闭的系统
------------------------------------------

###    命令

      iptables -P INPUT DROP
      iptables -A INPUT -j DROP
      iptables -A INPUT -j REJECT


###    副作用

      也适用于回环接口
      也会拒绝localhost



例
------------------------------------------

*    接受所有来自lo的数据包
      iptables -A INPUT -i lo -j ACCEPT
*    拒绝指定网络的数据包进入主机
      iptables -A INPUT -s 192.168.1.0/24 -j REJECT
*    连接本机的指定端口的数据包，予以拒绝操作
      iptables -A INPUT -p tcp --dport 21 -j LOG
      iptables -A INPUT -p tcp --dport 21 -j REJECT






NAT
=====================================================================

概述
------------------------------------------

*    将一个IP转换成另一个（进入和输入）
*    允许您将内部的IP地址“隐藏”在一个公共IP地址后面
*    在nat表中设置规则



转换类型
------------------------------------------

###    源NAT

*      用于代理上网
*      SNAT
*      MASQUERADE
*      在POSTROUTING链中设置
*      示例
        iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
          使用指定网卡的地址进行转换
        iptables -t nat -A POSTROUTING -j SNAT --to-source 1.2.3.45
        iptables -t nat -I POSTROUTING -s 192.168.0.0/24 -j MASQUERADE


###    目的NAT

*      用于服务器的发布
*      DNAT
*      在PREROUTING链中设置
*      示例
        INBOUND
          进入
          iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-dest 192.168.0.20
        OUTBOUND
          输出，带有端口重定向
          iptables -t nat -A OUTPUT -p tcp --dport 80 -j DNAT --to-dest 192.168.0.200:3128






防火墙
=====================================================================

firewall-config：图形化界面
------------------------------------------
    
      services
      ports
      masquerading
      port forwarding
      ICMP Filter
      Rich Rules
      Interfaces
      Sources



firewall-cmd：命令行界面
------------------------------------------

    