---
title: Angular基础
categories: [开发]
tags: [angular,js]
sitemap:
lastmod: 2015-10-4T12:49:30-05:00
---



# MVC

## 概念

$scope充当MVC中的Data-Model角色
$scope是一个POJO（Plain Old Javascript Object）
$scope提供了一些工具方法$watch()/$apply()
$scope是表达式的执行环境（或者叫作用域）
$scope是一个树形结构，与DOM标签平行
$scope以元素属性的形式被绑定在对应的HTML标签上，可以通过angular.element($0).scope()方式获取
子$scope对象会继承父$scope上的属性
每一个Angular应用只有一个根$scope对象（一般位于ng-app上）
$scope可以传播事件，类似DOM事件，可以向上也可以向下
$scope的生命期：creation,matcher registration,model mutation,mutation observation,scope destruction

## 示例1

HelloAngular1.html
```html

<!doctype html>
<html ng-app>
	<head>
		<meta charset="utf-8">
	</head>
	<body>
		<div ng-controller="HelloAngular">
			<p>{{greeting.text}},Angular</p>
		</div>
	</body>
	<script src="angular-1.0.3/angular.min.js"></script>
	<script src="HelloAngular1.js"></script>
</html>

```

HelloAngular1.js
```javascript

function HelloAngular($scope){
	$scope.greeting={text:'Hello'};
}

```

## 示例2

Scope1.html
```html

<!doctype html>
<html ng-app>
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" type="text/css" href="Scope1.css" />
	</head>
	<body>
		<div class="show-scope-demo">
			<div ng-controller="GreetCtrl">
				Hello {{name}} !
			</div>
			<div ng-controller="ListCtrl">
				<ol>
					<li ng-repeat="name in names">
						{{name}} from {{department}}
					</li>
				</ol>
			</div>
		</div>
	</body>
	<script src="angular-1.0.3/angular.min.js"></script>
	<script src="Scope1.js"></script>
</html>

```

Scope1.js
```javascript

function GreetCtrl($scope,$rootScope){
	$scope.name='World';
	$rootScope.department='Angular';
}

function ListCtrl($scope){
	$scope.names=['Igor','Misko','Vojta'];
}

```

## 示例3

Scope2.html
```html

<!doctype html>
<html ng-app>
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" type="text/css" href="Scope1.css" />
	</head>
	<body>
		<div ng-controller="EventAngular">
			Root scope
			<tt>MyEvent</tt> count: {{count}}
			<ul>
				<li ng-repeat="i in [i]" ng-controller="EventController">
					<button ng-click="$emit('MyEvent')">
						$emit('MyEvent')
					</button>
					<button ng-click="$broadcast('MyEvent')">
						$broadcast('MyEvent')
					</button>
					<br/>
					Middle scope
					<tt>MyEvent</tt> count: {{count}}
					<ul>
						<li ng-repeat="item in [1,2]" ng-controller="EventController">
							Leaf scope
							<tt>MyEvent</tt> count: {{count}}
						</li>
					</ul>
				</li>
			</ul>
		</div>
	</body>
	<script src="angular-1.0.3/angular.min.js"></script>
	<script src="Scope2.js"></script>
</html>

```



# DI

## 概念

每一个Angular应用都有一个injector。
injector负责自动处理依赖关系，实例化对象。
对用户代码来说，injector是透明的。
injector会自动分析函数签名，注入所需要的对象。
声明依赖关系的三种方式：http://docs.angularjs.org/guide/di
DI可以用在各种不同的地方，主要用在controller和factory中。

## QA

Q:除了可以自动注入$scope之外，还可以哪些可以自动注入？
A:$location,$window等等，包括自定义的service，都可以注入。

Q:如此使用Angular的依赖注入机制？
A:依赖注入一般用在controller和factory中。



# Module

## 概念

一切都是从angular.module开始的。
controller(),directive(),service(),fileter()等API，都定义在module实例上。
模块是service,directive,fileter,配置信息的集合
使用angular.module(...)来创建或者获取模块
模块之间可以互相依赖
模块可以动态加载
切分成小模块便于进行单元测试和集成测试

## 示例

```javascript

var myModule=angular.module('HelloAngular',[]);
myModule.controller('helloAngular',['$scope',function HelloAngular($scope){
	$scope.greeting={text:'Hello'};
}]);

```



# Service

## 概念

Service是一些单例的对象或者function,用来完成一些通用的功能
Angular内置了很多Service,见http://docs.angularjs.org/api/
内置的Service都以$符号开头，自定义的Service最好规避$符号
如果你需要某个Service，你只要声明即可，Angular会帮你自动注入

## Angular使用构造器注入的方式

```javascript

var Mycontroller=function($location){
//...
};
Mycontroller.$inject=['$location'];
myModule.controller('MyController',Mycontroller);

var myService=funnction($http){
//...
};
myModule.factory('myService',['$http',myService]);

```

## 示例

BooksStore.html
```html

<!doctype html>
<html ng-app>
	<head>
		<meta charset="utf-8">
	</head>
	<body>
		<div ng-controller="book.list">
			<button add-book-button>Add book</button>
			<br/>
			<ul>
				<li ng-repeat="book in books">
					书名：{{book.title}}&nbsp;&nbsp;&nbsp;作者:{{book.author}}
				</li>
			</ul>
		</div>
	</body>
	<script src="angular-1.0.3/angular.min.js"></script>
	<script src="BooksStore.js"></script>
</html>

```

BooksStore.js
```javascript

var bookStoreModule=angular.module('my.new.module',[]);

bookStoreModule.service('Book',['$rootScope',function($rootScope){
	var service={
		books:[
			{title:'《Ext江湖》',author:'大漠穷秋'},
			{title:'《ActioinScript游戏设计基础（第二版）》',author:'大漠穷秋'},
		],
		addBook:function(book){
			service.books.push(book);
			$rootScope.$broadcast('books.update');
		}
	};
	return service;
}]);

bookStoreModule.controller('book.list',['$scope',function(scope,Book){
	scope.$on('books.update',function(event){
		scope.books=Book.books;
		scope.$apply();
	});
	scope.books=Book.books;
}]);

bookStoreModule.directive('addBookButton',['Book',function(Book){
	return {
		restrict:'A',
		link:function(scope,element,attrs){
			element.bind('click',function(){
				Book.addBook({title:'《Ext江湖》',author:'大漠穷秋'});
			});
		}
	}
}]);

```



# Filter

Query.html
```html

<!doctype html>
<html ng-app>
	<head>
		<meta charset="utf-8">
	</head>
	<body>
		<div ng-controller="PhoneListCtrl">
			<div class="container-fluid">
				<div class="row-fluid">
					<div class="span2">
						Search:<input ng-model="query">
					</div>
					<div class="span10">
						<ul class="phones">
							<li ng-repeat="phone in phones | filter:query">
								{{phone.name}}
								<p>{{phone.snippet}}</p>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</body>
	<script src="angular-1.0.3/angular.min.js"></script>
	<script src="Query.js"></script>
</html>

```

Query.js
```javascript

function PhoneListCtrl($scope){
	$scope.phones=[
		{
			'name':'Nexus S',
			'snippet':'Fast just got faster with Nexus S.'
		},
		{
			'name':'Motorola XOOM with Wi-Fi',
			'snippet':‘The Next,Next Generation tablet'
		},
		{
			'name':'MOTOROLA XOOM',
			'snippet':'The Next,Next Generation tablet'
		}
	];
}

```



# Two way DataBinding

## 概念

双向绑定的核心问题是“脏值检测”，难点是“振荡问题”或者说是“循环依赖问题”。
如果Angular检测到数据模型的状态很久都无法“稳定”下来，并且digest的次数超过10次，则抛出异常。

### 双向绑定的一些忠告
监控的表达式不要过于复杂，表达式数量不要太多。
监听函数内不要有DOM操作，那样会显著降低性能。
不能互相监听对方会修改的属性，以免形成交叉引用。
ng默认的TTL是10次。
深拷贝式的脏值检测会消耗更多的内存（复杂的大型JSON数据尤其如此）。

## 示例

HelloAngular3.html
```html

<!doctype html>
<html ng-app>
	<head>
		<meta charset="utf-8">
	</head>
	<body>
		<div ng-controller="helloAngular">
			<input ng-model="greeting.text'/>
			<p>{{greeting.text}},Angular</p>
		</div>
	</body>
	<script src="angular-1.0.3/angular.min.js"></script>
	<script src="HelloAngular3.js"></script>
</html>

```

HelloAngular3.js
```javascript

var myModule=angular.module('HelloAngular',[]);
myModule.controller('helloAngular',['$scope',function HelloAngular($scope){
	$scope.greeting={text:'Hello'};
}]);

```




# Directive

## 概念

通过Angular来封装UI控件，可以让代码得到大幅度简化
Angular封装UI组件的基础：指令嵌套，指令处理HTML元素，指令之间的交互
指令的目的是用来自定义HTML标签，指令是一种标记，用来告诉HTML Parse“这里需要编译”

## 属性

* restrict
| character | declaration style | example |
| E | element | <my-menu title=Products></my-menu> |
| A | attribute | <div my-menu=Procuts></div> |
| C | class | <div class=my-menu:Products></div> |
| M | comment | <!-- directive my-menu Products --> |

* template属性
可以使用templateUrl加载外部HTML片段作为模板

* replace属性
可以简单替换，也可以做其它形式的HTML变换transclude

## HTML Parse的本质：JS版的编译器

* compile：
遍历DOM，找到所有指令；
指令优先级排序；
执行compile函数；
把每个compile函数返回的link函数打包到一个总的link函数中。

* link：
将scope绑定到DOM上；
在元素上注册事件监听器；
使用$watch监控数据模型；

## 示例1

Directive1.html
```html

<!doctype html>
<html ng-app>
	<head>
		<meta charset="utf-8">
	</head>
	<body>
		<hello></hello>
	</body>
	<script src="angular-1.0.3/angular.min.js"></script>
	<script src="HelloAngular3.js"></script>
</html>

```

Directive1.js
```javascript

var myModule=angular.module('MyModule',[]);
myModule.directive('hello',function(){
	return {
		restrict:'E',
		template:'<div>Hi everyone</div>',
		replace:true
	};	
});

```

## 示例2

ExpanderSimple.html
```html

<!doctype html>
<html ng-app='expanderModule'>
	<head>
		<meta charset="utf-8">
	</head>
	<body>
		<div ng-controller='SomeController'>
			<expander class='expander' expaner-title='title'>
				{{text}}
			</expander>
		</div>
	</body>
	<script src="angular-1.0.3/angular.min.js"></script>
	<script src="ExpanderSimple.js"></script>
</html>

```

ExpanderSimple.js
```javascript

var expanderModule=angular.module('expanderModule',[]);
expanderModule.directive('expander',function(){
	return {
		restrict:'EA',
		replace:true,
		scope:{
			title:'=expanderTitle'
		},
		template:'<div>'
			+'<div class="title" ng-click="toggle()">{{title}}</div>'
			+'<div class="body" ng-show="showMe" ng-transclude></div>'
			+'</div>',
		link:function(scope,element,attrs){
			scope.showMe=false;
			scope.toggle=function toggle(){
				scope.showMe=!scope.showMe;
			}
		}
	};	
});
expanderModule.controller('SomeController',function($scope){
	$scope.title='点击展开';
	$scope.text='这里是内部的内容';
});

```




# Unit Testing&&E2E Testing

Angular非常推崇TDD的开发理念

## JTestDriver

## Jasmine

四个核心概念：分组，用例，期望，匹配。
四个核心概念分别对应Jasmine的四种函数：
describe(string,function)：这个函数表示分组，也就是一组测试用例。
it(string,function)：这个函数表示测试用例。
expect(expression)：表示期望expression这个表达式具有某个值或者具有某种行为。
to***(arg)：这个函数表示匹配。



