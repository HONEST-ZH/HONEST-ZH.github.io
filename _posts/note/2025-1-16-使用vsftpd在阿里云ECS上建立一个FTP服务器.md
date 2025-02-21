---
tags:
  - ECS
  - FTP
  - vsftpd
---

首先要做的就是在服务器上运行一个FTP server。现在已经十分的成熟了，可以直接使用apt工具下载一些常用的ftp工具软件包，例如`vsftpd`和`ProFTPD`等。这里我使用的是`vsftpd`。

```bash
apt update
apt install vsftpd
systemctl start vsftpd
```
>  “vsftpd” 中，最后的 “d” 代表 “daemon”，即守护进程。守护进程是一种在后台持续运行的进程，它独立于控制终端，通常在系统启动时自动启动，并一直运行直至系统关闭，用于执行特定的系统任务或提供某种服务。
> systemctl是一个在基于 systemd 的 Linux 系统中用于控制 systemd 系统和服务管理器的命令行工具。systemd 是一个系统和服务管理器，它提供了系统启动、服务管理、日志记录等一系列功能。systemctl命令是与systemd 进行交互的主要方式，具体参见[systemctl]({% link _posts/note/2025-1-16-systemd和systemctl.md %})。

接下来要做的是对vsftpd的一些配置，最主要的是添加用户和用户组，设置用户的权限和工作目录。

```bash
adduser honest
```

完成了配置以后，还需要再阿里云的控制台里配置服务器的安全组，让ftp的端口开放出来。

登录阿里云控制台，找到对应的 ECS 实例，进入安全组设置页面。添加安全组规则，允许 FTP 服务相关端口的访问。如果是主动模式，需开放 21 端口（控制连接）；如果使用被动模式，除了 21 端口，还需开放配置的被动模式端口范围（例如 40000 - 40100）。方便起见，这里我把入方向和出方向都配置成了所有端口。

> 很有可能不安全，小孩子不要学

![](/assets/images/blog/2025-01-16%20103849.png)

在想要连接FTP server的设备上运行FileZilla client这样的软件。建立连接时有如下提示，也就是没有做加密。

![](/assets/images/blog/2025-01-16%20105225.png)

**FTPS**
一种方法是使用FTPS（FTP over SSL/TLS）的协议，使用SSl/tsl来实现安全传输。这需要依赖`openssl`这个软件包，一般的Linux发行版都会下载这个包，所以仅需要我们配置ssl的公钥然后让Vsftpd 支持 FTPS。
打开vsftpd.conf文件
```bash
vi /etc/vsftpd.conf
```
添加或修改以下配置参数：
```plain
ssl_enable=YES
write_enable=YES
```
重启vsftpd服务
```bash
systemctl restart vsftpd
```
**SFTP**
另一种方法是使用SFTP（SSH FTP），SFTP 是基于 SSH 协议的文件传输协议，使用 SSH 的安全通道来传输文件。SFTP将文件传输作为 SSH 协议的子系统，所以只需要支持ssh的设备就可以使用这种方式传输文件。因为使用 SSH 协议，所以继承了 SSH 的安全性，包括加密和用户认证。
> 更简单的情况下，我们可以直接使用SCP来复制文件。