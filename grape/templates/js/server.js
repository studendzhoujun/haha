const express = require('express');
const router = express.Router();
const app = express();
const fs = require('fs');
const logger = require('morgan');
const argv = require('yargs').argv;

//router.use()
const header = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>静态页开发服务器</title>
    <link rel="stylesheet" type="text/css" href="//css.gomein.net.cn/plus/style/public/css/base.css?v=20170306">
</head>
<body>
`
const footer = `
</body>
</html>
`
app.use(logger('dev'));


output = 'dist'
app.use('/dist/cdn',express.static(__dirname + '/dist/cdn'));

router.get('/*', (req, res) => {
    const path = req.path;
    fs.readFile( output + '/template/' + path, (enc, data) => {
        data = String(data);
        data = data.replace(/\{GOMEUI_CDN_IP\}/g,  '/' + output + '/cdn/gomeUI');
        data = data.replace(/\{JS_CDN_IP\}/g,  '/' + output + '/cdn/js');
        data = data.replace(/\{CSS_CDN_IP\}/g, '/' + output + '/cdn/style');
        data = data.replace(/\{APP_CDN_IP\}/g, '/' + output + '/cdn/images');
        res.send(header + String(data) + footer)
    });
})

app.use('/', router);

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});