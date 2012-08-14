/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

/*jslint nomen: true */

/*global YUI: true, window: true, document: true, navigator: true*/

'use strict';

YUI.add('newsfeedappbinderindex', function (Y, NAME) {

    Y.namespace('mojito.binders')[NAME] = {

        init: function (mp) {

            var preventDefaultScroll;

            this.mp = mp;
            this.titles = null;
            this.scrollable = null;
            this.height = NaN;
            this.width = NaN;
            this.horizSwiper = null;
            this.vertSwiper = null;

            /* This code prevents users from dragging the page */
            preventDefaultScroll = function (event) {
                event.preventDefault();
                window.scroll(0, 0);
                return false;
            };
            document.addEventListener('touchmove', preventDefaultScroll, false);

            /* Bug fix for apple CSS3 flicker when scroll */
            if (navigator.vendor.slice(0, 5) === 'Apple') {
                Y.one('head').append('<style>' +
                        '.horizontal, .screen, .vertical, .content li {' +
                        '-webkit-transition-duration: 0;' +
                        '-webkit-transform: translate3d(0,0,0);' +
                        '}' +
                        '</style>'
                    );
            }
        },

        bind: function (node) {

            var self = this,
                supportsOrientationChange,
                orientationEvent,
                resizeFunc;

            self.titles = node.one('.titles');
            self.scrollable = node.one('.horizontal');

            /*
             * Add a scrollview to the screens
             */
            self.setScreenSize(node, function () {
                self.addScrollviews(node, self.changeTitle, function () {
                    Y.log('Scrollviews added');
                });
            });

            /*
             * Add click handler to titles
             */
            self.titles.delegate('click', function (e) {

                var srceen = e.currentTarget.getAttribute('data-screen');

                e.preventDefault();

                /*
                 * Update the user before we do anything
                 */
                self.changeTitle(self.titles, srceen);

                setTimeout(function () {
                    Y.fire('scroll-to', srceen);
                }, 0);

            }, 'a');

            /*
             * Listen for screen size changes
             *
             * Detect whether device supports orientationchange event, otherwise fall back to the resize event.
             */
            supportsOrientationChange = typeof window.onorientationchange !== 'undefined';
            orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

            resizeFunc = function () {
                self.setScreenSize(node, function () {
                    // self.horizSwiper.set('width', self.width);
                    self.vertSwiper.set('height', self.height);
                    Y.one(window).once(orientationEvent, resizeFunc);
                });
            };

            Y.one(window).once(orientationEvent, resizeFunc);
        },

        setScreenSize: function (node, cb) {

            var self = this,
                titleHeight;

            titleHeight = parseInt(self.titles.getStyle('height'), 10);

            self.height = parseInt(node.get('winHeight'), 10) - titleHeight;
            self.width = parseInt(node.get('winWidth'), 10);

            self.scrollable.setStyle('height', (self.height) + 'px');

            // Now tell all the children what width they should be
            node.all('.screen').each(function (item) {
                item.setStyle('width', (self.width) + 'px');
                item.setStyle('height', (self.height) + 'px');
            });

            cb();
        },

        changeTitle: function (titles, currPage) {

            titles.get('children').removeClass('current');
            titles.get('children').item(currPage).addClass('current');
        },

        _addScrollviews: function (node, onChange, cb) {

            var self = this;

            self.vertSwiper = new Y.ScrollView({
                srcNode: ".vertical",
                height: this.height,
                bounce: false
                // flick: {
                //     minDistance: 40,
                //     minVelocity: 0.5,
                //     axis: "y"
                // }
            });

            self.vertSwiper.plug(Y.Plugin.ScrollViewScrollbars);
            self.vertSwiper.scrollbars.show();

            self.vertSwiper.render();

            Y.on('more-data', function () {
                self.vertSwiper.syncUI();
            });
        },

        addScrollviews: function (node, onChange, cb) {

            var self = this,
                startX,
                startY,
                screens,
                vertContentArea,
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

            self.horizSwiper = new Y.ScrollView({
                srcNode: this.scrollable,
                width: this.width,
                bounce: false,
                flick: {
                    minDistance: 40,
                    minVelocity: 0.5,
                    axis: 'x'
                }
            });

            // Add pages
            self.horizSwiper.plug(Y.Plugin.ScrollViewPaginator, {
                selector: '.screen'
            });

            self.horizSwiper.render();

            self.vertSwiper = new Y.ScrollView({
                srcNode: ".vertical",
                height: this.height,
                bounce: false,
                flick: {
                    minDistance: 40,
                    minVelocity: 0.5,
                    axis: "y"
                }
            });

            overrideGMS(self.vertSwiper, function (e) {
                startX = e.pageX;
                startY = e.pageY;
            });

            overrideGM(self.vertSwiper, function (e) {
                if (!self.horizSwiper.get("disabled") && (Math.abs(e.pageX - startX) < Math.abs(e.pageY - startY))) {
                    self.horizSwiper.set("disabled", true);
                }
            });

            overrideGME(self.vertSwiper, function (e) {
                self.horizSwiper.set("disabled", false);
                self.vertSwiper.set("disabled", false);
            });

            vertContentArea = self.vertSwiper.get("contentBox");

            vertContentArea.delegate("click", function (e) {
                // Prevent links from navigating as part of a scroll gesture
                if (Math.abs(self.vertSwiper.lastScrolledAmt) > 2) {
                    e.preventDefault();
                }
            }, "a");

            vertContentArea.delegate("mousedown", function (e) {
                // Prevent default anchor drag behavior, on browsers which let you drag anchors to the desktop
                e.preventDefault();
            }, "a");

            // Add Scrollbars
            self.vertSwiper.plug(Y.Plugin.ScrollViewScrollbars);
            self.vertSwiper.scrollbars.show();

            self.vertSwiper.render();

            // Here we grab all the screens and cache them
            screens = node.all(".screen");
            CACHED_VERT_CONTENT = [];

            screens.each(function (node, i) {
                CACHED_VERT_CONTENT.push(node.one(".content"));
            });

            self.horizSwiper.pages.on("indexChange", function (e) {

                // Let the DOM update before we do anything more
                setTimeout(function () {
                    var lastPage = parseInt(e.prevVal, 10),
                        currPage = parseInt(e.newVal, 10),
                        newContainer;

                    self.vertSwiper.get("boundingBox").get("parentNode").append(CACHED_VERT_CONTENT[lastPage]);
                    self.vertSwiper.get("contentBox").append(CACHED_VERT_CONTENT[currPage]);

                    newContainer = node.one("#screen" + currPage + " .frame");
                    newContainer.insert(self.vertSwiper.get("boundingBox"));

                    self.vertSwiper.scrollTo(0, 0); // re-set the scrollview to the top

                    self.vertSwiper.syncUI();

                    onChange(self.titles, currPage);

                    // Let the DOM update and then tell the next
                    // view to load if it's not loaded.
                    setTimeout(function () {
                        Y.fire('run-jit-for-screen' + (currPage));
                        Y.fire('run-jit-for-screen' + (currPage + 1));
                        Y.fire('run-jit-for-screen' + (currPage - 1));
                    }, 0);
                });
            });

            Y.on('more-data', function () {
                self.vertSwiper.syncUI();
            });

            Y.on('scroll-to', function (position) {

                self.horizSwiper.pages.scrollTo(position, '0.5', 'ease-in');

                /*
                 * This is required to trigger the "indexChange" event.
                 */
                self.horizSwiper.pages.set('index', position);
            });

            cb();
        }
    };

}, '0.0.1', {
    requires: ['mojito-client', 'node', 'scrollview', 'scrollview-paginator', 'scrollview-scrollbars']
});
