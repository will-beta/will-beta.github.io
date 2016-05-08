---
title: angular的双向数据绑定
categories: [开发]
tags: [angular]
sitemap:
    lastmod: 2015-10-7T12:49:30-05:00
---



概述
====================================

* 由于angular的$digest机制和“对象深比较”机制，导致在处理tree型结构方面性能非常差，建议不要对tree型结构使用双向数据绑定。




angular支持的表达式类型
====================================

* 数学运算：+ , - , / , * , %
* 比较运算：== , != , > , < , >= , <=
* 布尔运算：&& , || , !
* 位运算： ^ , & , |
* 对象和数组字面值： [] , {}

注意：不支持if/for/while等控制逻辑！






自己动手实现双向数据绑定？
====================================

* 如何把一个model绑定到多个view？（观察者模式）
* 如何才能知道model发生了变化？（脏值检测$watch和$digest）
* 如果model是深层嵌套结构，如何知道某个属性是不是变了？（对象深比较）
* A和B两个方法互相watch对方的时候，如何避免发生“振荡”？（TTL机制）
* 绑定的过程中如何支持表达式？（$parse与$eval自制JS版的编译器）

参考：[创建你自己的AngularJS](http://www.html-js.com/article/1863)







最简单的例子
====================================

HelloAngular_MVC.html
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
    <script src="js/angular-1.3.0.js"></script>
    <script src="HelloAngular_MVC.js"></script>
</html>

```


HelloAngular_MVC.js
```javascript
function HelloAngular($scope) {
    $scope.greeting = {
        text: 'Hello'
    };
}
```






取值表达式和ng-bind
====================================

HelloAngular_bind.html
```html
<!doctype html>
<html ng-app>
    <head>
        <meta charset="utf-8">
    </head>
    <body>
        <div ng-controller="HelloAngular">
            <p><span ng-bind="greeting.text"></span>,Angular</p>
        </div>
    </body>
    <script src="js/angular-1.3.0.js"></script>
    <script src="HelloAngular_MVC.js"></script>
</html>

```

HelloAngular_bind.js
```javascript
function HelloAngular($scope) {
    $scope.greeting = {
        text: 'Hello'
    };
}
```






双向绑定的典型场景--表单
====================================

Form.html
```html
<!doctype html>
<html ng-app="UserInfoModule">

<head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="css/bootstrap-3.0.0/css/bootstrap.css">
    <script src="framework/angular-1.3.0.14/angular.js"></script>
    <script src="Form.js"></script>
</head>

<body>
    <div class="panel panel-primary">
        <div class="panel-heading">
            <div class="panel-title">双向数据绑定</div>
        </div>
        <div class="panel-body">
            <div class="row">
                <div class="col-md-12">
                    <form class="form-horizontal" role="form" ng-controller="UserInfoCtrl">
                        <div class="form-group">
                            <label class="col-md-2 control-label">
                                邮箱：
                            </label>
                            <div class="col-md-10">
                                <input type="email" class="form-control" placeholder="推荐使用126邮箱" ng-model="userInfo.email">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label">
                                密码：
                            </label>
                            <div class="col-md-10">
                                <input type="password" class="form-control" placeholder="只能是数字、字母、下划线" ng-model="userInfo.password">
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-md-offset-2 col-md-10">
                                <div class="checkbox">
                                    <label>
                                        <input type="checkbox" ng-model="userInfo.autoLogin">自动登录
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-md-offset-2 col-md-10">
                                <button class="btn btn-default" ng-click="getFormData()">获取Form表单的值</button>
                                <button class="btn btn-default" ng-click="setFormData()">设置Form表单的值</button>
                                <button class="btn btn-default" ng-click="resetForm()">重置表单</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
```


Form.js
```javascript
var userInfoModule = angular.module('UserInfoModule', []);
userInfoModule.controller('UserInfoCtrl', ['$scope',
    function(scope) {
        scope.getFormData = function() {
            console.log($scope.userInfo);
        };
        scope.setFormData = function() {
            $scope.userInfo = {
                email: '123@126.com',
                password: '123',
                autoLogin: false
            }
        };
        scope.resetForm = function() {
            $scope.userInfo = {
                email: "456@qq.com",
                password: "456",
                autoLogin: true
            };
        };
        scope.resetForm();
    }
])
```






动态切换标签样式
====================================

CSS1.html
```html
<!doctype html>
<html ng-app="MyCSSModule">

<head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="CSS1.css">
</head>

<body>
    <div ng-controller="CSSCtrl">
        <p class="text-{{color}}">测试CSS样式</p>
        <button class="btn btn-default" ng-click="setGreen()">绿色</button>
    </div>
</body>
<script src="js/angular-1.3.0.js"></script>
<script src="CSS1.js"></script>

</html>
```


CSS1.js
```javascript
var myCSSModule = angular.module('MyCSSModule', []);
myCSSModule.controller('CSSCtrl', ['$scope',
    function($scope) {
        $scope.color = "red";
        $scope.setGreen = function() {
            $scope.color = "green";
        }
    }
])
```


CSS1.js
```javascript
.text-red {
    background-color: #ff0000;
}
.text-green {
    background-color: #00ff00;
}
```






ng-show和ng-hide
====================================

NgShow.html
```html
<!doctype html>
<html ng-app="MyCSSModule">

<head>
    <meta charset="utf-8">
</head>

<body>
    <div ng-controller='DeathrayMenuController'>
        <button ng-click='toggleMenu()'>Toggle Menu</button>
        <ul ng-show='menuState.show'>
            <li ng-click='stun()'>Stun</li>
            <li ng-click='disintegrate()'>Disintegrate</li>
            <li ng-click='erase()'>Erase from history</li>
        </ul>
    <div/>
</body>

<script src="js/angular-1.3.0.js"></script>
<script src="NgShow.js"></script>

</html>
```


NgShow.js
```javascript
var myCSSModule = angular.module('MyCSSModule', []);
myCSSModule.controller('DeathrayMenuController', ['$scope',
    function($scope) {
        $scope.menuState={show:false};
        $scope.toggleMenu = function() {
            $scope.menuState.show = !$scope.menuState.show;
        };
    }
])
```






ng-class
====================================

NgClass.html
```html
<!doctype html>
<html ng-app="MyCSSModule">

<head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="NgClass.css">
</head>

<body>
    <div ng-controller='HeaderController'>
        <div ng-class='{error: isError, warning: isWarning}'>{{messageText}}</div>
        <button ng-click='showError()'>Simulate Error</button>
        <button ng-click='showWarning()'>Simulate Warning</button>
    </div>
</body>
<script src="js/angular-1.3.0.js"></script>
<script src="NgClass.js"></script>

</html>
```


NgClass.js
```javascript
var myCSSModule = angular.module('MyCSSModule', []);
myCSSModule.controller('HeaderController', ['$scope',
    function($scope) {
        $scope.isError = false;
        $scope.isWarning = false;
        $scope.showError = function() {
            $scope.messageText = 'This is an error!';
            $scope.isError = true;
            $scope.isWarning = false;
        };
        $scope.showWarning = function() {
            $scope.messageText = 'Just a warning. Please carry on.';
            $scope.isWarning = true;
            $scope.isError = false;
        };
    }
])
```


NgClass.css
```javascript
.error {
    background-color: red;
}
.warning {
    background-color: yellow;
}
```
