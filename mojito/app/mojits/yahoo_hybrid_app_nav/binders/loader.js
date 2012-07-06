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

            var self = this,
                viewHeight = node.get('winHeight'),
                backgroundAnim;

            backgroundAnim = new Y.Anim({
                node: 'html',
                to: {
                    backgroundColor: '#333'
                }
            });

            backgroundAnim.on('end', function () {

                var height;

                node = Y.one(node);

                height = parseInt(node.getStyle('height'), 10);

                node.setStyle('margin-top', ((viewHeight / 2) - (height / 2)) + 'px');

                node.setStyle('display', 'block');

                self.mp.invoke('index', {}, function (err, html) {
                    node.replace(html);
                });
            });

            backgroundAnim.run();
        }
    };

}, '0.0.1', {
    requires: ['mojito-client', 'node', 'anim']
});
