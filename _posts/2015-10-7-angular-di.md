---
title: angular之依赖注入
categories: [开发]
tags: [angular]
sitemap:
    lastmod: 2015-10-7T12:49:30-05:00
---


描述
=============================================================================

* angular中的“依赖注入”是通过provider和injector这两个机制联合实现的。





通过injector完成注入
=============================================================================

自动注入方式
------------------------------------------------------------------

### 内联注入

```javascript
var myModule = angular.module('MyModule',[]);
myModule.controller('MyCtrl',['$scope',
	function(scope){
		scope.gameName = '大漠吃豆子';
	}
]);
```


### 推断式注入

```javascript
var myModule = angular.module('MyModule',[]);
var myCtrl = function($scope){
		$scope.gameName = '大漠吃豆子';
	}
myModule.controller('MyCtrl',myCtrl);
```


### 标式注入

```javascript
var myModule = angular.module('MyModule',[]);
var myCtrl = function(scope){
		scope.gameName = '大漠吃豆子';
	}
myCtrl.$inject = ['$scope'];
myModule.controller('MyCtrl',myCtrl);
```



使用$injector手动注入方式
--------------------------------------------------------------------

```javascript
var myModule = angular.module('MyModule',[]);
myModule.factory('game',function(){
	return {
		gameName : '大漠吃豆子'
	}
});
myModule.controller('MyCtrl',['$scope','$injector',
	function(scope,injector){
		injector.invoke(function(game){
			console.log(game.gameName);
		});
		console.log(injector.annotate(function(arg0,arg1){}));
	}
]);
```





通过provider创建注入对象
=================================================================================

描述
---------------------------------------------------

* provider模式是策略模式和工厂模式的综合体。
* 核心目的是为了让接口和实现分离。
* 所有provider都可以用来进行注入：provider/factory/service/constant/value，其中provider是基础，其余都是调用provider函数实现的，只是参数不同，且灵活性从左到右灵活性越来越差。
* 可以接受注入的函数类型：controller/directive/filter/service/factory。



通过provider
---------------------------------------------------

```javascript
var myModule = angular.module('MyModule',[]);
myModule.provider('HelloAngular',function(){
	return {
		$get: function(){
			var name = '慕课网';
			function getName(){
				return name;
			}	
			return {
				getName:getName
			};
		}
	};
});
myModule.controller('MyCtrl',['$scope','HelloAngular',
	function(scope,helloAngular){
		scope.gameName = helloAngular.getName();	
	}
]);
```


通过factory
---------------------------------------------------

```javascript
var myModule = angular.module('MyModule',[]);
myModule.factory('HelloAngular',function(){
	var name = '慕课网';
	function getName(){
		return name;
	}	
	return {
		getName:getName
	};
});
myModule.controller('MyCtrl',['$scope','HelloAngular',
	function(scope,helloAngular){
		scope.gameName = helloAngular.getName();	
	}
]);
```



通过service
---------------------------------------------------

```javascript
var myModule = angular.module('MyModule',[]);
myModule.service('HelloAngular',function(){
	var name = '慕课网';
	this.getName = function(){
		return name;
	}	
});
myModule.controller('MyCtrl',['$scope','HelloAngular',
	function(scope,helloAngular){
		scope.gameName = helloAngular.getName();	
	}
]);
```



