var http=require('http');
var fs=require('fs');
var url=require('url');
var hostname='10.69.5.75';
var port=8000;
var server=http.createServer(function(req,res){
	var pathname=url.parse(req.url).pathname;
	var ext=pathname.match(/(\.[^.]+|)$/)[0];
	switch(ext){
		case '.css':
		case '.js':
	}
	fs.readFile('./index.html','UTF-8',function(err,data){
        if(err) throw err;
        res.writeHead(200,{'Content-Type':'text/html'});
        res.write(data);
	    //res.end('index.html');
	});
});
server.listen(port,hostname);
console.log('server running');