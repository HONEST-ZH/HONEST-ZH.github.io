---
#last_modified_at: 2025-1-2、
tags:
    - shell
    - git
    - vim
---

# 问题描述

在嵌入式开发的过程当中，经常需要使用bash脚本进行批量的操作。编写bash脚本时，有时会出现报错，未找到xxx。使用Vi打开bash脚本以后发现在每行命令的行尾出现了`^M`这样的符号，导致指令未能被正确的识别和执行。

导致这种问题的原因是Windows和Linux系统下的换行符的不同。这种不同来源于传统电控打字机的兼容性带来的历史遗留问题。

> `\r`（Carriage Return，ASCII 码值为 13 ）：意思是 “回车”，起源于老式的打字机机械结构。打字机打印头在一行末尾打完字后，需要将整个打印托架移回本行开头的位置，为下一行的打字做准备，这个动作就叫 “回车” 。在电传打字机、早期计算机终端设备等场景下，当接收到\r字符时，设备的光标或者打印头就会回到本行起始坐标处，准备后续输入或者输出。

> `\n`（Line Feed，ASCII 码值为 10）：意思是 “换行”，当电传打字机等设备接收到该字符时，会将纸张向上滚动一行，让打印位置垂直下移一行，这样后续内容就会打印到新的一行。Windows使用的换行符是`\r\n`,由两部分组成。

windows为了更好的兼容性同时使用了`\r\n`一起作为换行符，称为CRLF换行符。

Linux（等类unix系统）则秉持着最小化的哲学仅使用`\n`，称为LF换行符。

 Windows 风格换行符（CRLF，\r\n ）中的 “回车符（Carriage Return，ASCII 码值 13，对应 Ctrl + M，在文本显示中就呈现为^M ）” 。

# 解决方法
1. 最简单直接的做法就是在IDE中直接设置好文件的换行符格式。例如，在vscode的右下角蓝色底部边框中可以修改文件的编码格式、换行符和缩进方式。

2. 在linux系统下,一种方法是使用对应的工具包`unix2dos`或`dos2unix`,但是需要下载。

3. 另一种方法是使用tr命令和管道相结合的方式修改文件中的换行符。
    RF --> CRLF
    ```
    cat input.txt | tr '\n' '\t' | tr '\t' '\r\n' > output.txt
    ```
    CRLF --> LF
    ```
    cat input.txt | tr '\r\n' '\t' | tr '\t' '\n' > output.txt
    ```
    
4. 还有一种方法是使用vim的`set fileformat`命令进行设置
    RF --> CRLF
    ```
    :set fileformat=dos
    :wq
    ```
    CRLF --> LF
    ```
    :set fileformat=unix
    :wq
    ```
