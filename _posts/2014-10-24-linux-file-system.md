---
title: LINUX-文件系统
tags: [linux]
sitemap:
    lastmod: 2015-10-24T12:49:30-05:00
---


[TOC]



目录结构
=====================================================================

  / 与 /etc 与 /dev 与 /lib 必须在同一磁盘分区上
------------------------------------------



  /usr目录
------------------------------------------

###    工具软件的配置和可执行文件存放的目录
   
*      /usr/bin
*      /usr/lib


###    /usr存放系统发行时自带的程序


###    /usr/local存放用户自己安装的程序



  /bin 是 /usr/bin的快捷方式
------------------------------------------

    /sbin
    /lib



  服务目录
------------------------------------------

    /var
    /srv
      当前已不推荐使用



  /tmp
------------------------------------------

    超过10天以上未使用的资料将被删除



  系统信息目录使用专属的文件系统，无法直接文本编辑
------------------------------------------

    /proc
    /sys



  扩展文档
------------------------------------------

    /use/share/doc



  挂载点
------------------------------------------

###    /media
   
*      外设
*      图形界面中，自动挂载设备到/run/media/<用户名>下

###    /mnt
   
*      远程目录
*      console界面中，手动挂载设备到/mnt下



  /dev下的文件用于访问驱动
------------------------------------------

###    echo "message" > /dev/pts/1

###    三种文件属性决定访问哪种驱动

*      设置类型号
        字符设备或块设备
*      主设备号
*      次设备号






文件描述
=====================================================================

  基础文件类型
------------------------------------------

*    -
      一般文件
*    d
      目录
*    l
      符号链接文件
*    b
      块设备文件
*    c
      字符设备文件
*    p
      命名管道
*    s
      套接字



  inode
------------------------------------------

###    inode包含文件的元信息

*      文件类型
*      许可权限
*      uid
*      链接数量（指向该文件的路径数目）
*      gid
*      文件大小
*      可变的时间戳
*      文件数据在磁盘上的块指针
*      文件的其它数据


###    查看

*      ls -i
*      stat


###    rm命令会将空闲下来的数据块放到空闲列表上，以便优先使用此数据块



  链接
------------------------------------------

###    硬链接

*      增加inode的引用数
*      不能跨硬盘或分区
*      rm命令减少链接数，减至零时删除文件

###    软链接

*      也叫符号链接
*      ls -l显示链接名和引用的文件
*      文件类型l代表符号链接
*      符号链接的内容是名字指向的文件
*      ln -s filename linkname



  设备
------------------------------------------

###    设备在插入时被自动创建，断开时自动删除

*      使用udev进行管理

###    块设备

*      /dev/sda,/dev/sdb
        SCSI,SATA或USB存储
*      /dev/md0,/dev/md1
        软件RAID

###    字符设备

*      /dev/tty[2-6]
        虚拟控制台
*      /dev/null,/dev/zero
        软设备
*      /dev/random,/dev/urandom
        随机数






工具
=====================================================================

  cd：切换至家目录
------------------------------------------

    



  rmdir：删除空目录
------------------------------------------

    



  rm
------------------------------------------



  nautilus
------------------------------------------

    alt+拖放：      主动询问拖放操作的类型



  file：确定文件类型
------------------------------------------

    



  nano
------------------------------------------



  ls -R：递归显示目录以及子目录的内容
------------------------------------------

    



  tree
------------------------------------------



  blkid：查看所有设备上的文件系统标签和类型号
------------------------------------------

    



  df：统计磁盘空间的使用情况
------------------------------------------

    
*    -h 或 -H
      以更容易理解的单位显示大小
*    -T
      显示文件系统类型



  du：统计每个目录的使用情况
------------------------------------------

    
*    -s
      只统计单个目录的总计
*    -h



  挂载
------------------------------------------

###    mount

*      目标设备可以使用uuid或label进行指定
*      -a
        挂载/etc/fstab中列出的所有文件系统
  *        <dump>字段
            是否备份
  *        <pass>字段
            检查的优先级，0表示不检查
*      -o
        remount
          重新挂载


###    umount

*      -o
 *       rw
 *       suid
 *       dev
          是否使用此设备上的特殊功能，如光驱上的弹出光盘功能
 *       exec
          是否允许直接执行上面的应用程序
 *       async
          是否异步读写


###    fuser

*      检查对文件系统访问的进程
*      -k
        终止当前正在对文件系统访问的进程


###    showmount -e <NFS服务器地址>

      显示NFS服务器的共享列表


###    挂载共享点

      mout 192.168.0.254:/var/ftp/pub /mnt/


###    挂载目录至另一个目录

      mount --bind /opt/ /mnt/opt/



  归档工具
------------------------------------------

###    tar

*      可以备份到文件和磁带设备
*      可以保持文件的权限，属主和时间戳
*      支持扩展属性
*      使用rmt写入到远程磁带设备
*      例
 *       tar cf /opt/backup_etc.tar /etc
          建档
 *       tar cfP /opt/backup_etc.tar /etc /var 2> /dev/null
          建档时保留绝对路径信息
 *       tar tf /opt/backup_etc.tar | less
          查看档
 *       tar xf /opt/backup_etc.tar
          解档
 *       tar rf /opt/backup_etc.tar /var/
          追加
*      压缩
 *       gzip
          gzip /opt/backup_etc.tar
            会替换掉原文件
 *       bzip2
          bzip2 /opt/backup_etc.tar
            会替换掉原文件
*      归档并压缩
 *       tar cfz /opt/backup_etc.tar.gz /etc /var 2> /dev/null
 *       tar cfj /opt/backup_etc.tar.bz2 /etc /var 2> /dev/null


###    xfsdump/xfsrestore

*      备份和恢复XFS文件系统
*      不能工作在其它文件系统上
*      可以做全备份和增量备份
*      示例
 *       xfsdump -l 0 -f /opt/backup_home /dev/vol0/home
          0为全备份，1-9为增量备份
          会提示输入会话标签和媒体标签
 *       xfsrestore -I
          查询备份信息
 *       xfsrestore -S session-ID -f /opt/backup_home /home


###    rsync

*      能够极有效率地与远程系统交换文件
*      使用安全ssh连接用户传输：        rsync /etc/*.conf barney:/home/joe/configs/
*      比scp快速：只复制文件的不同部分






MBR
=====================================================================

###  用于调入操作系统的可执行代码


###  分区表

*    分区ID或类型
*    分区开始柱面号
*    分区包含的柱面数






磁盘分区
=====================================================================

###   一个扩展分区指向一个附加的分区描述符


###   内存支持的最大分区数

    SCSI：      15个


###   分区原因

*    可控性
*    性能
*    额度控制
*    修复


###   工具

*    fdisk
*    gdisk
*    parted
*    partprobe






创建文件系统
=====================================================================

*  mkfs.xfs
*  mkfs.ext4
*  mkfs.msdos
*  mkfs -t xfs
*  mkfs.xfs -L fslabel /dev/sdaX
      创建文件系统时设置文件系统标签
*  xfs_admin -L fslabel /dev/sdaX
      修改文件系统标签
*  mount [options] LABEL=fslabel mount_point
      挂载文件系统时通过标签进行定位






交换空间
=====================================================================

  mkswap：格式化交换分区或文件
------------------------------------------

    



  swapon：激活指定的交换空间
------------------------------------------

*      -a
        激活fstab中所有的交换空间
*      -s
        查看所有交换空间
*      -p
        修改交换空间的优先级



  swapoff：禁用指定的的交换空间
------------------------------------------

    



  创建交换空间
------------------------------------------

*    创建交换分区
      fdisk：        文件系统类型为82
*    创建交换文件
      dd if=/dev/zero of=/opt/wapfile bs=1M count=500






ACL：ACL可以共享文件而不用冒风险设备文件权限
=====================================================================
  
*  设置和查看
    getfacl file|directory
    setfacl -m u:gandolf:rwx file|directory
    setfacl -m g:nazgul:rwx file|directory
    setfacl -m d:u:frodo:rwx file|directory
    setfacl -x u:samwise file|directory
*  自动设定
    新文件从目录继续缺省ACL（如果存在）
    mv命令和cp -p会维持原有的ACL






磁盘限额：在单个文件系统上实限
=====================================================================

  
*  针对每个组或用户具有单独的策略
*  初始化
    mount -o uquota,gquota /dev/sda5 /opt
*  设置
    xfs_quota -x -c "limit bsoft=20M bhard=25M student" /opt
*  报告
    xfs_quota -x -c report






软件RAID
=====================================================================

  定义
------------------------------------------

###    多个磁盘编组形成“阵列”


###    可以提供更好的性能，冗余性或两者兼有


###    mdadm

*      提供软件RAID的管理界面
*      支持多种RAID级别，包括RAID0，1，5，6和10
*      备份磁盘提供更强的冗余性


###    RAID设备命名

      /dev/md{0,1,2...}



  配置
------------------------------------------

###    使用mdadm创建和定义RAID设备

      mdadm -C /dev/md0 -l 1 -n 2 /dev/sda{5,6}


###    为每个RAID设备格式化文件系统

      mkfs.xfs /dev/md0


###    测试RAID设备

*      mdadm -D /dev/md0
        检测RAID设备的同步状态
*      mdadm -Ds > /etc/mdadm.conf
        创建RAID配置信息


###    示例

*      使用fdisk创建两个分区5和6
        分区类型为“fd”
*      创建RAID1
        mdadm -C /dev/md0 -l1 -n2 /dev/sda{5,6}
*      创建RAID配置信息
        mdadm -Ds > /etc/mdadm.conf
*      格式化文件系统
        mkfs.xfs /dev/md0
*      写fstab以实现自动加载分区
        /dev/md0  /mnt/md0  xfs  defaults  1 2
*      检查状态
        df -hT /mnt/md0/



  测试和恢复
------------------------------------------

###    模拟磁盘失效

      mdadm /dev/md0 -f /dev/sda1


###    从一个RAID磁盘失效中恢复

*      移除失效的物理磁盘分区
        mdadm /dev/md0 -r /dev/sda1
        mdadm -D /dev/md0
*      追加另一块物理磁盘分区
        mdadm /dev/md0 -a /dev/sda7


###    mdadm的启动和停止

      mdadm -A /dev/md0 #        依赖于RAID配置文件/etc/mdadm.conf
      mdadm -S /dev/md0 #        得先umount






LVM
=====================================================================

  定义
------------------------------------------

*    为便于操作卷，包括重定义文件系统的大小，定义的抽象层
*    允许在多个物理设备上重新组织文件系统
*    设备被认定为物理卷
*    一个或多个物理卷可以用于创建成一个卷组
*    卷组由指定数目的固定大小的物理区域（Physical Extent,PE）定义
*    逻辑卷在卷组上创建并且由PE组成
*    文件系统创建在逻辑卷上



  创建逻辑卷
------------------------------------------

###    pvcreate

*      先使用fdisk生成分区，分区类型指定为8e
*      创建物理卷
*      从Linux Block Devices生成Physical Volumes
*      pvcreate /dev/sda5


###    vgcreate

*      关联物理卷到卷组
*      生成Volume Group
*      vgcreate -s 32M vg0 /dev/sda5
        PE指定为32M


###    lvcreate

*      在卷组中创建逻辑卷
*      生成Logical Volumes
*      lvcreate -L 256M -n data vg0
        创建256M的逻辑卷
*      lvcreate -l 20 -n data vg0
        创建20*PE大小的逻辑卷
*      mkfs.ext4 /dev/vg0/data
*      mkfs.xfs /dev/vg0/data


###    写fstab

      /dev/mapper/vol1-lv2  /mnt/lv2  ext4  defaults  1 2


###    lvscan



  扩展逻辑卷
------------------------------------------

###    lvextend可以扩展逻辑卷

      lvextend -L 512M -n /dev/vg0/data
      lvextend -l +200 -n /dev/vg0/data


###    resize2fs可以在联机或脱机状态下扩展ext4文件系统

      resize2fs /dev/vg0/data


###    xfs文件系统要使用xfs_growfs在联机状态下扩展xfs文件系统

      xfs_growfs /dev/vg0/data



  收缩逻辑卷
------------------------------------------

###    ext4文件系统必须在脱机状态下实施(umount）

      umount /dev/vg0/data


###    需要先进行文件系统校验（e2fsck）

      e2fsck -f /dev/vg0/data


###    再收缩文件系统（resize2fs）

      resize2fs /dev/vg0/data 256M


###    最后用lvreduce收缩卷

      lvreduce -L 256M -n /dev/vg0/data



  调整卷组
------------------------------------------

###    扩展


      vgextend vg0 /dev/sda6
      vgdisplay vg0


###    收缩

      pvmove /dev/sda5 /dev/sda6 #        移动老pv至新pv
      vgreduce vg0 /dev/sda5 #        移除老pv


###    移除

      vgremove



  逻辑卷快照
------------------------------------------

###    定义

*      快照是特殊的逻辑卷
*      快照是一个现有逻辑卷在创建快照的那一刻的完全复制
*      当现有的数据集需要一个临时拷贝或者备份时，快照是一种理想的方式
*      快照需要的空间大小，仅仅取决于相对于原始逻辑卷的不同部分
        快照在创建时分配空间，直到原始逻辑卷或快照有修改发生时才使用
        当原始逻辑卷上的数据被修改时，老的数据被复制到快照中
        快照只包含自快照建立以来原始逻辑卷或快照中变化的数据
*      快照可以对xfs/ext4等文件系统进行


###    创建

      lvscan
      lvcreate -L 128M -n /dev/vol0/home_snap -s /dev/vol0/home
      lvscan


###    加载

      mkdir /mnt/datasnap
      mount -o ro /dev/vg0/datasnap /mnt/datasnap


###    移除

      umount /mnt/datasnap
      lvremove /dev/vg0/datasnap
      lvscan