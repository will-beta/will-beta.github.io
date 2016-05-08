---
title: Angular之MVC
categories: [开发]
tags: [angular,js]
sitemap:
lastmod: 2015-10-8T12:49:30-05:00
---



概念
===========================================================================================================

mvc只是模块化和复用的手段。



view
===========================================================================================================

概念
----------------------------------------------------------------

* 利用directive实现view的复用




示例1
----------------------------------------------------------------

```html
<!doctype html>
<html ng-app>
    <head>
    </head>
    <body>
        <div>
            <input ng-model="greeting.text"/>
            <p>{{greeting.text}},Angular</p>
        </div>
    </body>
    <script src="js/angular-1.3.0.js"></script>
</html>
```



示例2
----------------------------------------------------------------

HelloAngular_Directive.html

```html

<!doctype html>
<html ng-app="MyModule">
	<head>
	</head>
	<body>
		<hello></hello>
	</body>
	<script src="js/angular-1.3.0.js"></script>
	<script src="HelloAngular_Directive.js"></script>
</html>

```

HelloAngular_Directive.js

```javascript
var myModule = angular.module("MyModule", []);
myModule.directive("hello", function() {
    return {
        restrict: 'E',
        template: '<div>Hi everyone!</div>',
        replace: true
    }
});
```





controller
===========================================================================================================

概念
----------------------------------------------------------------

* 推荐通过组合而非继承方式来实现方法复用，即将公共方法写在service中。
* 不要试图去复用controller，一个控制器一般只负责一小块视图。
* 不要在controller中操纵DOM，这不是控制器的职责。
* 不要在controller中做数据格式化，ng有很好用的表单控件。
* 不要在controller中做数据过滤操作，ng有$filter服务。
* 一般来说，controller是不会相互调用的，其交互会通过事件进行。




示例1
----------------------------------------------------------------

HelloAngular1.html
```html
<!doctype html>
<html ng-app>
	<head>
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




示例2
----------------------------------------------------------------

MVC3.html
```html
<!doctype html>
<html ng-app>
    <head>
    </head>
    <body>
        <div ng-controller="CommonController">
            <div ng-controller="Controller1">
                <p>{{greeting.text}},Angular</p>
                <button ng-click="test1()">test1</button>
            </div>
            <div ng-controller="Controller2">
                <p>{{greeting.text}},Angular</p>
                <button ng-click="test2()">test2</button>
                <button ng-click="commonFn()">通用</button>
            </div>
        </div>
    </body>
    <script src="js/angular-1.3.0.js"></script>
    <script src="MVC3.js"></script>
</html>
```


MVC3.js
```javascript
function CommonController($scope){
	$scope.commonFn=function(){
    	alert("这里是通用功能！");
    };
}

function Controller1($scope) {
    $scope.greeting = {
        text: 'Hello1'
    };
    $scope.test1=function(){
    	alert("test1");
    };
}

function Controller2($scope) {
    $scope.greeting = {
        text: 'Hello2'
    };
    $scope.test2=function(){
    	alert("test2");
    }
}
```







model
===========================================================================================================

概念
----------------------------------------------------------------

* angular的MVC是借助$scope实现的
* $scope充当MVC中的Data-Model角色
* $scope是一个POJO（Plain Old Javascript Object）
* $scope提供了一些工具方法$watch()/$apply()
* $scope是表达式的执行环境（或者叫作用域）
* $scope是一个树形结构，与DOM标签平行
* $scope以元素属性的形式被绑定在对应的HTML标签上，可以通过angular.element($0).scope()方式获取和调试
* 子$scope对象会继承父$scope上的属性
* 每一个Angular应用只有一个根$scope对象（一般位于ng-app上）
* $scope可以传播事件，类似DOM事件，可以向上也可以向下
* $scope不仅是MVC的基础，也是后面实现双向绑定的基础
* $scope的生命期：creation -> matcher registration -> model mutation -> mutation observation -> scope destruction





示例1
----------------------------------------------------------------

Scope1.html
```html

<!doctype html>
<html ng-app>
	<head>
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




示例2
----------------------------------------------------------------

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
