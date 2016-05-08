---
title: django初体验
categories: [开发]
tags: [python, django, chocolatey]
sitemap:
lastmod: 2015-9-23T12:49:30-05:00
---


#安装
  * python：python的运行时
    windows下通过chocolatey安装

``` bash
choco install python
```

  * pip：python的包管理器
    windows下通过chocolatey安装

``` bash
choco install pip
```

  * ipython：python的增强型命令行交互界面
    通过pip安装

``` bash
pip install ipython
```

  * pyreadline：ipython的自动补全插件
    通过pip安装

``` bash
pip install pyreadline
```

  * django：python的web开发框架
      通过pip安装

``` bash
pip django
```

#建工程目录
  * django-admin startproject mysite
  * cd mysite
  * tree
    * settings.py：应用、中间件、数据库、静态目录
    * urls.py：url映射配置文件
    * wsgi.py：python应用程序或框架和web服务器之间接口

#创建应用
  * python manage.py startapp blog
  * tree
    * views.py：处理用户请求返回html页面
    * models.py：定义数据库中的表
    * admin.py：admin相关
    * test.py：测试相关

#编辑应用
  * vim blog/views.py

``` python
from django.shortcuts import render
from django.http import HttpResponse,HttpResponseNotFound,HttpResponseRedirect,JsonResponse,FileResponse
from django.template import loader
from .models import Blog


def showBlog(request,blogId):
     blog=Blog.objects.get(id=blogId)
     context={'blog':blog}
     t=loader.get_template('blog.html')
     html=t.render(context)

     return HttpResponse(html)
     

def showBlogList(request):
     blogs=Blog.objects.all()
     context={'blogs':blogs}
     t=loader.get_template('blog_list.html')
     html=t.render(context)

     return HttpResponse(html)
```

  * vim blog/models.py

``` python
from django.db import models
from django.utils import timezone
from django.contrib import admin


class Author(models.Model):
	name=models.CharField(max_length=50)
	age=models.IntegerField()
	
	def __unicode__(self):
		return self.name

	class Admin:
		list_display=("name","age")


class Blog(models.Model):
	title=models.CharField(max_length=50)
	content=models.TextField()
	pubDate=models.DateField(auto_now_add=True)
	author=models.ForeignKey(Author)

	def __unicode__(self):
		return self.title


# register into admin page
admin.site.register(Author)
admin.site.register(Blog)
```

  * vim blog/templates/blog.html

``` html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>{{blog.title}}</title>
</head>
<body>
	<div>
		<h1>{{blog.title}}</h1>
		<p>{{blog.author.name}}</p>
		<pre>{{blog.content}}</pre>
	</div>
</body>
</html>
```

  * vim blog/templates/blog_list.html

``` html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>blog list</title>
</head>
<body>
	<ul>
		{% for blog in blogs %}
		<li>
			<span>{{ blog.pubDate }}</span>
			<a href="/blog/{{ blog.id }}">{{ blog.title }}</a>
		</li>
		{% endfor %}
	</ul>
</body>
</html>
```

#导航应用
  * vim mysite/settings.py
    在INSTALLED_APP中添加‘blog’
  * vim mysite/urls.py
    添加以下url与view的映射：

```
      url(r'helloworld','blog.views.hello')
      url(r'^$','blog.views.showBlogList')
      url(r'^blog/(\d+$)','blog.views.showBlog')
```

#创建数据库
  * 打印即将执行的自动根据模型类生成的sql
    * 执行python manage.py sql blog后提示：

```
CommandError: App 'blog' has migrations. Only the sqlmigrate and sqlflush commands can be used when an app has migration ...
```

    * 删除blog/migrations目录

```
      rmdir blog/migrations -r
```

    * 重试

```
      python manage.py sql blog
```

  * 生成数据库：python manage.py syncdb
    * 出现以下提示时填yes:

```
      You have installed Django's auth system, and don't have any superusers defined. Would you like to create one now? (yes/no): 
```

    * 然后根据提示创建管理员帐户

#启动服务
  * python manage.py runserver 0.0.0.0 8000
 
#创建数据
  * 打开页面：http://localhost:8000/admin
  * 使用刚才创建的管理员帐户进行登录
  * 在管理页面中创建Author和Blog

#浏览数据
  * 打开页面：http://localhost:8000/