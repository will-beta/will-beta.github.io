---
title: ThinkPHP基础
categories: [开发]
tags: [php]
sitemap:
lastmod: 2015-10-26T12:49:30-05:00
---


概述
=================================================================================

国产
开源
面向对象
MVC框架
单一入口框架：一个网站中，所有的请求都指向一个脚本文件






创建项目
=================================================================================

/admin.php
``` php
<?php
define('APP_NAME','AdminApp');
define('APP_PATH','./AdminApp/');
require('./ThinkPHP/ThinkPHP.php');
?>
```


浏览后会自动创建“/Admin”目录。






目录结构
=================================================================================

```
/
-AdminApp
--Common  公共函数
--Conf  配置文件
--Lang  语言包
--Lib  控制器和模型
---Action  控制器
---Behavior  行为管理
---Model  模型
---Widget  组件
--Runtime  运行时文件
--Tpl  模板文件
```






运行流程
=================================================================================

加载 thinkphp.php
--------------------------------------------

```php
require('./ThinkPHP/ThinkPHP.php');
```


加载核心文件 ./thinkPHP/LIB/core
--------------------------------------------

加载项目的文件，分析URL，调用相关的控制器
--------------------------------------------

* m:module    模块，控制器
* a:action    方法，=页面

```php
$module=isset($_GET['m'])?$_get['m']:'Index';
$action=isset($_GET['a'])?$_get['a']:'index';

$mooc=new $module();
$mooc->$action();

class Index{
    function __construct(){
        echo '调用了index控制器<br/>';
    }
    function index(){
        echo '我是index控制器的index方法';
    }
    function test(){
        echo '我是index控制器的test方法';
    }
}
```






配置
=================================================================================

配置文件
--------------------------------------------

### /ThinkPHP/Conf/ 目录下包含各种默认配置

convention.php
```php
<?php
return array(
    //'配置项' => '配置值',
);
?>
```


### /<应用目录>/Conf/ 目录下包含此应用的自定义配置

```php
<?php
return array(
    //'配置项' => '配置值',
    'name'  =>  'Donsen2',
    'LOAD_EXT_CONFIG'   =>  'user', //指示读取 Conf/user.php 这个文件中定义的扩展配置（此文件中的配置不会编译至Runtime目录中）
);
?>
```



应用配置
--------------------------------------------

* 在 /<应用目录>/Runtime/ 目录下包含各种编译生成的用于直接执行的php
* 通过 define('APP_DEBUG',true) 确保在开发过程中每次都重新读取最新的配置
* 通过 C('<配置项名') 方法可获取相应的配置值






MVC之控制器
=================================================================================

URL模式
--------------------------------------------

### 模式种类

* 0：普通模式
http://localhost/muke/index.php?m=Index&a=user&id=1

* 1：pathinfo模式，为默认模式
http://localhost/muke/index.php/Index/user/id/1.html

* 2：重写模式
http://localhost/muke/Index/user/id/1.html

* 3：兼容模式
http://localhost/muke/index.php?s=/Index/user/id/1.html


### 配置方式

Conf/config.php
```php
return array(
    'URL_MODEL' =>  '<模式值>',
);
```


### 示例

Lib/Action/IndexAction.class.php
```php
class IndexAction extends Action{
    public function index(){
        echo C('URL_MODEL');
        echo U('Index/user',array('id'=>1),'html',false,'localhost');
    }
}
```



隐藏index.php
--------------------------------------------

### 编辑httpd.conf，启用mod_rewrite模块

```
LoadModule rewrite_module modules/mod_rewrite.so
```


### 编辑.htaccess

```
<ifmodule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !=d
    RewriteCond %{REQUEST_FILENAME} !=f
    RewriteRule ^(.*)$ index.php/$1 [QSA,PT,L]
</ifmodule>
```



URL伪静态
--------------------------------------------

### 更改配置

```php
'URL_HTML_SUFFIX'   =>  'html|shtml|xml',//URL伪静态后缀设置
```


### 元素

muke：应用目录名
Index：模块名
user：方法名
id：参数名
1：参数值


### 效果

原网址：http://localhost/muke/Index/user/id/1.html
现网址：http://localhost/muke/Index/user/id/1






MVC之模型
=================================================================================

自定义函数库
--------------------------------------------

* ThinkPHP内置函数库在/ThinkPHP/Common/ 目录下的common.php与functions.php中
* 自定义函数可以在/<应用目录>/Common/common.php中定义






MVC之视图模板
=================================================================================

示例
--------------------------------------------

### 写视图模板

Tpl/Index/test.html
```html
<?php
echo $name;
?>
<br/>
{$age}
<br/>
{$sex|default="female"}
<br/>
```


### 在控制器中调用

IndexAction.class.php
```php
$name='Donsen';
$this->name=$name;
$this->assign('age',11).assign('sex','male');
$this=>display('Index/test');
```






ThinkPHP的调试方法
=================================================================================

自定义调试变量
--------------------------------------------

### 设置开关

define('APP_DEBUG',true);


### 在Conf/debug.php中提供各个变量

```php
<?php
return array(
    'name'  =>  'leo',
);
?>
```



使用ThinkPHP提供的调试视图
--------------------------------------------

### 设置开关

```php
<?php
return array(
'SHOW_PAGE_TRACE'   =>  true,//显示页面trace信息
);
?>
```


### 在浏览的页面中点击图标进行查看

* 基本
* 文件
* 流程
* 错误
* SQL
* 调试



使用trace()
--------------------------------------------

```php
public function user(){
    trace('name',C('name'));
}
```



使用dump()
--------------------------------------------

```php
public function user(){
    dump($_SERVER);
}
```



使用G()
--------------------------------------------

```php
public function user(){
    G('run');
    for($i=0;$i<1000;$i++){
        $count+=$i;
    }
    echo G('run','end');//输出花费的时长
}
```






使用数据库
=================================================================================

配置
--------------------------------------------

```php
<?php
return array(
    'DB_TYPE'   =>  'mysql',
    'DB_HOST'   =>  'dbserver1,dbserver2,dbserver3',
    'DB_NAME'   => '', //数据库名
    'DB_USER'   =>  'root', //用户名
    'DB_PWD'    =>  '',
    'DB_PORT'   =>  '3306',
    'DB_PREFIX' =>  'think_',   //数据库表前缀
    'DB_RW_SEPARATE'    =>  true,   //开启主从写写分离
    'DB_MASTER_NUM'    =>  '2',     //前两个作为主服务器
);
?>
```



实例化模型
--------------------------------------------

### 实例化基础模型

IndexAction.class.php
```php
$user=new Model('user');//表名，表前缀，数据库连接信息
//$user=M('user');
$data=$user->select();
dump($data);
```


### 实例化用户自定义模型

UserModel.class.php
```php
<?php
class UserModel extends Model{
    public function getinfo(){
        //添加自己的业务逻辑
        return 'hello world';
    }
}
?>
```

IndexAction.class.php
```php
<?php
$user=new UserModel();
//$user=D('user');
$data=$user->getinfo();
dump($data);
?>
```


### 实例化空模型

IndexAction.class.php
```php
<?php
$model=M();
$model->execute('qpdate mk_user set user_name="kitty"');//update,insert
$data=$model->query('select * from mk_user');//select
dump($data);
?>
```
```



CRUD
--------------------------------------------

### insert数据

```php
<?php
public function user(){
    $data=array(
                'user_name' =>  'xiaoming',
                'score' =>  '100',
        );
    echo M('User')->add($data);
}
?>
```


### select数据

```php
<?php
public function user(){
    $data=M('User')->order('score desc,id asc')->select();
    echo $data;
}
?>
```



命名范围
--------------------------------------------

UserModel.class.php
```php
<?php
class UserModel extends CommonModel{
    protected $_scope=array(
            'jige'=>array(
                    'where'=>array(
                            'score'=>array('egt',60),
                        ),
                    'order'=>'id asc',
                    'limit'=>10
                ),
            'ziduan'=>array(
                    'field'=>'nick_name,score',
                    'limit'=>5
                )
        );
}
?>
```

IndexAction.class.php
```php
<?php
class IndexAction extends Action{
    public function fanwei(){
        $user=D('User');
        $data=$user->scope('jige,ziduan')->where('id<50')->select();
        echo M()->getLastSql();
    }
}
?>
```