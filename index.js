var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var stream = require('stream');
var EventEmitter =  require('events').EventEmitter;

var customEvent = new EventEmitter();

var app = express();

app.set('view engine', 'ejs');

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res){

    res.render('index');
});

var stream;

app.get('/sdata', function(req, res){
    
    console.log('get Data');
    stream  = fs.createReadStream('./files/small.file', {
        flags: 'r',
        encoding: 'utf-8',
        fd: null,
        bufferSize: 1
    });
    var line = '';
    //Right now it streams partially only
    stream.on('data', function(chunk){
        stream.pause();
        console.log(chunk);
        res.send(chunk);
    });
});

app.get('/hdata', function(req, res){
    
    console.log('get Data');
    const stream  = fs.createReadStream('./files/huge.file', {
        flags: 'r',
        encoding: 'utf-8',
        fd: null,
        bufferSize: 1
    });
    stream.pipe(res);
    
});

var port = process.env.PORT || 3000;

app.listen(port, function(req, res){
    console.log('Server served at port '+port);
});