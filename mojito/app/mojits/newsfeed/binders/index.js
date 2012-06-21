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
//                deceleration: 0.8,
                flick: {
                    minDistance: 10,
                    minVelocity: 0.3,
                    axis: "y"
                },
                height: node.get('winHeight') + 'px' // HACK
            });

            // ---- //

                /* Allow vertical swipe to scroll page */
                scrollview._prevent.move = false;

                /* Wiggle Fix */
                var bb = scrollview.get("boundingBox");

                bb.on("gesturemovestart", function(e) {

                    var origXY = [e.pageX, e.pageY];

                    // Figure out direction on first move event, and then detach
                    bb.once("gesturemove", function(e) {

                        var currXY = [e.pageX, e.pageY],
                            xMove = Math.abs(currXY[0] - origXY[0]),
                            yMove = Math.abs(currXY[1] - origXY[1]);

                        if (xMove > yMove) {
                            e.preventDefault();
                        }
                    });
                });
                /* End Wiggle Fix*/

            scrollview.render();
        }
    };

}, '0.0.1', {requires: ['mojito-client', 'node', 'scrollview']});
