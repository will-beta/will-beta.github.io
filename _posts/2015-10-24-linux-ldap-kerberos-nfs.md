---
title: LINUX-LDAP+Kerberos+nfs集成
tags: [linux]
sitemap:
    lastmod: 2015-10-24T12:49:30-05:00
---

[TOC]




LDIF
=====================================================================

*  一个标准的基于文本格式的文件，描述目录条目
*  一个条目由一组属性组成：    每一行一个属性；    dn是一个条目独一的名字，必须位于第一行
*  条目与条目之间用空行来分隔






kerberos+LDAP
=====================================================================

kerberos服务器
------------------------------------------

###    依赖包

*      krb5-srever
*      krb5-libs


###    关联包

*      ntp
*      krb5-workstation
*      pam_krb5



kerberos客户机
------------------------------------------

###    依赖包

*      krb5-libs
*      krb5-workstation
*      pam_krb5


###    配置验证方式

*      运行system-config-authentication加入域
          Kerberos password
            Realm
              EXAMPLE.COM
            KDCs
              192.168.0.254:88
            Admin Servers
              192.168.0.254:749



LDAP客户机
------------------------------------------

###    加入域

*      安装
        sssd
        authconfig-gtk
        openldap-clients
*      运行system-config-authentication加入域
        User Account Configuration
          LDAP Search Base DN
            dc=example,dc=com
          LDAP Server
            ldap://instructor.example.com
          Download CA Certificate...
        Authentication Configuration
          LDAP password


###    配置autofs服务

####      概述

*        automount守护进程：          监视所有对这些目录的访问，按要求挂载
*        相应的文件系统也会在空闲一段时间后自动卸载


####      修改配置文件

*        /etc/autofs.master
          /home/guests /etc/auto.misc
            确保客户机里一定不能存在/home/guests目录
            此目录必须由autofs自动创建
*        /etc/autofs.misc
          #nisuser2000  -fstype=nfs,rw,soft,intr  192.168.0.101:/home/guests/nisuser2000
          *  -fstype=nfs,rw,soft,intr  192.168.0.101:/home/guests/&
          username instructor.example.com:/rhome/username
*      重启服务生效
        yum restart autofs
*      查看挂载情况
        df -hT






kerberos+nfs
=====================================================================

nfs服务器
------------------------------------------

###    加入kerberos域


###    获取配置keytab文件：      保存了kerboros域中所有主机的相关密钥信息

```shell
wget -0 /etc/krb5.keytab ftp://192.168.0.254/pub/krb5.keytab
chmod 600 /etc/krb5.keytab
```


###    配置idmapd服务

```shell
vi /etc/idmapd.conf #Local-Realms=EXAMPLE.COM
systemctl start nfs-idmap
systemctl enable nfs-idmap
```


###    配置nfs-secure-server服务

```shell
systemctl start nfs-secure-server
systemctl enable nfs-secure-server
```


###    配置nfs服务

```shell
vi /etc/exports #/securenfs  *.example.com(sec=krb5p,rw)
systemctl start nfs-server
systemctl enable nfs-server
exportfs -arv
showmount -e 192.168.0.101
```



nfs客户机
------------------------------------------

```shell
vi /etc/idmapd.conf #  Local-Realms=EXAMPLE.COM
wget -0 /etc/krb5.keytab ftp://192.168.0.254/pub/krb5.keytab
chmod 600 /etc/krb5.keytab
systemctl start nfs-idmap nfs-secure
systemctl enable nfs-idmap nfs-secure
mkdir /mnt/securenfs
showmount -e server1
mount server1:/securenfs /mnt/securenfs/
mount | grep securenfs
ssh ldapuser1@192.168.0.1
touch /mnt/securenfs/file1
vi /etc/fstab #  server1:/securenfs  /mnt/securenfs  nfs  sec=krb5p  0 0
```