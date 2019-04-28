![img](https://github.com/studendzhoujun/jun/blob/master/static/img/txx.png)

## JavaScript

* [10 things to master to become a good JavaScript Developer](developer.md)
* [git相关](git.md)
* [vue相关](vue.md)

## H5标签语义化
1. 有利于搜索引擎的抓取(SEO优化)<br/>
2. 有利于开发人员后期的维护,代码重构<br/>
3. 在没有css样式的驱动下，仍然会以一种清晰的结构出现<br/>

## cors 跨域
1. cookie跨域遵循同源策略
2. 请求跨域-jsonp-cors
3. cors前端设置`xhr.withCredentials = true`
4. cors后端设置`Access-Control-Allow-Origin--Access-Control-Allow-Credentials`
## Node.js
事件驱动，非阻塞<br/>
阻塞与非阻塞--阻塞需等待，非阻塞无需等待，但需不停询问。
## 事件驱动
事件收集器，事件发送器，事件处理器<br/>
单线程，多线程
## css3 box-shadow
box-shadow {inset 1px 1px 1px 1px color}<br/>
inset：写表示内阴影，不写表示外阴影;<br/>
第一个数字表示左右偏移；第二个数字表示上下偏移；第三个数字表示模糊度；第四个数字表示阴影范围；最后表示阴影颜色；
## http协议
http应用层<br/>
TCP 传输层<br/>
TCP/UDP<br/>
UDP的特性是：数据报，无连接，简单，不可靠，会丢包，会乱序<br/>
TCP的特性是：流式，有连接，复杂，可靠，延迟较大、带宽占用较大<br/>

## H5小游戏框架createjs
Easeljs<br/>
Tweenjs<br/>
soundjs<br/>
preloadjs<br/>

## localStorage
```
localStorage.setItem(name,value)==>设置
localStorage.getItem(name)==>获取value
localStorage.removeItem(name)==>删除指定name
localStorage.clear()==>清数据所有
```
** 优势
* 1.localStorage扩展了cookie的大小限制(5M大小)
* 2.localStorage可以将数据储存到本地可以做缓存使用

** 局限
* 1.浏览器的大小不统一,且只支持高级浏览器
* 2.浏览器在隐私模式下读取不了localStorage
* 3.读取localStorage是对字符串的读取,如果内容较大的话会消耗内存导致页面变卡

## form表单的提交
action=“要提交的地址”<br/>
method="get/post"<br/>
onsubmit=" return false/true"---阻止提交/提交

## call OR apply
```
fn.call(this,args);
fn.apply(this,[args]);
```

## 数字千分位处理
  ```
  function toThousands(num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  }
  ```