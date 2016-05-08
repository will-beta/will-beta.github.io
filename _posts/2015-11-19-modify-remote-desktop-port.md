---
title: 修改远程桌面端口脚本
categories: [工具]
tags: [python]
---

```python
import winreg

def modifyNumber(key,name,value):
	pair=winreg.QueryValueEx(key,name)
	winreg.SetValueEx(key,name,0,pair[1],value)

def modifyString(key,name,value,prevValue):
	pair=winreg.QueryValueEx(key,name)
	winreg.SetValueEx(key,name,0,pair[1],pair[0].replace(str(prevValue),str(value)))

k1=winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE,r'SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp',0,winreg.KEY_ALL_ACCESS)
k2=winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE,r'SYSTEM\CurrentControlSet\Control\Terminal Server\Wds\rdpwd\Tds\tcp',0,winreg.KEY_ALL_ACCESS)
k3=winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE,r'SYSTEM\CurrentControlSet\Services\SharedAccess\Parameters\FirewallPolicy\FirewallRules',0,winreg.KEY_ALL_ACCESS)
k4=winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE,r'SYSTEM\CurrentControlSet\Services\SharedAccess\Defaults\FirewallPolicy\FirewallRules',0,winreg.KEY_ALL_ACCESS)

prevPort=winreg.QueryValueEx(k1,'PortNumber')[0]
print('读出原端口：'+str(prevPort))
destPort=int(input('输入新端口：'))

#修改远程桌面软件配置
modifyNumber(k1,'PortNumber',destPort)
modifyNumber(k2,'PortNumber',destPort)
#修改防火墙配置
modifyString(k3,'RemoteDesktop-UserMode-In-TCP',destPort,prevPort)
modifyString(k4,'RemoteDesktop-UserMode-In-TCP',destPort,prevPort)

print('已经修改为:'+str(winreg.QueryValueEx(k1,'PortNumber')[0]))

winreg.CloseKey(k1)
winreg.CloseKey(k2)
winreg.CloseKey(k3)
winreg.CloseKey(k4)
```