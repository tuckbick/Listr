
/**
 * Module dependencies.
 */

var   io = require('socket.io')
    , express = require('express')
    , mongoose = require('mongoose')
    , Schema = mongoose.Schema
    // , db = mongoose.connect('mongodb://localhost/sharp-light-9215')
    , db = mongoose.connect('mongodb://heroku:214d06765672424e2b6b460532ed1749@staff.mongohq.com:10026/app1764458')
    , app = express.createServer()
    , io = io.listen(app);

var ListItem = mongoose.model('ListItem', new Schema({
      content   : { type: String, required: true }
    , date      : { type: Date, default: Date.now }
    , done      : { type: Boolean, default: false }
}));

// Configuration

app.configure(function(){
    // app.settings.env = "dev";
    // app.settings.env = "live-dev";
    app.settings.env = "live";
    app.set('view engine', 'html');
    app.set('heartbeat interval',3000);
    app.register(".html", require('jqtpl').express);
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});

app.configure('dev', function(){
    app.set('views', __dirname + '/dev/views');
    app.use(express.static(__dirname + '/dev/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('live-dev', function(){
    app.set('views', __dirname + '/publish/views');
    app.use(express.static(__dirname + '/publish/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('live', function(){
    app.set('views', __dirname + '/publish/views');
    app.use(express.static(__dirname + '/publish/public'));
    app.use(express.errorHandler());
    app.enable('browser client etag');
});



// Routes

app.get('/', function(req, res){
    res.render('index', {
        title: 'Listr'
    });
});



// Fire it up

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);



// Utils

Util = {
    isEmpty: function(str) {
        return !(str+"").match(/\S/);
    }
};



// A Simple Router

Routr = (function(){ var

    socket,
    routes = {},

    r = function(uri, actions) {
        console.log('r',arguments);
        routes[uri] = actions;
    },

    getAction = function(request) {
        console.log('getAction',arguments);
        return routes[request.r][request.m];
    },

    incoming = function(request) {
        console.log('incoming',arguments);
        var action = getAction(request);
        action(request, mongoose);
    },

    package = function(request, result) {
        console.log('package',arguments);
        request.data = result;
        return request;
    },

    handleResult = function(request) {
        console.log('handleResult',arguments);
        return function(err,docs) {
            return respond(request, docs);
        }
    },

    respond = function(request, result) {
        var response = package(request, result);
        console.log('respond',response);
        if (request.m === 'get' || request.m === 'put') {
            io.sockets.socket(Routr.socket.id).emit('rest',response);
            return;
        }
        Routr.socket.broadcast.emit('rest',response);
    }

    return {
        r: r,
        incoming: incoming,
        handleResult: handleResult
    }
})();


// Routes

Routr.r('items/', {
    get: function(req, mon) {
        ListItem.find({}).fields('content done').sort('date',1).run(Routr.handleResult(req));
    },
    put: function(req, mon) {
        new ListItem(req.data).save(Routr.handleResult(req));
    },
    delete: function(req, mon) {
        console.log('delete', req);
        ListItem.findById(req.data._id).remove( /* Routr.handleResult(req) */ );
    }
});


// Socket comm

io.sockets.on('connection', function (socket) {
    Routr.socket = socket;
    socket.on('rest', Routr.incoming);
});

