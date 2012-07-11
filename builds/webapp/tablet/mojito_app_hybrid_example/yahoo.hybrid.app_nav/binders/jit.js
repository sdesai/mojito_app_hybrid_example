/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

/*jslint nomen: true */

/*global YUI: true, window: true, document: true*/

'use strict';

YUI.add('newsfeedappbinderjit', function (Y, NAME) {

    Y.namespace('mojito.binders')[NAME] = {

        init: function (mp) {
            this.mp = mp;
        },

        bind: function (node) {

            var self = this,
                handler,
                params = {
                    body: {
                        config: Y.JSON.parse(node.getAttribute('data-jit'))
                    }
                };

            handler = Y.on('run-jit-for-screen' + params.body.config.screenId, function () {
                handler.detach();
                self.mp.invoke('runJit', {params: params}, function (err, html) {
                    node.replace(html || err);
                    Y.fire('more-data');
                });
            });
        }
    };

}, '0.0.1', {
    requires: ['mojito-client']
});
