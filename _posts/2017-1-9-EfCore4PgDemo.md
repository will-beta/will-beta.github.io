---
title: EfCore4PgDemo
categories: [开发]
tags: [dotnetcore]
sitemap:
    lastmod: 2017-1-9T12:49:30-05:00
---

Entities工程
=====================================================================

概述
--------------------

* 数据实体层
* 只放简单的POCO类



依赖
--------------------

* NETStandard.Library







Dal工程
=====================================================================

概述
--------------------

* 数据连接抽象层
* 包含通用的DbContext
* DbContext中包含各持久化数据实体集



依赖
--------------------

* Microsoft.EntityFrameworkCore
* NETStandard.Library






Dal.Pg工程
=====================================================================

概述
--------------------

* 数据连接实现层
* 扩展DbContext
* DbContext中为有效持久化需要做相应的数据类型映射工作：DB<-->Code



依赖
--------------------

* Microsoft.EntityFrameworkCore
* Microsoft.EntityFrameworkCore.Relational
* NETStandard.Library



若要实现 db <--> code model 的自动生成，则可能要安装其它工具包（当前版本还存在兼容性问题）
---------------------------------------------------------------

Install-Package Npgsql.EntityFrameworkCore.PostgreSQL
Install-Package Microsoft.EntityFrameworkCore.Tools -Pre
Install-Package Microsoft.EntityFrameworkCore.Tools.DotNet -Pre
Install-Package Npgsql.EntityFrameworkCore.PostgreSQL.Design






Bll工程
=====================================================================

概述
---------------------------------------------------------------

* 业务层
* 所有依赖的基础组件（如日志组件）与数据连接层（Dal.Pg），直接使用即可，不主动创建，而是通过宿主层注入



依赖
--------------------

* Dal层：不依赖于Dal.Pg层
* Entities层
* NETStandard.Library
* System.Linq.Parallel：以便支持并行LINQ






App工程
=====================================================================

概述
---------------------------------------------------------------

* 宿主层
* 配置依赖注入
* 启动业务执行：本层中无业务代码



依赖
--------------------

* 其它所有层
* 业务层依赖的组件
* Npgsql.EntityFrameworkCore.PostgreSQL






参考
=====================================================================

* [ef core for pg的大本营](https://github.com/npgsql/Npgsql.EntityFrameworkCore.PostgreSQL)
* [EntityTypeConfiguration的自定义实现](http://cgzl.me/2016/10/15/%E4%B8%BA-entity-framework-core-%E6%B7%BB%E5%8A%A0-entitytypeconfiguration/)
* [ASP.NET Core中的依赖注入（4）: 构造函数的选择与服务生命周期管理](http://www.cnblogs.com/artech/p/asp-net-core-di-life-time.html)
* [.Net Core Linux centos7行—IOC模块](http://www.cnblogs.com/calvinK/p/5621262.html)
* [How do I configure a .NET Core 1.0.0 Console Application for Dependency Injection, Logging and Configuration?](http://stackoverflow.com/questions/38706959/net-core-console-applicatin-configuration-xml)
* [Dependency Injection](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection)
* [Configuration](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration#options-config-objects)
* [Make sure that scoping with AddDbContext is a good experience #1112](https://github.com/aspnet/EntityFramework/issues/1112)
