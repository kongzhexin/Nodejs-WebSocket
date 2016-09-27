var http =require('http');
var server =http.createServer(function (req,res) {
    res.writeHead(200,{'Content-Type':'text/html'});
    res.end('<h1>Hello Socket Lover!</h1>');
});
var   io =require('socket.io')(server);

server.listen(8080);
//--------------------------------
var onlineUsers ={};
var onlineCount =0;

io.on('connection',function (socket) {
    console.log('a user connected');
    socket.on('login',function (obj) {
        socket.name =obj.userid;

        if(!onlineUsers.hasOwnProperty(obj.userid)){
            onlineUsers[obj.userid] = obj.username;
            onlineCount ++;
        }
        //给登录事件发送一个数据对象 用户信息
        io.emit('login',{onlineUsers:onlineUsers,onlineCount:onlineCount,user:obj});
        console.log(obj.username+'加入了聊天室')
    });
    socket.on('disconnect',function(){
        //退出用户
        if(onlineUsers.hasOwnProperty(socket.name)) {
            //退出用户的信息
            var obj = {userid:socket.name, username:onlineUsers[socket.name]};

            //删除
            delete onlineUsers[socket.name];
            //在线人数-1
            onlineCount--;

            //向所有客户端广播用户退出
            io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
            console.log(obj.username+'退出了聊天室');
        }
    });
    socket.on('message',function (obj) {
        io.emit('message',obj);
        console.log(obj.username+'说' +obj.content)
    })
});


