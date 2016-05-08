---
title: 性能测试工具之jmeter
categories: [测试]
tags: [jmeter]
sitemap:
    lastmod: 2015-10-11T12:49:30-05:00
---



概念
===============================================

Sampler: 模拟用户发送的请求
Thread:模拟用户
Thread Group:运行类似操作模式的用户组
Remote Start:运行远程机器上的采样

Test Plan:测试计划，包含各种运行相关的配置项
Workbench:做测试相关后些辅助配置






可添加至Test Plan的各种配置项
===============================================

Logical Controller
--------------------------


Config Element
--------------------------


Timer
--------------------------


Pre Processor
--------------------------


Sampler
--------------------------


Post Processor
--------------------------


Assertions
--------------------------


Listener
--------------------------






构建过程示例
===============================================

创建模拟用户组：在TestPlan中添加ThreadGroup
--------------------------

* Action to be taken after a Sampler error：出错后怎么办，包括Continue、Start Next Thread Loop、Stop Thread（停止本用户）、Stop Test（未执行完的测试结束后退出整个测试）、Stop Test Now（强制立即退出整个测试）
* Number of Threads (users)：指定模拟用户数
* Ramp-Up Period (in seconds)：在指定时间内启动所有的用户
* Loop Count：循环次数
* Delay Thread creation until needed
* Scheduler：执行计划


实现多用户多场景测试：在TestPlan中添加多个Thread Group
--------------------------



配置请求的公共参数：加入HTTP Request Defaults
--------------------------

* Server Name or IP
* Port
* Parameters
* Proxy Server


加入配置参数：加入User Defined Variables
--------------------------

如IP，Port Number，Parameters
之后可以将参数应用到其它地方，如样本请求中，如Server Name or IP可设为${IP}



加入CSV配置：加入CSV Dataset Config
--------------------------

设置参数：
* Filename：csv文件路径
* File encoding
* Variable Names：获取的列号，如“catid,gdid”
* Delimiter
* Allow Quoted data：数据使用引号括起来，以便支持多行
* Sharing mode


使用Session支持：在TeatPlan中添加HTTP Cookie Manager
--------------------------

可设置Cookie Policy等。



模拟用户的等待：加入Gaussian Random Timer
--------------------------

类似的可以加入Poisson Random Timer。

* 设置Deviation(In milliseconds)
* 设置Constant Offset(In milliseconds)



加入逻辑控制：加入Loop Controller
--------------------------

设置Loop Count为指定次数，可设为Forever




加入结果列表报表：加入View Result Tree
--------------------------



加入结果汇总报表：加入Aggregate Report
--------------------------



创建数据捕捉代理：在Workbench内添加HTTP(S) Test Script Recorder
--------------------------

* Port
* Content-type filter
* URL Patterns to include
* URL Patterns to Exclude


访问目标页面，获取样本数据
--------------------------

先为浏览器配置本地代理，将其指向至刚才配置的代理地址。
然后访问目标页面，可观察到Workbench中陆续捕捉到了访问数据。



在TestPlan中加入样本数据
--------------------------

从Workbench中将捕捉到的样本数据拖到TestPlan中。
可以将登录操作样本放到Loop Controller前，以实现一个Thread的单次执行目标登录样本。
可以将其它操作样本放到Loop Controller中，以实现一个Thread的多次执行目标操作样本。



加入样本数据的解析：在目标样本数据中加入Post Processors > CSS/JQuery Extractor
--------------------------

* Reference Name：获取到目标值后以什么变量名给之后的过程引用
* CSS/JQuery expression：目标元素查找表达式
* Attribute：找到目标元素后，提取它的哪个属性值
* Match No.(0 for Random)：若找到多个目标元素，获取哪一个进行之后的过程
* Default Value：若属性值获取失败，那么要返回的默认值



加入样本数据的正确性判断：在目标样本数据中加入Assertions > BSFAssertion
--------------------------

* 设置Language为javascript。
* 设置Parameters为准备要在之后脚本访问的变量，如：${ur_hear} ${catid}
* 设置script：
```javascript
var re=new RegExp(“id=(\\d+)”,”ig”);
var arr=re.exec(args[0]);
if(!RegExp.$1||RegExp.$1!=args[1]{
	AssertionResult.setFailure(true);
	AssertionResult.setFailureMessage(RegExp.$1+”<>”+args[1]);
}
```

若用BeanShellAssertion判断，如下script：
```java
java.util.regex.Pattern p=java.util.regex.Pattern.compile(“id=(\\d+)”);
java.util.regex.Matcher m=p.matcher(bsh.args[0]);
boolean found=m.find();
if(found){
	if(!m.group(1).equals(bsh.args[1])){
		Failure=true;
		FailureMessage=m.group(1)+”<>”+bsh.args[1];
	}
}else{
	Failure=true;
}
```

类似的还可以加入Duration Assertion、HTML Assertion、MD5Hex Assertion、Size Assertion等。



执行TestPlan
--------------------------

点击执行即可。




观察结果
--------------------------

* 查看View Result Tree
可观察各个请求对应的详细数据
可保存结果至文件中

* 查看Aggregate Report
可观察所有请求的统计结果
可保存结果至文件中





扩展jmeter
===============================================

使用BeanShell进行java扩展
--------------------------

### 写插件: dependencies/com.immoc.jar

Match.java
```java
package com.immoc;

public class Math {
	public static String sqrt ( String i ) {
		Float iv = Float.valueOf(i);
		return String.valueOf(iv.floatValue() * iv.floatValue());
	}
}
```

### 修改配置jmeter.properties

plugin_dependency_paths=../dependencies

### 写测试

在Thread下添加BeanShell Sampler,配置其Script:
```java
import com.immoc.Math;
String ret = Math.sqrt ("2.0") ;
log.info ( "The Result: " + ret) ;
```
 
### 运行测试

* 打开options/log viewer, 准备查看输出日志。
* 点击运行。



使用BSFShell进行javascript扩展
--------------------------



开发自定义的Sampler,ConfigElement
--------------------------



