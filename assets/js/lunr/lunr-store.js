var store = [{
        "title": "Linux的系统引导",
        "excerpt":"Linux系统引导 UBOOT   本次的目的是实现飞思卡尔t1022板卡的rework引导，决定使用uboot进行。   Uboot的运行环境：   首先从Github上获取了uboot的源代码，发现对Uboot源代码的编译需要Linux的make指令操作。   第一时间想到了Linux虚拟机实现（VMware），但是工作环境缺乏Linux发行版的镜像，且不允许接入外部网络和使用移动存储设备，只能退一步考虑如何在windows中进行交叉编译。   第二反应想到了使用Git bash中的MinGW模拟Linux环境，（cygwin和mysys2都基于这个包）在windows系统的主机上进行交叉编译。   MinGW需要下载make包和gcc包的安装。apt工具和上面同样的原因，无法使用。我直接手动下载了具有gcc包的MinGW的文件夹（需要对mingw_make.exe改名为make.exe）。   然后为bash添加$PATH环境变量。使用vi工具打开并编辑~/.bashrc文件，vi ~/.bashrc为文件最后一行添加export PATH=$PATH:/mingw64/bin/gcc。ESC退出插入模式，然后输入冒号进入命令行模式，输入WQ保存写入文件。g/^#/d删除注释   使能.bashrc文件。source ~/.bashrc。   进行make编译报错：没有CC的命令（makefile中的gcc的常见缩写）。   检查gcc是否成功安装。which gcc 和gcc -v，发现已经有gcc包。还需要对gcc和cc进行软连接。ln -s mingw64/bin/gcc mingw64/bin/cc。   再次检查 which cc 和cc -v，发现软连接建立成功。    再次进行编译报错：   scripts/basic/fixdep.c:108:10: fatal error: sys/mman.h: No such file or directory  #include &lt;sys/mman.h&gt;              ^~~~~~~~~~~~   Uboot的源码依赖于linux系统的默认系统头文件mman.h(用于内存管理)，mingw没法继续进行工作。最后还是得在Linux虚拟机上进行操作。   Uboot介绍   Uboot是一个开源的嵌入式系统引导程序，支持多种不同架构的板卡通过内存、SD卡或者FTP的方式加载系统。Uboot对板上的资源进行初始化使其达到满足引导操作系统的最小化要求（相当于一个小的操作系统），类似于windows系统的BIOS。   Uboot工作目录：   目录结构和内容，见docs.u-boot.org/en/latest/develop/directories.html中的表格。   Uboot的工作流程：   1.        初始化硬件资源（RAM、网卡等）   2.        从flash搬运系统的内核到RAM中   (1)     XIP:(eXcute in place**，片内执行)   e.g.写在片内的falsh中   CPU可以直接在片上访问地址找到uboot程序，无需初始化。   (2)     非XIP**：   e.g.写在SD卡上（需要初始化emmc）   CPU不可以直接在片上访问地址找到uboot程序，需额外的初始化片外的存储设备，以复制uboot的程序uboot.bin和设备树。相当于额外执行了一个加载uboot的加载程序(bootrom，在片上固化的)。   3.        启动系统的内核   Uboot的代码执行过程：   根据架构的设置从一个汇编文件strat.s开始。然后执行lowlevel_init()、board_init_f()、board_init_r()。   Uboot的make编译流程：   Uboot的程序通过make指令生成一个名为uboot.bin的二进制文件，烧录到板卡的闪存之中。                        若板卡厂商已经提供了u-boot的支持：   STEP1：      make XXX_defconfig：   根据板卡预设的信息_defconfig，生成.config文件。首先建立一个conf工具，使用Kconfig解析_defconfig的配置，如果不存在依赖，直接写入.config，如果存在依赖，从Kconfig中写入_defconfig依赖的配置到.config文件，未设置的配置使用默认值。   .config决定了uboot项目编译的过程中需要对那些目录、哪些文件进行编译，makefile中使用obj-$(CONFIG_XXXX)+= xxx/ 命令实现。还有可能需要编译文件中的某一部分，因此在make的时候会根据.config文件生成一个名为config.h的头文件，其中包含了所有的config的宏定义。在c文件中使用宏指令#if#else#endif判断编译那一部分。   可以使用以下技巧观察make的具体依赖，分析源码。   make xx -p &gt;detail.txt               Vi  detail.txt            :g/^#/d   STEP2.      make ARCH=OOO CROSS_COMPILE=XXX*   根据.config生成了config.h文件，用于编译c文件的部分。生成auto.conf（auto.conf.cmd、autoconf.h、），生成uboot.cfg，autoconf.mk。最后生成uboot.bin文件。   若板卡厂商未提供u-boot的支持：   需要自己设置.config文件然后make u-boot.bin文件。最后下入板中的是uboot.bin + 设备树文件（DTB）。  ","categories": ["编程"],
        "tags": [],
        "url": "/%E7%BC%96%E7%A8%8B/Linux%E7%9A%84%E7%B3%BB%E7%BB%9F%E5%BC%95%E5%AF%BC/",
        "teaser": null
      },{
        "title": "Markdown",
        "excerpt":"MarkDown   标题：若干# + 空格   加粗： ** 文本** 、__ 文本__或Ctrl +B `   倾斜：* 文本*、_ 文本_ 或Ctrl+I   加粗+倾斜：*** 文本***、___ 文本___ 或Ctrl+B  Ctrl+I   下划线：&lt;u&gt;文本&lt;/u&gt;或Ctrl+U   删除线：~~ 文本~~或Ctrl+D   引用：&gt; 文本 或Ctrl+shift+Q   无序列表：- 列表或* 列表   有序列表：1. 列表   代码：\\代码`  或Ctrl + ` `   代码段： ```   分割线 ****   数学公式：Ctrl + Shift +M 或 $数学符号$   图片：![描述]（图片路径）或Ctrl+shift+I   链接：  \\`[文本](链接网址\"悬浮title\")\\` \\`&lt;https://www.114514.com&gt;\\`  亦或  [链接文本][1] [1]:www.1919810.com  再或  &lt;a id = XXX&gt;&lt;/a&gt;  参见Markdown笔记   注释：[//]:#(注释)   目录：[TOC]  ","categories": ["编程"],
        "tags": [],
        "url": "/%E7%BC%96%E7%A8%8B/MarkDown/",
        "teaser": null
      },{
        "title": "Linux的文本编辑工具",
        "excerpt":"Linux的文本编辑工具   文本编辑器vim：   命令模式（：）和插入模式（i）,按ecs从插入到命令。命令模式下可以输入命令对文本进行控制。   w 保存   wq保存并退出   q! 退出不保存   u undo   crtl-r redo   x删除   dw删除单词   d$ 删除到行结束   d number w/number e 删除到下number个词的开头或者结束   dd删除整行   p把删除的放到指定位置   r取代当前的词   /向前搜索   ?向后搜索   %匹配对应的括号   s替换/old为/new   G移动到结尾   gg移动到开头   ctrl-G当前位置   o下方创建新的一行   O上方创建新的一行   a添加   A在后面的行添加。  ","categories": ["编程"],
        "tags": [],
        "url": "/%E7%BC%96%E7%A8%8B/Linux%E7%9A%84%E6%96%87%E6%9C%AC%E7%BC%96%E8%BE%91%E5%B7%A5%E5%85%B7/",
        "teaser": null
      },{
        "title": "Zero mq学习笔记",
        "excerpt":"Zero MQ     We took a normal TCP socket, injected it with a mix of radioactive isotopes stolen from a secret Soviet atomic research project, bombarded it with 1950-era cosmic rays, and put it into the hands of a drug-addled comic book author with a badly-disguised fetish for bulging muscles clad in spandex.                                                                                                           —-Pieter Hintjens, CEO of iMatix   精简版：人们受够了套接字！他实在太混乱了！ZMQ就是这个混乱网络世界的救主。                                                                                                   —-笔者      ZMQ是一个高性能的异步消息传递库，提供了一个无需消息代理的消息队列（MQ）。ZMQ通过多种传输方式（TCP, in-process, inter-process, multicast, WebSocket and more）实现了常见的消息传递模式（pub/sub, request/reply, client/server and others）从而使进程间消息传递变得与线程间消息传递一样简单。这样可以保持代码清晰、模块化，并且非常易于扩展。   本质上ZMQ和Redis、RabbitMQ、RocketMQ、Kafka这类的消息中间件并不相同。ZMQ更类似于一个对socket的封装，包含了网络层协议。因此他更快速也无需消息代理（message broker)。当然，这也意味着更底层更复杂（这就是力量的代价：MQ +4/+4，当发生底层错误时消灭程序员）。   中文zguide   一、 ZMQ模型                  [1. Basics       ØMQ - The Guide](https://zguide.zeromq.org/docs/chapter1/#Why-We-Needed-ZeroMQ)           一文带你入门了解“零之禅“消息队列ZeroMQ-CSDN博客   重头戏！ZeroMQ的管道模式详解：ZMQ_PUSH、ZMQ_PULL_zmq push pull-CSDN博客   1 请求/应答模型(REQ/REP)–1v1   1.1 原理      REQ-REP 套接字的步调一致。客户端循环发出zmq_send()，然后发出 zmq_recv()（如果仅此而已，则只发出一次）。执行任何其他顺序（例如，连续发送两条消息）将导致 send或recv调用返回 -1 代码。同样，服务会根据需要按顺序发出zmq_recv()，然后发出 zmq_send() 。   1.2 服务器端   服务器创建一个响应类型的套接字（稍后您将了解有关请求-响应的更多信息），将其绑定到端口 5555，然后等待消息。您还可以看到我们没有任何配置，我们只是发送字符串。   //  Hello World server #include &lt;zmq.h&gt; #include &lt;string.h&gt; #include &lt;stdio.h&gt; #include &lt;unistd.h&gt; #include &lt;assert.h&gt;  int main (void) {     //  Socket to talk to clients     void *context = zmq_ctx_new ();     void *responder = zmq_socket (context, ZMQ_REP);     int rc = zmq_bind (responder, \"tcp://*:5555\");     assert (rc == 0);      while (1) {         char buffer [10];         zmq_recv (responder, buffer, 10, 0);         printf (\"Received Hello\\n\");         sleep (1);          //  Do some 'work'         zmq_send (responder, \"World\", 5, 0);    }     return 0; }   1.3 客户端   客户端创建一个请求类型的套接字，连接并开始发送消息。send和方法receive都是阻塞的（默认情况下）。对于接收来说很简单：如果没有消息，该方法将阻塞。对于发送来说，它更复杂，并且取决于套接字类型。对于请求套接字，如果达到高水位或没有连接对等点，该方法将阻塞。   //  Hello World client #include &lt;zmq.h&gt; #include &lt;string.h&gt; #include &lt;stdio.h&gt; #include &lt;unistd.h&gt;  int main (void) {     printf (\"Connecting to hello world server…\\n\");     void *context = zmq_ctx_new ();     void *requester = zmq_socket (context, ZMQ_REQ);     zmq_connect (requester, \"tcp://localhost:5555\");      int request_nbr;     for (request_nbr = 0; request_nbr != 10; request_nbr++) {         char buffer [10];         printf (\"Sending Hello %d…\\n\", request_nbr);         zmq_send (requester, \"Hello\", 5, 0);         zmq_recv (requester, buffer, 10, 0);         printf (\"Received World %d\\n\", request_nbr);     }     zmq_close (requester);     zmq_ctx_destroy (context);     return 0; }   #注意:字符串安全性#      C语言中的字符串并不安全！     zmq_send只关注会发送的字符的数量，这意味着它是可以发送带有空字节的字符串的。这会导致不正确的字符串格式—没有安全的终止。如果接收方的buffer中剩余的位置不是空字符（尽管大部分情况下是这样），将会导致字符串读写的错误     zmq_send (requester, \"Hello\", 6, 0);       一般默认的我们认为zmq_send使用的字符串的长度是不带终止符的长度，也就是strlen得到的长度。也就是说，网络中传输的字符串不是C语言中的字符串，需要额外的格式化处理。     我们选择在接收端对接收的字符进行处理。在实际的使用之中，有两种方法：1.每次memset接收缓存为0；2.需要对接收缓存的字符串多读一位然后使用空字符截取，好消息是我们从0开始，所以recv的返回值就是那个多一位，该赋值为空字符的位置。两种方法的思路其实是一样的，为recv到的网络字符添加空字符结尾，使他结束在应该有的位置。     //  Receive ZeroMQ string from socket and convert into C string //  Chops string at 255 chars, if it's longer static char * s_recv (void *socket) {     char buffer [256];     int size = zmq_recv (socket, buffer, 255, 0);     if (size == -1)         return NULL;     if (size &gt; 255)         size = 255;     buffer [size] = '\\0';     /* use strndup(buffer, sizeof(buffer)-1) in *nix */     return strdup (buffer); }       可以使用zhelpers.h头文件对c语言进行安全的收发。点击此处查看具体源码。     ps. 不正确的使用send，在router中会导致身份识别的错误请务必注意！    2  发布/订阅模型(PUB/SUB)–1vN   2.1 原理      单向数据分发即服务器将更新流推送到一组客户端。这股更新流可以理解为无始无终永不结束的广播。   2.2 发布者（生产者）   //  Weather update server //  Binds PUB socket to tcp://*:5556 //  Publishes random weather updates  #include \"zhelpers.h\"  int main (void) {     //  Prepare our context and publisher     void *context = zmq_ctx_new ();     void *publisher = zmq_socket (context, ZMQ_PUB);     int rc = zmq_bind (publisher, \"tcp://*:5556\");     assert (rc == 0);      //  Initialize random number generator     srandom ((unsigned) time (NULL));     while (1) {         //  Get values that will fool the boss         int zipcode, temperature, relhumidity;         zipcode     = randof (100000);         temperature = randof (215) - 80;         relhumidity = randof (50) + 10;          //  Send message to all subscribers         char update [20];         sprintf (update, \"%05d %d %d\", zipcode, temperature, relhumidity);         s_send (publisher, update);     }     zmq_close (publisher);     zmq_ctx_destroy (context);     return 0; }   2.3 订阅者（消费者）   //  Weather update client //  Connects SUB socket to tcp://localhost:5556 //  Collects weather updates and finds avg temp in zipcode  #include \"zhelpers.h\"  int main (int argc, char *argv []) {     //  Socket to talk to server     printf (\"Collecting updates from weather server...\\n\");     void *context = zmq_ctx_new ();     void *subscriber = zmq_socket (context, ZMQ_SUB);     int rc = zmq_connect (subscriber, \"tcp://localhost:5556\");     assert (rc == 0);      //  Subscribe to zipcode, default is NYC, 10001     const char *filter = (argc &gt; 1)? argv [1]: \"10001 \";     rc = zmq_setsockopt (subscriber, ZMQ_SUBSCRIBE,                          filter, strlen (filter));     assert (rc == 0);      //  Process 100 updates     int update_nbr;     long total_temp = 0;     for (update_nbr = 0; update_nbr &lt; 100; update_nbr++) {         char *string = s_recv (subscriber);          int zipcode, temperature, relhumidity;         sscanf (string, \"%d %d %d\",             &amp;zipcode, &amp;temperature, &amp;relhumidity);         total_temp += temperature;         free (string);     }     printf (\"Average temperature for zipcode '%s' was %dF\\n\",         filter, (int) (total_temp / update_nbr));      zmq_close (subscriber);     zmq_ctx_destroy (context);     return 0; }   关键在于 zmq_setsockopt (subscriber, ZMQ_SUBSCRIBE,filter, strlen (filter)); 一步为subscriber设置订阅。PUB-SUB 套接字对是异步的。客户端循环执行zmq_recv()（如zmq_hello_world_client果仅此而已，则执行一次）。尝试向 SUB 套接字发送消息将导致错误。同样，服务会根据需要尽可能频繁地执行 zmq_send()，但不得在 PUB 套接字上执行zmq_recv() 。   理论上，对于 ZeroMQ 套接字，哪一端连接和哪一端绑定并不重要。然而，在实践中存在一些未记录的差异。一般的，在PUB端bind在SUB端connect。      在通常的套接字编程中，bind 和conect一般分别用于服务器端和客户端。bind用于服务器监听指定的地址和端口，connect用于客户端连接到指定地址的服务器。     在ZMQ中,在那一段bind或connect并无影响（为什么？）但实际上还是有差异的（毕竟底层的套接字不同）    #注意:缓慢加入问题#      ”缓慢加入“问题会导致SUB永远没办法接收到PUB发送的最开始的信息（建立连接需要时间，这段时间中PUB很可能已发出很多信息！）需要对发布者和订阅者的同步。    3 推拉模型（PUSH/PULL)–1vNv1   管道模式或者叫并行流水线(ventilator/worker/sink)   3.1 原理      可同时执行多项任务的发送者ventilator、一组处理任务的工作者worker、从工作进程收集结果的接收者sink。发送者将任务分配给工人并行的处理，工人将各自的成果交给接收者。实质上是push和pull两种套接字上的操作！!本质是单向的套接字接口。   3.2 发送者   //  Task ventilator //  Binds PUSH socket to tcp://localhost:5557 //  Sends batch of tasks to workers via that socket  #include \"zhelpers.h\"  int main (void)  {     void *context = zmq_ctx_new ();      //  Socket to send messages on     void *sender = zmq_socket (context, ZMQ_PUSH);     zmq_bind (sender, \"tcp://*:5557\");      //  Socket to send start of batch message on     void *sink = zmq_socket (context, ZMQ_PUSH);     zmq_connect (sink, \"tcp://localhost:5558\");      printf (\"Press Enter when the workers are ready: \");     getchar ();     printf (\"Sending tasks to workers...\\n\");      //  The first message is \"0\" and signals start of batch     s_send (sink, \"0\");      //  Initialize random number generator     srandom ((unsigned) time (NULL));      //  Send 100 tasks     int task_nbr;     int total_msec = 0;     //  Total expected cost in msecs     for (task_nbr = 0; task_nbr &lt; 100; task_nbr++) {         int workload;         //  Random workload from 1 to 100msecs         workload = randof (100) + 1;         total_msec += workload;         char string [10];         sprintf (string, \"%d\", workload);         s_send (sender, string);     }     printf (\"Total expected cost: %d msec\\n\", total_msec);      zmq_close (sink);     zmq_close (sender);     zmq_ctx_destroy (context);     return 0; }   当工作者准备好时，发送者发送一个开始标志给sink让其准备好接收工人的成果。这么做的原因是和发布订阅模型一样可能存在丢失的信息，所以必须的先让接收者做好接收的准备，再让其得到工作者发出的信息。   3.3 工作者   //  Task worker //  Connects PULL socket to tcp://localhost:5557 //  Collects workloads from ventilator via that socket //  Connects PUSH socket to tcp://localhost:5558 //  Sends results to sink via that socket  #include \"zhelpers.h\"  int main (void)  {     //  Socket to receive messages on     void *context = zmq_ctx_new ();     void *receiver = zmq_socket (context, ZMQ_PULL);     zmq_connect (receiver, \"tcp://localhost:5557\");      //  Socket to send messages to     void *sender = zmq_socket (context, ZMQ_PUSH);     zmq_connect (sender, \"tcp://localhost:5558\");      //  Process tasks forever     while (1) {         char *string = s_recv (receiver);         printf (\"%s.\", string);     //  Show progress         fflush (stdout);         s_sleep (atoi (string));    //  Do the work         free (string);         s_send (sender, \"\");        //  Send results to sink     }     zmq_close (receiver);     zmq_close (sender);     zmq_ctx_destroy (context);     return 0; }   工作者得到发送者的任务后停止一段时间然后发出成果给接收者。但这里隐含一个需求——所有的工作者需要同步的开始工作。也就是说我们需要额外的操作实现同步的并行处理。   同时，发送者需要均匀的为每一位工作者分配任务，称为**负载均衡**。   3.4 接收者   //  Task sink //  Binds PULL socket to tcp://localhost:5558 //  Collects results from workers via that socket  #include \"zhelpers.h\"  int main (void)  {     //  Prepare our context and socket     void *context = zmq_ctx_new ();     void *receiver = zmq_socket (context, ZMQ_PULL);     zmq_bind (receiver, \"tcp://*:5558\");      //  Wait for start of batch     char *string = s_recv (receiver);     free (string);      //  Start our clock now     int64_t start_time = s_clock ();      //  Process 100 confirmations     int task_nbr;     for (task_nbr = 0; task_nbr &lt; 100; task_nbr++) {         char *string = s_recv (receiver);         free (string);         if (task_nbr % 10 == 0)             printf (\":\");         else             printf (\".\");         fflush (stdout);     }     //  Calculate and report duration of batch     printf (\"Total elapsed time: %d msec\\n\",          (int) (s_clock () - start_time));      zmq_close (receiver);     zmq_ctx_destroy (context);     return 0; }**   接收者需要均匀的从工作者处接收成果，也就是**公平排队**的接收机制。   3.5  负载均衡和公平排队      注意:不完全的负载均衡#      和发布/订阅模型一样，流水线模式也有着很严重的同步问题需要研究。     PUSH 套接字无法正确实现负载平衡。如果您同时使用 PUSH 和 PULL，并且您的一个工作进程收到的消息比其他工作进程多得多，这是因为该 PULL 套接字比其他工作进程加入得更快，并且在其他工作进程设法连接之前就获取了大量消息。     如果您想要正确的负载平衡，您可能需要查看 第 3 章 - 高级请求-回复模式中的负载平衡模式。    4 独占套接字对（Exclusive pair)–线程间通信   —-todo:   5 路由模式（Router/Dealer)–NvN   Router/Dealer模式是异步版的的REQ/REP模式。在实际的高访问量高并发性应用当中，往往有者多个服务器共同完成请求任务，甚至承载着不同的任务（微服务？）。此时可以通过一个消息中间人（message broker）（类似于Nginx的反向代理服务器？作用于不同的层次）实现请求应答。   router实际上在使用中更多的起到的是消息中间人的效果！   zeromq中两个dealer 通过一个router进行通信 - fengbohello - 博客园   6 有代理的发布/订阅模型（XPUB/XSUB）   —-todo:   二、ZMQ套接字机制   1 ZMQ上下文的创建和销毁：   在ＺＭＱ中，使用ZMQ上下文管理所有的套接字。ZMQ使用一个称为上下文的结构体管理套接字——一个zmq::ctx_t类型的结构体,用于管理单个进程的所有套接字。一般的我们在一个进程开始时使用zmq_ctx_new()去创建上下文，在进程结束时使用zmq_ctx_term() / zmq_ctx_destroy()去销毁上下文,释放所有资源。如果使用fork，则是在fork之后和子线程的开头创建上下文。一般来说在子线程进行具体的zmq操作，在父线程进行线程管理。      在之前的zmq版本中使用的是zmq_init()和zmq_term()去创建和销毁上下文。但这样并没有表现出zmq上下文的作用，为了强调这是上下文的创建和销毁而修改了接口。更主要的，这为了提示你还需要释放zmq_msg结构体和套接字才能实现完整的释放，不导致资源泄露。换句话说，实际上ZMQ就是ZMQ上下文。    在ZMQ当中，一个完整的资源释放过程被分为了三个部分：释放zmq_msg_t、释放套接字、释放zmq_ctx_t。           释放zmq_msg_t： 在使用时尽量使用zmq_send()和zmq_recv()，而不是zmq_msg_send()和zmq_msg_recv()。通过这种方法来避免zmq_msg_t结构体的使用。如果非要使用的话，需要在每次使用之后立刻调用zmq_msg_close()来关闭消息结构体，避免内存泄漏。            释放套接字： 在连接的套接字使用完毕后，需要及时的使用zmq_close()关闭套接字，因为上下文的释放仅能在其拥有的所有套接字都释放完毕后进行。此时需要为未关闭的套接字设置一个较小的LINGER值（等待时间，比如1s），然后关闭所有的套接字。            释放zmq_ctx_t：zmq_ctx_destroy()的过程是一个复杂而痛苦的过程，因为上下文释放时可能仍有着悬挂的连接和进行的发送，也就是上下文对应的套接字没有完全释放。此时zmq_ctx_destroy()会一直被挂起。              释放zmq上下文的zmq_ctx_term()的流程是：                             任何当前在“context”内打开的套接字上正在进行的阻塞操作应立即以错误代码 ETERM 返回。除了zmq_close()之外，在“context”内打开的套接字上的任何进一步操作都应因错误代码 ETERM 而失败。                              中断所有阻塞调用后，zmq_ctx_term()应阻塞，直到：                                         所有在“context”内打开的套接字都已使用zmq_close()关闭                                          zmq_send()发送的所有消息要么已实际传输到网络对等方，要么套接字的延迟时间已过期（由ZMQ_LINGER套接字选项设置）。                                                    2 ＺＭＱ上下文对于套接字的管理：   ZMQ上下文对于套接字的管理主要包括：           创建和销毁套接字，它们共同构成套接字生命的循环（参见zmq_socket()、zmq_close()）。            通过设置选项并在必要时检查它们来配置套接字（参见zmq_setsockopt()、zmq_getsockopt()）。            通过创建 ZeroMQ 连接将套接字插入网络拓扑（参见zmq_bind()、zmq_connect()）。            通过在套接字上写入和接收消息来使用套接字传输数据（参见zmq_msg_send()、zmq_msg_recv()）。       2.1 ZMQ套接字的创建：   —-todo:   2.2 ZMQ 的套接字选项：   —-todo:   2.3 ZMQ套接字绑定和连接：   ZMQ允许不严格的区分bind和connect，这使得其使用更加简单。但是正如之前在ZMQ模式中提到的，他们实际上有着微妙不同，但我们只需要按照标准的方法来使用它就可以避免。一般来说，执行zmq_bind()的节点是***“服务器”***，位于***众所周知的网络地址***上，而执行zmq_connect()的节点是***“客户端”***，具有***未知或任意的网络地址***。因此，我们说“将套接字绑定到端点”和“将套接字连接到端点”，端点是众所周知的网络地址。   2.4 ZMQ的发送和接收：   ＺＭＱ与TCP套接字的区别：           可以使用任意传输方式进行传输（ inproc、ipc、tcp、pgm或epgm）。zmq_inproc()、zmq_ipc()、zmq_tcp()、zmq_pgm()和zmq_epgm()。            一个套接字可能有许多传出连接和许多传入连接。            没有zmq_accept () 方法。当套接字绑定到端点时，它会自动开始接受连接。            网络连接由ZMQ自动管理，你无法直接处理这些连接。如果网络连接中断（例如，如果对等方消失然后又回来），ZeroMQ 将自动重新连接。            ZMQ不是一个能承载协议的中间载体，只能使用ZMQ_ROUTER_RAW套接字选项支持正确的读写HTTP等协议。这意味着他不能兼容现有的协议（like:HTTP，因为它们基于socket而ZMQ对socket进行了封装）。尽管可以使用ZMQ实现类似的协议但他们本质不同（取决于对端的协议，更广泛的设备使用的是普通的协议）。。            ZMQ使用一个I/O线程来处理所有的网络连接，处于不断轮询的poll/select之中。       三、ZMQ程序接口   void *zmq_ctx_new ();           返回值：                       成功: 返回ZMQ上下文content，是一个zmq_ctx_t的结构体                        失败: 返回NULL, 并设置errno                   void *zmq_ctx_term ();           返回值:                       成功: 返回0                        失败: 返回-1, 并设置errno                   三、ZMQ源码结构   https://www.iteye.com/blog/watter1985-1736023   zeromq源码分析笔记之架构（1） - zengzy - 博客园   zmq源代码分析 - mailbox_t_zmq代码-CSDN博客   ZMQ API reference   The Architecture of Open Source Applications (Volume 2)ZeroMQ  ","categories": ["编程"],
        "tags": [],
        "url": "/%E7%BC%96%E7%A8%8B/Zero-MQ%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/",
        "teaser": null
      },{
        "title": "Cmake学习笔记",
        "excerpt":"Cmake笔记   Cmake介绍   Cmake是一种与平台无关的自动控制项目编译过程的工具（自动生成makefile文档）。只需要配置CMakeList.txt就可以自动的根据平台生成Makefile，方便的跨越多个平台进行编译。   Cmake说明文档   cmake是什么？cmake的特性和编译原理（cmake原理和cmake编译过程）   【C++】Cmake使用教程（看这一篇就够了）-CSDN博客      不是已经有了makefile去实现编译控制，为什么还需要Cmake?     Maybe:控制编译的对象范围不同？     Answer:Cmake为了方便的自动生成可以跨平台的makefile，直接写makefile可以实现但是复杂    Cmake的常用语法   初始化：       添加cmake版本要求, 添加project名称   cmake_minimum_required (VERSION 2.8) project (project_name)   使用变量：   指定头文件搜索路径：   include_directories (test_func test_func1)   编译可执行文件：       直接编译.c文件   add_executable(main main.c testFunc.c)       将目录中的所有源文件存在变量中   aux_source_directory(. SRC_LIST)       编译变量指定的文件   add_executable(main ${SRC_LIST})       设置二进制文件的输出位置：   set (EXECUTABLE_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/bin)   添加库文件：    编译源代码归档成动态和静态库。   add_library (libname SHARED/STATIC ${SRC_LIST})   设置最终生成的库的名字   set_target_properties (libname PROPERTIES OUTPUT_NAME \"libname \")   设置库的输出路径   set (LIBRARY_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/lib)   链接库和可执行文件：   在路径下查找库并把绝对路径存放在变量中   find_library(LIB_PATH libname HINTS ${PROJECT_SOURCE_DIR}/lib)   链接目标文件和库文件   target_link_libraries (target_file ${LIB_PATH})   添加编译选项：   add_compile_options(-std=c++11 -Wall)    部分编译：   添加编译子目录：   add_subdirectory(source_dir [binary_dir] [EXCLUDE_FROM_ALL])           source_dir 源代码目录       指定一个具有cmakelist和源代码的目录，将其作为编译的子目录            binary_dir 二进制代码目录       指定cmake输出的二进制文件所在的目录            EXCLUDE_FROM_ALL标记       指定将添加的子目录从make all 中移除          添加编译子目录是为了让源码的编译结构更加清晰，可以更好的使用选项管理编译过程。       文件操作   file(MAKE_DIRECTORY path/to/directory)add_library (libname SHARED/STATIC ${SRC_LIST})      ","categories": ["编程"],
        "tags": [],
        "url": "/%E7%BC%96%E7%A8%8B/Cmake%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/",
        "teaser": null
      },{
        "title": "锐华嵌入式操作系统",
        "excerpt":"锐华嵌入式操作系统   CH 1—ReDE   一、 ReDE介绍   ReDe是基于Eclipse开发的集成嵌入式系统开发平台。构建和项目管理依赖于GCC交叉编译工具链和make工具（但会操作简单点，自动生成Makefile）   二、ReDe使用   1. 建立工程   Reworks的项目是建立在一个拥有系统镜像的自引导工程之上的。   一般的，在项目文件中建立一个自引导工程和多个可下载工程和库工程。通过自引导工程引用别的工程的内容，将所有的文件写入elf的系统镜像之中。   也可以在运行好的Reworks系统上通过库工程L和可下载工程D动态的加卸载.o和.a文件。           自引导工程B： 生成可以直接在目标机上运行的目标代码。编译生成.bin和.elf文件。            库工程L: 生成可以被其他库引用的库文件。编译生成.a文件。            可下载工程D: 生成可以下载到目标机运行的文件。编译生成.o和.out文件。            BSP工程: 该工程提供了BSP工程建立、代码模板自动导入、BSP库构建与ReWorks自引导工程一体化调试、BSP资源组建配置与发布等功能。            自定义工程： 允许用户自定义包括makefile的工程。            资源组件工程： 对工程的一系列属性进行了配置。可在自引导工程、库工程、可下载工程的资源配置模块中应用。（资源配置模块就是资源组件工程？是的）            目标板资源工程：定义在目标系统上运行所需的最低资源集合       2. 配置系统资源   出于嵌入式系统的特性考虑（功耗、资源、性能、价格等…），需要对完整的系统根据需求进行定制裁剪。根据具体的调试和应用需要，各异的设置开发板上所需的系统资源。   ReDe中可以直接在.syscfg中勾选保存所需的功能。具体功能需要那些系统资源请看各自功能的文档。   常用的资源配置：   板级支持包–网卡驱动、控制台配置   开发和运行支持–运行时工具–任务调试支持   3. 构建工程   对工程中的文件进行编译，自引导工程、库工程、可下载工程具有默认的构建配置（自动生成的makefile) 。可以在工程属性中管理自动生成的makefile和make指令。   连接可下载/库工程到自引导工程（系统调试）：   右键–属性–C++构建–设置–GCC C++ linker–杂项–附加对象文件–选择   为项目添加依赖（先构建依赖）：   右键–属性–项目引用–选择   为make all 添加选项：   右键–属性–C/C++构建–构建器设置–去除勾选使用默认构建命令–添加选项。   例如：make -j10 all开启多线程编译。   4. 连接目标板   ReDe和开发板的Uboot通过USB串口和RJ45以太网接口连接。串口用于和开发板直接沟通配置Uboot。以太网接口用于进行FTP通信。   此时还没有拷贝镜像！更没有启动系统！和系统资源配置没关系！只是在和U-Boot交互   FTP方式下载系统镜像：      注意：网卡需要设置的IP地址。这次用的192.168.1.110，取决于板上写入的服务器地址（uboot tftp配置的地址，可以更改）     setenv ipaddr 192.168.1.1 setenv serverip 192.168.1.31 saveenv       更改前本机的ip地址，软件平台室服务器。    USB串口设置：左上角选择终端打开设备管理器选择对应的COM号，设置端口速度为115200。（这是USB连接的线用来和uboot的引导程序命令行进行交互）运行过程中不断敲击回车键（保证能中断他的自动引导，其实一下好像就行）   TFTP服务器设置：   右键存在需下载文件的项目目录–设置TFTP路径   或   打开窗口–显示视图–TFTP服务–启动TFTP 服务（依然是上次设置的路径）   5. Uboot启动系统镜像   在串口界面输入命令： tftpboot 0x80100000 reworks 使用TFTP服务从服务器获得reworks.elf放到地址0x80100000   go 0x80100000 从地址运行系统，进行uboot，启动reworks系统镜像      地址是根据不同开发板而不同的。    6. 调试   6.1 系统调试（本地调试）：   .o文件跟随系统镜像写入开发板。参见在自引导工程中引用可下载工程的.o文件部分。直接烧入镜像进行测试。      在自引导工程中引用可下载工程的.o文件：     右键属性–c++构建–设置–c++linker–杂项–附加对象文件–输入命令“${workspace_loc:/projectName/gnuXXX/boardName/projectName.out}”    6.2 任务调试（远程调试）：   .o文件在系统启动以后在写入并加载。首先需要通过TFTP等方式拷贝系统镜像，使用Uboot启动系统。使用的是GNU GDB工具进行测试。   0、系统资源配置：   运行时工具–任务调试支持、协同总线组件、远程接卸载 和 板级支持包–网卡驱动   1、运行系统镜像：   勾选任务调试支持后系统会暂停于usrInit处。   2、连接目标机：   左下角目标机系统管理器，第一个图标：添加连接。   目标机名填写系统资源配置中网卡的IP(和TFTP中的IP并不一定相同)      U-boot和Reworks是两个不同的系统。U-boot是引导系统的系统。     有bug，必须更改一次ip地址才可以使用！    3、调试配置：   右键项目–调试–调试配置–自引导应用程序–程序   右键项目–调试–调试配置–自引导应用程序–目标机   4、开始调试：   等同于GNU GDB，略   6.3 远程加卸载：   对非核心的.o文件在系统中动态的加载或者卸载。实质是把.out文件下载到 /clb/dynamicModuleFolder/路径下，然后运行ld unld指令,然后删除可执行文件。等价于TFTP获取文件+加载模块+删除文件。   与直接镜像link然后构建写入镜像不同。直接写入镜像的模块无法卸载，在/clb/dynamicModuleFolder/路径下没有.out文件      TFTP命令     tftp (\"ip\", \"path/remotefile\", \"get/put\",“ascii/netascii/binary/image/octet”, \"path/localfile\")     符号表命令     ld 加载.out/.o文件     unld 卸载已加载的.out/.o文件     unld_by_module_name 通过模块名称卸载已加载的.out/.o文件     unld_by_module_id 通过模块ID卸载已加载的.out/.o文件     reld 重新加载.out/.o文件     module_info 显示已加载的.out/.o文件     symbol_lkup 查找指定的符号信息     lkup 显示包括指定名称的所有符号信息    0、系统资源配置： 远程加卸载、符号表、网卡   1、目标及启动系统： 略   2、连接目标机： 略   3、加卸载： 左上角加载–加载配置–设置目标机、动态加载   4、符号表同步： 何意？   6.4 仿真调试：Qumu   CH 2—系统命令行Shell   一、Shell介绍   1.1 Reworks Shell命令   i   oi   stackuse   cpuuse   1.2 反汇编   在软件运行过程中只要有shell线程工作就可以使用pthread_show_stackframe命令获得任务运行的堆栈，再使用arrch64-objdump-elf -C -x -S可以查看反汇编的.elf源码，方便进行调试。   任务堆栈：   pthread_show_stackframe   objdump反汇编工具：  ","categories": ["编程"],
        "tags": [],
        "url": "/%E7%BC%96%E7%A8%8B/%E9%94%90%E5%8D%8E%E5%B5%8C%E5%85%A5%E5%BC%8F%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/",
        "teaser": null
      },{
        "title": "Linux操作系统学习笔记",
        "excerpt":"linux操作系统学习笔记   一、系统内核（kernal）介绍:   是一个建立在硬件和应用之间的中间软件，向上为应用提供调动硬件的接口服务，向下提供对各类硬件的兼容性支持（各种架构的CPU、各种不同原理、不同厂商的内存和设备）。   系统内核可以分为三层：系统调用接口（POXIS）、内核代码（不依赖架构，通用）、BSP板级支持包（依赖架构，具体配置）。   系统的主要组件有：系统调用接口、进程管理、内存管理、虚拟文件系统、网络堆栈、设备驱动程序和架构相关的内核代码（BSP）。   https://zhuanlan.zhihu.com/p/342056802   https://www.cnblogs.com/dy2903/p/8453660.html   1.1 系统调用接口：   系统调用接口是操作系统提供给内核的一组函数，用于对操作系统进行管理（后面的内容）。系统调用接口屏蔽了底层硬件的差异性、向上提供了系统内统一的用户接口，但是不同系统之间的借口是不统一的。POSIX是可移植系统接口，规定了通用的系统调用接口，使得应用程序能在兼容POSIX的不同操作系统中正常运行。   1.2 进程管理：   进程、线程、任务：   进程是一个在执行的程序（执行实例），他由一个或多个线程来实现（e.g.PI的计算）。进程是划分资源的基本单位，一个程序开始运行以后就为其开启了一个独立的空间，包括堆（heap进程期间动态分配的malloc/realloc）、缓冲、栈（stack、存放局部变量）、BSS段、数据段data segment、代码段text segment。   线程是进程执行的实体，是真正在运行的执行实体。线程是CPU调度的基本单位。同一个进程的线程之间共享资源（全局变量相同），又保留有自己的程序计数器、堆、栈（局部变量不同）。   任务笼统的表述为某一目的而执行的程序，在Linux和RTOS中任务指的就是线程。   Linux中不明确的区分进程和线程（使用了相同的结构体task_struct），区别只在于是否拥有资源。因此，线程又叫轻量级进程。   进程建立的过程：   进程间通信:   进程优先级和进程调度：   进程的数据结构：   https://blog.csdn.net/weixin_42462202/article/details/102768721   Linux中的进程由结构体task_struct表示，又叫进程描述符。结构体成员如下：   tasks是一个双向的循环链表，连接了所有的进程。   pid是进程号，不论进程还是线程都拥有内核中唯一的进程号（只是习惯的称为进程号，或许线程号的叫法更加合理）。   tgid是线程组号，可以把进程看做一个主线程，由主线程创建的其他子线程和主线程构成一个线程组。线程组中的子线程的线程组号就是主线程的pid。   group_leader是一个指向主线程的进程描述符（task_struct）。   /信号相关的数据结构/   1.3 内存管理：   虚拟内存：利用cache机制联系内存和硬盘，   分页机制：   1.4 文件系统：   虚拟文件系统VFS：   建立了一个文件系统的抽象层，实现对于不同的文件系统的兼容支持：网络文件系统NFS,AFS,GFS等等。   1.5 网络协议栈：   1.6 驱动：   1.7 BSP:   参考文献：   https://zhuanlan.zhihu.com/p/342056802   【计算机原理】程序执行过程 - dy2903 - 博客园   设备树：   Kconfig:   是一种图形化的配置.config文件的工具语言，被广泛的应用于Linux内核。使用一个名为Kconfig的配置脚本，设置了各种配置选项和之间的依赖关系。这样，开发者可以通过make  menuconfig的命令实现图形化的.config文件生成（需要已经安装好了uboot）。   Kconfig的语法为：   config [name] [“option name”] default     [default_value] depends on [dependency_config _name] select [select_config _name] help [help information]   二、Linux命令行(bash Shell命令)：   freecodecamp.org/chinese/news/the-linux-commands-handbook/   man:查看命令手册的具体内容，帮助了解（很长很长）。建议使用tldr以更快的大致了解一个命令。   man [命令]/tldr [命令]   文件夹操作：      ls:查看文件夹的内容，默认是当前目录。常用的属性是-al,可以查看文件的详细信息（l详细数据，a显示隐藏数据）。           ls [选项] &lt;文件路径&gt;      cd:打开文件夹。.. :上级文件夹、. :当前文件夹、/：根目录、~：root目录。           cd [选项] &lt;文件路径&gt;           pwd:显示当前的工作文件夹。            du:显示目录大小。 -h单独计算每个文件大小。            mkdir:创建新的文件夹。-p :创建嵌套的文件夹。               mkdir [选项] &lt;文件路径&gt;           rm -f:删除文件和其中内容（必须慎重操作）。-rf:递归的删除文件（也删除文件夹里的）            rmdir:删除文件夹（必须为空）。               rmdir [选项] &lt;文件路径&gt;      mv:移动文件、文件夹；也可用于重命名文件。 -t 目标目录           mv             cp：复制文件，-r复制文件夹。            find:查找文件,可以限定查找的类型、名称、大小、时间和附加操作。               find  [路径]  -type [类型：f/d]  -name [文件名]  -size [+大于的值/-小于的值]  -mtime [更新时间]  -delete/-exec [命令]      ln:链接文件,包括硬链接和软链接。保证同步更新？           硬链接：ln ，复制+同步           软链接：ln ，指针           gzip：压缩            ta：归档       文件操作：           touch :创建文件，以写入方式打开。            cat：打印文件的内容到标准输出。       cat常常与管道运算符，重定向输出符等连用   cat 文件名      | 是管道符号，标识把左边的内容的输出作为右边内容的输入。     &gt;是重定向输出符号，把内容输出到文件当中，会覆盖     &gt;&gt;是追加重定向输出符号，把内容追加在文件的末尾       tail: 打开并监控文件的末尾。（用于日志监控）           tail -f [文件]      grep：全局正则表达式打印。在指定的文件里寻找字符串（正则表达式）。-n 显示匹配的行行号、- l 打印匹配的文件名、-i 忽略大小写匹配、-v 反向查找（打印不匹配的） 、-r 递归查找文件、-c 只打印匹配的行数、-C x 打印匹配的行前后x行的内容。   grep [选项] 表达式 [文件]           echo:打印输出。            sort:对文本进行排序 -r倒序 -u移除重复的（对中文不可用）            uniq：去除重复的行，-d显示重复行、-u显示不重复行、-c计数            diff:比对两个文档。-y逐行对比、-u git式的对比、-r 递归比较、-q显示不同的文件名       进程操作：           ps:检查进程，（静态）            top:动态监控进程            kill：向进程发送信号（KILL和STOP先向内核发送，由内核操纵进程）。信号包括：HUP(1)挂起、INT(2)干扰、KILL(9)强制终结、TERM(15)正常终结、CONT(18)继续、STOP(19)停止       用户操作：      alias:为命令创造别名。’’ 变量在调用时解析, ””变量在定义时解析。   alias [new_cmd]=’cmd’/”cmd”           chown:改变所有者            chmod:改变权限。rwx分别对应了读4写2执行1,不操作的使用-替代。一个文件有三组rwx的值，对应所有者、关联的用户组和其他人的权限。       chmod  owner/group/world  +/-  rwx   chmod  777           df:获取磁盘使用情况。-h            su -l :切换设备权限到root            ldconfig：更新系统共享库缓存       查看操作   sudo netstat -tulpn | grep &lt;port_number&gt;   Linux快捷键   打开终端ctrl+alt+t           常用：              Ctrl L ：清屏       Ctrl M ：等效于回车       Ctrl C : 中断正在当前正在执行的程序                历史命令：              Ctrl P : 上一条命令，可以一直按表示一直往前翻       Ctrl N : 下一条命令       Ctrl R，再按历史命令中出现过的字符串：按字符串寻找历史命令（重度推荐）                命令行编辑：              Tab : 自动补齐（重度推荐）       Ctrl A ： 移动光标到命令行首       Ctrl E : 移动光标到命令行尾       Ctrl B : 光标后退       Ctrl F : 光标前进       Alt F : 光标前进一个单词       Alt B : 光标后退一格单词       Ctrl ] : 从当前光标往后搜索字符串，用于快速移动到该字符串       Ctrl Alt ] : 从当前光标往前搜索字符串，用于快速移动到该字符串       Ctrl H : 删除光标的前一个字符       Ctrl D : 删除当前光标所在字符       Ctrl K ：删除光标之后所有字符       Ctrl U : 清空当前键入的命令       Ctrl W : 删除光标前的单词(Word, 不包含空格的字符串)       Ctrl \\ : 删除光标前的所有空白字符       Ctrl Y : 粘贴Ctrl W或Ctrl K删除的内容       Alt . : 粘贴上一条命令的最后一个参数（很有用）       Alt [0-9] Alt . 粘贴上一条命令的第[0-9]个参数       Alt [0-9] Alt . Alt. 粘贴上上一条命令的第[0-9]个参数       Ctrl X Ctrl E : 调出系统默认编辑器编辑当前输入的命令，退出编辑器时，命令执行                其他：              Ctrl Z : 把当前进程放到后台（之后可用’‘fg’‘命令回到前台）       Shift Insert : 粘贴（相当于Windows的Ctrl V）       在命令行窗口选中即复制       在命令行窗口中键即粘贴，可用Shift Insert代替       Ctrl PageUp : 屏幕输出向上翻页       Ctrl PageDown : 屏幕输出向下翻页           #  ","categories": ["编程"],
        "tags": [],
        "url": "/%E7%BC%96%E7%A8%8B/Linux%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/",
        "teaser": null
      },{
    "title": "按年份归档",
    "excerpt":"","url": "https://honest.github.io/archive/posts/"
  },{
    "title": "按分类归档",
    "excerpt":"","url": "https://honest.github.io/archive/categories/"
  }]
