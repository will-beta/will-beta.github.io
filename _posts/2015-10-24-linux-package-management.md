---
title: LINUX-软件包管理
tags: [linux]
sitemap:
    lastmod: 2015-10-24T12:49:30-05:00
---

[TOC]






rpm
=====================================================================

rpm本地数据库：    /var/lib/rpm
------------------------------------------

*      Group
*      签名信息
        Sha1header
        Sigmd5
*      __db.001



rpmbuild
------------------------------------------



增删改
------------------------------------------

*    rpm -ivh | --install --verbose --hash rpmfile
*    rpm -Fvh | --freshen --verbose --hash rpmfile
*    rpm -Uvh | --upgrade --verbose --hash rpmfile
*    rpm -e | --erase rpmfile



查
------------------------------------------

*    rpm -qa
*    rpm -q package
*    rpm -qf file_path_name
*    rpm -qp rpmfile
*    -i
      包的主要信息
*    -l
      显示包中的文件
*    --scripts
      显示安装前后要执行的脚本



  校验
------------------------------------------

###    已安装的包

      rpm -V package
      rpm -Vp rpmfile
      rpm -Va


###    未安装的包

      rpm --import RPM-GPG-KEY-redhat-release
      rpm -K rpmfile



  rpm --vvk rpmfile
------------------------------------------






yum
=====================================================================

  资源库
------------------------------------------

*    repodata目录



  引用资源库
------------------------------------------

*    /etc/yum.repos.d/<repo-name>.repo
      [repo-name]
        name=A nice description
        baseurl=http://yourserver.com/repopath  
        enabled=1  
        gpgcheck=1
*    yum clean <dbcache|all>



  增删改
------------------------------------------

*    yum install package
*    yum localinstall rpmfile
*    yum groupinstall packagegroup
*    yum remove package
*    yum update package



  查
------------------------------------------

*    yum search searchterm
*    yum list [all] [package_glob]
*    yum list (available|updates|installed|extras|obsoletes [package_glob])
*    yum info package
*    yum groupinfo packagegroup
*    yum whatprovides filename