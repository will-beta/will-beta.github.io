---
title: angular之路由
categories: [开发]
tags: [angular]
sitemap:
    lastmod: 2015-10-8T12:49:30-05:00
---



概述
========================================================================================

* ajax请求不会留下history记录。
* 用户无法直接通过url进入应用中的指定页面（保存书签，链接分享给朋友等）。
* ajax对SEO是个灾难。





前端路由的基本原理
========================================================================================

* 哈希#
* HTML5中新的history api
* 路由的核心是给应用定义“状态”
* 使用路由机制会影响到应用的整体编码方式（需要预告定义好状态）
* 考虑兼容性问题与“优雅降级”






使用官方的ngRoute进行视图之间的路由
========================================================================================

* 缺点是无法进行嵌套的、深层次的路由


示例
---------------------------------------------------------

index.html
```html
<!doctype html>
<html ng-app="bookStoreApp">

<head>
    <title>BookStore</title>
    <script src="framework/1.3.0.14/angular.js"></script>
    <script src="framework/1.3.0.14/angular-route.js"></script>
    <script src="framework/1.3.0.14/angular-animate.js"></script>
    <script src="js/app.js"></script>
    <script src="js/controllers.js"></script>
    <script src="js/filters.js"></script>
    <script src="js/services.js"></script>
    <script src="js/directives.js"></script>
</head>

<body>
    <div ng-view>
    </div>
</body>

</html>
```


hello.html
```html
<p>{{greeting.text}},Angular</p>
```


bookList.html
```html
<ul>
    <li ng-repeat="book in books">
        书名:{{book.title}}&nbsp;&nbsp;&nbsp;作者:{{book.author}}
    </li>
</ul>
```


app.js
```javascript
var bookStoreApp = angular.module('bookStoreApp', [
    'ngRoute', 'ngAnimate', 'bookStoreCtrls', 'bookStoreFilters',
    'bookStoreServices', 'bookStoreDirectives'
]);

bookStoreApp.config(function($routeProvider) {
    $routeProvider.when('/hello', {
        templateUrl: 'tpls/hello.html',
        controller: 'HelloCtrl'
    }).when('/list',{
    	templateUrl:'tpls/bookList.html',
    	controller:'BookListCtrl'
    }).otherwise({
        redirectTo: '/hello'
    })
});
```


controllers.js
```javascript
var bookStoreCtrls = angular.module('bookStoreCtrls', []);

bookStoreCtrls.controller('HelloCtrl', ['$scope',
    function($scope) {
        $scope.greeting = {
            text: 'Hello'
        };
    }
]);

bookStoreCtrls.controller('BookListCtrl', ['$scope',
    function($scope) {
        $scope.books =[
        	{title:"《Ext江湖》",author:"大漠穷秋"},
        	{title:"《ActionScript游戏设计基础（第二版）》",author:"大漠穷秋"},
        	{title:"《用AngularJS开发下一代WEB应用》",author:"大漠穷秋"}
        ]
    }
]);

/**
 * 这里接着往下写，如果控制器的数量非常多，需要分给多个开发者，可以借助于grunt来合并代码
 */
```


directives.js
```javascript
var bookStoreDirectives = angular.module('bookStoreDirectives', []);

bookStoreDirectives.directive('bookStoreDirective_1', ['$scope',
    function($scope) {}
]);

bookStoreDirectives.directive('bookStoreDirective_2', ['$scope',
    function($scope) {}
]);
```


filters.js
```javascript
var bookStoreFilters = angular.module('bookStoreFilters', []);

bookStoreFilters.filter('bookStoreFilter_1', ['$scope',
    function($scope) {}
]);

bookStoreFilters.filter('bookStoreFilter_2', ['$scope',
    function($scope) {}
]);
```


services.js
```javascript
var bookStoreServices = angular.module('bookStoreServices', []);

bookStoreServices.service('bookStoreService_1', ['$scope',
    function($scope) {}
]);

bookStoreServices.service('bookStoreService_2', ['$scope',
    function($scope) {}
]);
```








使用第三方的angular-ui-router进行视图之间的路由
========================================================================================

示例1
---------------------------------------------------------

UIRoute1.html
```html
<!doctype html>
<html ng-app="MyUIRoute">

<head>
    <script src="js/angular-1.3.0.js"></script>
    <script src="js/angular-animate.js"></script>
    <script src="js/angular-ui-router.js"></script>
    <script src="UIRoute1.js"></script>
</head>

<body>
    <div ui-view></div>
    <a ui-sref="state1">State 1</a>
    <a ui-sref="state2">State 2</a>
</body>

</html>
```


UIRoute1.js
```javascript
var myUIRoute = angular.module('MyUIRoute', ['ui.router', 'ngAnimate']);
myUIRoute.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/state1");
    $stateProvider
        .state('state1', {
            url: "/state1",
            templateUrl: "tpls/state1.html"
        })
        .state('state1.list', {
            url: "/list",
            templateUrl: "tpls/state1.list.html",
            controller: function($scope) {
                $scope.items = ["A", "List", "Of", "Items"];
            }
        })
        .state('state2', {
            url: "/state2",
            templateUrl: "tpls/state2.html"
        })
        .state('state2.list', {
            url: "/list",
            templateUrl: "tpls/state2.list.html",
            controller: function($scope) {
                $scope.things = ["A", "Set", "Of", "Things"];
            }
        });
});
```


state1.html
```html
<h1>State 1</h1>
<hr/>
<a ui-sref="state1.list">Show List</a>
<div ui-view></div>
```


state1.list.html
```html
<h3>List of State 1 Items</h3>
<ul>
    <li ng-repeat="item in items">{{item}}</li>
</ul>
```


state2.html
```html
<h1>State 2</h1>
<hr/>
<a ui-sref="state2.list">Show List</a>
<div ui-view></div>
```


state2.list.html
```html
<h3>List of State 2 Things</h3>
<ul>
    <li ng-repeat="thing in things">{{thing}}</li>
</ul>
```


示例2
---------------------------------------------------------

UIRoute2.html
```html
<!doctype html>
<html ng-app="routerApp">

<head>
    <link rel="stylesheet" href="css/bootstrap-3.0.0/css/bootstrap.css">
    <script src="js/angular-1.3.0.js"></script>
    <script src="js/angular-animate.js"></script>
    <script src="js/angular-ui-router.js"></script>
    <script src="UIRoute2.js"></script>
</head>

<body>
    <nav class="navbar navbar-inverse" role="navigation">
        <div class="navbar-header">
            <a class="navbar-brand" ui-sref="#">AngularUI Router</a>
        </div>
        <ul class="nav navbar-nav">
            <li>
                <a ui-sref="home">Home</a>
            </li>
            <li>
                <a ui-sref="about">About</a>
            </li>
        </ul>
    </nav>
    <div class="container">
        <div ui-view=""></div>
    </div>
</body>

</html>
```


UIRoute2.js
```javascript
var routerApp = angular.module('routerApp', ['ui.router']);
routerApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'tpls2/home.html'
        })
    // nested list with custom controller
    .state('home.list', {
        url: '/list',
        templateUrl: 'tpls2/home-list.html',
        controller: function($scope) {
            $scope.topics = ['Butterscotch', 'Black Current', 'Mango'];
        }
    })
    // nested list with just some random string data
    .state('home.paragraph', {
        url: '/paragraph',
        template: 'I could sure use a scoop of ice-cream. '
    })
    .state('about', {
        url: '/about',
        views: {
            '': {
                templateUrl: 'tpls2/about.html'
            },
            'columnOne@about': {
                template: '这里是第一列的内容'
            },
            'columnTwo@about': {
                templateUrl: 'tpls2/table-data.html',
                controller: 'Controller'
            }
        }
    });
});
routerApp.controller('Controller', function($scope) {
    $scope.message = 'test';
    $scope.topics = [{
        name: 'Butterscotch',
        price: 50
    }, {
        name: 'Black Current',
        price: 100
    }, {
        name: 'Mango',
        price: 20
    }];
});
```


about.html
```html
<div class="jumbotron text-center">
    <h1>The About Page</h1>
    <p>This page demonstrates
        <span class="text-danger">multiple</span>and
        <span class="text-danger">named</span>views.</p>
</div>
<div class="row">
    <div class="col-md-6">
        <div ui-view="columnOne"></div>
    </div>
    <div class="col-md-6">
        <div ui-view="columnTwo"></div>
    </div>
</div>
```


home.html
```html
<div class="jumbotron text-center">
    <h1>Home</h1>
    <p>This page demonstrates
        <span class="text-danger">nested</span>views.
   	</p>
    <a ui-sref=".list" class="btn btn-primary">List</a>
    <a ui-sref=".paragraph" class="btn btn-danger">Paragraph</a>
</div>
<div ui-view></div>
```


home-list.html
```html
<ul>
    <li ng-repeat="topic in topics">{{ topic }}</li>
</ul>
```


table-data.html
```html
<h2>Ice-Creams</h2>
<table class="table table-hover table-striped table-bordered">
    <thead>
        <tr>
            <td>Name</td>
            <td>Cost</td>
        </tr>
    </thead>
    <tbody>
        <tr ng-repeat="topic in topics">
            <td>{{ topic.name }}</td>
            <td>${{ topic.price }}</td>
        </tr>
    </tbody>
</table>
```



示例3
---------------------------------------------------------

UIRoute3.html
```html
<!doctype html>
<html ng-app="routerApp">

<head>
    <link rel="stylesheet" href="css/bootstrap-3.0.0/css/bootstrap.css">
    <link rel="stylesheet" href="css/index.css">
    <script src="js/angular-1.3.0.js"></script>
    <script src="js/angular-animate.js"></script>
    <script src="js/angular-ui-router.js"></script>
    <script src="UIRoute3.js"></script>
</head>

<body>
    <div ui-view></div>
</body>

</html>
```


UIRoute3.js
```javascript
var routerApp = angular.module('routerApp', ['ui.router']);
routerApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/index');
    $stateProvider
        .state('index', {
            url: '/index',
            views: {
                '': {
                    templateUrl: 'tpls3/index.html'
                },
                'topbar@index': {
                    templateUrl: 'tpls3/topbar.html'
                },
                'main@index': {
                    templateUrl: 'tpls3/home.html'
                }
            }
        })
        .state('index.usermng', {
            url: '/usermng',
            views: {
                'main@index': {
                    templateUrl: 'tpls3/usermng.html',
                    controller: function($scope, $state) {
                        $scope.addUserType = function() {
                            $state.go("index.usermng.addusertype");
                        }
                    }
                }
            }
        })
        .state('index.usermng.highendusers', {
            url: '/highendusers',
            templateUrl: 'tpls3/highendusers.html'
        })
        .state('index.usermng.normalusers', {
            url: '/normalusers',
            templateUrl: 'tpls3/normalusers.html'
        })
        .state('index.usermng.lowusers', {
            url: '/lowusers',
            templateUrl: 'tpls3/lowusers.html'
        })
        .state('index.usermng.addusertype', {
            url: '/addusertype',
            templateUrl: 'tpls3/addusertypeform.html',
            controller: function($scope, $state) {
                $scope.backToPrevious = function() {
                    window.history.back();
                }
            }
        })
        .state('index.permission', {
            url: '/permission',
            views: {
                'main@index': {
                    template: '这里是权限管理'
                }
            }
        })
        .state('index.report', {
            url: '/report',
            views: {
                'main@index': {
                    template: '这里是报表管理'
                }
            }
        })
        .state('index.settings', {
            url: '/settings',
            views: {
                'main@index': {
                    template: '这里是系统设置'
                }
            }
        })
});
```


home.html
```html
<div class="jumbotron text-center">
    <h2>首页</h2>
    <p>
        首页的形式一般比较<span class="text-danger">灵活</span>，而且可能随时发生变化。
    </p>
</div>
```


index.html
```html
<div class="container">
    <div ui-view="topbar"></div>
    <div ui-view="main"></div>
</div>
```


topbar.html
```html
<nav class="navbar navbar-inverse" role="navigation">
    <div class="navbar-header">
        <a class="navbar-brand" ui-sref="#">ui-router综合实例</a>
    </div>
    <ul class="nav navbar-nav">
        <li>
            <a ui-sref="index">首页</a>
        </li>
        <li>
            <a ui-sref="index.usermng">用户管理</a>
        </li>
        <li>
            <a ui-sref="index.permission">权限管理</a>
        </li>
        <li>
            <a ui-sref="index.report">报表管理</a>
        </li>
        <li>
            <a ui-sref="index.settings">系统设置</a>
        </li>
    </ul>
</nav>
```


usermng.html
```html
<div class="row">
    <div class="col-md-3">
        <div class="row">
            <div class="col-md-12">
                <div class="list-group">
                    <a ui-sref="#" class="list-group-item active">用户分类</a>
                    <a ui-sref="index.usermng.highendusers" class="list-group-item">高端用户</a>
                    <a ui-sref="index.usermng.normalusers" class="list-group-item">中端用户</a>
                    <a ui-sref="index.usermng.lowusers" class="list-group-item">低端用户</a>
                    <a ui-sref="#" class="list-group-item">黑名单</a>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <button class="btn btn-primary" ng-click="addUserType()">新增用户</button>
            </div>
        </div>
    </div>
    <div class="col-md-9">
        <div ui-view></div>
    </div>
</div>
```


highendusers.html
```html
<div class="row">
    <div class="col-md-12">
        <h3>高端用户列表</h3>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <table class="table table-bordered table-hover table-condensed">
            <thead>
                <tr>
                    <th>序号</th>
                    <th>姓名</th>
                    <th>年龄</th>
                    <th>作品</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td rowspan="2">1</td>
                    <td>大漠穷秋</td>
                    <td>29</td>
                    <td>《用AngularJS开发下一代WEB应用》</td>
                </tr>
                <tr>
                    <td>大漠穷秋</td>
                    <td>29</td>
                    <td>《用AngularJS开发下一代WEB应用》</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>大漠穷秋</td>
                    <td>29</td>
                    <td>《Ext江湖》</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td colspan="2">大漠穷秋</td>
                    <td>《ActionScript游戏设计基础（第二版）》</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
```


normalusers.html
```html
<div class="alert alert-success" role="alert">
    <strong>Well done!</strong>You successfully read <a href="#" class="alert-link">this important alert message</a>.
</div>
<div class="alert alert-info" role="alert">
    <strong>Heads up!</strong>This <a href="#" class="alert-link">alert needs your attention</a>, but it's not super important.
</div>
<div class="alert alert-warning" role="alert">
    <strong>Warning!</strong>Better check yourself, you're <a href="#" class="alert-link">not looking too good</a>.
</div>
<div class="alert alert-danger" role="alert">
    <strong>Oh snap!</strong> <a href="#" class="alert-link">Change a few things up</a> and try submitting again.
</div>
```


lowusers.html
```html
<div class="btn-toolbar" role="toolbar">
    <div class="btn-group">
        <button type="button" class="btn btn-default">
            <span class="glyphicon glyphicon-align-left"></span>
        </button>
        <button type="button" class="btn btn-default">
            <span class="glyphicon glyphicon-align-center"></span>
        </button>
        <button type="button" class="btn btn-default">
            <span class="glyphicon glyphicon-align-right"></span>
        </button>
        <button type="button" class="btn btn-default">
            <span class="glyphicon glyphicon-align-justify"></span>
        </button>
    </div>
</div>
<div class="btn-toolbar" role="toolbar">
    <button type="button" class="btn btn-default btn-lg">
        <span class="glyphicon glyphicon-star"></span>Star</button>
    <button type="button" class="btn btn-default">
        <span class="glyphicon glyphicon-star"></span>Star</button>
    <button type="button" class="btn btn-default btn-sm">
        <span class="glyphicon glyphicon-star"></span>Star</button>
    <button type="button" class="btn btn-default btn-xs">
        <span class="glyphicon glyphicon-star"></span>Star</button>
</div>
```


addusertypeform.html
```html
<h3>新增用户</h3>
<form class="form-horizontal" role="form">
    <div class="form-group">
        <label class="col-md-2 control-label">
            邮箱：
        </label>
        <div class="col-md-10">
            <input type="email" class="form-control" placeholder="推荐使用126邮箱">
        </div>
    </div>
    <div class="form-group">
        <label class="col-md-2 control-label">
            密码：
        </label>
        <div class="col-md-10">
            <input type="password" class="form-control" placeholder="只能是数字、字母、下划线">
        </div>
    </div>
    <div class="form-group">
        <div class="col-md-offset-2 col-md-10">
            <div class="checkbox">
                <label>
                    <input type="checkbox">自动登录
                </label>
            </div>
        </div>
    </div>
    <div class="form-group">
        <div class="col-md-offset-2 col-md-10">
            <button class="btn btn-primary" ng-click="backToPrevious()">返回</button>
        </div>
    </div>
</form>
```

