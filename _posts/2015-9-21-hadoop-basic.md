---
title: hadooop基础
tags: [hadoop]
sitemap:
    lastmod: 2015-9-21T12:49:30-05:00
---


# Google大数据技术

## 组成

* MapReduce
* BigTable
* GFS

## 分布式技术革命性变化

* 成本降低、能用PC机、就不用大型机和高端存储。
* 软件容错硬件故障视为常态。通过软件保证高可靠性。
* 简化并行分布式计算，无须控制节点同步和数据交换。。。

## Hadoop为其开源实现

# 用处

* 搭建大型数据仓库
* PB级数据的存储、处理、分析、统计等业务

# 优势

* 高扩展（通过硬件来不断扩展性能和内容)
* 低成本(可以在普通pc机上进行开发）
* 成熟的生态圈

# 相关开源工具

* hive：将sql语句转化为hadoop任务
* HBASE：存储结构化数据的分布式数据库，放弃事务特性，追求更高的扩展，它提供数据的随机读写和实时访问，实现对表数据的读写功能
* zookeeper：监控Hadoop集群里的每个节点的状态，管理整个集群的配置，维护数据节点之间的一致性

# 安装

## 第一步：linux
主流linux都可

## 第二步：jdk

### 安裝

``` bash

javac
yum install openjdk

```

### 配置

 * /etc/profile

``` bash

export JAVA_HOME=/usr/lib/jvm/java-7-openjdk-amd64/
export JRE_HOME=$JAVA_HOME/jre/
export PATH=$JAVA_HOME/bin:$JRE_HOME/bin:$PATH

```

## 第三步：hadoop

### 安装

``` bash

wget http://mirror.bit.edu.cn/apache/hadoop/common/hadoop-1.2.1/hadoop-1.2.1.tar.gz /opt/
tar -xzf /opt/hadoop/hadoop-1.2.1.tar.gz

```

### 配置
* /etc/profile

``` bash

export HADOOP_HOME=/opt/hadoop/hadoop-1.2.1
export PATH=$HADOOP_HOME/bin:$PATH

```

* hadoop-env.sh

``` bash

export JAVA_HOME=/usr/lib/jvm/java-7-openjdk-amd64/

```

* core-site.xml

``` xml

<property>  
  <name>hadoop.tmp.dir</name>  
  <value>/hadoop</value>  
</property>  
<property>  
  <name>dfs.name.dir</name>  
  <value>/hadoop/name</value>  
</property>  
<property>  
  <name>fs.default.name</name>  
  <value>hdfs://immoc:9000</value>  
</property>

```

* mapred-site.xml

``` xml

<property>  
    <name>mapred.job.tracker</name>  
    <value>immoc:9001</value>  
</property>

```

* hdfs-site.xml

``` xml

<property>  
    <name>dfs.data.dir</name>  
    <value>/hadoop/data</value>  
</property>

```

### 初始化

``` bash

hadoop namenode -format
/opt/hadoop-1.2.2/conf/start-all.sh

```

### 检查运行情况
使用jps确认活动进程

* NameNode
* SecondaryNameNode
* DataNode
* JobTracker
* TaskTracker

# 核心组成部分

## 一：HDFS

### 分布式文件系统
存储海量数据

### 组成
* NameNode
包含文件与数据块的映射表，数据块与数据节点的映射表
* SecondaryNameNode
NameNode的备份
* DataNode
以数据块（默认大小为64MB）为单元存储文件内容

### 写文件流程
![hadoop_hdfs_save_file](/post_file/2015-9-21-hadoop-basic/hadoop_hdfs_save_file.png)

### 读文件流程
![hadoop_hdfs_read_file](/post_file/2015-9-21-hadoop-basic/hadoop_hdfs_read_file.png)

### 适用性
适合数据批量读写，吞吐量高

### 局限性
适合交互式应用，低延迟很难满足

### 稳定性
* datanode定期namenode心跳汇报自己的情况，是否宕机是否活跃
* 每个数据块3个副本，分布在两个机架内的三个节点

## 二：MapReduce

### 实现任务分解、调度、并行执行
![hadoop_mapreduce](/post_file/2015-9-21-hadoop-basic/hadoop_mapreduce.png)

### 容错机制

* 重复执行
出错后自动重复执行，最多4次
* 推测执行
根据task node机器负载对task进行自动迁移

### 角色

* JobTracker
 * 作业调度
 * 分配任务、监控任务执行进度
 * 监控TaskTracker的状态
* TaskTracker
 * 执行任务
 * 汇报任务状态

# 示例：WordCount

## 第一步：写代码
* WordCount.java

```java

import java.io.IOException;
import java.util.StringTokenizer;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;

public class WordCount {
    public static class WordCountMap extends
            Mapper<LongWritable, Text, Text, IntWritable> {
        private final IntWritable one = new IntWritable(1);
        private Text word = new Text();

        public void map(LongWritable key, Text value, Context context)
                throws IOException, InterruptedException {
            String line = value.toString();
            StringTokenizer token = new StringTokenizer(line);
            while (token.hasMoreTokens()) {
                word.set(token.nextToken());
                context.write(word, one);
            }
        }
    }

    public static class WordCountReduce extends
            Reducer<Text, IntWritable, Text, IntWritable> {
        public void reduce(Text key, Iterable<IntWritable> values,
                Context context) throws IOException, InterruptedException {
            int sum = 0;
            for (IntWritable val : values) {
                sum += val.get();
            }
            context.write(key, new IntWritable(sum));
        }
    }

    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        Job job = new Job(conf);
        job.setJarByClass(WordCount.class);
        job.setJobName("wordcount");
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(IntWritable.class);
        job.setMapperClass(WordCountMap.class);
        job.setReducerClass(WordCountReduce.class);
        job.setInputFormatClass(TextInputFormat.class);
        job.setOutputFormatClass(TextOutputFormat.class);
        FileInputFormat.addInputPath(job, new Path(args[0]));
        FileOutputFormat.setOutputPath(job, new Path(args[1]));
        job.waitForCompletion(true);
    }
}

```

## 第二步：编译代码

``` bash

javac -classpath /opt/hadoop-1.2.1/hadoop-core-1.2.1.jar:/opt/hadoop-1.2.1/lib/commons-cli-1.2.1.jar -d word_count_class/ WordCount.java

```

## 第三步：打包代码

``` bash

jar -cvf wordcount.jar word_count_class/*.class

```

## 第四步：准备输入

* file1

```

hello hadoop
hadoop file system
hadoop java api
hello java

```

* file2

```

hadoop file
hadoop new world
hadoop free home
hadoop free school

```

## 第五步：准备HDFS中的目录

``` bash

hadoop fs -mkdir input_wordcount
hadoop fs -mkdir output_wordcount

```

## 第六步：提交输入
``` bash

hadoop fs -put file1 input_wordcount/
hadoop fs -put file2 input_wordcount/
hadoop fs -ls input_wordcount/
hadoop fs -cat input_wordcount/file1

```

## 第七步：提交job
``` bash

hadoop jar word_count_class/wordcount.jar WordCount input_wordcount output_wordcount

```

## 第八步：查看job结果

``` bash

fs -ls output_wordcount
    _SUCCESS
    _logs
    part-r-0000
    
```
