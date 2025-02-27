---
tags:
  - Linux
  - 操作系统内核
  - .config
  - Makfile
---

## 自动项目编译工具make

make是一种用于自动编译项目的构建工具，通过执行makefile中预先写好的命令保证按照依赖关系、避免重复编译。Make在实际的工作中依然是使用gnu gcc的工具进行编译的，只是提前指定了gcc的命令。

### Makefile的编写：

#### 1.基础语法：

```
目标：依赖
命令
```

为了方便缩写和编译，可以使用定义的变量进行缩写，使用时加上()即可解析为命令进行。除此以外，存在一些简略的写法代替目标和依赖，^: 依赖、$@: 目标文件。

#### 2.伪目标：

.PHONY:用于标识一个不对应实际文件的伪目标，这些伪目标往往用来控制makefile

例如clean。

#### 3.例子：

```
CC=gcc

OBJS=hello.c

CFLAGS=-c

RM=rm -f

hello.o:$(OBJS)

(CC) (CFLAGS) ^ -o @

.PHONY:clean

clean:

$(RM) *.o
```

#### 4.Makefile的remake操作：

有如下的makefile脚本，先生成target对象再重编译remake整个makefile。

```
-include   目标
    目标: 依赖             
    正则表达式
```

## .config配置文件

## Linux内核图形编译工具.Kconfig

[Kconfig详解 - 大海中的一粒沙 - 博客园 (cnblogs.com)](https://www.cnblogs.com/fah936861121/p/7229522.html)

[menuconfig 和 Kconfig 介绍-阿里云开发者社区 (aliyun.com)](https://developer.aliyun.com/article/1207026)

[Linux从模块化机制学到Kconfig，Makefile构建配置原理_linux kconfig makefile-CSDN博客](https://blog.csdn.net/qq_39679797/article/details/123661893)

为了正确处理Linux操作系统繁杂的项目文件和复杂的依赖，简单的通过源码完成内核的配置和编译。 **Kconfig是一种用于支持Linux内核图形化配置（menuconfig）的脚本语言**。通过Kconfigs实现图形化界面的选项设置，便于用户交互。但Linux内核实际使用是通过顶层makefile根据menucofig得到的.conf文件逐级建立的。实质上是在**操作系统配置中使用的、Makefile的一种图形化配置方法**。

**配置内核有几种方式**：

`make menuconfig`:图像化配置。

先生成可执行文件mconf.o生成图像界面，选择结束后生成.config文件。

`make XXX_defconfig`：板卡适配的默认配置。

先生成可执行文件conf.o，直接把XXX_defconfig保存成.config文件（本质是一个东西）。编译时主Makefile会根据.config中的变量决定编译哪些部分。

> *Linux内核源码的这棵树，通过Makefile文件来选择各个目录下的对应的文件是否被编译，.config文件就像是控制台，控制着Makefile文件去编译指定的程序代码文件（主要是C和汇编）。而这一切控制关系是由Kconfig文件建立起来的。
