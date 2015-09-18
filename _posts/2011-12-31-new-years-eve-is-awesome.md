---
title: 使用HTTP探测web服务稳定性
categories: [脚本]
tags: [powershell, python]
sitemap:
   lastmod: 2015-5-14T14:58:30-05:00
---


# 需求
将响应码非200、非304、响应时间超过1秒的连接记录至文本


# 实现
## PowerShell脚本实现：http.ps1
```powershell
$fileName="www.baidu.com"
$destAddress="http://www.baidu.com"

while(1)
{
    $startTime = Get-Date
    $r = [System.Net.WebRequest]::Create($destAddress)
    $response = $r.GetResponse() -as [System.Net.HttpWebResponse]
    $stopTime = Get-Date
    $response.Close()

    $totalSeconds = ($stopTime - $startTime).TotalSeconds

    $str="{0},{1},{2}" -f $startTime,$totalSeconds,$response.StatusCode
    $str
    if((($response.StatusCode -ne 200) -and ($response.StatusCode -ne 304)) -or ($totalSeconds -gt 1))
    {
        $str>>("http {0}.log" -f $fileName)
    }

    Start-Sleep -s 1
}
```


## python脚本实现：http.py
```python
import time
import datetime
import http.client


fileName = "www.baidu.com"
host = "www.baidu.com:80"
path = "/"

file = open("http {0}.log".format(fileName),'a')
while True:
    startTime = datetime.datetime.now()

    conn = http.client.HTTPConnection(host)
    conn.request('GET',path)
    response = conn.getresponse()
    conn.close()

    stopTime = datetime.datetime.now()
    totalSeconds = (stopTime - startTime).total_seconds()

    str = "{0},{1},{2}".format(startTime,totalSeconds,response.code)
    print(str)
    if (response.code != 200 and response.code != 304) or totalSeconds > 1:
        file.write(str + '\n')
        file.flush()

    time.sleep(1)
```

:blush:
