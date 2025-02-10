---
#last_modified_at: 2025-1-2
tags:
    - git
    - jekyll
    - 个人主页
---

# 问题描述
最近在阿里云上为我的个人网页购买了一个域名`honest-zh.me`,我将`www.honest-zh.me`的链接重定向到了我之前在github page上托管的[个人主页]({{ site.baseurl }}/笔记/基于Jekyll和Github-Page的个人主页搭建经验/)。并在github的设置中的page选项的Custom domain里设置为了我的域名。很顺利的，域名可以跳转到我在github page上托管的个人网页网址`honest-zh.github.io`上。但当我更新我的博客，ghpage分支重新部署文件后，域名的重定向就失效了！
# 解决方法
github page使用CNAME的文件管理自定义域名，观察到检测ghpage分支更新并进行部署的Github action工作流里面没有CNAME的设置项，添加`cname: www.honest-zh.me`
添加后的文件大致为：
```yaml
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./_site
        cname: www.honest-zh.me  # 自定义域名www.honest-zh.me
```