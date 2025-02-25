---
title: 在服务器上使用Jekyll和Nginx实现SSL和用户登录
tags:
- Jekyll
- 个人主页
- ECS
---

## 需求描述
在jekyll上编译了一个[静态网页]({% link _posts/note/2024-12-12-基于Jekyll和Github Page的个人主页搭建经验.md %})用来作为我的个人网页。但是每次编辑网页存在着比较大的问题——我需要先在本地编写MarkDown文本然后push到github上，等待他的自动构建。

于是我在jekyll上使用了[jekyll-admin]({% link _posts/snag/2025-2-22-jekyll-admin使用的包依赖问题.md %})来进行后台管理我的个人主页的博客，每次更改博客时自动进行增量式的静态页面构建。但是此时我还是遇到了一些问题，使得我需要重构我的个人网页结构。  

第一点是**拓展性问题**。

github page托管的终究只是一个简单的页面。想要满足不同的需求，解决各种的问题，为其添加其他的功能，就需要在具有更高自主权的linux主机上运行服务才方便。

第二点是**Jekyll的跳转问题**。

jekyll默认的ip和端口是127.0.0.1:4000。运行在ECS云服务器上时，你需要让服务器监听所有的ip的接入，需要配置为0.0.0.0:4000.但是此时jekyll-admin页面的跳转存在着问题，预览界面时他会尝试在0.0.0.0上进行跳转。

第三点是**安全性问题**。

**登陆问题**jekyll-admin插件提供的后台管理界面 `/admin`是任何人都可以登录进行修改的，这非常的不安全。我需要一个用户登录管理的功能。

**SSL/TLS加密问题**。jekyll编译和提供的服务是没有进行SSL加密的，是以HTTP的方式进行的访问，应该对其添加加密使其以HTTPS方式访问。

## 解决方案分析
正好我有一个阿里云的ECS**云服务器**（之前用来搭建[FTP server]({% link _posts/note/2025-1-16-使用vsftpd在阿里云ECS上建立一个FTP服务器.md %})），可以比较容易的把Jekyll的服务器转移到linux的云服务器上运行。这样第一个问题就解决了。

对于第二和第三个问题，有一个成熟的方案可以同时解决这两个问题——**Web代理服务器**。

Web服务器为服务器提供反向的代理，可以把向云服务器的公网的某个IP的端口上访问的链接转移到其他的IP的端口，当然也包括本地的IP。Web服务器也可以和其他的方法相结合提供网页的SSL加密和用户登录管理。

这里使用`Nginx`作为Web服务器，使用`certbot`从Let's Encrypt这一机构获得免费的SSL/TLS证书，使用`apache2-utils`中的`htpasswd`工具进行用户的加密。

## 实现

### 一、下载所需的工具包

```shell
sudo apt update
sudo apt upgrade

sudo apt install certbot python3-certbot-nginx
sudo apt install apache2-utils
```
### 二、获得SSL/TLS证书

#### 1.初步设置Nginx
确保 Nginx 已经配置了正确的服务器块，并且可以通过 HTTP（端口 80）访问你的域名。

打开Nignx的设置文件

`sudo vi /etc/nginx/sites-available/default`

清空，重新写入以下内容

```
server {
    server_name www.honest-zh.me;  # 确保配置了正确的域名

    root /home/honest/honestblog/_site;  # 根据实际路径调整

    index index.html index.htm;

    # 可选：配置特定路径
    location / {
        try_files $uri $uri/ =404;
    }
```

运行`sudo nginx -t`,保证Nginx设置的正确。

#### 2.使用certbot

想要使用certbot为域名生成SSL证书需要确保以下的两个前提。

**域名已经指向你的服务器**：确保 honest-zh.me 域名的 DNS 记录已经正确指向你的服务器的公共 IP 地址。如果你还没有配置 DNS，请在域名注册商的管理面板中设置 A 记录，指向你的服务器 IP 地址。

**Nginx配置正常**：确保你的服务器上已经安装并配置了 Nginx。

那之后执行命令`sudo certbot --nginx -d www.honest-zh.me`获得SSL证书，保存的证书在路径`/etc/letsencrypt/live/www.honest-zh.me/`下。这个命令会执行以下的操作：

1. 获取证书：它会向 Let's Encrypt 服务器请求一个 SSL 证书。
2. 修改 Nginx 配置：它会自动为你的域名配置 SSL，更新 Nginx 配置文件，添加 SSL 相关的配置（例如 ssl_certificate 和 ssl_certificate_key）。
3. 重载 Nginx：它会重新加载 Nginx，使得新证书和配置立即生效。

certbot从Let's Encrypt获取的证书有效期为 90 天，因此需要定期续期。为了确保证书能够自动续期，可以设置一个 cron 任务，每天检查并续期证书。

`sudo crontab -e`

```
0 */12 * * * certbot renew --quiet && systemctl reload nginx
```
### 三、设置用户名密码

执行命令

`sudo htpasswd -c /etc/nginx/.htpasswd honest`

用户文件将储存在.htpasswd中

### 四、设置Ngnix（HTTP重定向、服务器反向代理、用户验证）

打开Nignx的设置文件

`sudo vi /etc/nginx/sites-available/default`

清空，重新写入以下内容

```
server {
    listen 80;
    server_name www.honest-zh.me;  # 替换为你的域名
    # HTTP -> HTTPS 重定向
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name www.honest-zh.me;  # 替换为你的域名
    # SSL 配置（Certbot 自动配置的证书路径）
    ssl_certificate /etc/letsencrypt/live/www.honest-zh.me/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.honest-zh.me/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    # 反向代理 Jekyll 服务
    location / {
        proxy_pass http://127.0.0.1:4000;  # 将请求转发到 Jekyll 本地服务
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    location /admin {
    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/.htpasswd;

    proxy_pass http://127.0.0.1:4000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

运行`sudo nginx -t`,保证Nginx设置的正确。

> 启动`sudo systemctl start nginx`
> 
> 停止 
> `sudo systemctl stop nginx`
> 
> 重启 
> `sudo systemctl restart nginx`
> 
> 重新加载
> `sudo systemctl reload nginx`
> 
> 禁用启动时自动启动
> `sudo systemctl disable nginx`
> 
> 启用启动时自动启动
> `sudo systemctl enable nginx`
> 
> 查看服务状态
> `sudo systemctl status nginx`