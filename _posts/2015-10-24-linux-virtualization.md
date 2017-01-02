---
title: LINUX-虚拟化
tags: [linux]
sitemap:
    lastmod: 2015-10-24T12:49:30-05:00
---

[TOC]





虚拟化技术
=====================================================================

*  从物理硬件中抽取用户环境
*  把一个单独的机器资源隔离出多个相互隔离的环境
*  允许一个环境独占共享的资源






虚拟化分类
=====================================================================

硬件仿真
------------------------------------------

*    bochs
*    qemu



完全虚拟化
------------------------------------------

*    kvm
*    vSphere
*    HyperV



半虚拟化
------------------------------------------

*    xen






虚拟化实现方式
=====================================================================

vmm
------------------------------------------

*    转译指令
*    管理虚拟机
*    为虚拟机提供一个虚拟的硬件环境



X86处理器的优先级（ring）有四个
------------------------------------------

*    ring0最高级别，用于操作系统内核。ring1、ring2、ring3级别最低
*    如果是传统的虚拟化，ring0用于vmm，ring1用于内核
*    如果是硬件辅助的虚拟化，ring1用于vmm，ring0用于内核
*    如果是半虚拟化，ring1用于vmm，ring0用于内核，必须修改内核






硬件辅助的完全虚拟化
=====================================================================

要求
------------------------------------------

*    64bits CPU
*    支持虚拟化指令集的CPU



检查CPU是否支持虚拟化
------------------------------------------

*    egrep -e 'vmx|svm' /proc/cpuinfo
*    厂商的网站






红帽虚拟化
=====================================================================

安装虚拟机
------------------------------------------

###    安装软件包

      yum group list hidden
      yum -y group install "Virtualization*"


###    启动libvirtd

      systemctl start libvirtd
      systemctl enable libvirtd



添加虚拟交换机
------------------------------------------

###    vi /etc/sysconfig/network-scripts/ifcfg-vnet0

      DEVICE=vnet0
      ONBOOT=yes
      BOOTPROTO=dhcp
      TYPE=Bridge



添加接口到交换机
------------------------------------------

###    在交换机上添加接口eth0

*      cat /etc/sysconfig/network-scripts/ifcfg-eth0
        DEVICE=eth0
        ONBOOT=yes
        BOOTPROTO=dhcp
        BRIDGE=vnet0


###    重启libvirtd

      systemctl restart libvirtd



virt-manager
------------------------------------------

*    用virt-manager工具来安装虚拟机
*    虚拟机配置文件位于/etc/libvirt/qemu/
*    使虚拟机能够随物理机启动而自行启动
      使用virt-manager工具编辑
      为/etc/libvirt/qemu/vserver.xml创建快捷方式到/etc/libvirt/qemu/autostart/



虚拟机快照
------------------------------------------

*    使用逻辑卷快照功能实现
*    需要修改/etc/libvirt/qemu/虚拟机.xml文件






docker：轻量级的虚拟化程序
=====================================================================

安装
------------------------------------------

    yum -y install docker



启动
------------------------------------------

    sudo systemctl start docker



操作镜像
------------------------------------------

*    搜索可用的docker镜像
      sudo docker search NAME
*    下载docker镜像
      sudo docker pull NAME
*    导入镜像
      docker load -i rhel7 -docker.tar.gz
*    查看导入的镜像列表
      docker images
*    编辑导入的镜像的repository名
      docker tag rhel7 docker_id
*    导出
      docker save -o <文件名> <repository名>



在镜像中执行命令
------------------------------------------

###    参数

*      -t
        让Docker分配一个伪终端（pseudo-tty）并绑定到容器的标准输入上
*      -i
        则让容器的标准输入保持打开
*      -d
        在后台运行容器
        若无，则执行完命令后终止容器
*      -p
        指示要暴露哪些端口，默认不暴露。
        至于哪些端口可以暴露，那由dockerfile中的EXPOSE指令来控制。



###    例

      docker run -i -t rhel7 bash



控制容器
------------------------------------------

*    列表
      docker ps -a
*    启动
      docker start -ai 
*    停止
      docker stop
*    移除
      docker rm
*    附加
      docker attach



参考
------------------------------------------

    http://dockerpool.com/static/books/docker_practice/image/pull.html
