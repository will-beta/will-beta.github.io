---
title: LINUX-网络文件共享服务
tags: [linux]
sitemap:
    lastmod: 2015-10-24T12:49:30-05:00
---

[TOC]




vsftpd
=====================================================================

描述
------------------------------------------

*    红帽企业版linux的默认ftp服务器
*    不再由xinetd管理
*    允许系统、匿名或虚拟用户访问
*    匿名目录层次结构由vsftpd RPM提供



类型
------------------------------------------

    System V管理的服务



软件包
------------------------------------------

    vsftpd



守护程序
------------------------------------------

    /usr/sbin/vsftpd



脚本
------------------------------------------

    /usr/lib/systemd/system/vsftpd.service



端口
------------------------------------------

*    21
      ftp
*    20
      ftp-data



配置文件
------------------------------------------

*    /etc/vsftpd/vsftpd.conf
*    /etc/vsftpd/ftpusers
      拒绝用户
      优先级最高
*    /etc/vsftpd/user_list
      需要配置vsftpd.conf中的user_list_deny的值
      作用根据配置值不同而不同



日志
------------------------------------------

    /var/log/xferlog



相关软件包
------------------------------------------

    tcp_wrappers



配置
------------------------------------------

###    服务器

```shell
systemctl start vsftpd
systemctl enable vsftpd
#配置防火墙
firewall-cmd --permanent --add-service=ftp
firewall-cmd --reload
firewall-cmd --list-services
#查看ftp目录
getent passwd ftp
#建测试用文件
ls /var/ftp/
touch /var/ftp/pub/file{1,2,3}
mkdir /var/ftp/incoming
#允许匿名用户上传文件
#修改selinux
getsebool -a | grep ftp_home_dir
setsebool -P ftp_home_dir on
chcon -t public_content_rw_t /var/ftp/incoming
ls -Zd /var/ftp/incoming/
ls -Zd /var/ftp/pub/
chmod 777 /var/ftp/incoming/
getsebool -a | grep ftp
setsebool -P ftp_anon_write on
vi /etc/vsftpd.conf
#修改anon_upload_enable=YES
systemctl restart vsftpd.service
```


###    客户端

*      ftp 192.168.0.101
        ls
        cd pub
        lcd /opt/
        get file1
*      lftp 192.168.0.101
        ls
        cd incoming
        lcd /opt/
        put file1






NFS
=====================================================================

类型
------------------------------------------

    System V



软件包
------------------------------------------

    nfs-utils



守护程序
------------------------------------------

    rpc.nfsd
    rpc.lockd
    rpciod
    rpc.mountd
    rpc.rquotad
    rpc.statd



脚本
------------------------------------------

    /usr/lib/systemd/system/nfs-server.service



端口
------------------------------------------

    2049（nfsd）



防火墙中要开放的服务
------------------------------------------

    mountd
    rpc-bind
    nfs



相关软件包
------------------------------------------

    tcp_wrappers



配置文件
------------------------------------------

###    /etc/exports

*      导出目录列表
*      条目项
        共享目录
          /var/ftp/pub
        客户端
          192.168.0.0/24
          *.example.com
        权限
          ro
          rw
        选项
          磁盘读写同步方式
            async
            sync
          角色
            root_squash
            no_root_squash
            all_squash
*      示例
        /var/ftp/pub  192.168.0.0/24(ro,sync,root_squash)



用例
------------------------------------------

###    刷新导出列表

      exportfs -r
      systemctl restart nfs-server


###    查看共享列表

      showmount -e <hostname>


###    访问共享目录

      mount
      autofs按需挂载


###    控制服务

      systemctl start nfs-server
      systemctl enable nfs-server






Samba
=====================================================================

类型
------------------------------------------

    System V



软件包
------------------------------------------

    samba
    samba-common
    samba-client



守护程序
------------------------------------------

    /usr/sbin/nmbd
    /usr/sbin/smbd



脚本
------------------------------------------

    /usr/lib/systemd/system/nmb.service
    /usr/lib/systemd/system/smb.service



端口
------------------------------------------

*    udp
      137
      138
*    tcp
      139
      445



配置文件
------------------------------------------

###    /etc/samba/smb.conf

*        .ini文件格式
*        部分
          [global]：            服务器通用或全局设置的部分
          [homes]：            用来准许某些或全部用户访问他们的目录
          [printers]：            定义打印机资源和服务
          每个共享都应该有它们自己的[]部分
*        选项
          public：            能够被guest访问的共享
          browsable
          writable
          printable：            资源是打印机，而不是磁盘
          group：            所有到共享的连接都使用group作为它们的主要组群
*        用户验证方法:          使用security=<method>来指定
            user
              通过用户和密码来校验（默认方法）
            domain/server
              带有一组验证数据的工作组
            ads
              作为通过Kerberos验证的活动目录Active Directory成员
            share
              在每个共享基础上的用户校验
*        使用testparm检查此文件的语法
          testparm /etc/samba/smb.conf desktop1.example.com 192.168.0.1
 

###     private/*.tdb

        保存加密密码



提供了四种主要服务
------------------------------------------

    用户验证和授权
    文件和打印机共享
    域名解析
    浏览（服务通告）



相关软件包
------------------------------------------

    smbclient的命令访问
    linux可以使用cifs文件系统挂载samba共享
 


用户管理
------------------------------------------

    用户必须拥有本地帐户或实施winbindd这个单独的服务
    添加用户：      smbpasswd -a <user>
    修改用户：      smbpasswd <user>



打印机共享
------------------------------------------

    /etc/cups/printers.conf中定义的所有打印机都是共享资源
    可以被改成允许共享明确公开的打印机



防火墙中要开放的服务
------------------------------------------

    samba
    samba-client



smbclient
------------------------------------------

    查看共享列表：smbclient -L //192.168.0.101 -U student%123
    使用-U选项来指定“用户%密码”
    设置和导出USER和PASSWD环境变量来指定



设置selinux让用户能够访问home目录
------------------------------------------

    setsebool -P samba_enable_home_dirs on



使用mount挂载
------------------------------------------

    mount -o username=student,password=123 //192.168.0.101/project /mnt/smbdata



编辑/etc/fstab开机自动挂载
------------------------------------------

    //stationX/homes  /mnt/homes  cifs  username=bob,password=redhat  0 0