---
last_modified_at: 2024-12-16
header:
  overlay_image: /assets/images/blog_header/
tags:
  - Jekyll
  - Github Page
  - 个人主页
---
# 基于Jekyll和Github Page的个人主页搭建经验

## 一、方案选择

大体上讲，搭建个人网站有几种常见的方案技术路线。一种是分为前端和后端，使用web服务器处理web请求的**通用网页方案**；另一种是使用**静态网页生成器**将所有网页内容预先生成为静态文件（如 HTML、CSS、JavaScript），然后部署到**静态网页托管平台**上。

前者是web网页的一般方法，由前端和后端两部分组成。前端负责提供网页的结构、布局和交互等可视化的直接和用户接触的部分，后端负责处理请求的业务逻辑、数据存储和安全性等涉及服务器端的部分。

- 前端的核心是HTML、CSS、JavaScript三个部分，分别对应了网页的结构、布局和交互处理。除此以外，还有其他基于JavaScript的前端的框架（如 `React`、`Vue.js`、`Angular`）用来简化网页交互的编写。

- 后端的核心是Web服务器、后端框架和数据库。
  - Web服务器主要用于连接用户的网页请求和用于处理请求的服务器。具体来说：主要负责处理用户HTTP/HTTPS请求、对后端的服务器进行反向代理和负载均衡。
  -  后端框架则主要用于处理业务逻辑，负责对web服务器代理后的请求进行处理。常见的后端框架有：Python的`Django`,和`Flask`、JavaScript的`Node.js`、Java的`Spring`等。
  - 数据库则是十分明了的用于存储和管理数据。常见的数据库包括：`MySQL`、`Oracle`（关系型数据库）、`MongoDB`、`Redis`（非关系型数据库）。

后者是用于生成静态网页的方法，即使用静态网页生成器（如`Jekyll`、`Hugo`、`Hexo`等）预先生成好网页，将之存为不需要服务器端处理的文件（如`HTML`、`CSS`、`JavaScript`）。静态网页可以直接使用静态网页托管平台直接进行部署，如`Github Pages`、`Vercel`、`Netlify`等。

动态网页的灵活性更高，可以处理更多的交互需求，但是需要服务器端的支持，部署较为复杂，需要额外的服务器;静态网页的灵活性较差，但是部署简单，可以直接使用Github Page进行部署（还省去了配置公网IP和网页备案的麻烦）。对比两种方案，静态网页的方案适合个人主页低更新频率，交互性较弱的应用需求。

因此，我最后选择了静态网页的方案，使用Jekyll的Minimal Mistakes主题和Github Page搭建个人主页。

## 二、Jekyll和Minimal Mistakes主题

Jekyll是一个简单的、开源的静态网页生成器，它使用Markdown格式编写网页内容，然后生成静态网页。Minimal Mistakes是一个Jekyll的主题，它提供了丰富的功能和灵活的配置选项，可以方便地进行网页的布局和样式设置。


## 三、设置Github Page

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

![AI生成配图示例图片](/assets/images/blog_header/ZMQ.jpg)
