/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */
/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('newsfeedbinderindex', function(Y, NAME) {

    Y.namespace('mojito.binders')[NAME] = {

        init: function(mp) {
            this.mp = mp;
        },

        bind: function(node) {

            var scrollview;

            /* Create the scrollview */
            scrollview = new Y.ScrollView({
                srcNode: node,
                height: node.get('winHeight') + 'px' // HACK
            });

            scrollview.render();
        }
    };

}, '0.0.1', {requires: ['mojito-client', 'node', 'scrollview']});
