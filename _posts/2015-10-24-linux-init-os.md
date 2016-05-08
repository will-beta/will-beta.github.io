---
title: LINUX-系统初始化
tags: [linux]
sitemap:
    lastmod: 2015-10-24T12:49:30-05:00
---


系统引导顺序
=====================================================================

BIOS初始化
------------------------------------------

*    检测周边设备
*    选择启动设备
*    读入引导设备的第一个扇区并执行



引导程序（bootloader）
------------------------------------------

###    组成

*      放置在MBR或硬盘第一个分区中的一小段代码
*      从引导分区调入


###    linux引导程序的最小需求

*      标题
*      内核位置
*      OS根文件系统及初始化ram盘位置


###    其它操作系统的引导程序的最小需求

*      标题
*      引导设备


###    GRUB2

*      支持在boot提示符下的命令行界面
*      支持从xfs,ext2/ext3/ext4,ReiserFS,JFS,FAT,minix,FFS文件系统启动
*      重建/boot/grub2/grub.cfg
        grub2-mkconfig > /boot/grub2/grub.cfg
*      修复MBR
 *       破坏
          rm -rf /boot/grub2/
          dd if=/dev/zero of=/dev/sda bs=446 count=1
 *       修复
          /sbin/grub2-install /dev/sda
          grub2-mkconfig > /boot/grub2/grub.cfg


###    在启动画面修改启动级别

*      systemctrl reboot重启系统
*      在grub启动画面上
 *       按e修改引导条目
          systemd.unit=multi-user.target
 *       按ctrl-x继续启动



内核初始化
------------------------------------------

*    设备检测
*    设备驱动初始化
*    以只读方式装载根文件系统
*    调入最初的进行（init）



加载init进程
------------------------------------------

*    /usr/lib/systemd/system/initrd.target
*    /etc/systemd/system/default.target符号链接指向不同的运行级
      /etc/systemd/system/[multi-user|graphical].target.wants/
*    可使用/sbin/runlevel显示当前或曾经的运行级






系统引导完后执行
=====================================================================

*  /etc/rc.d/rc.local
    此文件需要设置成可执行
      chmod +x /etc/rc.d/rc.local
*  /etc/issue文件
    用于配置shell中登录前的文字公告






故障分析
=====================================================================

数据收集
------------------------------------------

###    可用的命令

*      history
*      grep
*      diff
*      find /dir -cmin -60
*      tail -f logfile


###    产生额外的信息

*      打开syslog中的*.debug
*      应用程序中的--debug选项


检查
------------------------------------------

*    引导程序配置
*    内核
*    /usr/lib/systemd/system/initrd.target
*    /etc/systemd/system/default.target






使用rescue环境
=====================================================================

###  当根文件系统不可用时需要

*    从CDROM引导（boot.iso或DVD）
*    从USB存储器上的efiboot.img引导
*    从网络引导


###  文件系统重建

*    破坏
      rm -f /bin/mount
      echo /bin/date > /bin/ls
      rm  -fr /boot/*
      dd if=/dev/zero of=/dev/sda bs=446 count=1
      systemctl reboot
*    修复
      进入rescue环境
      anaconda询问将文件系统挂载到/mnt/sysimage/
      mkdir /mnt/source
      mount -o nolock 192.168.0.254:/var/ftp/pub /mnt/source/
      rpm -qf /bin/ls --root /mnt/sysimage/
      rpm -qf /bin/mount --root /mnt/sysimage/
      rpm -ivh --force /mnt/source/rhel7/dvd/Packages/coreutils-8.22-11.e17.x86_64.rpm /mnt/source/rhel7/dvd/Packages/util-linux-2.23.2-16.e17.x86_64.rpm --root /mnt/sysimage/
      chroot /mnt/sysimage
      ls /boot/
      /sbin/grub2-install /dev/sda
      rpm -V kernel
      exit
      rpm -ivh --force /mnt/source/rhel7/dvd/Packages/kernel-3.10.0-123.e17.x86_64.rpm --root /mnt/sysimage/
      chroot /mnt/sysimage
      grub2-mkconfig > /boot/grub2/grub.cfg
      exit
      exit
*    /mnt/source
*    $PATH包含了硬盘目录
*    定义MANPATH以访问man页


###  修复密码

*    传递运行级到init
      引导时在GRUB启动画面设置
      输入：rd.break
      需要删除rhgb和quiet
      ctrl+x引导系统启动
*    mount -o remount,rw /sysroot
*    chroot /sysroot/
*    echo 'redhat' | passwd --stdin root
*    touch /.autorelabel
*    exit
*    exit