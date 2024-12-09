# Linux的包管理工具Apt

包管理工具apt

apt是linux上进行包管理的一种常用工具，调用dpkg管理已安装的包还能管理未安装的包（一定要确定包是否已经安装！）

`apt install`：安装软件包，从sourcelist中定义的源获取。

`apt list`

<u>参数</u>：--installed `apt list --installed|grep -i [pakegename]`

`apt search`：寻找的是可以从所有软件源上下载到的包，并不是本地的包/已经安装的包。

### apt-get

### dpkg

dpkg 是Debian发行版中的包管理工具，只能用于已安装的包的管理

<u>参数</u>：-L ： `dpkg -L [pakegename]`查找pakegename的安装包路径
