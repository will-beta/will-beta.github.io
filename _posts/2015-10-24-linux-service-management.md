---
title: LINUX-服务管理
tags: [linux]
sitemap:
    lastmod: 2015-10-24T12:49:30-05:00
---

[TOC]






系统服务
=====================================================================

*  通常被成为“System V”或“Sys V”
    许多脚本都是用文件系统目录的格式来组织的
    可启用或者彬资源服务
*  经常使用几个配置文件
*  大多数服务启动一个或多个进程
*  命令被“包裹”在脚本中
*  服务由/usr/lib/systemd/system/目录中的脚本管理
    systemctl start httpd.service






使用systemctl管理服务
=====================================================================

*  管理运行级别中的服务定义
*  不会改变System V服务的当前运行状态
*  用于独立的和瞬态的服务
*  在引导时启动和cups服务
    systemctl enable cups
    systemctl disable cups
*  启动服务
    systemctl start cups
*  重启服务
    systemctl restart xinetd.service
*  查看服务状态
    systemctl status cups
*  列出服务在运行级别中的分配情况
    systemctl list-units
*  查看系统引导时运行哪些服务
    systemctl list-unit-files --type service






xinetd管理服务
=====================================================================

概述
------------------------------------------

*    一些互联网瞬态（Transient）服务被xinetd进程所管理
*    sudo yum install tftp-server
*    进入的请求首先被xinetd代理
*    与libwrap.so文件连接



配置文件
------------------------------------------

###    /etc/xinetd.conf
*      cps：        并发连接数
*      instance：        并发实例数
*      per_source：        每个IP的并发连接数
*      only_from=<主机范围>：        允许访问
 *         数字式地址
            192.168.1.10
 *         IP地址/掩码范围
            192.168.0.0/24
 *         主机名或域名
            .domain.com
 *         网络名
            来自 /etc/networks
*      no_access=<主机范围>：        禁止访问


###    /etc/xinetd.d/<service name>

      修改此配置文件使服务自启动
        disable = no



配置服务的运行方式
------------------------------------------

###    /etc/sysconfig目录


###    有哪些服务

      named
      sendmail
      dhcpd
      samba
      init
      syslog






系统日志
=====================================================================

集中化的日志守护进程
------------------------------------------

###    rsyslogd：      管服务日志
*      由/usr/lib/systemd/system/rsyslog.service控制
*      配置文件：       /etc/rsyslog.conf
 *       日志级别
          debug
          info
          notice
          warn
          err
          crit
          alert
          emerg
 *       日志筛选
          *.info
            需要info级别的
          user.=info
            需要info及以上的级别
          user.!info
            禁用info及以上的级别
            等同user.debug
 *       转发日志
          vi /etc/rsyslog.conf
          配置
            取消注释
              $ModLoad imudp
              $UDPServerRun 514
            替换对mail的日志配置
              mail.*   @192.168.0.254
          systemctl restart rsyslog.service
*      测试
        logger -i -p mail.emerg -t "test title" "test content"
        sudo tail /var/log/maillog


###    auditd：      管内核日志



日志文件样本
------------------------------------------

*    /var/log/dmesg：      内核引导信息
*    /var/log/messages：      系统标准错误信息
*    /var/log/maillog：      邮件系统信息
*    /var/log/secure：      安全，认证和xinetd信息
*    /var/log/audit/audit.log：      内核审计信息



应用程序的日志文件也存放在/var/log中
------------------------------------------







cron：用于定时执行周期性任务
=====================================================================

用户crontab
------------------------------------------

###    使用crontab编辑，安装和显示任务调度

      crontab [-u user]  [-l|-r|-e]


###    允许/限制用户访问crond

      /etc/cron.allow
      /etc/cron.deny


###    存储在/var/spool/cron/<user>文件中



系统crontab
------------------------------------------

*    与用户crontab文件格式不同
*    主crontab文件/etc/crontab
*    crond运行在下列目录中的可执行文件
 *     /etc/cron.hourly/
 *     /etc/cron.daily/
        日常cron任务
          tmpwatch
            在指定目录中清除旧文件
            防止/tmp空间满
          logrotate
            防止日志文件增长过大
            /etc/logrotate.conf具有高度的可配置性
            运行后/var/log/ 目录中的日志文件会将旧日志保存为新文件
 *     /etc/cron.weekly/
 *     /etc/cron.monthly/
*    /etc/con.d/ 目录包含也附加的系统crontab文件



anacron系统
------------------------------------------

###    anaron运行那些在系统期间未执行的cron任务

*      假定计算机不是连续运行的
*      对笔记本电脑，工作站及其它非连续运行的系统来说很重要
*      对需要临时停机的服务器也有作用


###    配置文件：/etc/anacrontab

*      字段1
        如果任务在指定的天数内没有运行
*      字段2
        重启后在执行任务之前需要等待的分钟数
*      字段3
        任务标识符
*      字段4
        需要运行的任务






at任务：计划延迟，一次性执行的作业
=====================================================================

  
概述
------------------------------------------

*    时间元素非常灵活
*    作业存储在/var/spool/at/ 目录中
*    最后一个作业序列号存储在/var/spool/at/.SEQ文件中



增加
------------------------------------------

    at 16:00+3days
    at 10:00 Jul 31
    at now+5min
    按ctrl+D结束编辑



查询
------------------------------------------

    atq



移除
------------------------------------------

    atrm <作业号>






Network Time Protocol
=====================================================================

*  时间同步使系统日志便于分析
*  许多应用需要精确的时间
*  如果没有校正，工作站的硬件时钟会随着时间逐渐产生漂移
*  NTP通过控制一秒的长度来抵消时间漂移
*  NTP客户端应当配置三个时钟服务器
*  软件包：chrony
*  配置文件：/etc/chrony.conf
*  服务控制
    systemctl [start|enable] chronyd.service
*  查看同步状态
    chronyc sources






VNC：虚拟网络计算
=====================================================================

概述
------------------------------------------

*    允许通过网络访问或共享完全的桌面
*    比远程X桌面所使用的带宽明显减少



服务端
------------------------------------------

*    每个单独的用户可以启动一个VNC服务端
      vncserver :1
      输入客户端访问vnc的密码
*    在服务启动时会运行$HOME/.VNC/xstartup
*    需要一个不同于系统密码的VNC密码


客户端
------------------------------------------

*    连接到远程VNC服务器
      vncviewer host.screen
*    唯一的显示号用于区分在同一主机上运行的多个VNC服务
*    支持SSH通道化传输
      vncviewer -via user@host 192.168.0.25:1






服务和应用程序的访问控制
=====================================================================

tcp_wrapppers通用配置
------------------------------------------

###    概述

*      和libwrap.so连接的所有程序都使用公共的配置文件
*      因为xinetd和libwrap.so相连接，所以它的服务也受此影响
*      检查主机和（或）远程用户名


###    检查访问权限的三个步骤

*      访问被明确允许了吗？
*      或者访问被明确拒绝了吗？
*      或者，默认设置是允许访问！


###    配置被存放在两个文件里

*      /etc/hosts.allow
*      /etc/hosts.deny


###   基本语法

        daemon_list: client_list [:options]


###   高级语法

        daemon@host: client_list ...


###   守护进程名称

*        应用程序传递它们的可执行文件名称
*        可以制定多个服务
*        使用通配符ALL来匹配所有守护进程
*        某些守护进程有局限
*        宏定义
 *         主机名宏定义
            LOCAL
            KNOWN,UNKOWN,PARANOID
 *         主机和服务宏定义
            ALL
 *         EXCEPT
            可用于客户和服务列表
            可嵌套
            例
              sshd,in.tftpd:ALL EXCEPT 192.168.1.20
*        例
          in.telnetd , sshd : .example.com 192.168.2.5


###   数据式地址

        192.168.1.0


###   扩展选项

*        spawn：          可以开启一个特定的动作，          有自己的扩展代码（%c,%s）
            sshd: ALL : spawn echo "login attempt from %c to %s" | mail -s warning root
*        deny：          可作为hosts.allow中的一个选项
            ALL:ALL:DENY



服务特有的配置
------------------------------------------

*    有些守护进程如httpd,smbd,squid等有自己的安全机制
*    xinetd先使用tcp_wrappers评估允许连接后，再使用它自己的一套访问控制来确定最终的访问性
      基于主机
      基于时间



SELinux
------------------------------------------

###    概述

*      对比“强制访问控制”和“自主访问控制”
*      一组叫做“策略”（policy）的规则会决定控制的严格程度
*      进程要么是被限制的（restricted），要么是无束缚的
*      策略被用来定义被限制的进程能够使用哪些资源
*      默认情况下将拒绝没有被明确允许的行为
*      可以通过/var/log/audit/audit.log日志文件找到错误所在


###    所有文件和进程都具备“安全环境”（security context）

*      user:role:type:sensitivity:category
*      如 user_u:object_r:tmp_t:s0:c0
*      不是所有的系统都会显示s0:c0
*      查看文件的sc属性
        ls -Z
*      查看进程的sc属性
        ps -Z


###    目标策略

*      安装时载入目标策略
*      多数本地进程都属于未受限制的进程
*      类型元素主要用来进行类型强制
*      修改安全环境
        chcon -t tmp_t /etc/hosts
        restorecon /etc/hosts


###    模式

*        Enforcing
*        Permissive
*        Disabled


###    更改

*          sestatus
            查看selinux当前的状态
*          getenforce
            查看selinux当前的模式
*          setenforce 0|1
            让selinux模式在enforcing和permissive之间切换
*          使用selinux=0在GRUB中禁用SELinux


###    目标策略允许改变强制属性

*        getsebool
          getsebool -a | grep nfs
*        setsebool
          setsebool -P ftpd_use_nfs on


###    /etc/sysconfig/selinux

*        改变模式以及目标策略控制
*        模式改变需要重新引导系统才能生效


###    文件类型

*      一个被管理的服务类型叫做它的域（domain）
*      允许策略中的规则定义某个域可以访问哪些文件类型
*      策略以二进制格式保存，从而使规则无法被随意浏览
*      ls /etc/selinux/targeted/policy/policy.29






网络配置
=====================================================================

工具
------------------------------------------

*    systemctl start|stop network.service
*    nmcli
        nmcli connection modify "System eth0" ipv4.addresses "192.168.0.101/24"
        nmcli connection modify "System eth0" ipv4.method manual
*    ifconfig
        ifconfig <网卡名> <IP地址>



配置文件
------------------------------------------

*    网卡配置
      /etc/sysconfig/network-scripts/ifcfg-ethX
*    主机名配置
      /etc/hostname
*    本地dns
      /etc/hosts
*    dns服务器配置
      /etc/resolv.conf



网卡组合
------------------------------------------

###    组合模式

      activebackup
      broadcast
      roundrobin
      loadbalance


###    配置

*      配置组合
        nmcli connection add  type team  con-name team0  ifname team0  config '{"runner": {"name":"activebackup"}}'
        nmcli connection add  type team-slave  con-name team-part1  ifname eth1  master team0
        nmcli connection add  type team-slave  con-name team-part2  ifname eth2  master team0
*      配置地址
        nmcli connection modify team0 ipv4.addresses '192.168.10.101/24'
        nmcli connection modify team0 ipv4.method manual
        systemctl restart network
*      查看状态
        teamdctl team0 state
*      模拟出错
        断开部分网卡
          nmcli device disconnect eth1
        恢复
          nmcli device connect eth1