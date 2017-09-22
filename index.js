const port = "8080";
const fs = require("fs");
const xssFilters = require('xss-filters');
const server = require("http").createServer();
server.on("request", function(req, res){
	let fileName;
	if(req.url.indexOf("/chat") === 0){
		fileName = "chat";
	}else{
		fileName = "index";
	}

	var stream = fs.createReadStream("template/" + fileName + ".html");
	res.writeHead(200, {"Content-Type":"text/html"});
	stream.pipe(res);
});
server.listen(port);
console.log("create server : " + port);

const io = require("socket.io").listen(server);

//namespacesを２つにしてみる
["hoge", "huga"].forEach(function(v){
	// ユーザ管理ハッシュ
	var userHash = {};

	// Namespacesを利用する
	var chatNS = io.of('/chat/' + v);
	chatNS.on("connection", function(socket){

		// Room(Namespacesで分けた時、roomも利用した方が良いみたい)
		var roomName = "default";

		// WebSocketで接続の際にどのroomに参加するか？
		socket.join(roomName);

		// 接続開始のカスタムイベント(接続元ユーザを保存し、他ユーザへ通知)
		socket.on("connected", function(name){
			var msg = name + "が入室しました";
			userHash[socket.id] = name;
			chatNS.to(roomName).emit("pushlish", {value: msg});
		});

		// メッセージ送信カスタムイベント
		socket.on("publish", function(data){
			chatNS.to(roomName).emit("publish", {value:xssFilters.inHTMLData(data.value)});
		});

		let nowTyping = 0;
		socket.on("start typing", function(){
			if (nowTyping <= 0) {
				socket.to(roomName).emit("start typing", userHash[socket.id]);
			}

			nowTyping++;
			setTimeout(function(){
				nowTyping--;
				if (nowTyping <= 0) {
					socket.to(roomName).emit("stop typing");
				}
			}, 3000);
		});

		socket.on("stop typing", function(){
			nowTyping = 0;
			socket.broadcast.emit("stop typing");
		});

		// 接続終了組み込みイベント(接続元ユーザを削除し、他ユーザへ通知)
		socket.on("disconnect", function(){
			if(userHash[socket.id]){
				var msg = userHash[socket.id] + "が退出しました";
				delete userHash[socket.id];
				chatNS.to(roomName).emit("publish", {value: msg});
			}
		});
	});
});
