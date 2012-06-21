/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

/*global YUI: true*/

'use strict';

YUI.add('newsfeedbinderindex', function (Y, NAME) {

    Y.namespace('mojito.binders')[NAME] = {

        init: function (mp) {
            this.mp = mp;
        },

        bind: function (node) {

            var scrollview;

            /* Create the scrollview */
            scrollview = new Y.ScrollView({
                srcNode: node,
                bounce: 0,
                deceleration: 0.8,
                flick: {
                    minDistance: 10,
                    minVelocity: 0.3,
                    axis: "y"
                },
                height: node.get('winHeight') + 'px' // HACK
            });

            scrollview.render();
        }
    };

}, '0.0.1', {requires: ['mojito-client', 'node', 'scrollview']});
