---
tags:
    - Jekyll
---

# 问题描述
我希望找到一个在线编辑jekyll的文档的方式，这样我们可以使用不同的设备在网页进行编辑。好消息是jekyll有一个专门用于实现的插件叫做jekyll-admin,可以比较方便的进行管理。

正常来说，在Gemfile和_config里添加jekyll-admin，然后再执行bundle install命令即可使用这个插件。但是这次却在静态网页bulid之后发生了问题。

问题报错如下：
```
jekyll_admin_monkey_patch': uninitialized constant Rack::Handler (NameError)

          @server.mount "/admin", Rack::Handler::WEBrick, JekyllAdmin::StaticServer
                                               ^^^^^^^^^
```
未找到rack里对于webrick的定义

然而我使用bundle list出现的结果确实有的，怀疑是出现了包依赖问题

# 解决方法
尝试了bundle update等方法更新rack, 但是到了最新版本问题依然存在。进一步怀疑是包依赖发生了冲突？使用bundle check并没有找到冲突的依赖项，让人更是摸不着头脑。

最后我去jekyll-admin的[Github Issue](https://github.com/jekyll/jekyll-admin/issues/705)上看了一下才发现了问题。这个问题是jekyll-admin 的依赖项sinatra的更新导致的——sinatra 版本更新到 4.0之后放弃了对 rack 2 的支持。

只需在 gemfile 中添加此内容将sinatra版本回退到4.0之前即可。
```
gem "sinatra", ">= 3", "< 4"。
```