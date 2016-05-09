---
title: LINUX-http服务
tags: [linux]
sitemap:
    lastmod: 2015-10-24T12:49:30-05:00
---

[TOC]






apache
=====================================================================

总览
------------------------------------------

    进程控制
      在访问前大量生成进程
      使进程数量配合访问
    载入动态模块
      不必重新编译就具备的运行时间可扩展能力
    虚拟主机
      多个网站可能共享同一个Web服务器



类型
------------------------------------------

    System V



软件包
------------------------------------------

    httpd
    httpd-devel
    httpd-manual



守护程序
------------------------------------------

    /usr/sbin/httpd



脚本
------------------------------------------

    /usr/lib/systemd/system/httpd.service



端口
------------------------------------------

    80
    443



配置
------------------------------------------

###    /etc/httpd/httpd.conf

####        控制常规的Web服务器参数

####        访问配置：提供基于主机的目录级和文件级访问控制

*          order提供次序控制
            order allow,deny #              允许明确指定的“allow”用户，拒绝其他用户
            order deny,allow #              拒绝明确指定的“deny”用户，允许其他用户

####        MIME类型配置

          AddType application/x-httpd-php .phtml
          AddType text/html .htm

####        指出用于目录的索引文件

          DirectoryIndex index.html default.html

####        用户页配置

```shell
vi /etc/httpd/conf.d/userdir.conf
su -student
mkdir public_html
vi public_html/index.html #              <center>hellom,world!</center>
ls -Zd public_html/
chcon -t httpd_sys_content_t -R public_html/
ls -Zd public_html/
ls -Z public_html/
ls -dl ~student
chmod o+x ~student
ls -dl ~student
setsebool -P http_enable_homedirs on
getsebool -a | grep httpd_enable_homedirs
systemctl restart httpd
elinks http://192.168.0.106/~student/
```

####        虚拟主机配置

```shell
vi /etc/httpd/conf.d/userdir.conf
su -student
mkdir public_html
vi public_html/index.html
  <center>hellom,world!</center>
ls -Zd public_html/
chcon -t httpd_sys_content_t -R public_html/
ls -Zd public_html/
ls -Z public_html/
ls -dl ~student
chmod o+x ~student
ls -dl ~student
setsebool -P http_enable_homedirs on
getsebool -a | grep httpd_enable_homedirs
systemctl restart httpd
elinks http://192.168.0.106/~student/
```


###      log/

        日志目录链接


###      run/

        运行时文件目录链接



日志
------------------------------------------

    /var/log/httpd/



文档
------------------------------------------

    /var/www/*



动态模块
------------------------------------------

    /usr/lib64/httpd/modules/



相关软件包
------------------------------------------

    mod_ssl
    elinks
      文字版浏览器



防火墙要开放的服务
------------------------------------------

    http



管理selinux开放的端口
------------------------------------------

    semanage port -l | grep ^http
    semanage port -a -t http_port_t -p tcp 12345



.htaccess文件的用法
------------------------------------------

###    改变目录的配置

*      添加MIME类型定义
*      允许或拒绝某些主机


###    设置用户和密码数据库

*      AuthUserFile指令
*      httpwd命令
        httpwd -cm /etc/httpd/.htpasswd bob
        httpwd -m /etc/httpd/.htpasswd alice


###    设置

```
AuthName "Bob's Secret Stuff"
AuthType Basic
AuthUserFile /var/www/html/.htpasswd
AuthGroupFile /var/www/html/.htgroup
<Limit GET>
require group staff
</Limit>
<Limit PUT POST>
require user bob
</Limit>
```


###    例

```shell
vi /etc/httpd/conf.d/virt1.conf
vi .htaccess
httpwd -cm /var/www/virt1/.htpasswd bob
httpwd -m /var/www/virt1/.htpasswd alice
```

/etc/httpd/conf.d/virt1.conf
```
<VirtualHost 192.168.0.100:80>
 ServerName virt1.com
 DocumentRoot /virt1
 <Directory /var/www/virt1>
  Allowoverride Authconfig
 </Directory>
</VirtualHost>
```

.htaccess
```
AuthName test
AuthType Basic
AuthUserFile /var/www/virt1/.htpasswd
require valid-user
```


CGI
------------------------------------------

###    概述

*    ScriptAlias指令将CGI程序限定在另外的目录中：      ScriptAlias /cgi-bin/ /path/cgi-bin/
*    Apache通过载入mod-perl类的模块来提高CGI运行速度


###    例

```shell
mkdir /var/www/virt2
mkdir /var/www/virt2/cgi-bin
vi /var/www/virt2/cgi-bin/foo.sh
vi /etc/httpd/conf.d/virt2.conf
ls -Zd /var/www/virt2/cgi-bin/
ls -Zd /var/www/cgi-bin/
chcon --reference /var/www/cgi-bin/ /var/www/virt2/cgi-bin/
getsebool -a | grep httpd_enable_cgi
sytemctl restart httpd.service
elinks http://www.virt2.com/cgi-bin/foo.sh
```

```
#!/bin/bash
echo Content-type:text/html
echo
echo "hello,world!"
```

```
<VirtualHost 192.168.0.106:80>
 DocumentRoot /var/www/virt2
 ServerName www.virt2.com
 ScriptAlias /cgi-bin/ "/var/www/virt2/cgi-bin/"
 <Directory /var/www/virt2/cgi-bin>
  Require all granted
 </Directory>
</VirtualHost>
```



WSGI
------------------------------------------

###    概述

*        需要安装mod_wsgi
*        WSGIScriptAlias指令将Python程序限定在另外的目录中：      WSGIScriptAlias /mypython/ /path/python_file
*        WSGI不能与mod_php同时使用


###    例

```shell
mkdir /var/www/virt3
vi /var/www/virt3/webapp.wsgi
vi /etc/httpd/conf.d/virt3.conf
restorecon -R /var/www/virt3/
ls -Zd /var/www/virt3
sytemctl restart httpd.service
elinks http://www.virt3.com/
```

/var/www/virt3/webapp.wsgi


```python
#!/usr/bin/python
def application(environ, start_response):
 status = '200 OK'
 response_headers = [('Content-type', 'text/plain'), ('Content-Length', str(12))]
 write = start_response(status,response_headers)
 write('hello,')
 output = 'world!\n'
 return [output]
```

/etc/httpd/conf.d/virt3.conf

```
<VirtualHost 192.168.0.106:80>
 DocumentRoot /var/www/virt3
 ServerName www.virt3.com
 WSGIScriptAlias / "/var/www/virt3/webapp.wsgi"
</VirtualHost>
```




Squid代理服务器
=====================================================================

概述
------------------------------------------

* Squid支持FTP、HTTP以及其它数据流的缓存
* Squid将SSL请求直接转发源服务器或另一个代理服务器
* Squid包括了一些高级功能：    访问控制列表、    缓存层次、    HTTP服务器加速



类型
------------------------------------------

    System V



软件包
------------------------------------------

    squid



守护程序
------------------------------------------

    /usr/sbin/squid



脚本
------------------------------------------

    /usr/lib/sytemd/system/squid.service



端口
------------------------------------------

    3128 tcp（squid）（可配置）



配置文件
------------------------------------------

*    /etc/squid/squid.conf

```
        http_port 3128
        cache_mem 8 MB
        cache_dir ufs /var/spool/squid 100 16 256
        acl all src 0.0.0.0/0.0.0.0
        http_access deny all
```



配置防火墙
------------------------------------------

```shell
    firewall-cmd --permanent --add-port=3128/tcp
    firewall-cmd --reload
    firewall-cmd --list-ports
```