---
title: LINUX-数据库服务mariadb
tags: [linux]
sitemap:
    lastmod: 2015-10-24T12:49:30-05:00
---

[TOC]






简介
=====================================================================

*  MYSQL的红帽版
*  开源，随RHEL7发行版发行






服务端配置
=====================================================================

```shell
#安装包
yum -y group install mariadb mariadb-client
#启动服务
systemctl start mariadb
systemctl enable mariadb
#修改配置文件
vi /etc/my.cnf #  skip-networking=1 #只允许本地连接
#初始化
执行mysql_secure_installation
```





基础命令
=====================================================================

```shell
#导入外部数据库脚本
mysql -u root -p < employees.sql
#查看数据库
show databases
#查看表
show tables
#查看表结构
desc tb_name
#创建新用户
create user user_name identified by user_password
#给用户授权
grant select,update on db_name.tb_name to user_name
#回收用户权限
revoke update on db_name.tb_name from user_name
#创建数据库备份
mysqldump -u root -p mypassword > /opt/inventory.dump
#还原数据库备份
mysql -u root -p mypassword < /opt/inventory.dump
```