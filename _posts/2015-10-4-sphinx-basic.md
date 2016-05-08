---
title: sphinx基础
categories: [工具]
tags: [sphinx,搜索]
sitemap:
lastmod: 2015-10-4T12:49:30-05:00
---


概述
=======================

* 基于sql的全文搜索引擎。
* 提供了比数据庘更专业的搜索功能。
* 特别为一些脚本语言设计了搜索的API接口，如PHP、PYTHON等。
* 为mysql设计了一个存储引擎插件。





优点
=======================

* 做搜索时当数据量大时，单纯的mysql搜索比较慢（若表进行了分表那更慢）。
* 搜索时能根据不同语言进行分词。
* 快。





组成
=======================


sphinx.conf：配置
------------

### 连接信息

```
source news
{
    type    =   mysql
    sql_host    =   127.0.0.1
    sql_user    =   root
    sql_pass    =   
    sql_db  =   cms
    sql_port    =   3306
    
    sql_query_pre   =   SET NAMES UTF8
}
```

### 索引配置

```
source news_main:news
{
    sql_query   =   SELECT id,category_id,type,title,image,status,careate_time,update_time FROM news WHERE status != 0
    sql_attr_uint   =   category_id
    sql_attr_uint   =   type
    sql_attr_uint   =   status
    sql_attr_timestamp  =   update_time
}
```

### 索引存放配置

```
index news_main
{
    path    =   /var/lib/sphinxsearch/data/news_main
    docinfo =   extern
    
    source  =   news_main
}
```

### 增量索引配置

```
index news_delta
{
    type    =   rt
    path    =   /var/lib/sphinxsearch/data/news_delta
    rt_mem_limit    =   32M
    rt_field    =   title
    rt_field    =   image
    rt_field    =   create_time
    rt_attr_uint    =   category_id
    rt_attr_uint    =   type
    rt_attr_uint    =   status
    rt_attr_timestamp   =   update_time
    
    docinfo =   extern
}
```

### 后台进程配置

```
searchd
{
    listen  =   9312 #提供API连接
    listen  =   9306:mysql141 #提供mysql连接
    
    log =   /var/log/sphinxsearch/searchd.log
    query_log   =   /var/log/sphinxsearch/query.log
    
    read_timeout    =   5
    client_timeout  =   300
    max_children    =   0
    pid_file    =   /var/run/sphinxsearch/searchd.pid
    #max_matches    =   1000
    
    #...
}
```


/var/lib/sphinxsearch/data/：索引数据存入目录
-----------------------------------------

* .spa：存储文档属性
* .spd：存储每个词ID可匹配的文档ID列表
* .sph：存储索引头信息
* .spi：存储词列表
* .spm：存储MVA信息
* .spp：存储每个词的命中列表



/usr/bin/indexer：创建索引
-----------------

```bash
/usr/bin/indexer -config /etc/sphinxsearch/sphinx.conf -all
```


/usr/bin/searchd：后台进程，提供查询服务
----------------------

* 查询是否启动

```bash
ps -aux | grep searchd
```

* 结束运行

```bash
/usr/bin/searchd --stop
```





查看sphinx数据
=======================

* 通过一命令进入

```bash
mysql -h0 -P9306
```

* 查询（通过索引名）

```sql
select * from new_main limit 100;
```





类似工具
=======================

* lucence：支持c#
