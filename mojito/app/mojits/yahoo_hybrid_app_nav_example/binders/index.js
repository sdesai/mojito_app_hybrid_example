/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

/*jslint nomen: true */

/*global YUI: true, window: true, document: true*/

'use strict';

YUI.add('newsfeedappbinderindex', function (Y, NAME) {

    Y.namespace('mojito.binders')[NAME] = {

        init: function (mp) {

            this.mp = mp;
            this.scrollable = null;
            this.height = NaN;
            this.width = NaN;

            /* This code prevents users from dragging the page */
            var preventDefaultScroll = function (event) {
                event.preventDefault();
                window.scroll(0, 0);
                return false;
            };
            document.addEventListener('touchmove', preventDefaultScroll, false);
        },

        bind: function (node) {

            var self = this;

            self.scrollable = Y.one('.horizontal');

            self.setScreenSize(node, function () {

                // Now tell all the children what width they should be
                node.all('.screen').each(function (item) {
                    item.setStyle('width', (self.width) + 'px');
                });

                self.addScrollviews(node, function () {
                    Y.log('Scrollviews added');
                });
            });
        },

        setScreenSize: function (node, cb) {

            var self = this;

            self.height = parseInt(node.get('winHeight'), 10);
            self.width = parseInt(node.get('winWidth'), 10);

            self.scrollable.setStyle('height', (self.height) + 'px');

            cb();
        },

        addScrollviews: function (node, cb) {

            var horizSwiper,
                vertSwiper,
                startX,
                startY,
                screens,
                CACHED_VERT_CONTENT;

            function overrideGMS(sv, customCode) {
                var orig = sv._onGestureMoveStart;

                sv._onGestureMoveStart = function (e) {
                    customCode.apply(this, arguments);
                    orig.apply(this, arguments);
                };
            }

            function overrideGM(sv, customCode) {
                var orig = sv._onGestureMove;

                sv._onGestureMove = function (e) {
                    customCode.apply(this, arguments);
                    orig.apply(this, arguments);
                };
            }

            function overrideGME(sv, customCode) {
                var orig = sv._onGestureMoveEnd;

                sv._onGestureMoveEnd = function (e) {
                    customCode.apply(this, arguments);
                    orig.apply(this, arguments);
                };
            }

            horizSwiper = new Y.ScrollView({
                srcNode: this.scrollable,
                width: this.width,
                flick: {
                    minDistance: 40,
                    minVelocity: 0.5,
                    axis: 'x'
                }
            });

            horizSwiper.plug(Y.Plugin.ScrollViewPaginator, {
                selector: '.screen'
            });

            horizSwiper.render();

            vertSwiper = new Y.ScrollView({
                srcNode: ".vertical",
                height: this.height,
                flick: {
                    minDistance: 40,
                    minVelocity: 0.5,
                    axis: "y"
                }
            });

            overrideGMS(vertSwiper, function (e) {
                startX = e.pageX;
                startY = e.pageY;
            });

            overrideGM(vertSwiper, function (e) {
                if (!horizSwiper.get("disabled") && (Math.abs(e.pageX - startX) < Math.abs(e.pageY - startY))) {
                    horizSwiper.set("disabled", true);
                }
            });

            overrideGME(vertSwiper, function (e) {
                horizSwiper.set("disabled", false);
                vertSwiper.set("disabled", false);
            });

            vertSwiper.render();

            // Here we grab all the screens and cache them
            screens = node.all(".screen");
            CACHED_VERT_CONTENT = [];

            screens.each(function (node, i) {
                CACHED_VERT_CONTENT.push(node.one(".content"));
            });

            horizSwiper.pages.on("indexChange", function (e) {

                var lastPage = e.prevVal,
                    currPage = e.newVal,
                    newContainer;

                vertSwiper.get("boundingBox").get("parentNode").append(CACHED_VERT_CONTENT[lastPage]);
                vertSwiper.get("contentBox").append(CACHED_VERT_CONTENT[currPage]);

                newContainer = node.one("#screen" + currPage + " .frame");
                newContainer.insert(vertSwiper.get("boundingBox"));

                vertSwiper.syncUI();
            });

            cb();
        }
    };

}, '0.0.1', {
    requires: ['mojito-client', 'node', 'scrollview-base', 'scrollview-paginator']
});
