---
title: LINUX-dns服务
tags: [linux]
sitemap:
    lastmod: 2015-10-24T12:49:30-05:00
---

[TOC]






常用主机名称服务
=====================================================================

文件
------------------------------------------

    /etc/hosts
    /etc/networks



服务
------------------------------------------

    DNS
    NIS






二级域名
=====================================================================

  com
  net 
  org
  edu
  gov
  mil
  cn...us：    国家域名
  in-addr.arpa：    反向解析域名，如    106.0.168.192.in-addr.arpa.






BIND
=====================================================================

概述
------------------------------------------

*    是互联网上使用最广泛的DNS服务器
*    在一个稳定可靠的体系上建构域名和IP地址关联
*    对DNS RFC的参考实现
*    在chroot环境下运行



描述
------------------------------------------

###    类型

      System V管理的服务


###    软件包

      bind
      bind-utils
      bind-chroot


###    守护程序

      /usr/sbin/named


###    脚本

      /usr/lib/systemd/system/named.service


###    端口

      53（UDP）：          开放给DNS客户端查询
      53（TCP）：          用于DNS服务器之间的数据同步


###    配置文件

      /etc/named.conf
      /var/named/*


###    相关软件包

      openssl



配置
------------------------------------------

```shell
    yum -y install bind
    systemctl start named
    systemctl enable named.service
    firewall-cmd --permanent --add-service=dns
    firewall-cmd --reload
    vi /etc/sysconfig/network-scripts/ifcfg-eth0 #      更新PEERDNS=no
    systemctl restart network
    vi /etc/resolv.conf #      添加DNS服务器地址        nameserver 192.168.0.186
```



基本的named配置
------------------------------------------

###    在/etc/named.conf中定义：提供客户端匹配列表，应该允许哪些查询？

*        options
          服务器接口
            listen-on
            listen-on-v6
*        logging
*        zone "." IN
          根记录
*        include "/etc/named.rfc1912.zones"
          扩展记录
*        include "/etc/named.root.key"


###    通过区块文件添加数据:/etc/named.rfc1912.zones

####      区块文件的内容

*        记录集合，从SOA记录开始
*        @符号是一个变量，代表区块的始发地址，始发地址在/etc/named.conf中指定
*        注释使用汇编语言模式（；）


####      注意事项

*        若没有使用”点“来终止名称，BIND会在这个名称后补充域的始发地址
*        如果记录中缺少域字段，BIND会使用前一个记录中的值
*        修改了区块文件后，不要忘记递增序列号码，重载named服务


####      区块文件结构

*        资源记录都有5个字段
          domain
            被查询的域或子域
          ttl
            记录被保存在缓存中的时间，以秒为单位
          class
            记录类型
              通常是IN
          type
            记录类型
              A
              NS
          rdata
            域映射的资源数据
*        用户查询domain，而domain映射到rdata来查找答案
*        区块文件提示
          捷径
            不必从头开始
            为尽量减少打字数量，将$TTL86400放在区块文件的第一行
            BIND允许您将被包在括号内的，有多个值的rdata分成几行
          为区块文件选择一个能够反映始发地址的文件名






记录类型
=====================================================================

SOA记录
------------------------------------------

###    观察结果

*      域字段叫做始发地址
*      Rdata字段被引申为支持额外数据
*      一个域通常有一个主名称服务器，它保存数据的主要副本


###    TTL

      记录在DNS缓存中的生存时间


###    rdata

*      主名称服务器的FQDN
        SOA记录将其中一个ns服务器标记为主ns服务器
*      联系邮件地址
        记录主机管理员的联系方式，其中第一个点表示的是@。
*      序列号码
        格式为yyyymmddnn，nn代表这一天是第几次修改。辅名字服务器通过比较这个序列号是否加载一份新的区数据拷贝。
*      在刷新序列号码之前刷新延迟时间
        告诉该区的辅名字服务器相隔多久检查该区的数据是否是最新的。
*      从服务器的重试间隔
        如果辅名字服务器超过刷新间隔时间后无法访问主服务器，那么它就开始隔一段时间重试连接一次。这个时间通常比刷新时间短，但也不一定非要这样。
*      当从服务器无法连接它的主服务器时，记录会过期
        如果在期满时间内辅名字服务器还不能和主服务器连接上，辅名字服务器就使用这个我失效。这就意味着辅名字服务器将停止关于该区的回答，因为这些区数据太旧了，没有用了。设置时间要比刷新和重试时间长很多，以周为单位是较合理的。
*      否定性答复（”no such host“）的TTL最小值
        这个值对来自这个区的权威名字服务器的否定响应都适用



邮件交换器记录
------------------------------------------

    MX记录会将域映射到邮件服务器的完整域名
    观察
      Rdata字段被引申为包括一个额外的叫做优先级的数据
      名称服务器通常在额外答复中提供和MX相对应的A记录
      MX记录和它相关的A记录一起解析某个域的邮件服务器






测试
=====================================================================

校验DNS的工具
------------------------------------------

###    dig

####      概述

*        从不读取/etc/nsswitch.conf
*        默认情况是在/etc/resolv.conf中只查找nameserver行
*        输出是RFC标准的区块文件格式


####      正向查询

*        dig redhat.com
          首先试图递归，如输出中的flags（标志）部分用rd表示
          如果名称服务器允许递归，那么服务器就会将请求的记录返回给客户端
          如果名称服务器不允许递归，那么服务器就推荐一个可以跟踪的上级域名
          观察
            dig的默认查询类型是A，它记录的rdata是一个IPV4地址
            使用-t AAAA来请求IPV6地址


####      逆向查询

*        dig -x 209.132.177.50
          观察
            输出部分显示了DNS逆转了地址的八进制数字
            PTR记录的rdata是完整网络域名


###    host

*      从不读取/etc/nsswitch.conf
*      默认情况是在/etc/resolv.conf中查找nameserver和search行
*      默认仅给出最少量的输出
*      强制迭代查询
        host -rt ns redhat.com


###    nslookup



语法检测工具
------------------------------------------

*    检测/etc/named.conf文件
      named-checkconf -t /var/named/chroot
*    检测指定的区块配置
      named-checkzone domain6.example.com /var/named/domain6.example.com.zone



查看日志
------------------------------------------

    重启服务后
    tail -f /var/log/messages






增加解析
=====================================================================

*  vi /etc/named.rfc1912.zones
    增加正向记录区块
      zone "domain6.example.com" {  type master;  file "domain6.example.com.zone";  allow-update {none;};  allow-transfer {none;}; }
    增加反向记录区块
      zone "0.168.192.in-addr.arpa" {  type master;  file "192.168.0.zone";  allow-update {none;};  allow-transfer {none;}; }
*  cp -p /var/named/named.localhost /var/named/domain6.example.com.zone
    拷贝时使用-p选项指定同时拷贝权限相关数据
    详细数据
      $TTL 43200 @       IN SOA         server1.domain6.example.com. root(             2014092901 ;serial             3H ;refresh             5M ;retry             1W ;expire             5M ;minimum            ) @       IN NS      server1.domain6.example.com. @       IN MX      5   smtp.domain6.example.com. server1 IN A           192.168.0.106 server2 IN A           192.168.0.206 smtp    IN A           192.168.0.6 www     IN cname       smtp.domain6.example.com.
*  cp -p /var/named/domain6.example.com.zone /var/named/192.168.0.zone
    $TTL 43200 @       IN SOA         server1.domain6.example.com. root(             2014092901 ;serial             3H ;refresh             5M ;retry             1W ;expire             5M ;minimum            ) @       IN NS      server1.domain6.example.com. 106     IN A           server1.domain6.example.com. 206     IN A           server2.domain6.example.com. 6       IN A           smtp.domain6.example.com.  
*  systemctl restart named
*  tail -f /var/log/messages






stub解析程序
=====================================================================

所有程序都可使用的通用解析程序库
------------------------------------------

    由gethostbyname()和其它glibc功能提供
    不具备更高性能的访问控制能力，例如签发和加密数据包



可以查询有glibc支持的任何名称
------------------------------------------



读取/etc/nsswitch.conf来决定查询名称服务的顺序
------------------------------------------

    hosts:files dns



在dns服务器上配置
------------------------------------------

    编辑/etc/resolv.conf来指定nameserver 127.0.0.1
    编辑/etc/sysconfig/network-scripts/ifcfg-*来指定PEERDNS=no



优点
------------------------------------------

    确保所有应用程序查询的一致性
    简化访问控制和故障排除






bind-chroot
=====================================================================

概述
------------------------------------------

*    bind-chroot是bind的一个功能,使bind可以在一个 chroot的模式下运行.
*    也就是说,bind运行时的/(根)目录,并不是系统真正的/(根)目录,只是 系统中的一个子目录而已.
*    这样做的目的是为了提高安全性.
*    因为在chroot的模式下,bind可以 访问的范围仅限于这个子目录的范围里,无法进一步提升,进入到系统的其他目录中.



服务
------------------------------------------

    named-chroot.service



数据
------------------------------------------

    /var/named/chroot/






地址匹配列表
=====================================================================

使用分号间隔的IP地址列表或者其它的ACL列表
------------------------------------------

*    IP地址
      192.168.0.1
*    后续的点
      192.168.0.
*    CIDR
      192.168.0.0/24



使用!来代表相反的结果
------------------------------------------



按顺序检查匹配列表，找到第一个匹配后就停止
------------------------------------------



选项
------------------------------------------

*    allow-query{<匹配列表>;};
      既提供权威答复也提供缓存的答复
*    allow-recursion{<匹配列表>;};
*    allow-transfer{<匹配列表>;};
      列表中的客户机可以当服务器
*    forwarders{<匹配列表>;}; forwarder first | only;
      first
        先使用匹配列表中的DNS服务器做域名解析
        若查询不到再使用本地DNS服务器做域名解析
      only
        只使用匹配列表中的DNS服务器做域名解析






内置ACL
=====================================================================

BIND预定义了四个ACL
------------------------------------------

*    none
      不匹配任何IP地址
*    any
      匹配所有IP地址
*    localhost
      匹配名称服务的任何IP地址
*    localnets
      匹配直接连接的网络






DNS主从
=====================================================================

配置主服务器
------------------------------------------

*    主区块
      zone "domainX.example.com" {  type master;  file "domainX.example.com.zone";  allow-transfer {myslaves;}; }
*    配置主服务器的防火墙
      firewall-cmd --permanent --add-port=53/tcp



配置从服务器
------------------------------------------

*    从区块
      zone "domainX.example.com" {  type slave;  masters {mymasters;};  file "slaves/domainX.example.com.zone"; } 






DNS委派
=====================================================================

父
------------------------------------------

    添加一对粘合记录来完成授权
      一个NS记录
      一个A记录

子
------------------------------------------

    在子服务器中，创建包含子域数据的区块文件