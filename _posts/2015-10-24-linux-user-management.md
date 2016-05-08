---
title: LINUX-软件包管理
tags: [linux]
sitemap:
    lastmod: 2015-10-24T12:49:30-05:00
---

[TOC]






用户、组和权限
=====================================================================

概述
------------------------------------------

*  组不能嵌套
*  用户名和uid保存在/etc/passwd
*  组信息保存在/etc/group中
*  用id命令查看当前用户信息
*  使用chmod更改权限
*  当目录缺少x权限时，r权限也无法起作用
*  使用nautilus里的“允许文件执行”用于同时更改所有用户的执行权限



每个用户有
------------------------------------------

###    一个Primary Group

*      使用usermod -g修改


###    多个Secondary Groups

*      使用usermod -G修改
*      newgrp命令用于切换当前用户的组，当目标组为其附加组时，不提示密码确认



每个文件有自己的
------------------------------------------

###    所有者

      只有root用户能用chown命令更改此值


###    所有组

      root用户和所有者能用chgrp命令更改此值



掩码
------------------------------------------

*    文件或目录的创建时权限受掩码影响
*    使用umask命令查看掩码
*    若掩码为奇数，则取其最近较小的偶数
*    root的掩码为022
*    非特权用户的掩码为002



图形工具
------------------------------------------

*    system-config-users



命令行工具
------------------------------------------

*    useradd
*    usermod
*    userdel



用户的Login Shell
------------------------------------------

*    bash
*    sh
*    csh
*    tcsh
*    no shell：      用于服务



帐户数据库文件
------------------------------------------

###    /etc/passwd

*      用户名
*      登录shell
*      home目录
*      uid
*      gid


###    /etc/shadow

      用户口令和相关信息


###    /etc/group

      组的相关信息


###    /etc/login.defs



查看当前登录的用户
------------------------------------------

*    w
*    who



查看历史登录记录
------------------------------------------

*    last
      所有历史登录记录
*    lastb
      登录失败的（BAD）记录
*    lastlog
      所有用户的最近登录记录



给文件赋执行权限
------------------------------------------

###    suid

*      执行时具有文件所有者权限，而非执行者权限
*      /usr/bin/passwd命令
*      chmod 4777 test
        显示为s
*      chmod 4677 test
        显示为S


###    sgid

*      执行时具有文件所有组权限累加
*      /usr/bin/write命令
        向目标终端用户传递消息
        crl+D结束输入
*      chmod 2777 test
        显示为s
*      chmod 2767 test
        显示为S


###    sticky bit

*      文件只能被root和所有者删除和移动
*      chmod 1777 test
        显示为t
*      chmod 1776 test
        显示为T



给目录赋执行权限
------------------------------------------

*    sgid
      在此目录中创建的文件的所属的组为此目录的所属组，而非执行者的组
*    sticky bit
      其中的文件只能被root和所有者删除和移动






用户帐户信息种类
=====================================================================

帐户信息
------------------------------------------

*      UID
*      默认SHELL
*      主目录
*      组群成员信息



验证是一种用来确定登录帐户所有的密码是否正确的方法
------------------------------------------







帐户信息（名称服务）
=====================================================================

*  通过库功能使用的名称服务将名称与信息进行匹配
*  最初，仅由类似/etc/passwd的本地文件提供名称服务
*  添加对新名称（如NIS）的支持需要重新编写libc






名称服务切换（NSS）
=====================================================================

*  NSS允许不必重新编写libc就能添加新名称服务
*  使用/lib64/libnss_service.so
*  /etc/nsswitch.conf控制要使用的名称服务及其顺序
*  passwd:files nis ldap






getent
=====================================================================

getent <database>
------------------------------------------

*    列出所有保存在指定数据库中的对象
*    getent services



getent <database> <name>
------------------------------------------

*    在指定数据库中的保存信息中查找某个特定的名称
*    getent passwd smith






验证
=====================================================================

应用程序传统上使用libc功能来验证密码
------------------------------------------

*    在登录时提供散列密码
*    和NSS中的散列密码进行比较
*    如果匹配，则通过验证



应用程序必须被重新编写来改变它们验证用户的方法
------------------------------------------







可插入验证模块（PAM）
=====================================================================

简介
------------------------------------------

*    可插入验证模块
*    应用程序调用libpam功能来验证和授权用户
*    libpam根据应用程序的PAM配置文件来进行验证，      可能通过libc来包含NSS检查
*    共享的，可动态配置的代码
*    文档：      /usr/share/doc/pam-<version>/



pam模块
------------------------------------------

### 概述

*    /lib64/security/*.so
*    每个模块都执行“通过”或“失败”测试
*    /etc/security/ 目录中的文件可能会影响某些模块执行测试的方法


### 例：      pam_unix.so（用于基于NSS验证的模块）

*          auth
            从NSS中获取散列密码，然后与输入的密码散列进行比较
*          account
            检查密码是否过期
*          password
            处理本地文件或NIS中的密码修改
*          session
            将登录和注销事件记录到日志中



pam配置
------------------------------------------

###    概述

*    /etc/pam.d/*
*    服务文件决定模块在什么时候如何被特定程序使用


###    分类

####        auth：          验证某用户的确是这个用户

*            pam_securetty.so：              如果从没有在/etc/securetty中列出的终端上以root身份登录，测试就会失败
*            pam_nologin.so：              如果用户不是root，并且存在文件/etc/nologin，测试就会失败
*            pam_listfile.so：              根据文件中的列表来检查验证特征，
*               可以被允许或拒绝的帐户列表
                auth required pam_listfile.so item=user sense=deny file=/etc/vsftpd/ftpusers onerr=succeed
*            pam_userdb.so：              根据数据库来检查验证信息，                vsftpd的虚拟用户
 *               建密码数据库
  *                建明文文件
                    vi login.txt #                      帐户名与密码相间各占一行
                        user1
                        abc-123
                        user2
                        abc
  *                转化成散列数据文件
                    db_load -T -t hash -f login.txt /etc/vsftpd/virtual_user.db
                    file /etc/vsftpd/virtual_user.db
 *               配置pam配置：                  vi /etc/pam.d/ftpd/vsftpd.vu
                    auth  required  pam_userdb.so  db=/etc/vsftpd/virtual_user
                    account  required  pam_userdb.so  db=/etc/vsftpd/virtual_user
 *               配置vsftpd配置：                  vi /etc/vsftp.d/vsftpd.conf
                    pam_service_name=vsftpd.vu
                    guest_enable=YES
                    guest_username=ftpuser
 *               生成匿名用户登录ftp所使用的系统帐户：                  useradd -s /sbin/nologin -d /var/ftpuser ftpuser
 *               配置匿名用户登录ftp后所使用的目录
                  chmod 755 /var/ftpuser/
                  ls -Zd /var/ftpuser/
                  ls -Zd -R
                  chcon -t public_content_t /var/ftpuser/ -R
                  ls -Zd /var/ftpuser/
                  ll /var/ftpuser/
                  touch /var/ftpuser/file{1,2,3}
 *               启动服务
                  systemctl start vsftpd
                  systemctl enable vsftpd
 *               验证登录：                  lftp user1:abc-123@192.168.0.1
                    ls
                      可以看到file1,file2,file3文件


####        account：          批准某帐户使用，          对失败登录的监控

*           启用功能
              vi /etc/pam.d/system-auth-ac
                account  required  pam_tally2.so deny=3 even_deny_root
*           查看特定用户的计数记录
              pam_tally2 -u student
*           重置特定用户的计数记录
              pam_tally2 -u student --reset


####        password：          控制密码的修改

*          密码安全性
 *           pam_unix.so MD5 密码散列
              使密码散列更难破译
 *           pam_unix.so shadow 密码
              使密码散列只能被root查看
              启用密码时效功能
 *           其它模块可能会支持密码时效机制
 *           vi /etc/pam.d/system-auth-ac
*          密码策略
 *           密码历史
              带有remember=N参数的pam_unix.so
 *           密码强度
              pam_pwquality.so


####        session：          打开，关闭并记录会话

 *           pam_limits.so
              强制资源限制
                maxlogins
                  特定帐户的最多同时登录数
                maxsyslogins
                  系统的最多同时登录用户数
              使用/etc/security/limits.conf
 *           pam_mkhomedir.so
              在主目录不存在的情况下创建主目录


###      控制值

*        required
          必须通过，若失败则继续测试
*        requisite
          和required类似，但失败则退出测试
*        sufficient
          如果到此为止一直通过，则返回成功；
          如果失败，则忽略测试，继续检查
*        optional
          测试通过与否都无关紧要
*        include
          返回在被调用的文件中配置的测试总体结果


###    例：      system-auth

*        被广泛使用
*        被include控制标记，而不是模块（如pam_stack.so）调用
*        包含标准验证测试
*        被系统中许多程序共享
*        能够对标准系统验证进行简单、统一的管理



工具和验证
------------------------------------------

###    需要验证的本地管理工具

*      su
*      reboot
*      system-config-*


###    若以root身份运行，pam_rootok.so就会通过



pam故障排除
------------------------------------------

###    检查系统日志

*      /var/log/messages
*      /var/log/secure


###    PAM错误会将root用户也拒之门外

*      在测试PAM前先打开一个root shell，以便之后无法登录时有机会修复系统
*      用单用户模块绕开PAM
*      使用救援光盘引导系统