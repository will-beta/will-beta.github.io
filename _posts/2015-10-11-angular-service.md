---
title: angular之service和provider
categories: [开发]
tags: [angular]
sitemap:
    lastmod: 2015-10-10T12:49:30-05:00
---




Service的特性
========================================================================================

* service都是单例的
* service由$injector负责实例化
* service在整个应用的生命周期中存在，可以用来共享数据
* 在需要使用的地方利用依赖注入机制注入service
* 自定义的service需要写在内置的service后面
* 内置service的命名以$符号开头，自定义service应该避免
* service、provider、factory本质都是provider
* provider模式是“策略模式”+“抽象工厂模式”的混合体







常用的服务
========================================================================================

* $filter
* $http
* $compile：编译服务
* $interval
* $timeout
* $locale
* $location
* $log
* $parse






$filter服务：数据格式化工具，内置了8个
========================================================================================

概述
-------------------------------------------------------

* $filter是用来进行数据格式化的专用服务
* angularjs内置了9个filter：currency ,data ,filter ,json ,limitTo ,lowercase ,number ,orderBy ,uppercase
* filter可以嵌套使用（用管道符号|分隔）
* filter是可以传递参数的
* 用户可以定义自己的filter



内置filter使用示例
-------------------------------------------------------

```html
<html ng-app="MyModule">
	<head>
		<script src="framework/angular-1.3.0.14/angular.js"></script>
		<script src="Filter.js"></script>
	</head>
	<body>
		{{ 1304375948024 ｜ date }}
		<br>
		{{ 1304375948024 ｜ date:"MM/dd/yyyy @ h:mma" }}
		<br>
		{{ 1304375948024 ｜ date:"yyyy-MM-dd hh:mm:ss" }}
		<br>
	</body>
</html>
```



自己写filter
-------------------------------------------------------

```html
<html ng-app="MyModule">

<head>
    <script src="framework/angular-1.3.0.14/angular.js"></script>
    <script src="MyFilter.js"></script>
</head>

<body>
    {{'大漠穷秋'|filter1 }}
</body>

</html>
```

```javascript
var myModule=angular.module("MyModule",[]);
myModule.filter('filter1',function(){
    return function(item){
        return item + 'o(∩_∩)o';
    }
});
```









$http服务：封装了ajax
========================================================================================

HTTPBasic.html

``` html
<html ng-app="MyModule">
	<head>
		<script src="framework/angular-1.3.0.14/angular.js"></script>
		<script src="HTTPBasic.js"></script>
	</head>
	<body>
		<div ng-controller="LoadDataCtrl">
			<ul>
				<li ng-repeat="user in users">
					{{user.name}}
				</li>
			</ul>
		</div>
	</body>
</html>
```

HTTPBasic.js

``` javascript
var myModule=angular.module("MyModule",[]);
myModule.controller('LoadDataCtrl', ['$scope','$http', function($scope,$http){
	$http({
        method: 'GET',
        url: 'data.json'
    }).success(function(data, status, headers, config) {
        console.log("success...");
        console.log(data);
        $scope.users=data;
    }).error(function(data, status, headers, config) {
        console.log("error...");
    });
}]);
```









写自己的服务
========================================================================================

MyService1.html

```html
<html ng-app="MyServiceApp">

<head>
    <link rel="stylesheet" href="framework/bootstrap-3.0.0/css/bootstrap.css">
    <script src="framework/angular-1.3.0.14/angular.js"></script>
    <script src="MyService1.js"></script>
</head>

<body>
    <div ng-controller="ServiceController">
        <label>用户名</label>
        <input type="text" ng-model="username" placeholder="请输入用户名" />
        <pre ng-show="username">{{users}}</pre>
    </div>
</body>

</html>
```


```javascript
var myServiceApp = angular.module("MyServiceApp", []);
myServiceApp.factory('userListService', ['$http',
    function($http) {
        var doRequest = function(username, path) {
            return $http({
                method: 'GET',
                url: 'users.json'
            });
        }
        return {
            userList: function(username) {
                return doRequest(username, 'userList');
            }
        };
    }
]);
myServiceApp.controller('ServiceController', ['$scope', '$timeout', 'userListService',
    function($scope, $timeout, userListService) {
        var timeout;
        $scope.$watch('username', function(newUserName) {
            if (newUserName) {
                if (timeout) {
                    $timeout.cancel(timeout);
                }
                timeout = $timeout(function() {
                    userListService.userList(newUserName)
                        .success(function(data, status) {
                            $scope.users = data;
                        });
                }, 350);
            }
        });
    }
]);
```
