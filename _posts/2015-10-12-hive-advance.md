---
title: apache hive进阶
tags: [hive]
sitemap:
    lastmod: 2015-10-12T12:49:30-05:00
---



hive的数据导入
==========================================================================

使用load语句导入数据
---------------------------------------

### 语法

LOAD DATA [LOCAL] INPATH 'filepath' [OVERWRITE]
INTO TABLE tablename [PARTITION (partcol1=vall, partcol2=val2 ...)]


### 示例：导入本地文件

load data local inpath '/root/data/student01.txt' into table t2;


### 示例：导入本地目录

load data local inpath '/root/data/' overwrite into table t3;


### 示例：导入HDFS中的数据

load data inpath '/input/student01.txt' overwrite into tablet3


### 示例：使用分区表

load data local inpath '/root/data/data1.txt' into table partition_table partition (gender='M')



使用apache sqoop导入数据
---------------------------------------

### 下载解压后配置环境变量

```bash
export HADOOP_COMMON_HOME=~/training/hadoop-2.4.1/
export HADOOP_MAPRED_HOME=~/training/hadoop-2.4.1/
```


### 示例：导入oracle数据到hdfs中

./sqoop import --connect jdbc:oracle:thin:@192.168.56.101:1521:orcl --username scott --passwrod tiger --table emp --columns 'empno,ename,job,sal,deptno' -m 1 --target-dir '/sqoop/emp'


### 示例：导入oracle数据到hive中

./sqoop import --connect jdbc:oracle:thin:@192.168.56.101:1521:orcl --username scott --passwrod tiger --table emp --columns 'empno,ename,job,sal,deptno' -m 1 --hive-import


### 示例：导入oracle数据到hive中，并且指定表名

./sqoop import --connect jdbc:oracle:thin:@192.168.56.101:1521:orcl --username scott --passwrod tiger --table emp --columns 'empno,ename,job,sal,deptno' -m 1 --hive-import --hive-table emp1


### 示例：导入oracle数据到hive中，并且使用where条件

./sqoop import --connect jdbc:oracle:thin:@192.168.56.101:1521:orcl --username scott --passwrod tiger --table emp --columns 'empno,ename,job,sal,deptno' -m 1 --hive-import --hive-table emp2 --where 'deptno=10'


### 示例：导入oracle数据到hive中，并且使用查询语句

./sqoop import --connect jdbc:oracle:thin:@192.168.56.101:1521:orcl --username scott --passwrod tiger --query 'select * from emp where sal<2000' --target-dir '/sqoop/emp5' -m 1 --hive-table emp5


### 示例：导入hive数据到oracle中

./sqoop import --connect jdbc:oracle:thin:@192.168.56.101:1521:orcl --username scott --passwrod tiger -m 1 --table MYEMP --export-dir *******






hive的数据查询
==========================================================================

查询语法
---------------------------------------

```sql
SELECT [ALL | DISTINCT] select_expr,select_expr,...
FROM table_reference
[WHERE where_condition]
[GROUP BY col_list]
[CLUSTER BY col_list
 | [DISTRIBUTE BY col_list] [SORT BY col_list]
 | [ORDER BY col_list] 
]
[LIMIT number]
```

DISTRIBUTE BY：指定分发器（partitioner）,多Reducer可用



查询所有列时能直接返回结果
---------------------------------------

select * from emp;



查询部分列时会成为一个作业被调度运行，无法立即返回结果
---------------------------------------

select empno,ename,comm,sal*12+comm from emp;



其它示例
---------------------------------------

### 将NULL转化成其它数值

select empno,ename,comm,sal*12+nvl(comm,0) from emp;


### 判断是否是null

select * from emp where comm is null;


### 查询名字含有下划线的员工

select empno,ename,sal from emp where ename lik '%\\_%';


### 对order by开启数字列号的引用

set hive.groupby.orderby.position.alias=true;
select empno,ename,sal,sal*12 annsal from emp order by 4;


开启Fetch Task功能：没有函数，没有排序等的简单查询不生成作业
---------------------------------------

* set hive.fetch.task.conversion=more;
* hive --hiveconf hive.fetch.task.conversion=more;
* 修改hive-site.xml文件






hive的内置函数
==========================================================================

数学函数
---------------------------------------

* round：四舍五入
select round(45,926,1),round(45.926,-1); # 输出45.9和50
* ceil：向上取整
* floor：向下取整



数学函数
---------------------------------------

* lower
* upper
* length
* concat
* substr
* trim：去除前后的空格
* lpad：向左填充
* rpad



收集函数

---------------------------------------

* size
select size(map(1,'Tom',2,'Mary')); # 输出2



转换函数
---------------------------------------

* cast
select cast(1 as float)
select cast('2015-04-10' as date)



日期函数
---------------------------------------

* to_date
* year
* month
* day
* weekofyear
* datediff：相关天数
* date_add
* date_sub



条件函数
---------------------------------------

* coalesce：从左到右返回第一个不为null的值
select comm,sal,coalesce(comm,sal) from emp;
* case...where...：条件表达式
CASE a WHEN b THEN c [WHEN d THEN e]* [ELSE f] END



表生成函数
---------------------------------------

* explode：将键值对生成单独的行
select explode(1,'Tom',2,'Mary',3,'Mike'); # 生成3行2列的表



聚合函数
---------------------------------------

* count
* sum
* min
* max
* avg






hive的自定义函数(UDF)
==========================================================================

概述
---------------------------------------

* 自定义函数需要继承org.apache.hadoop.hive.ql.UDF
* 需要实现evaluate函数
* evaluate函数支持重载



创建
---------------------------------------

```java
package demo.udf;
import org.apache.hadoop.hive.ql.exec.UDF;
import org.apache.hadoop.io.Text;

public class ConcatString extends UDF {
  public Text evaluate(Text a,Text b){
    return new Text(a.toString() +"****" + b.toString());
  }
}
```


部署
---------------------------------------

* 先打成jar包
* hive客户端进行添加： add jar /root/training/udfjar/udf_test.jar
* 定义：CREATE TEMPORARY FUNCTION <函数名> AS '<JAVA 类名>'



使用
---------------------------------------

select <函数名> from table;



销毁
---------------------------------------

DROP TEMPORARY FUNCTION <函数名>;






hive的表连接
==========================================================================

等值连接
---------------------------------------

select e.empno,e.ename,e.sal,d.dname
from emp e,dept d
where e.deptno=d.depno;



不等值连接
---------------------------------------

select e.empno,e.ename,e.sal,s.gra
from emp e,salgrade s
where e.sal between s.losal and s.hisal;



外连接：不符合条件的数据全也部包含到结果中
---------------------------------------

select d.deptno,d.dname,count(e.empno)
from emp e right outer join d
on (e.deptno=d.deptno)
group by d.depno,d.dname;



自连接
---------------------------------------

select e.ename,b.ename
from emp e,emp b
where e.mgr=b.empno;






hive的子查询
==========================================================================

注意的问题
---------------------------------------

* 语法中的括号
* 合理的书写风格
* hive中只支持from和where子句中的子查询
* 主查询和子查询可以不是同一张表
* 子查询中的空值问题



示例
---------------------------------------

select e.ename from emp e where e.deptno in
(select d.deptno from dept d where d.dname='SALES' or d.dname='ACCOUNTING');






hive的java客户端操作
==========================================================================

启动hive的远程服务
---------------------------------------
hive --service hiveserver



JDBC客户端
---------------------------------------

### 步骤

* 获取连接
* 创建运行环境
* 执行HQL
* 处理结果
* 释放资源


### 驱动包

hive安装目录/lib目录下的hive-jdbc.jar与其它文件得拷贝至工程的 build path中


### 示例

JDBCUtils.java

```java
package demo.utils;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class JDBCUtils {
  private static String driver = "org.apache.hadoop.hive.jdbc.HiveDriver";
  private static String url = "jdbc:hive://192.168.56.31:10000/default";
  
  //注册驱动
  static{
    try {
      Class.forName(driver);
    } catch (ClassNotFoundException e) {
      throw new ExceptionInInitializerError(e);
    }
  }

  //获取连接
  public static Connection getConnection(){
    try {
      return DriverManager.getConnection(url);
    } catch (SQLException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
    return null;
  }

  //释放资源
  public static void release(Connection conn,Statement st,ResultSet rs){
    if(rs != null){
      try {
        rs.close();
      } catch (SQLException e) {
        e.printStackTrace();
      }finally{
        rs = null;
      }
    }
    if(st != null){
      try {
        st.close();
      } catch (SQLException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
      }finally{
        st = null;
      }
    }
    if(conn != null){
      try {
        conn.close();
      } catch (SQLException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
      }finally{
        conn = null;
      }
    }
  }
}
```

HiveJDBCDemo.java

```java
package demo.hive;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import demo.utils.JDBCUtils;

public class HiveJDBCDemo {
  public static void main(String[] args) {
    Connection conn = null;
    Statement st = null;
    ResultSet rs = null;
    
    String sql = "select * from emp";
    try {
      //获取连接
      conn = JDBCUtils.getConnection();
      //创建运行环境
      st = conn.createStatement();
      //运行HQL
      rs = st.executeQuery(sql);
      //处理数据
      while(rs.next()){
        //取出员工的姓名和薪水
        String name = rs.getString(2);
        double sal = rs.getDouble(6);
        System.out.println(name+"\t"+sal);
      }
    } catch (Exception e) {
      e.printStackTrace();
    }finally{
      JDBCUtils.release(conn, st, rs);
    }
  }
}
```



Thrift Client客户端连接至Thrift  Server
---------------------------------------

### 概述

基于socket


### 示例

```java
package demo.hive;
import java.util.List;
import org.apache.hadoop.hive.service.HiveClient;
import org.apache.thrift.protocol.TBinaryProtocol;
import org.apache.thrift.protocol.TProtocol;
import org.apache.thrift.transport.TSocket;

public class HiveThriftClient {
  public static void main(String[] args) throws Exception{
    //创建Socket；连接
    final TSocket tSocket = new TSocket("192.168.56.31", 10000);
    
    //创建一个协议
    final TProtocol tProtcal = new TBinaryProtocol(tSocket);
    
    //创建Hive Client
    final HiveClient client = new HiveClient(tProtcal);
    
    //打开Socket
    tSocket.open();
    
    //执行HQL
    client.execute("desc emp");
    //处理结果
    List<String> columns = client.fetchAll();
    for(String col:columns){
      System.out.println(col);
    }
    
    //释放资源
    tSocket.close();
  }
}
```

