---
title: php静态化
categories: [开发]
tags: [php,静态化]
sitemap:
lastmod: 2015-10-4T12:49:30-05:00
---


静态化分类
===========================

* 伪静态
* 纯静态
 * 全部纯静态
 * 局部纯静态/动态



静态化基础
===========================


操作文件
------------------

### 文件操作函数

file_put_contents
fopen
fwrite
fclose

### 示例

```php

<?php
$fp=fopen('data.txt','w');
fwrite($fp,'1');
fwrite($fp,'23');
fclose($fp);
?>

```



操作缓存 
--------------------

使用PHP内置缓存机制output_buffering


### ob函数

ob_start:打开输出控制缓冲。
ob_get_contents:返回输出缓冲区内容。
ob_clean:清空输出缓冲区。
ob_get_clean:得到当前缓冲区的内容后清空输出缓冲区


### 示例

```php

<?php
ob_start();
echo 1234;
file_put_contents('index.shtml',ob_get_contents());
ob_clean();
?>

```


综合示例
---------------------


```php

<?php
//1. 连接数据库，获取数据
//2. 将数据填充到模板文件里
//3. 需要把动态页面转化成静态页面，生成纯静态化文件

require_once('./db.php');

$connect=Db::getInstance()->connect();
$sql="select * from news where 'category_id'=1 and 'status'=1 order by id desc limit 5";
$result=mysql_query($sql,$connect);
$news=array();
while($row=mysql_fetch_array($result)){
	$news[]=$row;
}

ob_start();

//引入模板文件
require_once('./templates/singwa.php');

if(file_put_contents('index.shtml',ob_get_clean())){
	echo 'success';
}else{
	echo 'error';
}
?>

```



静态触发
===========================


页面添加缓存
----------------------

```flow
st=>start: 用户请求页面
cond=>condition: 页面时间是否过期 ?
op1=>operation: 获取静态页面
op2=>operation: 动态页面，并生成一份新的静态页面

st->cond
cond(yes)->op1
cond(no)->op2
```


手动触发
----------------------


crontab定时触发
----------------------

命令

```bash

crontab -e

```

配置

```

*/5 * * * * php /data/static/index.php

```



伪静态
========================


php处理伪静态
---------------------------------

* 使用path_info模式
* nginx服务器默认情况下不支持path_info模式，需要配置

```php

<?php
/*
通过正则表达式去分析伪静态URL地址
http://state.com/newsList.php?type=2&category_id=2

http://state.com/newsList.php/2/1.html
2=>type=2	1=>category_id=1
*/

if(preg_match('/^\/(\d+)\/(\d+).html/',$_SERVER['PATH_INFO'],$arr){
	$type=$arr[1];
	$category_id=$arr[2];
}else{
	//TODO
}
?>

```


apache下rewrite配置
---------------------------------

httpd.conf

```

LoadModule rewrite_module modules/mod_rewrite.so
Include conf/extra/httpd-vhosts.conf

```

httpd-vhosts.conf

```
<VirtualHost 127.0.0.19:80>
	#...

	RewriteEngine on
	RewriteCond %{DOCUMENT_ROOT}%{REQUEST_FILENAME} !-D
	RewriteCond %{DOCUMENT_ROOT}%{REQUEST_FILENAME} !-f
	RewriteRule ^/detail/([0-9]*).html$ /detail.php?id=$1
</VirtualHost>
```


nginx下rewrite配置

---------------------------------

/etc/nginx/conf.d/static.singwa.com.conf

```

location / {
	if (!-e $request_filename) {
		rewrite ^/detail/(\d+)\.html$ /detail.php?id=$1 last;
		break;
	}
}

```


