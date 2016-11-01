
![img](https://github.com/studendzhoujun/abc/blob/master/src/images/loading-1.gif)
# JavaScript

# 10 things to master to become a good JavaScript Developer
* Number 10 How does JavaScript work?<br/>
* Number 9 How to test JavaScript?<br/>
* Number 8 How to use Chrom to your advantage?<br/>
* Number 7 What is JSON?<br/>
* Number 6 Whar is AJAX?<br/>
* Number 5 Where to find answers to your questions?<br/>
* Number 4 Who invented JavaScript?<br/>
* Number 3 What is a JavaScript Library?<br/>
* Number 2 jQuery is still this most important library.<br/>
* Number 1 How to start learning JavaScript?<br/>

# Chrome调试工具还是很不错的developer.chrome.com
* 好像要翻墙

# 通往成功的道路没有捷径,甚至会有冷嘲热讽,但是你必须相信自己,证明自己

# H5标签语义化
1. 有利于搜索引擎的抓取(SEO优化)<br/>
2. 有利于开发人员后期的维护,代码重构<br/>
3. 在没有css样式的驱动下，仍然会以一种清晰的结构出现<br/>

# 页面静态页编写的注意事项
# Node.js
事件驱动，非阻塞<br/>
阻塞与非阻塞--阻塞需等待，非阻塞无需等待，但需不停询问。
# 事件驱动
事件收集器，事件发送器，事件处理器<br/>
单线程，多线程
# css3 box-shadow
box-shadow {inset 1px 1px 1px 1px color}<br/>
inset：写表示内阴影，不写表示外阴影;<br/>
第一个数字表示左右偏移；第二个数字表示上下偏移；第三个数字表示模糊度；第四个数字表示阴影范围；最后表示阴影颜色；
# 端口即服务
把ip地址比喻为一栋楼房的话，那么端口即是进入到楼房的门；ip地址有很多的门；
# http协议
http应用层<br/>
TCP 传输层<br/>
TCP/UDP<br/>
UDP的特性是：数据报，无连接，简单，不可靠，会丢包，会乱序<br/>
TCP的特性是：流式，有连接，复杂，可靠，延迟较大、带宽占用较大<br/>

# 内嵌调试问题
## webview<br/>
## ios----safari浏览器调试<br/>
## android----chrome浏览器调试<br/>
# 正则表达式
正则表示式也叫规则表达式
# window
### W=window.innerWidth;
### H=window.innerHeight;
# H5小游戏框架createjs
Easeljs<br/>
Tweenjs<br/>
soundjs<br/>
preloadjs<br/>

# localStorage
`localStorage.setItem(name,value)==>设置<br/>
localStorage.getItem(name)==>获取value<br/>
localStorage.clear()==>清数据<br/>
`
# form表单的提交
action=“要提交的地址”<br/>
method="get/post"<br/>
onsubmit=" return false/true"---阻止提交/提交

# bind(this)
# ECMA核心解释器+DOM+BOM
# 函数命名问题
# git常用命令
git clone 地址<br/>
git status 状态<br/>
git add  添加<br/>
git commit 提交<br/>
git pull 拉新<br/>
git push 推送<br/>
git branch 分支<br/>
git checkout 切换分支<br/>
git log 日志<br/>
git reset 切版本<br/>
git merge 合并代码<br/>
# git忽略文件的创建
在所要忽略的目录下用命令工具touch .gitignore此时该目录下会生成一个文件，用vim或编辑器打开该文件，在里面设置忽略规则即可<br/>
### 此#为注释 – 将被 Git 忽略<br/>
*.a # 忽略所有 .a 结尾的文件<br/>
!lib.a # 但 lib.a 除外<br/>
/TODO # 仅仅忽略项目根目录下的 TODO 文件，不包括 subdir/TODO<br/>
build/ # 忽略 build/ 目录下的所有文件<br/>
doc/*.txt # 会忽略 doc/notes.txt 但不包括 doc/server/arch.txt<br/>
