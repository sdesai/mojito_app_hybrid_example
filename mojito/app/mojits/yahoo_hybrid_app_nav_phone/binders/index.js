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
            this.titles = null;
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

            self.titles = node.one('.titles');
            self.scrollable = node.one('.horizontal');

            /*
             * Add a scrollview to the screens
             */
            self.setScreenSize(node, function () {

                // Now tell all the children what width they should be
                node.all('.screen').each(function (item) {
                    item.setStyle('width', (self.width) + 'px');
                    item.setStyle('height', (self.height) + 'px');
                });

                self.addScrollviews(node, self.changeTitle, function () {
                    Y.log('Scrollviews added');
                });
            });

            /*
             * Add click handler to titles
             */
            self.titles.delegate('click', function (e) {

                var srceen = e.currentTarget.getAttribute('data-screen');

                /*
                 * Update the user before we do anything
                 */
                self.changeTitle(self.titles, srceen);

                setTimeout(function () {
                    Y.fire('scroll-to', srceen);
                }, 0);

            }, 'a');
        },

        setScreenSize: function (node, cb) {

            var self = this,
                titleHeight;

            titleHeight = parseInt(self.titles.getStyle('height'), 10);

            self.height = parseInt(node.get('winHeight'), 10) - titleHeight;
            self.width = parseInt(node.get('winWidth'), 10);

            self.scrollable.setStyle('height', (self.height) + 'px');

            cb();
        },

        changeTitle: function (titles, currPage) {

            titles.get('children').removeClass('current');
            titles.get('children').item(currPage).addClass('current');
        },

        addScrollviews: function (node, onChange, cb) {

            var self = this,
                horizSwiper,
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
                bounce: false,
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
                bounce: false,
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

                vertSwiper.scrollTo(0, 0); // re-set the scrollview to the top

                onChange(self.titles, currPage);

            });

            Y.on('more-data', function () {
                vertSwiper.syncUI();
            });

            Y.on('scroll-to', function (position) {
                horizSwiper.pages.scrollTo(position, '0.5', 'ease-in');

                /*
                 * This is required to trigger the "indexChange" event.
                 */
                horizSwiper.pages.set('index', position);
            });

            cb();
        }
    };

}, '0.0.1', {
    requires: ['mojito-client', 'node', 'scrollview-base', 'scrollview-paginator']
});
