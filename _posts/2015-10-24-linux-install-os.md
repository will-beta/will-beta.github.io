---
title: LINUX-系统安装
tags: [linux]
sitemap:
    lastmod: 2015-10-24T12:49:30-05:00
---


Anaconda支持不同的模式
=====================================================================

*  Kickstart：    自动化安装
*  upgrade：    升级已存在版本
*  rescue：    对不能启动的系统进行故障排除







第一阶段 准备安装
=====================================================================

概述
------------------------------------------

###  可以由任意一个被支持的bootloader启动

*    boot.iso或安装CD
*    包含efiboot.img的USB驱动器
*    PXE网络启动
*    其它bootloader，如GRUB2
*    引导软件不再被支持
*    引导介质可以针对个性化安装进行修改

###  由一个安装内核vmlinuz和initrd.img构成



任务
------------------------------------------

*    初始化安装器
*    解析命令行参数
*    自动检测硬件
*    装载附加驱动
*    选择语言，键盘布局和安装方式
*    设置安装需要的网络



进入安装程序
------------------------------------------

###   图形化安装

####      是缺省的安装类型号

####      inst.repo

          安装源
*            本地光盘
*            硬盘驱动器
*            NFS
*            HTTP

####      inst.ks

*          无人值守的自动化安装方式
*          http://10.32.5.1/mnt/archive/RHEL-7/7.x/Server/x86_64/kickstarts/ks.cfg


###    基于VNC的安装

*      激活vnc并且使用密码保护会话
*      inst.vnc
*      inst.vncpassword=


###    基于文本的安装

*      inst.text
*      基于菜单的终端界面


###    串口安装

*      当图形卡没有被检测到时自动使用
*      启用方式：console=ttyS0







第二阶段 执行安装
=====================================================================

  任务
------------------------------------------

###    硬盘分区

      一般至少3个分区
*        /
*        /swap
*        /boot

###    引导程序（bootloader）配置

###    网络和时区配置

###    软件包选择



配置文件系统
------------------------------------------

###    在安装中必须选择挂载点，分区大小和文件系统类型

      可以手工设置，也可以自动设置



###    有很多布局可以使用

####      根分区必须包含

*        /etc
*        /lib
*        /bin
*        /sbin
*        /dev

####      swap空间一般是内存的两倍大小


####      标准的挂载点

*        /boot
*        /home
*        /usr
*        /var
*        /tmp
*        /usr/local
*        /opt



###    替代分区的方式

####      软RAID

*        创建一个分区并且选择“Software RAID”做为“文件系统”类型
*        合并多个RAID分区形成一个RAID设备


####      LVM

*        选择“Physical Volume”用于创建一个物理卷
*        LVM创建一个卷组：          可选择是否使用RAID以及相应的LEVEL
*        创建新的逻辑卷
*        LVM Thin Provisioning支持缩小分区大小，但只被ext3和ext4支持







无人值守安装
=====================================================================

通过网络启动anaconda
------------------------------------------

###    anaconda的第一阶段由tfp提供


###    anaconda的第二阶段通过HTTP、NFS提供

    有用的选项
*      inst.ks=
*      ip=dhcp或特定的ipaddress
*      inst.text
*      inst.repo



dhcp
------------------------------------------

###    类型

      system V


###    软件包

      dhcp


###    守护程序

      /usr/sbin/dhcpd


###    启动脚本

      /usr/lib/systemd/system/dhcpd


###    端口

*     67
        bootps
*     68
        bootpc


###    配置文件

*     /etc/dhcp/dhcpd.conf
  *       /usr/share/doc/dhcp-<version>/dhcpd.conf.sample文件中提供了配置模板
  *       配置文件中必须要有一个作用域的配置块，且必须与服务器的网卡IP对应
  *       例
            ddns-update-style interim;
            ingore client-updates;
            default-lease-time 43200;
            option routers 192.168.0.254;
            option domain-name "domain1.example.com";
            option domain-name-servers 192.168.0.1;
            subnet 192.168.0.0 netmask 255.255.255.0 { range 192.168.0.200 192.168.0.209; }
*       /etc/dhcp/dhcpd6.conf
*       /etc/dhcp/dhclient.d


###    文档

      /usr/share/doc/dhcp-<版本号>/
*        dhcpd6.conf.example
*        dhcpd.conf.example
*        ldap


###    相关软件

*      dhclient
*      dhcpv6_client
*      dhcpv6


###    手动配置ip

*      vi /etc/sysconfig/network-scripts/ifcfg-br0
        BOOTPROTO=static
        IPADDR=192.168.0.1
        NETMASK=255.255.255.0
        GATEWAY=192.168.0.254
*      systemctl restart network



tftp
------------------------------------------

###    概述

*    trivial file transfer protocol
*    像ftp一样的简单的get,put命令
*    小的属性设置和小的代码
*    只支持UDP，不安全


###    端口

      69


###    软件包

      tftp-server


###    依赖软件包

      xinetd


###    存储目录

      /var/lib/tftpboot/


###    配置

*      vi /etc/xinetd.d/tftp
        disable=no
*      systemctl start xinetd.service
*      netstat -ntulp | grep 69



PXE boot
------------------------------------------

###    PXE是一个pre-boot执行环境

*      PXE提供第一阶段的启动引导
*      主机BIOS和网卡必须要支持PXE


###    PXE启动过程

*      网卡申请DHCP信息
*      DHCP服务器提供启动引导名称和TFTP服务器的IP
*      网卡用TFTP去获取启动引导信息
*      BIOS执行启动引导器
*      启动引导器用FTFP去找配置文件
*      启动引导器按配置文件的内容运行


###    pxe文件

*      网络启动引导器
*      由syslinux软件包提供
        /usr/share/syslinux/pxelinux.0
*      在系统中默认已安装
*      向tfp服务器查找pxelinux.cfg/filename
*      filename的顺序
        以ARP类型代码1开头，用“-”分隔的主机mac地址
        用16进制表示的主机IP地址（可以用gethostip得到）
        最后查找default
*      无人值守机器通过dhcp服务器知道此文件名
        filename "pxelinux.0";#引导文件信息
        next-server 192.168.0.1;#tftp服务器地址
*      例
        cd /var/lib/tftpboot/
        mkdir pxelinux.cfg
        cp /usr/share/syslinux/pxelinux.0 ./


###    pxe配置

*      vi pxelinux.cfg/default
        display boot.msg default vecamenu.c32 timeout 300  menu title Welcome to RHEL 7 setup!  label rhel7   menu label Kickstart Install RHEL 7   kernel vmlinuz   append initrd=initrd.img inst.repo=http://192.168.0.1/pub/rhel7/dvd inst.ks=nfs:192.168.0.1:/kickstart/rhel7.cfg



kickstart文件
------------------------------------------

###    系统安装后默认留下~/anaconda-ks.cfg可作为kickstart文件模板


###    命令部分
      
*      配置系统信息


###    %packages部分

*      选择需要安装的软件包和软件分组
*      始终会解决依赖关系


###    脚本部分

*      可选，可能有多个，用于定制系统
*      %pre脚本在安装前运行
*      %post脚本在安装后运行


###    配置示例

*      cd ~
*      mkdir /kickstart
*      vi /etc/exports
        /kickstart  192.168.0.0/24(ro,sync)
*      systemctl start nfs-server
*      yum -y install system-config-kickstart
*      system-config-kickstart
*      vi /kickstart/rhel7.cfg
        part pv.5 --fstype="lvmpv" --ondisk=vda --size=20000
        volgroup vgsrv --pesize=4096 pv.5
        logvol / --fstype="xfs" --size=8192 --name=root --vgname=vgsrv
        logvol /home --fstype="xfs" --size=128 --name=home --vgname=vgsrv
        logvol swap --fstype="swap" --size=1024 --name=swap --vgname=vgsrv
*      sed -n '126,169p' anaconda-ks.cfg >> /kickstart/rhel7.cfg



无人值守安装配置
------------------------------------------

###    创建kickstart文件


###    创建http服务器以提供安装文件

      lvcreate -L 5G -n /dev/vol0/html
      mkfs.xfs /dev/vol0/html
      yum -y install httpd bind
      vi /etc/fstab #        /dev/mapper/vol0-html /var/www/html xfs defaults 1 2
      df -hT
      mount 192.168.0.254:/var/ftp/pub /mnt/
      mkdir /var/www/html/rhel7/dvd -p
      cp -rp /mnt/rhel7/devd/* /var/www/html/rhel7/dvd/
      ls -Zd /var/www/html/rhel7/dvd/
      restorecon -R /var/www/html
      ls -Zd /var/www/html/rhel7/dvd/


###    创建dns服务器以提供主机名

*      yum -y install bind
*      vi /etc/named.conf
        禁用dnssec
*      vi /etc/named.rfc1912.zones
        zone "domain1.example.com" { type master; file "domain1.example.com.zone"; allow-update {none;}; allow-transfer {none;}; };
        zone "0.168.192.in-addr.arpa" { type master; file "192.168.0.zone"; allow-update {none;}; allow-transfer {none;}; };
*      cd /var/named/
*      cp -p /var/named/named.localhost /var/named/domain1.example.com.zone
        拷贝时使用-p选项指定同时拷贝权限相关数据
        详细数据
          $TTL 43200 @       IN SOA         desktop1.domain1.example.com. root(             2014092901 ;serial             3H ;refresh             5M ;retry             1W ;expire             5M ;minimum            ) @       IN NS      desktop1.domain1.example.com. desktop1 IN A           192.168.0.106 $GENERATE 200-209   test$ IN A           192.168.0.$
*      cp -p /var/named/domain1.example.com.zone /var/named/192.168.0.zone
        $TTL 43200 @       IN SOA         desktop1.domain1.example.com. root(             2014092901 ;serial             3H ;refresh             5M ;retry             1W ;expire             5M ;minimum            ) @       IN NS      desktop1.domain1.example.com. 1     IN PTR           desktop1.domain1.example.com. $GENERATE 200-209   $     IN PTR           test$.domain1.example.com.  
*      systemctl restart named
*      dig -x 192.168.0.205
*      dig test209.domain1.example.com


###    配置tftp服务器

*      拷贝pxe文件
        pxelinux.0
*      编辑pxe配置
        pxelinux.cfg/default
*      拷贝安装文件
        cp /var/www/html/rhel7/dvd/isolinux/* /var/lib/tfpboot/


###    配置dhcp服务器

*      filename "pxelinux.0";#引导文件信息
*      next-server 192.168.0.1;#tftp服务器地址


###    创建虚拟机并安装

*      lvcreate -L 35G -n /dev/vol0/vserver
*      virt-manager