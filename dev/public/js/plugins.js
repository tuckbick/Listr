
// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console) {
    arguments.callee = arguments.callee.caller;
    var newarr = [].slice.call(arguments);
    (typeof console.log === 'object' ? log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
  }
};

// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,clear,count,debug,dir,dirxml,error,exception,firebug,group,groupCollapsed,groupEnd,info,log,memoryProfile,memoryProfileEnd,profile,profileEnd,table,time,timeEnd,timeStamp,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());


// place any jQuery/helper plugins in here, instead of separate, slower script files.
window.Util = window.Util || {
    isEmpty: function(str) {
        return !(str+"").match(/\S/);
    }
};

/*

window.Route = window.Route || {
    requests: {},
    getId: function() {
        do {
            rid = Math.random()
        } while (this.requests[rid]);
        return rid;
    },
    validate: function(req) {
        for (var arg in req) {
            if (Util.isEmpty(req[arg])) {
                console.error('Empty parameter for '+arg);
                return false;
            }
        }
        return true;
    },
    register: function(req, cb) {
        if (!this.validate(req)) return;
        req.rid = this.getId();
        this.requests[req.rid] = cb;
        this.exec(req);
    },
    exec: function(req) {
        socket.emit('rest', req);
    },
    result: function(res) {
        var cb = Route.requests[res.rid];
        delete Route.requests[res.rid];
        cb(res.res);
    }
};




window.Listr = window.Listr || {
    init: function() {
        Route.register({
            r: '/item/all',
            m: 'get'
        },function(res){
            console.log(res);
        });
    },
    disableForm: function(form) {
        form.find("[type='submit']").button('disable');
        form.find("[type='text']").textinput('disable');
    },
    enableForm: function(form) {
        form.find("[type='submit']").button('enable');
        form.find("[type='text']").textinput('enable');
    },
    clearForm: function(form) {
        form.find("[type='text']").val('');
    },
    submitForm: function(form) {
        this.disableForm(form);
        Route.register({
            r: form.attr('action'),
            m: form.attr('method'),
            d: form.find('input[name=content]').val()
        },function(res){
            console.log(res);
            Listr.clearForm(form);
            Listr.enableForm(form);
        });
    }
};




$('#home').on('pageinit',function(e1){
    $(this).find('#addItem').on('click',function(e2){
        Listr.submitForm($(this).closest('form'));
        return false;
    });
});
*/