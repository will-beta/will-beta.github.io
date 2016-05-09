---
title: angular的启动方式
categories: [开发]
tags: [angular]
sitemap:
    lastmod: 2015-10-7T12:49:30-05:00
---


自动启动方式
==============

Boot1.html：有ng-app值

```html
<html ng-app="MyModule">
	<head>
		<script src="../framework/angular-1.3.0.14/angular.js"></script>
		<script src="Boot1.js"></script>
	</head>
	<body>
		<div ng-controller="MyCtrl">
			<span>{{gameName}}</span>
		</div>
	</body>
</html>
```

Boot1.js

```javascript
var myModule = angular.module("MyModule", []);
myModule.controller('MyCtrl', ['$scope',
    function(scope) {
        scope.gameName = "大漠吃豆子";
    }
]);
```






手动启动方式
=============

Boot1.html：没有ng-app值

```html
<html>
	<head>
		<script src="../framework/angular-1.3.0.14/angular.js"></script>
		<script src="Boot1.js"></script>
	</head>
	<body>
		<div ng-controller="MyCtrl">
			<span>{{gameName}}</span>
		</div>
	</body>
</html>
```


Boot1.js

```javascript
var myModule = angular.module("MyModule", []);
myModule.controller('MyCtrl', ['$scope',
    function(scope) {
        scope.gameName = "大漠吃豆子";
    }
]);

/**
 * 注意这里要用ready函数等待文档初始化完成
 * @return {[type]} [description]
 */
angular.element(document).ready(function() {
    angular.bootstrap(document, ['MyModule']);
});
```





不在一个页面上放多个ng-app的原因
=================================

* angular默认只启动第一个。
* 路由等不好处理。





内部
=================================

* publishExternalAPI(angular)
* 调用setupModuleLoader(window)函数建立模块机制
* 注册内核provider（两个最重要的provider：$parse和$rootScope）
* angularInit：防止多次初始化ng-app;
* bootstrap:创建injector、拉起内核和启动模块、调用compile服务