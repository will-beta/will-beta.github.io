---
title: 用ICMP探测web服务稳定性
categories: [小工具]
tags: [powershell, python]
sitemap:
   lastmod: 2015-5-14T14:58:30-05:00
---


#需求

将连接超时或大于10ms的连接记录至文本

#脚本实现

##PowerShell脚本实现：icmp.ps1

```powershell

$destAddress="www.baidu.com"

while(1)
{
    $startTime=Get-Date
    $result=Get-WmiObject -Class Win32_PingStatus -Filter ("Address='{0}'" -f $destAddress) -ComputerName .
    $str="{0},{1}" -f $startTime,$result.ResponseTime

    $str
    if(($result.ResponseTime -lt 0) -or ($result.ResponseTime -gt 10))
    {            
        $str>>("ping {0}.log" -f $destAddress)
    }
    Start-Sleep -s 1
}

```




## python脚本实现：icmp.py

```python

import subprocess
import datetime
import re

destAddress = "google.com"
file = open("icmp {0}.log".format(destAddress),'a')
process = subprocess.Popen(['ping',destAddress,'-t'], stdout=subprocess.PIPE)

while True:
    startTime = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    str = process.stdout.readline().decode('gb2312')
    print(startTime + ' : ' + str)

    digits = re.findall(r'(\d+)ms',str)
    if len(digits) > 0 and int(digits[0]) < 1000:
        pass
    else:
        file.write(startTime + ' : ' + str + '\n')
        file.flush()
        
```