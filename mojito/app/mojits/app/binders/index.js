/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

/*global YUI: true, window: true, document: true*/

'use strict';

YUI.add('newsfeedappbinderindex', function (Y, NAME) {

    Y.namespace('mojito.binders')[NAME] = {

        init: function (mp) {

            this.mp = mp;
            this.scrollable = null;
            this.height = NaN;
            this.width = NaN;
            this.position = 0;

            /* This code prevents users from dragging the page */
            var preventDefaultScroll = function (event) {
                event.preventDefault();
                window.scroll(0, 0);
                return false;
            };
            document.addEventListener('touchmove', preventDefaultScroll, false);
        },

        bind: function (node) {

            var self = this,
                scrollview;

            self.scrollable = node.one(".scrollable");

            // First make sure we have the screen size set right
            self.setScreenSize(node, function () {

                // Now tell all the children what size they should be
                node.all('li.page').each(function (item) {
                    item.setStyle('height', (self.height - 4) + "px");
                    item.setStyle('width', (self.width) + "px");
                });

                /* Create the scrollview */
                scrollview = new Y.ScrollView({
                    srcNode: self.scrollable,
                    bounce: 0,
//                    deceleration: 0.8,
                    flick: {
                        minDistance: 10,
                        minVelocity: 0.3,
                        axis: "x"
                    },
                    width: (self.width) + "px" // 4px deduction for some reason
                });

                /* Plug in pagination support */
                scrollview.plug(Y.Plugin.ScrollViewPaginator, {
                    selector: 'li.page' // elements definining page boundaries
                });

                scrollview.render();
            });
        },

        setScreenSize: function (node, cb) {

            var self = this;

            self.height = parseInt(node.get('winHeight'), 10);
            self.width = parseInt(node.get('winWidth'), 10);

            self.scrollable.setStyle('height', (self.height) + "px");
            self.scrollable.setStyle('width', (self.width * node.all('li.page').size()) + "px");

            cb();
        }
    };

}, '0.0.1', {requires: ['mojito-client', 'node', 'transition', 'scrollview', 'scrollview-paginator']});
