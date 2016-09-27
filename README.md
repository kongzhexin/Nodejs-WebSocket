基于Node.js和WebSocket的聊天室
===========================================================
##首先简单介绍WebSocket
  HTML5一种新的协议 ，实现了浏览器与服务器的全双工通信，一开始握手开始需要http请求完成。

###比较：
1.  comet:效率低  服务器较好的支持
2.  轮询:header非常长，有用数据可能很小的值  这样会占用很多的带宽
3.  可以更好地节省服务器资源和带宽 

###原理：
  浏览器和服务器只需要一个握手的动作，然后浏览器和服务器就形成了一个快速通道，两者之间就直接可以数据互相传送

###好处：
- Header  
  互相沟通的Header是很小的 大概2Bytes
- 服务器推送  
  服务器不在被动的接受浏览器的request之后才返回数据，而是在有新数据时就主动推送浏览器。

##准备工作
###安装node
直接从官网下载https://nodejs.org/en/
###安装socket.io 
```javascript
npm install socket.io
```
###用node写一个本地服务器
```javascript
var http =require('http');
var server =http.createServer(function (req,res) {
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end('<h1>Hello Socket Lover!</h1>');
});
var   io =require('socket.io')(server);

server.listen(8080);
```
 访问localhost:8080 可以查看到Hello Socket Lover! 说明创建成功！
