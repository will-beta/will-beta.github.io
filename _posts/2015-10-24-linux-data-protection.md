---
title: LINUX-数据安全
tags: [linux]
sitemap:
    lastmod: 2015-10-24T12:49:30-05:00
---

[TOC]




加密需要
=====================================================================

不加密流量的易受攻击性
------------------------------------------

*    密码/数据嗅探
*    数据操作
*    验证操作



不安全的传输协议
------------------------------------------

###    不安全密码

      telnet
      FTP
      POP3


###    不安全信息

      sendmail
      NFS
      NIS


###    不安全验证

      rsh
      rcp






常见加密技术
=====================================================================

随机数字生成程序
------------------------------------------

###    伪随机数字和资源

      键盘和鼠标等事件
      块设备中断


###    内核提供来源

*      /dev/random
        从源池中提取，用尽后阻塞
*      /dev/urandom
        从源池中提取，用尽后回归伪随机发生器，重新生成


###    例

      openssl rand -base64 20



单身散列
------------------------------------------

###    将任意数据缩成小“指纹”

      任意长度输入
      固定长度输出
      若修改数据，指纹也会改变
      无法从指纹中重新生成数据


###    常见算式

      md2
      md5
      mdc2
      rmd160
      sha
      sha1


###    例

      md5sum myfile > myfile.md5
      md5sum -c myfile.md5
      sha1sum myfile > myfile.sha1
      openssl dgst -md5 myfile



对称算法
------------------------------------------

###    基于单一密钥

      用于加密和解密


###    常见算式

      DES
      3DES
      Blowfish
      RC2
      RC4
      RC5
      IDEA
      CAST5


###    常见工具

      gpg
        3DES
        CAST5
        Blowfish
      openssl


###    例

      openssl des3 -e -in myfile -out myfile.des3
      openssl des3 -d -in myfile.des3 -out myfile



非对称算法
------------------------------------------

    基于一对公钥/私钥
    数字签名
    公钥体系
    数字证书



实施方式
------------------------------------------

    openssl
    gpg






公钥体系
=====================================================================

非对称加密依赖于公钥的完整性
------------------------------------------



两种防止劣质公钥的方法
------------------------------------------

*    公开钥匙指纹
*    公钥体系
      分布式信任网
      层次化证书授权机构
      数字证书






数字证书
=====================================================================

证书授权机构
------------------------------------------



数字证书
------------------------------------------

*    所有者
      公钥
      身份证件
*    颁发者
      分开的签名
      身份证件
*    有效性



类型
------------------------------------------

*    证书授权机构的证书
*    服务器证书
*    用户证书



使用证书授权机构创建X.509证书
------------------------------------------

### 在客户机

```shell
#创建私钥
openssl genrsa 2048 > www.key 
#创建证书申请文件,填入请求信息
openssl req -new -key www.key -out www.csr 
#上传证书申请文件
lftp 192.168.0.254 
cd certinput/
put www.csr
#颁发完成后下载证书
get www.crt 
```


### 在证书颁发机构机

```shell
#登录
ssh 192.168.0.254 
#创建证书
openssl ca -in /var/ftp/certinput/www.csr -out /var/ftp/certoutput/www.crt 
```



创建自签名X.509证书
------------------------------------------

```shell
cd /etc/pki/tls/certs/
#          去除openssql命令的“-aes128”选项，以去除对称加密操作  
vi Makefile    
#创建私钥  
make webapp.key      
#创建证书文件，填入请求信息
make webapp.crt 
```





openSSH
=====================================================================

总览
------------------------------------------

*    用openSSH代替常用的不安全网络通讯应用程序
*    提供用户验证以及基于令牌的验证
*    系统默认配置位于/etc/ssh/
      客户机配置
        ssh_config
      服务器配置
        sshd_config



服务器
------------------------------------------

###    在联网的系统间提供更强大的数据安全性

*      公钥/密钥加密
*      和SSH的早期限于商用的版本兼容
*      通过libwrap.so来实施基于主机的安全性


###    类型

      System V


###    软件包

*      openssh
*      openssh-clients
*      openssh-server


###    守护程序

      /usr/sbin/sshd


###    脚本

      /sur/lib/systemd/system/sshd.service

###    端口

      22


###    配置文件

*      /etc/ssh/*
 *       sshd_config
  *        Protocol
            更改端口时同时也要更改
              selinux
                semanage port -a -t ssh_port_t -p tcp <新端口号>
              防火墙
                firewall-cmd --permanent --add-port=<新端口号>/tcp
  *        ListenAddress
  *        PermitRootLogin
            是否允许root用户直接登录
            若不允许，则可以先使用普通用户登录，然后通过su命令切换至root用户
*      $HOME/.ssh/


###    相关软件包

*      openssl
*      openssh-askpass
*      tcp_wrappers



客户机
------------------------------------------

###    移除先前的连接密钥

      ls .ssh/
        authorized_keys
        known_hosts
      rm -f .ssh/*
      rm -f .ssh/id_rsa*


###    生成密钥对

      ssh-keygen -t rsa
        公钥文件
          id_rsa.pub
        私钥文件
          id_rsa


###    将私钥添加至缓存

```shell
      ssh-add .ssh/id_rsa
      ssh-copy-id -i .ssh/id_rsa.pub 192.168.0.106 #上传公钥至服务器
```


###    用例

*      安全shell会话
        ssh hostname
          ssh -X 192.168.0.106
        ssh user@hotname
          ssh student@129.168.0.106
        ssh hostname remote-command
          ssh 192.168.0.106 ls /etc/yum.repos.d/
*      安全文件传输和目录复制
        scp file user@host:remote-dir
*      由sshd提供的安全ftp
        sftp host






应用程序
=====================================================================

RPM检测文件完整性
------------------------------------------

###      被安装的文件

        MD5单向散列
        rpm --verify package_name
          或-V
          rpm -V util-linux


###      发行的软件包文件

        GPG公钥签名
        rpm --import /mnt/RPM-GPG-KEY-redhat-*
          rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-redhat-release
        rpm --checksig package_file_name
          或-K
          rpm --vvK /mnt/rhel7/dvd/Packages/bind-9.9.4-14.el7.x86_64.rpm 2> /dev/null



ssl
------------------------------------------

###    软件包

      mod_ssl


###    配置文件:      /etc/httpd/conf.d/ssl.conf

*        SSLHonorCipherOrder on
*        SSLCertificateChainFile根钥路径          
            /etc/pki/tls/certs/root.crt
*        SSLCertificateKeyFile私钥路径          
            /etc/pki/tls/private/your_host.key
*        SSLCertificateFile公钥路径          
            /etc/pki/tls/certs/your_host.crt

###    配置权限

*      配置selinux
        restorecon certs/*.crt
        restorecon private/*.key

*      配置文件权限
        chmod 600 certs/*.crt
        chmod 600 certs/*.key

*      配置防火墙
        firewall-cmd --permanent --add-service=https
        firewall-cmd --reload



### 生成公钥

            cd /etc/pki/tls/cert/
            make server.cert


### 生成私钥

            cd /etc/pki/tls/cert/
            make server.key
              要输入密码
            openssl rsa -in server.key -out server.key
              清除密码，以便apache顺利读取