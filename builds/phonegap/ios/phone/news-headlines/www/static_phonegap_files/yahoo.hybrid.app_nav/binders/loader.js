/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

/*jslint nomen: true */

/*global YUI: true, window: true, document: true*/

'use strict';

YUI.add('newsfeedappbinderloader', function (Y, NAME) {

    Y.namespace('mojito.binders')[NAME] = {

        init: function (mp) {
            this.mp = mp;
        },

        bind: function (node) {
            this.mp.invoke('index', {}, function (err, html) {

                if (err) {
                    console.log(err || html || 'No data given.');
                    alert('An error has occurred. Please reload the page and try again.');
                    return;
                }

                node.replace(html);
            });
        }
    };

}, '0.0.1', {
    requires: ['mojito-client']
});
