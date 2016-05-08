---
title: 在.NET Windows Form Application中统一处理未处理的异常
categories: [开发]
tags: [exception]
sitemap:
    lastmod: 2014-9-5T12:49:30-05:00
---


在Windows Form Application中，异常若最终得不到处理，则会触发AppDomain.CurrentDomain.UnhandledException事件进行以进行最终的异常记录（使用此事件无法避免应用程序的终结）。在此事件被触发之前，分以下情况可决定是否将异常继续传播。

# 分类

## UI线程

对每个UI线程独立设置Application.ThreadException事件处理器（.NET源代码中为Application.ThreadContext标注了ThreadStatic特性，Application.ThreadException事件是关联到Application.ThreadContext.threadExceptionHandler来实现的）
使用Application.SetUnhandledExceptionMode(UnhandledExceptionMode mode, bool threadScope)方法预先设置处理模式:

### mode值

* 若为UnhandledExceptionMode.ThrowException，则表示继续传播。
* 若为UnhandledExceptionMode.CatchException，则使用Application.ThreadException事件进行捕获处理，若在此事件中再抛出异常则会继续传播。
* 若为Automatic，则可以使用app.config进行设置

```xml

<configuration>
<system.windows.forms jitDebugging="true"/>
</configuration>

```

### threadScope值

* 若为true，则表示设置整个应用程序的UI线程异常处理模式。
* 若为false，则表示设置当前UI线程的异常处理模式。

 

## Task

可使用TaskScheduler.UnobservedTaskException事件进行捕获处理设置Observed值：

若为False，则表示继续传播
若为True，则不会继续传播。
不过注意此事件要在垃圾收集完毕后才会触发

 

## Thread

无

 


# 最佳实践


* 捕获处理引发应用程序崩溃的最终异常，通过设置AppDomain.CurrentDomain.UnhandledException处理器。
* 依照实际情况选择是否掩藏UI线程和任务工厂抛出的异常，分别通过设置Application.ThreadException事件处理器和TaskScheduler.UnobservedTaskException事件处理器。