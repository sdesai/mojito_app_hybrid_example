/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */
/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('newsfeedbinderindex', function(Y, NAME) {

    Y.namespace('mojito.binders')[NAME] = {

        list: null,

        updating: false,

        init: function(mp) {
            this.mp = mp;
        },

        bind: function(node) {

            var self = this;

            self.list = node.one('ul');

            self.fillToBottom(node);

            Y.on('scroll', function (e) {
                self.atBottom(e.target);
            });
        },

        fillToBottom: function (node) {

            var self = this,
                height = node.get('winHeight'),
                footer;

            /*
             * We do this as "node" is not standard
             */
            Y.use('node', function (YY) {

                do {
                    self.atBottom(node);
                    footer = parseInt(YY.one('.footer').getY()) - 20;
                } while (footer <= height)

            });
        },

        atBottom: function (node) {

            var self = this,
                top,
                bottom,
                footer;

            if (self.updating === true) {
                return;
            }

            top = node.get('docScrollY');
            bottom = top + node.get('winHeight');

            /*
             * We do this as "node" is not standard
             */
            Y.use('node', function (YY) {

                footer = parseInt(YY.one('.footer').getY()) - 20;

//self.debug(bottom + ' ' + footer);

                if (bottom >= footer) {
                    self.updating = true;
                    self.loadMore(self.list, function () {
                        self.updating = false;
                    });
                }
            });
        },

        loadMore: function (list, cb) {

            var params = {
                    body: {
                        offset: list.get('children').size()
                    }
                };

            this.mp.invoke('feed', {params: params}, function (err, data) {

                if (err || !data) {
                    Y.one('.footer').remove();
                    return;
                }

                list.append(data);
                cb();
            })
        },

        debug: function (data) {

            if (!Y.one('.debug')) {
                Y.one('body').append('<div class="debug"></div>');
            }

            Y.one('.debug').setContent(data);
        }

    };

}, '0.0.1', {requires: ['mojito-client']});
