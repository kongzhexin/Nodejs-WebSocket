/**
 * Created by kongzx on 2016/8/16.
 */
+function () {
    var d = document,
        w = window,
        p = parseInt,
        dd = d.documentElement,
        db = d.body,
        dc = d.compatMode=='CSS1Compat', //获取浏览器的渲染模式
        dx = dc ?dd :db,
        ec = encodeURIComponent;
    w.CHAT ={
        msgobj : d.getElementById("message"),
        screenheight :w.innerHeight ? w.innerHeight : dx.clientHeight,
        username : null,
        userid : null,
        socket : null,
        scrollToBottom:function () {
            w.scrollTo(0,this.msgobj.clientHeight);
        },
        logout:function () {
            location.reload();
        },
        submit:function(){
            var content = d.getElementById("content").value;
            if(content != ''){
                var obj = {
                    userid: this.userid,
                    username: this.username,
                    content: content
                };
                this.socket.emit('message', obj);
                d.getElementById("content").value = '';
            }
            return false;
        },
        getUid :function () {
            return new Date().getTime() +""+Math.floor(Math.random()*899+100);
        },
        updateSysMsg:function (o,action) {
            //当前在线用户列表
            var onlineUsers = o.onlineUsers;
            //当前在线人数
            var onlineCount = o.onlineCount;
            //新加入用户的信息
            var user = o.user;

            //更新在线人数
            var userhtml = '';
            var separator = '';
            for(key in onlineUsers) {
                if(onlineUsers.hasOwnProperty(key)){
                    userhtml += separator+onlineUsers[key];
                    separator = '、';
                }
            }
            d.getElementById("onlinecount").innerHTML = '当前共有 '+onlineCount+' 人在线，在线列表：'+userhtml;

            //添加系统消息
            var html = '';
            html += '<div class="msg-system">';
            html += user.username;
            html += (action == 'login') ? ' 加入了聊天室' : ' 退出了聊天室';
            html += '</div>';
            var section = d.createElement('section');
            section.className = 'system J-mjrlinkWrap J-cutMsg';
            section.innerHTML = html;
            this.msgobj.appendChild(section);
            this.scrollToBottom();
        },
        usernameSubmit : function () {
            var username =d.getElementById("username").value;
            if(username != ""){
                d.getElementById("username").value = '';
                d.getElementById("loginbox").style.display = 'none';
                d.getElementById("chatbox").style.display = 'block';
                this.init(username);
            }
            return false;
        },
        init:function (username) {

            this.userid = this.getUid();
            this.username = username;
            d.getElementById("showusername").innerHTML =this.username;
            this.msgobj.style.minHeight = (this.screenheight - db.clientHeight + this.msgobj.clientHeight) + "px";
            this.scrollToBottom();

            //连接socket
            this.socket = io.connect('http://localhost:8080');
            this.socket.emit('login',{userid :this.userid,username :this.username})

            this.socket.on('login',function (o) {
                CHAT.updateSysMsg(o,'login');
            });
            this.socket.on('logout',function (o) {
                CHAT.updateSysMsg(o,'logout');
            });
            this.socket.on('message',function (obj) {
                var isme = (obj.userid == CHAT.userid)?true:false;
                var contentDiv = '<div>'+obj.content+'</div>';
                var usernameDiv = '<span>'+obj.username+'</span>';

                var section = d.createElement('section');
                if(isme){
                    section.className = 'user';
                    section.innerHTML = contentDiv + usernameDiv;
                } else {
                    section.className = 'service';
                    section.innerHTML = usernameDiv + contentDiv;
                }
                CHAT.msgobj.appendChild(section);
                CHAT.scrollToBottom();
            });
        }
    };
    d.getElementById("username").onkeydown = function(e) {
        e = e || event;
        if (e.keyCode === 13) {
            CHAT.usernameSubmit();
        }
    };
    d.getElementById("content").onkeydown = function(e) {
        e = e || event;
        if (e.keyCode === 13) {
            CHAT.submit();
        }
    };

}()
