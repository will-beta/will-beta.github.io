---
title: 测试表分区性能
categories: [database]
sitemap:
lastmod: 2016-10-31T18:26
---


创建数据
===================================

``` sql

--创建数据库
USE [master]
GO
/****** Object:  Database [test1]    Script Date: 2016/10/31 18:22:01 ******/
CREATE DATABASE [test1]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'test1', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\DATA\test1.mdf' , SIZE = 524288KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'test1_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\DATA\test1_log.ldf' , SIZE = 1280KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO




--创建数据表
USE [test1]
GO
CREATE TABLE [dbo].[t1](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[time] [datetime2](7) NOT NULL,
	[comment] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_t1] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO



--创建数据
truncate table [dbo].[t1]
go
declare @t1 datetime2 = '1980/1/1'
while @t1 < '1980-01-10'
	begin
		INSERT INTO [dbo].[t1]
				   ([time],[comment])
			 VALUES
				   (@t1,'11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111')
		set @t1 = DATEADD(second,1,@t1)
	end

``` 





创建分区
===================================

``` sql

USE [master]
GO



--创建存储文件组
declare @temp bigint=1
declare @groupname nvarchar(MAX)
declare @sql nvarchar(MAX)
while @temp<300
	begin
set @groupname=N'g'+cast(@temp as varchar)
set @sql=N'ALTER DATABASE [test1_new1] ADD FILEGROUP ['+@groupname+']'
set @temp=@temp+1
execute sp_executesql @sql
	end
GO


--创建存储文件
declare @temp bigint=1
declare @groupname nvarchar(MAX)
declare @filename nvarchar(MAX)
declare @filepath nvarchar(MAX)
declare @sql nvarchar(MAX)
while @temp<300
	begin
		set @filename=N'test_new1-f'+cast(@temp as varchar)
		set @filepath=N'C:\Program Files\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\DATA\'+@filename+N'.ndf'
		set @groupname=N'g'+cast(@temp as varchar)
		set @sql=N'ALTER DATABASE [test1_new1] ADD FILE ( NAME = ['+@filename+'], FILENAME = ['+@filepath+'] , SIZE = 5120KB , FILEGROWTH = 1024KB ) TO FILEGROUP ['+@groupname+']'
		--ALTER DATABASE [test1_new1] ADD FILE ( NAME = "@filename", FILENAME = "@filepath" , SIZE = 5120KB , FILEGROWTH = 1024KB ) TO FILEGROUP "@groupname"
		execute sp_executesql @sql
		set @temp=@temp+1
	end
GO




USE [test1_new1]
GO



--创建分区函数和分区方案
declare @sql_pf nvarchar(MAX)=N'CREATE PARTITION FUNCTION [pf1](datetime2(7)) AS RANGE RIGHT FOR VALUES ('
declare @sql_ps nvarchar(MAX)=N'CREATE PARTITION SCHEME [ps1] AS PARTITION [pf1] TO ('
declare @dt datetime='1980-01-01T00:00:00'
declare @temp bigint=1
while 1=1
	begin
		set @sql_pf=@sql_pf+''''+convert(varchar,@dt,126)+''''
		set @sql_ps=@sql_ps+'[g'+cast(@temp as varchar)+'],'
		set @dt=dateadd(hour,1,@dt)
		if @dt>'1980-01-10T00:00:00' break
		set @sql_pf=@sql_pf+','
		set @temp=@temp+1
	end
set @sql_pf=@sql_pf+')'
set @sql_ps=@sql_ps+' [PRIMARY])'
select @sql_pf
select @sql_ps
execute sp_executesql @sql_pf
execute sp_executesql @sql_ps
go




--重新组织数据
BEGIN TRANSACTION

ALTER TABLE [dbo].[t1] DROP CONSTRAINT [PK_t1]


ALTER TABLE [dbo].[t1] ADD  CONSTRAINT [PK_t1] PRIMARY KEY NONCLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)


CREATE CLUSTERED INDEX [ClusteredIndex_on_ps1_636134253657994476] ON [dbo].[t1]
(
	[time]
)WITH (SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF) ON [ps1]([time])


DROP INDEX [ClusteredIndex_on_ps1_636134253657994476] ON [dbo].[t1]

COMMIT TRANSACTION

``` 







清除缓存并执行
===================================

``` sql

CHECKPOINT;
DBCC DROPCLEANBUFFERS;
DBCC FREEPROCCACHE;
DBCC FREESYSTEMCACHE ('ALL');
SET STATISTICS TIME ON ;
--查询条件

select * from t1
where time > '1980/1/9 23:00:00'
and time < '1980/1/9 23:01:00'

SET STATISTICS TIME OFF;


``` 


