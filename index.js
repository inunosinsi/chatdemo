const port = "8080";
const fs = require("fs");
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

//const io = require("socket.io").listen(server);
