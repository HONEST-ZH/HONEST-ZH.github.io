---
last_modified_at: 2024-12-19
tags:
  - Github Pages
  - Jekyll
  - 个人主页
---
# 基于Jekyll和Github Page的个人主页搭建经验

## 一、方案选择

大体上讲，搭建个人网站有几种常见的方案技术路线。一种是分为前端和后端，使用web服务器处理web请求的**通用网页方案**；另一种是使用**静态网页生成器**将所有网页内容预先生成为静态文件（如 HTML、CSS、JavaScript），然后部署到**静态网页托管平台**上。

前者是web网页的一般方法，由前端和后端两部分组成。前端负责提供网页的结构、布局和交互等可视化的直接和用户接触的部分，后端负责处理请求的业务逻辑、数据存储和安全性等涉及服务器端的部分。

- 前端的核心是HTML、CSS、JavaScript三个部分，分别对应了网页的结构、布局和交互处理。除此以外，还有其他基于JavaScript的前端的框架（如 `React`、`Vue.js`、`Angular`）用来简化网页交互的编写。

- 后端的核心是Web服务器、后端框架和数据库。
  
  - Web服务器主要用于连接用户的网页请求和用于处理请求的服务器。具体来说：主要负责处理用户HTTP/HTTPS请求、对后端的服务器进行反向代理和负载均衡。
  - 后端框架则主要用于处理业务逻辑，负责对web服务器代理后的请求进行处理。常见的后端框架有：Python的`Django`,和`Flask`、JavaScript的`Node.js`、Java的`Spring`等。
  - 数据库则是十分明了的用于存储和管理数据。常见的数据库包括：`MySQL`、`Oracle`（关系型数据库）、`MongoDB`、`Redis`（非关系型数据库）。

后者是用于生成静态网页的方法，即使用静态网页生成器（如`Jekyll`、`Hugo`、`Hexo`等）预先生成好网页，将之存为不需要服务器端处理的文件（如`HTML`、`CSS`、`JavaScript`）。静态网页可以直接使用静态网页托管平台直接进行部署，如`Github Pages`、`Vercel`、`Netlify`等。

动态网页的灵活性更高，可以处理更多的交互需求，但是需要服务器端的支持，部署较为复杂，需要额外的服务器;静态网页的灵活性较差，但是部署简单，可以直接使用Github Page进行部署（还省去了配置公网IP和网页备案的麻烦）。对比两种方案，静态网页的方案适合个人主页低更新频率，交互性较弱的应用需求。

因此，我最后选择了静态网页的方案，使用**Jekyll的Minimal Mistakes主题**和**Github Pages静态网页托管平台**组合的方案搭建了自己的个人主页。

首先，我在运行了ubuntu的虚拟机上下载Jekyll和其所需要的环境。然后，根据自己的使用需要，按照MInimal Mistakes的文档说明修改了`_config.yml`配置文件，调整了个人主页的一些常用设置。最后使用Github Page的部署功能来部署整个网页。

> PS.除了使用模板以外，也可以根据自己需要的格式修改`_layout`文件夹中的模板。添加自己想要的内容。

## 二、Jekyll和Minimal Mistakes主题

[Jekyll](https://jekyllrb.com/docs)是一个基于 Ruby 语言开发的开源静态网页生成器。其核心原理是将包含文本内容（如 Markdown 文件）、布局模板（如 HTML 模板）和配置文件（如`_config.yml`）的源文件目录，通过一系列的转换和处理，生成最终的静态网站（HTML、CSS、JavaScript 等文件的集合）。[Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/docs)是一个Jekyll的主题，提供了丰富的功能和灵活的配置选项，可以方便地设置美观的网页的布局和样式。

### 1.部署Jekyll环境

这一步其实来说并不是必要的，只是在本地拥有可以使用Jekyll构建网页的环境对于修改个人主页的一些功能来说会更加的方便。~~你也不想每次对网页布局之类的细微修改的尝试都要push到github上然后重新等待他慢慢的生成网页吧，这实在是太麻烦了~~。

首先你需要确保的是你拥有一个Linux的虚拟机环境，不管是VMware或者WSL都可以。我使用的是WSL，可以直接在VScode中使用。~~非常的方便，用过都说豪用~~。具体怎么弄我这里就不赘述了，网上有很多教程。

1. 安装 Ruby：
   
   Jekyll 是基于 Ruby 构建的，所以首先需要安装 Ruby。通过以下命令安装 Ruby：
   
   ```bash
   sudo apt - get update
   
   sudo apt - get install ruby - full
   ```

2. 安装 Jekyll 和 Bundler（RubyGems 包管理器）：
   
   在安装好 Ruby 后，可以使用 RubyGems 来安装 Jekyll 和 Bundler。在终端（命令提示符或 PowerShell）中输入以下命令：
   
   ```bash
   gem install jekyll bundler
   ```

3. 创建项目
   
   a. 新创建项目
   
   ```bash
   jekyll new .
   ```
   
   b. 从原有的模板复制一个项目
   
   最简单的方法就是直接使用git clone直接复制这个项目的文件下来。
   
   ```bash
    git clone https://github.com/HONEST-ZH/HONEST-ZH.github.io.git
   ```

4. 修改网页
   
   修改`_config.yml`或者`_layout`里的布局文件来达到你满意的网页效果。

5. 本地运行尝试
   
   执行以下命令来运行本地运行jekyll网页的服务器，工作的ip地址是`127.0.0.1:4000`
   
   ```bash
   bundle install
   bundle exec jekyll serve
   ```

6. 重复4-5直到网页满足你的需求。

## 三、设置Github Page

对于一般的静态网页而言，我们只需要将jekyll项目提交到名为`username.github.io`的仓库中（名字需要和github的账户名字一致，否则会无效），然后再选择`Settings-Pages-Deploy From a Branch`，`branch-main`。完成设置以后，就可以实现静态网页的部署了，Github会在Action中自动新建一个名为`pages-build-deployment`的工作流，每次选定的分支（main）上发生推送时会自动地构建和部署网页。

![](/assets/images/blog/2024-12-18-16-33-44-image.png)

但是这里因为我使用了Minimal Mistakes模板的原因，网页是没有办法使用这种方法的直接生成的。网页在编译时会报错，找不到模板的Gem包。

![](/assets/images/blog/2024-12-18-16-44-39-image.png)

![](/assets/images/blog/2024-12-18-16-44-56-image.png)

这是因为默认的`pages-build-deployment`工作流没有去下载所需要的依赖，而缺少了Jekyll模板。解决这个问题的方法也很简单，就是自己创建一个工作流保证每一次都能把所需要的依赖装好。

### 1. 创建gh-pages.yml工作流文件

在项目的根目录下创建.github/workflows文件夹然后添加gh-pages.yml文件。

```bash
mkdir -p .github/workflows
touch .github/workflows/gh-pages.yml
```

### 2. 编写gh-pages.yml

在gh-pages.yml文件中写入：

```yaml
name: GitHub Pages
on:
  push:
    branches:
      - main  # 监听的分支
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Set up Ruby
      uses: actions/setup-ruby@v1
      with:
        ruby-version: '3.2'  # 确保使用正确的 Ruby 版本
    - name: Install dependencies
      run: bundle install
    - name: Build the site
      run: bundle exec jekyll build
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./_site
```

这个工作流在每次检测到`main`分支上有推送时：下载所需要的Gem包依赖，构建静态网页，将静态网页的文件推送到一个专门用于存储静态网页的分支`gh-pages`。

### 3. Github pages从gh-pages分支部署

`gh-pages`分支被更新后，还没有完成网页的部署。此时需要把github page关注的分支换为`gh-pages`，根据每次推送到`gh-pages`上的文件部署静态网页。工作流的结果显示如下图所示，此时就可以在`username.github.io`中访问个人主页的页面了。

![](/assets/images/blog/2024-12-18-17-01-56-image.png)

## 四、网页的使用

### 1.基本FrontMatter

```
---

title: "文章标题"

date: 2023-10-20

last_modified_at: 2023-10-21    # 最后修改时间

categories:

  - 技术

  - ZMQ

tags:

  - 消息队列

  - 网络编程

toc: true                       # 显示目录

toc_sticky: true               # 固定目录

toc_label: "目录"              # 目录标题

toc_icon: "cog"               # 目录图标

#图片

header:

  image: /assets/images/header.jpg           # 头部大图

  teaser: /assets/images/teaser-image.jpg    # 预览图

  overlay_image: /assets/images/banner.jpg   # 覆盖图

  overlay_color: "#333"                      # 覆盖颜色

  caption: "图片来源: [**网站**](链接)"      # 图片说明



excerpt: "这是文章摘要，将显示在文章列表中"    # 文章摘要

# 作者相关

author: Your Name

author_profile: true    # 显示作者信息

# 布局相关

layout: single

classes: wide          # 宽屏显示

# 评论相关

comments: true        # 启用评论

share: true           # 显示分享按钮

# 相关文章

related: true         # 显示相关文章

# 阅读时间

read_time: true       # 显示预计阅读时间

# 导航

sidebar:

  nav: "main"        # 侧边栏导航

# SEO相关

description: "这是一段用于SEO的描述"

keywords: "关键词1, 关键词2"

---
```

### 2.AI工具生成顶部配图

使用ChatGPT生成提示词，使用DALLE-3生成图片

![](/assets/images/blog_header/ZMQ.jpg)

### 3.Markdown文档编写

使用Marktext以方便的编写MarkDown笔记，可以直接粘贴图片。图片可能被以网络链接的方式引用，也可能保存在本地的`C:\Users\HONEST\AppData\Roaming\marktext\images\`路径下，需要把图片的路径改成`/assets/images/blog_header`或者`/assets/images/blog`
> linux路径使用/，windows路径使用\