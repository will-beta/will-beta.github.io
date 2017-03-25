---
title: 架构shadowsocks
categories: [net]
sitemap:
lastmod: 2016-7-4T20:03
---

主题
=====================================================

  架设ShadowSocks







买VPS
=====================================================

* virmach
* Bandwagonhost







配置系统
=====================================================

* 安装CentOS6.5
* 安装CentOS7，但要[更改内核](https://www.91yun.org/archives/795)






安装ServerSpeeder
=====================================================

*  将系统内核更换成匹配的版本
*  [安装ServerSpeeder](https://github.com/91yun/serverspeeder/)




搭shadowsocks服务
=====================================================

``` bash

wget https://bootstrap.pypa.io/get-pip.py
python get-pip.py
pip install shadowsocks

```







开启防火墙
=====================================================

CentOS6.5:/etc/sysconfig/iptables
```

-A INPUT -m state NEW -m tcp -p tcp --dport 8388 -j ACCEPT

```

CentOS7:
```

firewall-cmd --permanent --add-port=8388/tcp
firewall-cmd --reload

```


开机运行shadowsocks服务
=====================================================

CentOS6.5:/etc/rc.d/rc.local
``` bash

ssserver -k <password> -p <port> &

```

CentOS7:/lib/systemd/system/shadowsocks-server.service
```

[Unit]
Description = ShadowSocks Server
[Service]
Type = forking
ExecStart = /usr/bin/ssserver -k 123.com -p 8388 
TimeoutStartSec = 0

[Install]
WantedBy = multi-user.target

```

``` bash

systemctl daemon-reload
systemctl enable shadowsocks-server.service
systemctl start shadowsocks-server.service

```

