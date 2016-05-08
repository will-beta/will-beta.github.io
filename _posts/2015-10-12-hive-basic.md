---
title: apache hive基础
tags: [hive]
sitemap:
    lastmod: 2015-10-12T12:49:30-05:00
---



概述
==========================================================================

* hive是基于hadoop HDFS之上的数据仓库。
* hive可用来进行数据的提取、转化、加载（ETL）
* hive定义了简单的类似SQL查询语言，称为HQL，允许熟悉SQL的用户查询数据
* hive允许熟悉MapReduce开发者开发自定义的mapper和reducer来处理内建的mapper和reducer无法完成的复杂的分析工作
* hive是SQL解析引擎，它将SQL语句转化成M/R Job，然后在Hadoop中执行
* hadoop表其实就是HDFS的目录/文件



数据仓库
==========================================================================

定义
----------------------------------------

* 数据仓库是一个面向主题的、集成的、不可更新的、随时间不变化的数据集合，它用于支持企业或组织的决策分析处理。



结构和建立过程
----------------------------------------

### 数据源

* 业务数据系统
* 文档资料
* 其它数据


### 数据存储及管理

* 抽取（Extract）
* 转换（transform）
* 装载（load）


### 数据仓库引擎

* 服务器


### 前端展示

* 数据查询
* 数据报表
* 数据分析
* 各类应用



OLTP应用和OLAP应用
----------------------------------------

* 典型的OLTP应用：银行转帐
* 典型的OLAP应用：商品推荐系统



数据模型
----------------------------------------

* 星型模型
* 雪花模型





体系结构
==========================================================================

元数据存储
----------------------------------------

* hive将元数据存储在数据库中（metastore），支持mysql、derby等数据库。
* hive中的元数据包括表的名字、表的列和分区及其属性、表的属性（是否为外部表等）、表的数据所在目录等



访问接口
----------------------------------------

CLI
JDBC/ODBC,Thrift Server
Web Console(只能查询)



驱动
----------------------------------------

* 解释器：词法分析、语法分析
* 编译器：编译
* 优化器：优化及查询计划的生成，生成的查询计划存储在HDFS中，并在随后由MapReduce调用执行。



hadoop
----------------------------------------

数据存储
MapReduce调用





安装
==========================================================================

嵌入模式
----------------------------------------

### 概念

* 元数据信息被存储在hive自带的derby数据库中
* 只允许创建一个连接
* 多用于demo


### 配置

.bash_profile
```bash
JAVA_HOME=/root/training/jdk1.7.0_75
HADOOP_HOME=/root/training/hadoop-2.4.1
export PATH=$JAVA_HOME/bin:$HADOOP_HOME/bin;$HADOOP_HOME/sbin:$PATH

HIVE_HOME=/root/training/apache-hive-0.13.0-bin
export PATH=$HIVE_HOME/bin:$PATH
```

可运行“”使其马上生效。


### 运行

```bash
source .bash_profile
hive
```
可在hive目录中看到新创建的metastore_db目录




本地模式
----------------------------------------

### 概念

* 元数据信息被存储在mysql数据库中
* mysql数据库与hive运行在同一台机器上
* 多用于开发和测试


### 远程安装配置

* 在嵌入模式的配置基础上进行扩展

* 在mysql中创建一个空数据库hive以用于存储元数据

* 将mysql-connector-java-5.1.7-bin.jar拷贝至hive的lib目录中

* vim conf/hive_site.xml
```xml
<?xml version=“1.0”?>  
<?xml-stylesheet type=“text/xsl” href=“configuration.xsl”?>  
  
<configuration>  
  
<property>  
  <name>javax.jdo.option.ConnectionURL</name>  
  <value>jdbc:mysql://192.168.56.101:3306/hive</value>  
</property>  
   
<property>  
  <name>javax.jdo.option.ConnectionDriverName</name>  
  <value>com.mysql.jdbc.Driver</value>  
</property>  
   
<property>  
  <name>javax.jdo.option.ConnectionUserName</name>  
  <value>root</value>  
</property>  
   
<property>  
  <name>javax.jdo.option.ConnectionPassword</name>  
  <value>password</value>  
</property>
  
</configuration>
```

* 运行hive后可看到mysql的hive数据库中被创建的各个元数据表



远程模式
----------------------------------------

### 概念

* 元数据信息被存储在mysql数据库中
* hive与mysql运行在不同的机器上
* 多用于实际的生产运行环境






管理
==========================================================================

CLI方式
----------------------------------------

### 进入CLI界面

* hive
* hive --service cli


### 常用命令

* 清屏
!clear

* 查看表
show tables;

* 查看内置函数
show functions;

* 查看表结构
desc <表名>

* 查看HDFS上的文件
如 dfs -ls /

* 执行操作系统上的命令
!<命令>

* 执行外部SQL脚本文件
source <SQL文件路径>

* 执行sql
hive -e '<sql语句>'



WEB界面方式
----------------------------------------

### 获取

cd apache-hive-0.13.0-src
jar cvfM0 hive-hwi-0.13.0.war -C web/ .


### 安装

将以下文件拷贝至lib目录中：
hive-hwi-0.13.0.war
jdk/lib/tools.jar


### 配置

在.xml中增加以下配置
```xml
<property>
    <name>hive.hwi.listen.host</name>
    <value>0.0.0.0</value>
    <description>This is the host address the Hive Web Interface will listen on</description>
</property>

<property>
    <name>hive.hwi.listen.port</name>
    <value>9999</value>
    <description>This is the port the Hive Web Interface will listen on</description>
</property>

<property>
    <name>hive.hwi.war.file</name>
    <value>${HIVE_HOME}/lib/hive-hwi-0.13.0.war</value>
    <description>This is the WAR file with the jsp content for Hive Web Interface</description>
</property>
```


### 启动

hive --service hwi &


### 访问

http://<IP>:9999/hwi/



远程服务方式
----------------------------------------

### 概述

以JDBC或ODBC的程序登录到hive中操作数据时，必须选用远程服务启动方式。
端口号10000。

### 启动

hive --service hiveserver &






数据类型
==========================================================================

基本数据类型
----------------------------------------

* tinyint/smallint/int/bigint
* float/double
* boolean
* string



复杂数据类型
----------------------------------------

* Array
* Map：一对键值对，可通过key来访问元素
* Struct：可包含不同数据类型的元素，这些元素可通过“点语法”的方式来得到



时间数据类型
----------------------------------------

* Date
* Timestamp






数据模型
==========================================================================

概述
----------------------------------------

* 基于HDFS
* 没有专门的数据存储格式
* 存储结构主要包括：数据库、文件、表、视图
* 可以直接加载文本文件（.txt文件等）
* 创建表时，指定hive数据的列分隔符与与分隔符



类型
----------------------------------------

* Table：内部表
* Partition：分区表
* External Table：外部表
* Bucket Table：桶表
* View：视图



内部表
----------------------------------------

### 概念

* 与数据库中的Table在概念上是类似
* 每一个Table在hive中都有一个相应的目录存储数据
* 所有的Table数据（不包括External Table）都保存在这个目录中
* 删除表时，元数据与数据都会被删除


### 示例

```sql
create table t1
(tid int,tname string,age int);

create table t2
(tid int,tname string,age int)
location '/mytable/hive/t2';

create table t3
(tid int,tname string,age int)
row format delimited fields terminated by ',';
```



分区表
----------------------------------------

### 概念

* Partition对应于数据库的Partition列的密集索引
* 在hive中，表中的一个partition对应于表下的一个目录，所有的partition的数据都存储在对应的目录中


### 示例

```sql
create table partition_table
(sid int,sname string)
partitioned by (gender string)
row format delimited fields terminated by ',';

insert into table partition_table partition(gender='M') select * from sample_data where gender='M';
insert into table partition_table partition(gender='F') select * from sample_data where gender='F';

explain select * from sample_data where gender='M';
```






外部表
----------------------------------------

### 概念

* 指向已经在HDFS中存在的数据，可以创建Partition
* 它和内部表在元数据的组织上是相同的，而实际数据的存储则有较大的差异
* 外部表只有一个过程，加载数据和创建表同时完成，并不会移动到数据录中，只是与外部数据建立一个链接。当删除一个外部表时，仅删除该链接。


### 示例

准备数据
```bash
hdfs dfs -put student01.txt /input
hdfs dfs -put student02.txt /input
hdfs dfs -put student03.txt /input
```

创建表
```sql
create external table external_student
(sid int,sname string,age int)
format delimited fields terminated by ','
on '/input';
```

查看数据
```sql
select * from external_student;
```


移除数据
```bash
hdfs dfs -rm /input/student03.txt
```

再次查看数据
```sql
select * from external_student;
```






桶表
----------------------------------------

### 概念

桶表是对数据进行哈希取值，然后放到不同文件中存储。


### 示例

```sql
create table bucket_table
(sid int,sname string,age int)
clustered by (sname) into 5 buckets;
```






视图
----------------------------------------

### 概念

视图是一种虚表，是一个逻辑概念
可以跨越多张表


### 示例

```sql
create view empinfo
as select e.empno,e.ename,e.sal,e.sal*12 annlsal,d.dname
from emp e,dept d
where e.deptno=d.deptno;
```