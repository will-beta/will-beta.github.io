---
title: LINUX-mail服务
tags: [linux]
sitemap:
    lastmod: 2015-10-24T12:49:30-05:00
---

[TOC]






基本的电子邮件操作原理
=====================================================================

代理
------------------------------------------

*    MUA
*    MRA
*    MTA
*    MDA



协议
------------------------------------------

*    IMTP
*    POP3
*    IMAP4






邮件传输代理MTA
=====================================================================

RHEL包括三个MTA
------------------------------------------

*    postfix
*    sendmail
*    exim



共通特性
------------------------------------------

*    支持虚拟主机
*    为失败的发送和其它错误条件提供自动重试



默认访问控制
------------------------------------------

*    Sendmail和Postfix没有setuid功能
*    禁用转发功能






发送邮件：postfix
=====================================================================

类型
------------------------------------------

      System V



软件包
------------------------------------------

      Postfix



守护活动
------------------------------------------

      /usr/libexec/postfix/
        master



脚本
------------------------------------------

      /usr/lib/systemd/system/postfix.service



端口：
------------------------------------------

      25(smtp)



配置
------------------------------------------

###        /usr/share/doc/postfix-2.10.1/main.cf.default


###        /etc/postfix/main.cf主配置文件

####            配置格式

*              使用“键=值”格式
*              行首的空白字符是连续字符
*              配置项可以被用作后续配置中的变量
                key1=value1
                key2=$key1,value2

####            邮件接收配置

*              监听所有接口
                inet_interfaces = all
*              指定服务器可能会引用的每个名称和别名
                mydestination = /etc/postfix/local-host-names
                相当于主机名
                虚拟主机通过此配置实现

####            邮件发送配置

*              默认配置
                启用postfix来充当客户端MSP
                对单一主机而言，不需要进一步配置
                postfix自动解析本地主机名和域名
*              要伪装成域名
                myorigin = $mydomain
*              将postfix配置成“仅发送不接收”模式
                inet_interfaces = loopback-only
                mynetworks = 127.0.0.0/8, [::]/128
                mydestination = 
                local_transport = error: local delivery disabled
*              用户发送验证
 *               配置
                  smtpd_sasl_auth_enable = yes
                  smtpd_sasl_security_options = noanonymous
                  smtpd_relay_restrictions = permit_mynetworks, permit_sasl_authenticated, defer_unauth_destination
 *               systemctl restart postfix
 *               启动sasl认证进程
                  systemctl start saslauthd
 *               确认sasl已经打开
                  telnet 127.0.0.1 25
                    ehlo 127.0.0.1
                      确保AUTH PLAIN LOGIN存在

####            入站别名

*              为指定的用户名指定另一个可用于接收的别名
                postmaster:root
                hr:jerry
*              可用于群发邮件
                managers:kelly,Li
*              和sendmail一样使用/etc/aliases文件
*              刷新别名
                newaliases
                postalias /etc/aliases


###        /etc/postfix/access

*            SMTP配置部分
*            需要在main.cf中配置：              smtpd_client_restrictions = check_client_access hash:/etc/postfix/access
*            允许指定网段向此服务器发送邮件：              192.168.0   OK
*            刷新access：              postmap /etc/postfix/access


###        postconf命令

*          -m：            支持的数据查找类型
*          -n：            打印显式地在main.cf中的配置
*          -e：            修改设置
            postconf -e 'inet_interfaces = loopback-only'



防火墙要开放的服务
------------------------------------------

      smtp



相关软件
------------------------------------------

      procmail



延期消息
------------------------------------------

      查看
        postqueue -p
      发送
        postqueue -f
      存储
        /var/spool/postfix/defer
        /var/spool/postfix/deferred



查看日志
------------------------------------------

      tail -f /var/log/maillog


  
例
------------------------------------------

      mail -s 'Some Subject' student@desktopX.example.com #使用单独一行的“.”结束内容编辑






接收邮件：dovecot
=====================================================================

  
支持的邮件检索协议
------------------------------------------

###      POP3：邮局协议

*        所有数据，包括密码，都通过TCP端口110被明文传递
*        使用POP3s来通过TCP端口995传递SSL加密数据


###      IMAP：互联网邮件存取协议

*        所有数据，包括密码，都通过TCP端口143被明文传递
*        使用POP3s来通过TCP端口993传递SSL加密数据



类型
------------------------------------------

      System V



软件包
------------------------------------------

      dovecot



守护进程
------------------------------------------

      /usr/sbin/dovecot



脚本
------------------------------------------

      /usr/lib/systemd/system/dovecot.service



端口
------------------------------------------

*      110：        pop
*      995：        pop3s
*      143：        imap
*      993：        imaps



配置
------------------------------------------

###      需要将/var/spool/mail/*改为600或666的权限以便能够读取用户的邮箱信息


###      /etc/dovecot/dovecot.conf

*        默认监听所有IPv6和IPv4接口
*        login_trusted_networks = 192.168.0.0/24


###      /etc/dovecot/conf.d/

####        10-mail.conf

*          邮件存放位置
            创建快捷方式：“/var/spool/mail/”>“/var/mail/”
            mail_location = mbox:~/mail:INBOX=/var/mail/%u

####        10-sl.conf

*          密钥和证书位置
            公钥：              ssl_cert = /etc/pki/dovecot/certs/dovecot.pem
            私钥：              ssl_key = /etc/pki/dovecot/private/dovecot.pem
*          使用SSL前制作一份密钥和自签名证书
            创建包含密钥和证书的单一PEM文件
              cd /etc/pki/tls/certs/
              make dovecot.pem
            把新建的PEM文件复制到两个位置，覆盖默认生成的PEM文件



相关软件包
------------------------------------------

*      procmail
*      fetchmail
*      openssl






检索邮件
=====================================================================

图形化工具
------------------------------------------

*    ThunderBird
*    Evolution



文本工具
------------------------------------------

*    FetchMail
*    mutt
      会建立“~/Mail”目录
      mutt -f pop://student@server2.example.com
        先会提示是否接受证书
        再提示输入密码
  


其它
------------------------------------------
*    telnet
*    openssl s_client -host 192.168.0.206 -port 995






查看邮件
=====================================================================

  mail -u <用户名>