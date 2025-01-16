
systemctl是一个在基于 systemd 的 Linux 系统中用于控制 systemd 系统和服务管理器的命令行工具。systemd 是一个系统和服务管理器，它提供了系统启动、服务管理、日志记录等一系列功能。systemctl命令是与 systemd 进行交互的主要方式，它非常强大且功能丰富。
# 1. 管理服务（Unit）
## 1.1 启动服务：
```bash
sudo systemctl start [服务名称]
```
例如，启动httpd服务（假设已安装）：
```
bash
sudo systemctl start httpd
```
## 1.2 停止服务：
```bash
sudo systemctl stop [服务名称]
```
例如，停止httpd服务：
```bash
sudo systemctl stop httpd
```
## 1.3 重启服务：
```bash
sudo systemctl restart [服务名称]
```
例如，重启httpd服务，常用于在修改服务配置文件后使其生效：
```bash
sudo systemctl restart httpd
```
## 1.4 重新加载服务配置：
```bash
sudo systemctl reload [服务名称]
```
此命令在不重启服务的情况下重新加载服务的配置文件，适用于某些服务可以在运行时重新加载配置而无需完全重启的情况，如nginx：
```bash
sudo systemctl reload nginx
```
## 1.5 查看服务状态：
```bash
sudo systemctl status [服务名称]
```
该命令显示服务当前的运行状态，包括是否正在运行、启动时间、最近一次启动或停止的结果等信息。例如查看vsftpd服务状态：
```bash
sudo systemctl status vsftpd
```
输出类似如下内容：
```
plaintext
● vsftpd.service - vsftpd FTP server
   Loaded: loaded (/lib/systemd/system/vsftpd.service; enabled; vendor preset: enabled)
   Active: active (running) since Mon 2024 - 01 - 01 10:00:00 UTC; 1h ago
  Process: 1234 ExecStart=/usr/sbin/vsftpd /etc/vsftpd.conf (code = exited, status = 0/SUCCESS)
 Main PID: 1234 (vsftpd)
    Tasks: 1 (limit: 4915)
   Memory: 1.2M
   CGroup: /system.slice/vsftpd.service
           └─1234 /usr/sbin/vsftpd /etc/vsftpd.conf
```
其中 “Active: active (running)” 表明服务正在运行。
# 2. 服务开机自启管理
## 2.1 设置服务开机自启：
```bash
sudo systemctl enable [服务名称]
```
例如，设置httpd服务开机自启：
```bash
sudo systemctl enable httpd
```
执行后会创建或修改符号链接，将服务单元文件链接到系统启动相关的目录。
## 2.2 取消服务开机自启：
```bash
sudo systemctl disable [服务名称]
```
例如，取消httpd服务开机自启：
```bash
sudo systemctl disable httpd
```
此命令会删除相关的符号链接，使服务在系统启动时不再自动启动。
## 2.3 查看服务是否开机自启：
```bash
sudo systemctl is - enabled [服务名称]
```
例如，查看httpd服务是否开机自启，若输出为enabled则表示开机自启，若为disabled则表示未设置开机自启：
```bash
sudo systemctl is - enabled httpd
```
# 3. 系统管理相关
## 3.1 启动进入指定运行级别（target）：
运行级别在 systemd 中被称为 target。例如，要启动到图形化界面（通常是graphical.target）：
```bash
sudo systemctl start graphical.target
```
若要启动到多用户文本界面（multi - user.target）：
```bash
sudo systemctl start multi - user.target
```
## 3.2 查看当前运行级别（target）：
```bash
systemctl get - default
```
输出结果会显示当前默认的启动目标，例如graphical.target或multi - user.target。
## 3.3 设置默认运行级别（target）：
例如，将默认运行级别设置为多用户文本界面：
```bash
sudo systemctl set - default multi - user.target
```
若要恢复为图形化界面为默认：
```bash
sudo systemctl set - default graphical.target
```
## 3.4 重启系统：
```bash
sudo systemctl reboot
```
## 3.5 关闭系统：
```bash
sudo systemctl poweroff
```
## 3.6 挂起系统（进入睡眠状态）：
```bash
sudo systemctl suspend
```
## 3.7 使系统进入休眠状态：
```bash
sudo systemctl hibernate
```
# 4. 管理服务依赖关系
## 4.1 查看服务依赖关系：
```bash
sudo systemctl list - dependencies [服务名称]
```
例如，查看httpd服务的依赖关系，会显示该服务所依赖的其他服务以及依赖它的服务：
```bash
sudo systemctl list - dependencies httpd
```