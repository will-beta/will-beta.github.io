---
title: LINUX-iscsi服务
tags: [linux]
sitemap:
    lastmod: 2015-10-24T12:49:30-05:00
---

[TOC]






各种存储连接技术对比
=====================================================================

硬件
------------------------------------------

###    iSCSI

iSCSI驱动
NIC
IP网络
存储设备


###    FC

FC驱动
HBA卡
FC接口和线
存储设备


###    SCSI

SCSI驱动
HBA卡
SCSI接口和线
存储设备



软件
------------------------------------------

都是以处理SCSI命令和数据为核心
围绕传输接口做相关的处理






iqn：
=====================================================================

*  全称
    iSCSI Qualified Name
*  格式
    iqn.<date_code>.<reversed_domain>.<string>[:substring]






服务端
=====================================================================

```shell
#安装依赖包
yum -y install targetcli
systemctl enable target
systemctl start target
#创建存储设备
lvcreate -L 100M -n /dev/vgsrv/vdisk1
lvscan
#配置iSCSI
targetcli
```

targetcli中的操作
*      ls
        层次结构
          /
            backstores
              block
              fileio
              pscsi
              ramdisk
            iscsi
            loopback
*      /backstores/block create vdisk1 /dev/vgsrv/vdisk1
*      iscsi/ create iqn.2014-08.com.example.server1:vdisk1
*      iscsi/iqn.2014-08.com.example.server1:vdisk1/tpg1/acls create iqn.2014-08.com.example:desktop1
*      iscsi/iqn.2014-08.com.example.server1:vdisk1/tpg1/luns create /backstores/block/vdisk1
*      iscsi/iqn.2014-08.com.example.server1:vdisk1/tpg1/portals create 192.168.0.101
*      exit






客户端
=====================================================================

```shell
#查询并安装相关软件包
yum list iscsi-initiator-utils
#编辑配置文件
vi /etc/iscsi/initiatorname.iscsi #InitiatorName=iqn.2014-08.com.example:desktop1
#启动iscsi initiator
systemctl restart iscsi
#发现target会话
iscsiadm -m discovery -t st -p 192.168.0.101
#登录和断开target会话
iscsiadm -m node -T iqn.2014-08.com.example.server1:vdisk1 -p 192.168.0.101 -l
iscsiadm -m node -T iqn.2014-08.com.example.server1:vdisk1 -p 192.168.0.101 -u
#查看连接的磁盘
fdisk -l
#为连接的新磁盘分区
fdisk /dev/sdb
#格式化分区
mkfs.xfs /dev/sdb1
#创建目录并将新分区到上面
mkdir /mnt/iscsi
mount /dev/sdb1 /mnt/iscsi/
df -hT /mnt/iscsi/
#使开机自动挂载新分区
vi /etc/fstab #      /dev/sdb1  /mnt/iscsi  xfs  _netdev  0 0
```