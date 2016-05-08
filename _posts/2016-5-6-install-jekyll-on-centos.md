---
title: install jekyll on centos
categories: [维护]
tags: [jekyll]
---

安装ruby与gem
=================================================

```bash

sudo yum install -y ruby rubygems

```





安装编译所需
=================================================

```bash

sudo yum install -y gcc
sudo yum install -y ruby-devel

```







安装jekyll
=================================================

```bash

sudo gem install jekyll
sudo gem install jekyll-paginate

```







建站
=================================================

```bash

jekyll new my-awesome-site
cd my-awesome-site
jekyll serve -H 0.0.0.0

```