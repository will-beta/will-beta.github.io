---
title: angular之指令
categories: [开发]
tags: [angular]
sitemap:
    lastmod: 2015-10-10T12:49:30-05:00
---



restrict---匹配模式
===========================================================================================

* E：元素，<my-menu title=Products></my-menu>
* A：默认，属性，<div my-menu=Products></div>
* C：样式类，<div class=my-menu:Products></div>
* M：注释，<!-- directive:my-menu Products-->

推荐使用E和A的方式使用指令
当需要创建带有自己的模板的指令时，使用元素名称的方式创建指令
当需要为已有的HTML标签增加功能时，使用属性的方式创建指令







template、templateUrl、$templateCache
===========================================================================================

示例
-------------------------------------------------------

HelloAngular_Directive.html

```html
<!doctype html>
<html ng-app="MyModule">
	<head>
	</head>
	<body>
		<hello></hello>
		<div hello></div>
		<div class="hello"></div>
		<!-- directive:hello -->
		<div></div>
	</body>
	<script src="framework/angular-1.3.0.14/angular.js"></script>
	<script src="HelloAngular_Directive.js"></script>
</html>
```


HelloAngular_Directive.js

```javascript

var myModule = angular.module("MyModule", []);
myModule.directive("hello", function() {
    return {
        restrict: 'AEMC',
        template: '<div>Hi everyone!</div>',
        replace: true
    }
});

```



示例
-------------------------------------------------------

$templateCache.html

``` html

<!doctype html>
<html ng-app="MyModule">
	<head>
		<meta charset="utf-8">
	</head>
	<body>
		<hello></hello>
	</body>
	<script src="framework/angular-1.3.0.14/angular.js"></script>
	<script src="$templateCache.js"></script>
</html>

```


$templateCache.js

```javascript

var myModule = angular.module("MyModule", []);

//注射器加载完所有模块时，此方法执行一次
myModule.run(function($templateCache){
	$templateCache.put("hello.html","<div>Hello everyone!!!!!!</div>");
});

myModule.directive("hello", function($templateCache) {
    return {
        restrict: 'AECM',
        template: $templateCache.get("hello.html"),
        replace: true
    }
});

```




replace和transclude
===========================================================================================

示例
-------------------------------------------------------

replace.html

```html

<!doctype html>
<html ng-app="MyModule">
	<head>
	</head>
	<body>
		<hello>
			<div>这里是指令内部的内容。</div>
		</hello>
	</body>
	<script src="framework/angular-1.3.0.14/angular.js"></script>
	<script src="replace.js"></script>
</html>

```


replace.js

```javascript

var myModule = angular.module("MyModule", []);
myModule.directive("hello", function() {
    return {
    	restrict:"AE",
    	template:"<div>Hello everyone!</div>",
    	replace:true
    } 
});

```



示例
-------------------------------------------------------

transclude.html

```html

<!doctype html>
<html ng-app="MyModule">
	<head>
	</head>
	<body>
		<hello>
			<div>这里是指令内部的内容。</div>
		</hello>
	</body>
	<script src="framework/angular-1.3.0.14/angular.js"></script>
	<script src="transclude.js"></script>
</html>

```


transclude.js

```javascript

var myModule = angular.module("MyModule", []);
myModule.directive("hello", function() {
    return {
    	restrict:"AE",
    	transclude:true,
    	template:"<div>Hello everyone!<div ng-transclude></div></div>"
    } 
});

```




complie和link
===========================================================================================

流程
-------------------------------------------------------

加载阶段：
加载angular.js，找到ng-app指令，确定应用的边界；

编译阶段：
遍历DOM，找到所有指令；
根据指令代码中的template、replace、transclude转换DOM结构；
如果存在dompile函数则调用；

链接阶段：
对每一条指令运行link函数；
link函数一般用来操作DOM、绑定事件监听器；



概述
-------------------------------------------------------

* compile函数用来对模板自身进行转换，而link函数负责在模型和视图之间进行动态关联
* 作用域在链接阶段才会被绑定到编译之后的link函数上。
* compile函数仅仅在编译阶段运行一次，而对于指令的每个实例，link函数都会执行一次
* compile可以返回preLink和postLink函数，而link函数只会返回postLink函数。
* 如果需要修改DOM结构，应该在postLink中来做这件事情，而如果在preLink中做这件事件会导致错误
* 大多数时候我们只要编写link函数即可



compile和link的区别
-------------------------------------------------------

* compile函数的作用是对指令的模板进行转换。
* link函数的作用是在模型和视图之间建立关联，包括在元素上注册事件监听。
* scope在链接阶段才会被绑定在元素上，因此compile阶段操作scope会报错。
* 对于同一指令的多个实例，compile只会执行一次；而link对于指令的每个实例都会执行一次。
* 一般情况下我们只要编写link函数就够了。
* 如果提供了自定义的compile函数，就再提供link函数会无效，因为compile函数的返回值就是一个link函数。



示例
-------------------------------------------------------

link1.html

```html

<!doctype html>
<html ng-app="MyModule">
	<head>
	</head>
	<body>
		<hello>Hi everyone!</hello>
	</body>
	<script src="framework/angular-1.3.0.14/angular.js"></script>
	<script src="link1.js"></script>
</html>

```


link1.js

```javascript

var myModule = angular.module("MyModule", []);
myModule.directive("hello", function() {
    return {
    	restrict:"AE",
    	link:function(scope,element,attrs){
	    	console.log(element);
	    	element.bind("mouseenter",function(){
	    		console.log("鼠标进入...");
	    	});
	    	element.bind("mouseout",function(){
	    		console.log("鼠标滑出...");
	    	});
	    }
    } 
});

```



示例
-------------------------------------------------------

link2.html

```html

<!doctype html>
<html ng-app="MyModule">
	<head>
	</head>
	<body>
		<div ng-repeat="i in [1,2,3,4]">
			<hello>Hi everyone!</hello>
		</div>
	</body>
	<script src="framework/angular-1.3.0.14/angular.js"></script>
	<script src="link2.js"></script>
</html>

```


link2.js

```javascript

var myModule = angular.module("MyModule", []);
myModule.directive("hello", function() {
    return {
        restrict: "AE",
        // compile: function(tElement, tAttrs, transclude) {
        //     return {
        //         pre: function preLink(scope, iElement, iAttrs, controller) {
        //             console.log("pre compile...");
        //         },
        //         post: function postLink(scope, iElement, iAttrs, controller) {
        //             console.log("post compile...");
        //         }
        //     }
        // },
        link: function(scope, element, attrs) {
            console.log("link...");
            element.bind("mouseenter", function(event) {
                console.log("鼠标进入...");
            });
            element.bind("mouseout", function(event) {
                console.log("鼠标滑出...");
            });
        }
    }
});

```




示例
==========================================

HelloAngularCompile.html

```html

<!doctype html>
<html ng-app="MyModule">
	<head>
	</head>
	<body>
		<div manyhello="5">
		  	<p>大漠你好，大漠再见！</p>
		</div>
	</body>
	<script src="../framework/angular-1.3.0.14/angular.js"></script>
	<script src="HelloAngularCompile.js"></script>
</html>

```

HelloAngularCompile.js

```javascript

var myModule = angular.module("MyModule", []);
myModule.directive('manyhello', function() {
    return {
        restrict: 'A',
        compile: function(element,attrs,transclude) {
            //这里开始对标签元素自身进行一些变换
            console.log("指令编译...");

            var tpl = element.children().clone();
            for (var i = 0; i < attrs.alotofhello - 1; i++) {
                element.append(tpl.clone());
            }

            return function(scope,element,attrs,controller){
            	console.log("指令链接...");
            }
        },
        link:function(scope,element,attrs,controller){//因为已经有了compile，所以这里的link不会得到执行
            console.log("我自己的link函数...");
        }
    }
});

```





指令和控制器之间的交互
===========================================================================================

示例
-------------------------------------------------------

Directive&Controller.html

```html

<!doctype html>
<html ng-app="MyModule">
	<head>
	</head>
	<body>
		<div ng-controller="MyCtrl">
			<loader howToLoad="loadData()">滑动加载</loader>
		</div>
		<div ng-controller="MyCtrl2">
			<loader howToLoad="loadData2()">滑动加载</loader>
		</div>
	</body>
	<script src="framework/angular-1.3.0.14/angular.js"></script>
	<script src="Directive&Controller.js"></script>
</html>

```

Directive&Controller.js

```javascript

var myModule = angular.module("MyModule", []);
myModule.controller('MyCtrl', ['$scope', function($scope){
	$scope.loadData=function(){
		console.log("加载数据中...");
    }
}]);
myModule.controller('MyCtrl2', ['$scope', function($scope){
    $scope.loadData2=function(){
        console.log("加载数据中...22222");
    }
}]);
myModule.directive("loader", function() {
    return {
    	restrict:"AE",
    	link:function(scope,element,attrs){
    		element.bind('mouseenter', function(event) {
    			//scope.loadData();
    			// scope.$apply("loadData()");
    			// 注意这里的坑，howToLoad会被转换成小写的howtoload
    			scope.$apply(attrs.howtoload);
    		});
        }
    } 
});

```






指令间的交互
===========================================================================================

示例
-------------------------------------------------------

Directive&Directive.html

```html

<!doctype html>
<html ng-app="MyModule">

<head>
    <link rel="stylesheet" href="css/bootstrap-3.0.0/css/bootstrap.css">
    <script src="framework/angular-1.3.0.14/angular.js"></script>
    <script src="Directive&Directive.js"></script>
</head>

<body>
	<div class="row">
		<div class="col-md-3">
			<superman strength>动感超人---力量</superman>
		</div>
	</div>
	<div class="row">
		<div class="col-md-3">
			<superman strength speed>动感超人2---力量+敏捷</superman>
		</div>
	</div>
	<div class="row">
		<div class="col-md-3">
			<superman strength speed light>动感超人3---力量+敏捷+发光</superman>
		</div>
	</div>
</body>

</html>

```

Directive&Directive.js

```javascript

var myModule = angular.module("MyModule", []);
myModule.directive("superman", function() {
    return {
        scope: {},
        restrict: 'AE',
        controller: function($scope) {
            $scope.abilities = [];
            this.addStrength = function() {
                $scope.abilities.push("strength");
            };
            this.addSpeed = function() {
                $scope.abilities.push("speed");
            };
            this.addLight = function() {
                $scope.abilities.push("light");
            };
        },
        link: function(scope, element, attrs) {
            element.addClass('btn btn-primary');
            element.bind("mouseenter", function() {
                console.log(scope.abilities);
            });
        }
    }
});
myModule.directive("strength", function() {
    return {
        require: '^superman',
        link: function(scope, element, attrs, supermanCtrl) {
            supermanCtrl.addStrength();
        }
    }
});
myModule.directive("speed", function() {
    return {
        require: '^superman',
        link: function(scope, element, attrs, supermanCtrl) {
            supermanCtrl.addSpeed();
        }
    }
});
myModule.directive("light", function() {
    return {
        require: '^superman',
        link: function(scope, element, attrs, supermanCtrl) {
            supermanCtrl.addLight();
        }
    }
});

```



示例
-------------------------------------------------------

Directive&Directive2.html

```html

<!doctype html>
<html ng-app="docsTabsExample">

<head>
    <link rel="stylesheet" href="css/bootstrap-3.0.0/css/bootstrap.css">
    <script src="framework/angular-1.3.0.14/angular.js"></script>
    <script src="Directive&Directive2.js"></script>
</head>

<body>
    <my-tabs>
        <my-pane title="Hello">
            <h5>Hello</h5>
            <p>Lorem ipsum dolor sit amet</p>
        </my-pane>
        <my-pane title="World">
            <h5>World</h5>
            <em>Mauris elementum elementum enim at suscipit.</em>
            <p><a href ng-click="i = i + 1">counter: 0</a>
            </p>
        </my-pane>
    </my-tabs>
</body>

</html>

```


Directive&Directive2.js

```javascript

angular.module('docsTabsExample', [])
    .directive('my-tabs', function() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {},
            controller: function($scope) {
                var panes = $scope.panes = [];
                $scope.select = function(pane) {
                    angular.forEach(panes, function(pane) {
                        pane.selected = false;
                    });
                    pane.selected = true;
                };

                this.addPane = function(pane) {
                    if (panes.length == 0) {
                        $scope.select(pane);
                    }
                    panes.push(pane);
                };
            },
            templateUrl: 'my-tabs.html'
        };
    })
    .directive('my-pane', function() {
        return {
            require: '^my-tabs',
            restrict: 'E',
            transclude: true,
            scope: {
                title: '@'
            },
            link: function(scope, element, attrs, tabsCtrl) {
                tabsCtrl.addPane(scope);
            },
            templateUrl: 'my-pane.html'
        };
    });
    
```


my-tabs.html

```html

<div class="tabbable">
    <ul class="nav nav-tabs">
        <li ng-repeat="pane in panes" ng-class="{active:pane.selected}">
            <a href="" ng-click="select(pane)"></a>
        </li>
    </ul>
    <div class="tab-content" ng-transclude></div>
</div>

```


my-pane.html

```html

<div class="tab-pane" ng-show="selected" ng-transclude>
</div>

```





scope的类型与独立scope
===========================================================================================

示例
-------------------------------------------------------

IsolateScope.html

```html

<!doctype html>
<html ng-app="MyModule">
	<head>
		<link rel="stylesheet" href="css/bootstrap-3.0.0/css/bootstrap.css">
	</head>
	<body>
		<hello></hello>
		<hello></hello>
		<hello></hello>
		<hello></hello>
	</body>
	<script src="framework/angular-1.3.0.14/angular.js"></script>
	<script src="IsolateScope.js"></script>
</html>

```

IsolateScope.js

```javascript

var myModule = angular.module("MyModule", []);
myModule.directive("hello", function() {
    return {
        restrict: 'AE',
        scope:{},
        template: '<div><input type="text" ng-model="userName"/>{{userName}}</div>',
        replace: true
    }
});

```






scope的绑定策略
===========================================================================================

概述
-------------------------------------------------------

@ ：把当前属性作为字符串传递。你还可以绑定来自外层scope的值，在属性值中插入{{}}即可
= ：与父scope中的属性进行双向绑定
& ：传递一个来自父scope的函数，稍后调用



示例：@
-------------------------------------------------------

ScopeAt.html

```html

<!doctype html>
<html ng-app="MyModule">
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" href="css/bootstrap-3.0.0/css/bootstrap.css">
	</head>
	<body>
		<div ng-controller="MyCtrl">
			<drink flavor="{{ctrlFlavor}}"></drink>
		</div>
	</body>
	<script src="framework/angular-1.3.0.14/angular.js"></script>
	<script src="ScopeAt.js"></script>
</html>

```

ScopeAt.js

```javascript

var myModule = angular.module("MyModule", []);
myModule.controller('MyCtrl', ['$scope', function($scope){
	$scope.ctrlFlavor="百威";
}])
myModule.directive("drink", function() {
    return {
    	restrict:'AE',
        scope:{
        	flavor:'@'
        },
        template:"<div>{{flavor}}</div>"
        // ,
        // link:function(scope,element,attrs){
        // 	scope.flavor=attrs.flavor;
        // }
    }
});

```



示例：=
-------------------------------------------------------

ScopeEqual.html

```html

<!doctype html>
<html ng-app="MyModule">
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" href="css/bootstrap-3.0.0/css/bootstrap.css">
	</head>
	<body>
		<div ng-controller="MyCtrl">
			Ctrl:
			<br>
			<input type="text" ng-model="ctrlFlavor">
			<br>
			Directive:
			<br>
			<drink flavor="ctrlFlavor"></drink>
		</div>
	</body>
	<script src="framework/angular-1.3.0.14/angular.js"></script>
	<script src="ScopeEqual.js"></script>
</html>

```


ScopeEqual.js

```javascript

var myModule = angular.module("MyModule", []);
myModule.controller('MyCtrl', ['$scope', function($scope){
	$scope.ctrlFlavor="百威";
}])
myModule.directive("drink", function() {
    return {
    	restrict:'AE',
        scope:{
        	flavor:'='
        },
        template:'<input type="text" ng-model="flavor"/>'
    }
});

```



示例：&
-------------------------------------------------------

ScopeAnd.html

```html

<!doctype html>
<html ng-app="MyModule">
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" href="css/bootstrap-3.0.0/css/bootstrap.css">
	</head>
	<body>
		<div ng-controller="MyCtrl">
			<greeting greet="sayHello(name)"></greeting>
			<greeting greet="sayHello(name)"></greeting>
			<greeting greet="sayHello(name)"></greeting>
		</div>
	</body>
	<script src="framework/angular-1.3.0.14/angular.js"></script>
	<script src="ScopeAnd.js"></script>
</html>

```


ScopeAnd.js

```javascript

var myModule = angular.module("MyModule", []);
myModule.controller('MyCtrl', ['$scope', function($scope){
	$scope.sayHello=function(name){
		alert("Hello "+name);
	}
}])
myModule.directive("greeting", function() {
    return {
    	restrict:'AE',
        scope:{
        	greet:'&'
        },
        template:'<input type="text" ng-model="userName" /><br/>'+
        		 '<button class="btn btn-default" ng-click="greet({name:userName})">Greeting</button><br/>'
    }
});

```






AngularJS内置的指令-form
===========================================================================================

概述
-------------------------------------------------------

HTML原生的form表单是不能嵌套的，而angular封装之后的form可以嵌套；
angular为form扩展了自动校验，防止重复提交等功能；
angular对input元素的type进行了扩展，一共提供了以下10种类型：text,number,url,email,radio,checkbox,hidden,button,submit,reset
angular为表单内置了4种css样式：ng-valid,ng-invalid,ng-pristine,ng-dirty
内置校验器：require,minlength,maxlength



示例
-------------------------------------------------------

FormBasic.html

```html

<html ng-app='TestFormModule'>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<script src="framework/angular-1.3.0.14/angular.js"></script>
		<script src="FormBasic.js"></script>
	</head>
	<body>
		<form name="myForm" ng-submit="save()" ng-controller="TestFormModule">
			  <input name="userName" type="text" ng-model="user.userName" required/>
			  <input name="password" type="password" ng-model="user.password" required/>
			  <input type="submit" ng-disabled="myForm.$invalid"/>
		</form>
	</body>
</html>

```

FormBasic.js

```html

var appModule = angular.module('TestFormModule', []);
appModule.controller("TestFormModule",function($scope){
	$scope.user={
		userName:'damoqiongqiu',
		password:''
	};
	$scope.save=function(){
		alert("保存数据!");
	}
});

```



示例：可输入的div
-------------------------------------------------------

FormCustom.html

```html

<!doctype html>
<html ng-app="form-example2">
	<head>
		<link href="../bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">
		<script src="framework/angular-1.3.0.14/angular.js"></script>
		<script src="FormCustom.js"></script>
		<style type="text/css">
			div[contentEditable] {
				cursor: pointer;
				background-color: #D0D0D0;
			}
		</style>
	</head>
	<body>
		<div>
			<div contentEditable="true" ng-model="content" title="Click to edit">Some</div>
			<pre>model = {{content}}</pre>
		</div>
	</body>
</html>

```

FormCustom.js

```html

angular.module('form-example2', []).directive('contenteditable', function() {
	return {
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			// view -> model
			elm.bind('keyup', function() {
				scope.$apply(function() {
					ctrl.$setViewValue(elm.text());
				});
			});

			// model -> view
			ctrl.$render = function() {
				elm.html(ctrl.$viewValue);
			};

			// load init value from DOM
			ctrl.$setViewValue(elm.html());
		}
	};
});

```



示例：表单验证
-------------------------------------------------------

FormValidation.html

```html

<!doctype html>
<html ng-app="form-example1">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<link rel="stylesheet" href="css/bootstrap-3.0.0/css/bootstrap.css" media="screen">
		<script src="framework/angular-1.3.0.14/angular.js"></script>
		<script src="FormValidation.js"></script>
	</head>
	<body>
		<div>
			<form name="myForm" class="css-form" novalidate>
				<div>
					整数(0-10):
					<input type="number" ng-model="size" name="size" min="0" max="10" integer/>
					{{size}}
					<br/>
					<span ng-show="myForm.size.$error.integer">不是合法的整数！</span>
					<span ng-show="myForm.size.$error.min || myForm.size.$error.max">
						数值必须位于0到10之间！
					</span>
				</div>
				<div>
					浮点数:
					<input type="text" ng-model="length" name="length" smart-float />
						{{length}}
					<br/>
					<span ng-show="myForm.length.$error.float">不是合法的浮点数！</span>
				</div>
				<div>
					远程校验:
					<input type="text" ng-model="remote" name="remote" remote-validation />
						{{remote}}
					<br/>
					<span ng-show="myForm.remote.$error.remote">非法数据！</span>
				</div>
			</form>
		</div>
	</body>
</html>

```

FormValidation.js

```html

var app = angular.module('form-example1', []);
var INTEGER_REGEXP = /^\-?\d*$/;
app.directive('integer', function() {
	return {
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			ctrl.$parsers.unshift(function(viewValue) {
				if (INTEGER_REGEXP.test(viewValue)) {
					ctrl.$setValidity('integer', true);
					return viewValue;
				} else {
					ctrl.$setValidity('integer', false);
					return undefined;
				}
			});
		}
	};
});

var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;
app.directive('smartFloat', function() {
	return {
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			ctrl.$parsers.unshift(function(viewValue) {
				if (FLOAT_REGEXP.test(viewValue)) {
					ctrl.$setValidity('float', true);
					return parseFloat(viewValue.replace(',','.'));
				} else {
					ctrl.$setValidity('float', false);
					return undefined;
				}
			});
		}
	};
});

app.directive('remoteValidation', function($http) {
	return {
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			elm.bind('keyup', function() {
			    $http({method: 'GET', url: 'FormValidation.jsp'}).
			    success(function(data, status, headers, config) {
			    	if(parseInt(data)==0){
			    		ctrl.$setValidity('remote',true);
			    	}else{
			    		ctrl.$setValidity('remote',false);
			    	}
			    }).
			    error(function(data, status, headers, config) {
			    	ctrl.$setValidity('remote', false);
			    });
			});
		}
	};
});

```



示例
-------------------------------------------------------

FormAdv1.html

```html

<!doctype html>
<html ng-app>
	<head>
		<script src="framework/angular-1.3.0.14/angular.js"></script>
		<script src="FormAdv1.js"></script>
	</head>
	<body>
		<div ng-controller="Controller">
			<form name="form" class="css-form" novalidate>
				Name:
				<input type="text" ng-model="user.name" name="uName" required /><br/>
				E-mail:
				<input type="email" ng-model="user.email" name="uEmail" required /><br/>
				<div ng-show="form.uEmail.$dirty && form.uEmail.$invalid">
					Invalid:
					<span ng-show="form.uEmail.$error.required">Tell us your email.</span>
					<span ng-show="form.uEmail.$error.email">This is not a valid email.</span>
				</div>
				Gender:<br/>
				<input type="radio" ng-model="user.gender" value="male" />
				male
				<input type="radio" ng-model="user.gender" value="female" />
				female<br/>
				<input type="checkbox" ng-model="user.agree" name="userAgree" required />
				I agree:
				<input ng-show="user.agree" type="text" ng-model="user.agreeSign" required />
				<div ng-show="!user.agree || !user.agreeSign">
					Please agree and sign.
				</div>
				<br/>
				<button ng-click="reset()" ng-disabled="isUnchanged(user)">
					RESET
				</button>
				<button ng-click="update(user)" ng-disabled="form.$invalid || isUnchanged(user)">
					SAVE
				</button>
			</form>
		</div>
	</body>
</html>

```

FormAdv1.js

```html

function Controller($scope) {
	$scope.master = {};

	$scope.update = function(user) {
		$scope.master = angular.copy(user);
	};

	$scope.reset = function() {
		$scope.user = angular.copy($scope.master);
	};

	$scope.isUnchanged = function(user) {
		return angular.equals(user, $scope.master);
	};

	$scope.reset();
}

```






实例解析Expander
===========================================================================================

代码
-------------------------------------------------------

ExpanderSimple.html

```html

<html ng-app='expanderModule'>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<link rel="stylesheet" type="text/css" href="ExpanderSimple.css"/>
		<script src="framework/angular-1.3.0.14/angular.js"></script>
		<script src="ExpanderSimple.js"></script>
	</head>
	<body>
		<div ng-controller='SomeController'>
			<expander class='expander' expander-title='title'>
				{{text}}
			</expander>
		</div>
	</body>
</html>

```

ExpanderSimple.js

```html

var expanderModule=angular.module('expanderModule', []);
expanderModule.directive('expander', function() {
	return {
		restrict : 'EA',
		replace : true,
		transclude : true,
		scope : {
			title : '=expanderTitle'
		},
		template : '<div>'
				 + '<div class="title" ng-click="toggle()">{{title}}</div>'
				 + '<div class="body" ng-show="showMe" ng-transclude></div>'
				 + '</div>',
		link : function(scope, element, attrs) {
			scope.showMe = false;
			scope.toggle = function() {
				scope.showMe = !scope.showMe;
			}
		}
	}
});
expanderModule.controller('SomeController',function($scope) {
    $scope.title = '点击展开';
	$scope.text = '这里是内部的内容。';
});

```






实例解析Accordion
===========================================================================================

代码
-------------------------------------------------------

Accordion.html

```html

<html ng-app="expanderModule">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<link rel="stylesheet" type="text/css" href="Accordion.css"/>
		<script src="framework/angular-1.3.0.14/angular.js"></script>
		<script src="Accordion.js"></script>
	</head>
	<body ng-controller='SomeController' >
		<accordion>
			<expander class='expander' ng-repeat='expander in expanders' expander-title='expander.title'>
				{{expander.text}}
			</expander>
		</accordion>
	</body>
</html>

```

Accordion.js

```html

var expModule=angular.module('expanderModule',[])
expModule.directive('accordion', function() {
	return {
		restrict : 'EA',
		replace : true,
		transclude : true,
		template : '<div ng-transclude></div>',
		controller : function() {
			var expanders = [];
			this.gotOpened = function(selectedExpander) {
				angular.forEach(expanders, function(expander) {
					if (selectedExpander != expander) {
						expander.showMe = false;
					}
				});
			}
			this.addExpander = function(expander) {
				expanders.push(expander);
			}
		}
	}
});

expModule.directive('expander', function() {
	return {
		restrict : 'EA',
		replace : true,
		transclude : true,
		require : '^?accordion',
		scope : {
			title : '=expanderTitle'
		},
		template : '<div>'
				  + '<div class="title" ng-click="toggle()">{{title}}</div>'
				  + '<div class="body" ng-show="showMe" ng-transclude></div>'
				  + '</div>',
		link : function(scope, element, attrs, accordionController) {
			scope.showMe = false;
			accordionController.addExpander(scope);
			scope.toggle = function toggle() {
				scope.showMe = !scope.showMe;
				accordionController.gotOpened(scope);
			}
		}
	}
});

expModule.controller("SomeController",function($scope) {
	$scope.expanders = [{
		title : 'Click me to expand',
		text : 'Hi there folks, I am the content that was hidden but is now shown.'
	}, {
		title : 'Click this',
		text : 'I am even better text than you have seen previously'
	}, {
		title : 'Test',
		text : 'test'
	}];
});

```






第三方指令库angular-ui
===========================================================================================

示例
-------------------------------------------------------

Accordion-ngui.html

```html

<!doctype html>
<html ng-app="MyModule">

<head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="framework/bootstrap-3.0.0/css/bootstrap.css">
    <link rel="stylesheet" href="common.css">
    <script src="framework/angular-1.3.0.14/angular.js"></script>
    <script src="framework/ui-bootstrap-tpls-0.11.0.js"></script>
    <script src="Accordion-ngui.js"></script>
</head>

<body>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div ng-controller="AccordionDemoCtrl">
                    <p>
                        <button class="btn btn-default btn-md" ng-click="status.open = !status.open">Toggle last panel</button>
                        <button class="btn btn-default btn-md" ng-click="status.isFirstDisabled = ! status.isFirstDisabled">Enable / Disable first panel</button>
                    </p>

                    <label class="checkbox">
                        <input type="checkbox" ng-model="oneAtATime">Open only one at a time
                    </label>
                    <accordion close-others="oneAtATime">
                        <accordion-group heading="Static Header, initially expanded" is-open="status.isFirstOpen" is-disabled="status.isFirstDisabled">
                            This content is straight in the template.
                        </accordion-group>
                        <accordion-group heading="{{group.title}}" ng-repeat="group in groups">
                            {{group.content}}
                        </accordion-group>
                        <accordion-group heading="Dynamic Body Content">
                            <p>The body of the accordion group grows to fit the contents</p>
                            <button class="btn btn-default btn-md" ng-click="addItem()">Add Item</button>
                            <div ng-repeat="item in items">{{item}}</div>
                        </accordion-group>
                        <accordion-group is-open="status.open">
                            <accordion-heading>
                                I can have markup, too! <i class="pull-right glyphicon" ng-class="{'glyphicon-chevron-down': status.open, 'glyphicon-chevron-right': !status.open}"></i>
                            </accordion-heading>
                            This is just some content to illustrate fancy headings.
                        </accordion-group>
                    </accordion>
                </div>

            </div>
        </div>
    </div>

</body>

</html>

```

Accordion-ngui.js

```html

var myModule = angular.module('MyModule', ['ui.bootstrap']);
myModule.controller('AccordionDemoCtrl', ['$scope',
    function($scope) {

        $scope.oneAtATime = true;

        $scope.groups = [{
            title: 'Dynamic Group Header - 1',
            content: 'Dynamic Group Body - 1'
        }, {
            title: 'Dynamic Group Header - 2',
            content: 'Dynamic Group Body - 2'
        }];

        $scope.items = ['Item 1', 'Item 2', 'Item 3'];

        $scope.addItem = function() {
            var newItemNo = $scope.items.length + 1;
            $scope.items.push('Item ' + newItemNo);
        };

        $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };
    }
])

```






ERP类型的系统必备的UI组件
===========================================================================================

表单
-------------------------------------------------------

Form(*)
DataBinding
Button
CheckBox
ListBox
CheckBoxList
RadioButtonList
Calendar
ButtonEdit
PopupEdit
TextBox
Password
TextArea
TextBoxList
ComboBox
DatePicker
Spinner
TimeSpinner
TreeSelect
Lookup
HtmlFile
FileUpload



布局
-------------------------------------------------------

Panel
Window
Splitter
Layout
Fit



导航
-------------------------------------------------------

Pager
NavBar
Tree(*)
Tabs
Menu
Toolbar



列表
-------------------------------------------------------

DataGrid(*)
Tree
TreeGrid

