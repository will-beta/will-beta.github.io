---
title: LINUX-NIS+NFS+AUTOFS集成
tags: [linux]
sitemap:
    lastmod: 2015-10-24T12:49:30-05:00
---

[TOC]




概述
=====================================================================

*  用于linux间帐号共享
*  只限id为1000以上的普通帐户
*  由SUN公司开发






NIS服务器
=====================================================================

配置NIS
------------------------------------------

###    安装

```shell

yum -y install ypserv

```


###    设置nis域名

```shell

nisdomainname DOMAIN1
echo '/bin/nisdomainname DOMAIN1' >> /etc/rc.local
ll /etc/rc.d/rc.local
chmod +x /etc/rc.d/rc.local
echo 'NISDOMAIN=DOMAIN1' >> /etc/sysconfig/network

```


###    修改NIS配置文件：      vi /etc/ypserv.conf

```

192.168.0.0/255.255.255.0  :*  :*  :none
  允许访问任何域名
  允许访问任何数据库
-  :*  :*  :deny

```


###    启动nis服务

```shell

systemctl start ypserv
systemctl enable ypserv

```


###    生成帐户

```shell

mkdir /home/guests
for i in $(seq 2000 2004) do   useradd -d /home/guests/nisuser$i nisuser$i   echo 'redhat' | passwd --stdin nisuser$i done

```


###    生成nis数据库

```shell

/usr/lib64/yp/ypinit -m

```



配置NFS
------------------------------------------

```shell

vi /etc/exports #      /home/guests 192.168.0.8/24(rw,sync)
systemctl start nfs-server
systemctl enable nfs-server
showmount -e 192.168.0.101

```






NIS客户机
=====================================================================

加入域
------------------------------------------

###    安装

      包名是ypbind,默认已经安装


###    运行setup加入域

      域名
      服务器IP


###    测试

      ypcat passwd



配置autofs服务
------------------------------------------

###    概述

*      automount守护进程
        监视所有对这些目录的访问，按要求挂载
*      相应的文件系统也会在空闲一段时间后自动卸载


###    修改配置文件

*      /etc/autofs.master
        /home/guests /etc/auto.misc
          确保客户机里一定不能存在/home/guests目录
          此目录必须由autofs自动创建
*      /etc/autofs.misc
        #nisuser2000  -fstype=nfs,rw,soft,intr  192.168.0.101:/home/guests/nisuser2000
        *  -fstype=nfs,rw,soft,intr  192.168.0.101:/home/guests/&
        username instructor.example.com:/rhome/username


###    重启服务生效

      yum restart autofs


###    查看挂载情况

      df -hT