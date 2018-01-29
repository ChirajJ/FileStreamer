var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
//var stream = require('stream');
var EventEmitter =  require('events').EventEmitter;
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var customEvent = new EventEmitter();

app.set('view engine', 'ejs');

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res){

    res.render('index');
});

app.get('/sdata', function(req, res){
    
    console.log('get Data');
    const instream  = fs.createReadStream('./files/small.file', {
        flags: 'r',
        encoding: 'utf-8',
        fd: null,
        bufferSize: 1
    });
    var line = '';
    //Right now it instreams partially only
    instream.on('data', function(chunk){
        instream.pause();
        console.log(chunk);
        res.send(chunk);
    });
});

app.get('/hdata', function(req, res){
    
    console.log('get Data');
    const instream  = fs.createReadStream('./files/huge.file', {
        flags: 'r',
        encoding: 'utf-8',
        fd: null,
        bufferSize: 1
    });
    instream.pipe(res);
    
});

var port = process.env.PORT || 3000;

server.listen(port, function(req, res){
    console.log('Server served at port '+port);
});

io.sockets.on('connection', function(socket){

    var query = socket.handshake.query;

    console.log('Connection Established with type ', query.type);
    
    const instream  = fs.createReadStream('./files/'+query.type+'.file', {
        flags: 'r',
        encoding: 'utf-8',
        fd: null,
        bufferSize: 1
    });
    var line = '';

    instream.on('data', function(chunk){
        instream.pause();
        console.log('---------------');
        socket.emit('result', chunk);
    });

    socket.on('continue', function(){

        console.log('**************');
        console.log("Huge Stream...");
        instream.resume();
    });


    instream.addListener('data', function(chunk){
        instream.pause();
        if(chunk == '\n'){
            console.log(line);
            line='';
        }else{
            line+=chunk;
        }
    });

});