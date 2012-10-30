Routr = (function(){ var

    routes = {},

    r = function(uri, actions) {
        console.log('r', uri, actions);
        routes[uri] = actions;
    },

    getAction = function(request) {
        console.log('getAction', request);
        return routes[request.r][request.m];
    },

    incoming = function(request) {
        console.log('incoming', request);
        getAction(request)(request);
    }

    return {
        r: r,
        incoming: incoming
    }
})();

Routr.r('items/', {
    get: function(req) {
      Items.reset(req.data);
    },
    put: function(req) {
      //console.log('Routr','put',req);
    }
});

var Store = function() {
  this.ops = ['create','read','update','delete'];
  this.socket.on('error', function(res) {
    console.error(res);
  });
  this.socket.on('rest', Routr.incoming);
};

_.extend(Backbone.Collection.prototype, Backbone.Events, {

  fetch: function(options) {
    options || (options = {});
    var collection = this;
    var success = options.success;
    options.success = function(resp) {
      collection[options.add ? 'add' : 'reset'](resp, options);
      if (success) success(collection, resp);
    };
    return (this.sync || Backbone.sync).call(this, 'read', this, options);
  }

});

_.extend(Store.prototype, {

  socket : io.connect(),

  requests: {},

  uri: function(model) {
    return model.url() + (model.id ? '/'+model.id : '');
  },

  event: function(method, model, callbacks) {
    rid = method + ':' + this.uri(model);
    if (!!this.requests[rid]) return false;
    this.requests[rid] = callbacks;
    return rid;
  },

  request: function(method, model) {
    var data = {
      m: method,
      // r: this.uri(model),
      r: model.url(),
      data: model.attributes || null
    };
    this.socket.emit('rest', data);
  },

  done: function(event) {
    self = this;
    return function(data) {
      if (data)
        self.requests[event].success(data);
      else
        self.requests[event].error(data);
      delete self.requests[event];
    }
  },

  create: function(model, options) {
    e = this.event('put', model, options);
    if (!e) return;
    this.request('put', model, e);
  },

  update: function(model, options) {

  },

  read: function(model, options) {
    this.request('get', model);
  },

  'delete': function(model, options) {
    // console.log("DELETE");
    this.request('delete', model);
    // model.set({content:'asdfasdfasdf',done:true});
  }

});

Backbone.sync = function(method, model, options) {
  console.log('sync: ', arguments);
  var store = model.store || model.collection.store;
  if (!_.contains(store.ops,method)) return;
  store[method](model, options);
};