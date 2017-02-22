---
title: SQL Server Temporal Table
categories: [DB]
tags: [SQL Server,DB]
sitemap:
    lastmod: 2017-2-22T12:49:30-05:00
---



创建
=================

```sql
create table T1(ID int identity primary key,
    COl1 nvarchar(50),
    TimeFrom datetime2 generated always as row start,
    TimeTo datetime2 generated always as row end,
    period for system_time(TimeFrom,TimeTo)) with (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.T1History));
```



要点
===================

* 可以选择隐藏这些期限列，以便直接select或insert时不涉及到这些列；若要返回隐藏的列，只需在查询中显式引用隐藏的列。
* 两个列限定了数据的有效时间，若当前还在用，则以最大值呈现（非空值）
* 可以开启列存储特性，以减少每次只是少量列被更新而带来的冗余
* 可通过在原SQL中加入SYSTEM_TIME的期限限定来进行对当前表与历史表的自动联合查询



参考
===================

* [Temporal Tables](https://msdn.microsoft.com/en-us/library/dn935015.aspx)
* [Sql Server 2016 新功能——内置的 Temporal Tables](http://www.cnblogs.com/Gin-23333/p/5936120.html)
* [SQL Server ->> 深入探讨SQL Server 2016新特性之 --- Temporal Table（历史表）](http://www.cnblogs.com/jenrrychen/p/5196948.html)
