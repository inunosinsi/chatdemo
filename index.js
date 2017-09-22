const port = "8080";
const fs = require("fs");
const server = require("http").createServer();
server.on("request", function(request, response){
	let fileName;
	switch(request.url){
		case "/chat":
			fileName = "chat";
			break;
		default:
			fileName = "index";
	}
	var stream = fs.createReadStream("template/" + fileName + ".html");
	response.writeHead(200, {"Content-Type":"text/html"});
	stream.pipe(response);
});
server.listen(port);
console.log("create server : " + port);

//const io = require("socket.io").listen(server);
