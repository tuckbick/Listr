$(function(){

    window.Item = Backbone.Model.extend({

        // urlRoot: 'items/',
        url: function() {
            return 'items/'
        }, // TODO
        idAttribute : '_id',

        defaults: {
            content: '<none>',
            done: false
        },

        initialize: function() {
            //this.id = this.get('id');
        },

        clear: function() {
            this.destroy();
        }

    });

    window.ItemView = Backbone.View.extend({

        template: _.template($('#item-template').html()),
        tagName: 'li',
        $delete: $('<a href="#" data-role="button" class="delete"><span class="inner" aria-hidden="true"><span class="text">Delete</span><span class="icon"></span></span></a>'),

        events: {
            'vmouseover'   : 'selectItem',
            'swiperight'   : 'showDeleteOption',
            'click .delete': 'deleteItem'
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        initialize: function(options) {
            _.bindAll(this, 'remove','render');
            this.model.bind('destroy', this.remove);
            this.model.bind('change',this.render);

            this.$el = $(this.el).attr('id',options.model.get('_id'));
        },

        toggleDone: function() {

        },

        selectItem: function() {
            var $current = this.$el.siblings('.current').removeClass('current');
            $current.find('.delete').remove();
            clearTimeout($current.data('t'));
            this.$el.addClass('current');
            var self = this;
            self.$el.data('t',setTimeout(function(){
                self.$el.removeClass('current').find('.delete').remove();
            },10000));
        },

        showDeleteOption: function() {
            this.$el.append(this.$delete);
        },

        remove: function() {
            this.$el.slideUp(100,this.$el.remove);
        },

        deleteItem: function() {
            this.model.clear();
        }

    });

    window.ItemList = Backbone.Collection.extend({

        model: Item,
        url: function(){
            return 'items/'
        },
        store: new Store()

    });

    window.Items = new ItemList;

    window.AppView = Backbone.View.extend({

        el: $("body"),

        events: {
            "submit form#new_item" : "newItem"
        },

        initialize: function() {
            var self = this;
            _.bindAll(this, 'addOne', 'addAll');

            this.dialog = this.$el.find('#new');
            this.toolbar = this.$el.find('#toolbar');
            this.input = this.dialog.find('form#new_item input[name=content]');
            this.item_list = this.$el.find('#item-list');

            this.toolbar.fixedtoolbar({ tapToggle: false });
            this.dialog.on( "pageinit", function( event, data ){
                self.input.focus();
            });

            Items.bind('add',   this.addOne);
            Items.bind('reset', this.addAll);

            Items.fetch();
        },

        scrollToBottom: function() {
            var body = this.el;
            setTimeout(function() {
                scrollTo(0, body.scrollHeight);
            }, 1000);

        },

        newAttributes: function() {
            return {
                content: this.input.val(),
                done: false
            }
        },

        newItem: function(e) {
            e.preventDefault();
            console.log('new');
            var self = this;
            var attrs = this.newAttributes();
            var item =  Items.create(attrs);
            self.item_list.listview('refresh');
            self.scrollToBottom();
            // // self.$el.scrollTop = self.$el.scrollHeight;
            item.view.selectItem();
            console.log(self.dialog);
            // document.write(self.dialog);
            self.dialog.dialog('close');
            self.input.val('');
            return false;
        },

        addOne: function(item,id,col) {
            var item_view = new ItemView({model:item});
            item_view.model.view = item_view;
            this.item_list.append(item_view.render().el);
        },

        addAll: function(col,options) {
            Items.each(this.addOne);
            this.item_list.listview('refresh');
        }

    });

    window.App = new AppView;

});

$(document).bind("mobileinit", function(){
    $.event.special.swipe.horizontalDistanceThreshold = 100;
});


