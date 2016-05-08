---
title: windows内置端口转发功能
categories: [工具]
tags: []
---


设置端口转发
===============================================

```dos
netsh interface ipv6 install
netsh interface portproxy add v4tov4 listenport=14941 connectaddress=172.20.53.2 connectport=3389
```


查询端口转发
===============================================

```dos
netsh interface portproxy show v4tov4
```


移除端口转发
===============================================

```dos
netsh interface portproxy delete v4tov4 listenport=14941
```