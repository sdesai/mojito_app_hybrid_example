/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

/*global YUI: true*/

'use strict';

YUI.add('infinitie_feed_binder_index', function (Y, NAME) {

    // Dirty
    var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false ),
        urlsOnPage = {},
        titlesOnPage = {};

    function isScrolledIntoView(node) {

        var docViewTop,
            docViewBottom,
            elemTop,
            elemBottom;

        docViewTop = Y.one('body').get('scrollTop') || document.documentElement.scrollTop;
        docViewBottom = docViewTop + node.get('winHeight');

        elemTop = node.getY(); // pad to pre-load
        elemBottom = elemTop + parseInt(node.getStyle('height'), 10);

        // Y.log("Viewport: " + docViewTop + "x" + docViewBottom + " Node: " + elemTop + "x" + elemBottom);

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

    function isOverflowed(el){

        var curOverflow = el.style.overflow;

        if ( !curOverflow || curOverflow === "visible" )
        el.style.overflow = "hidden";

        var isOverflowing = el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;

        el.style.overflow = curOverflow;

        return isOverflowing;
    }

    /*
        HACK of DIRTY DRIT

        This whole idea need more work
    */
    function resizeItemText(node) {

        var reRun = false;

        node.all("li .card").each(function (element) {

            var img = element.one("img");

            // If we have a large image we are in signle col mode
            // and don't need to resize the text.
                
            if (!element.hasClass("resized")) {

                if (img && parseInt(img.getStyle("width")) > 140) {
                    return;
                }

                if (isOverflowed(element.getDOMNode())) {
                    if (!element.hasClass("small-text")) {
                        element.addClass("small-text");
                        reRun = true;
                    } else {
                        element.addClass("hide-text");
                        element.addClass("resized");
                    }
                } else {
                    element.addClass("resized");
                }
            }
        });

        if (reRun) {
            resizeItemText(node);
        }
    }

    function cacheOnPageKeys(node) {
        // HACK: store the urls so we can hide any dupes later!
        node.all("li").each(function (li) {
            var href = li.one("a").get("href"),
                title = li.one("a").get("text").toLowerCase().replace(/[^a-z]/g, "");
            urlsOnPage[href] = true;
            titlesOnPage[title] = true;
        });
    }

    function clearOnPageKeys() {
        // Clear what we have
        urlsOnPage = {};
        titlesOnPage = {};
    }

    Y.namespace('mojito.binders')[NAME] = {

        lastOffset: 0,

        init: function (mp) {
            this.mp = mp;
            this.limit = this.mp.config.limit;
        },

        bind: function (node) {

            var self = this,
                footer = node.one('.footer .test'),
                loading = false,
                offset = 0,
                listener,
                listenOn = ["gesturemovestart", "mousewheel", "onscroll"];

            listener = function (e) {

                if (loading === false && isScrolledIntoView(footer)) {

                    loading = true; // Stop anyone else from coming in here

                    offset = node.one('ul').get('children').size() + 1;

                    if (self.lastOffset < offset) { // TODO: or some time has passed

                        self.lastOffset = offset;

                        self.loadContent(node, offset, function () {
                            loading = false;
                        });
                    } else {
                        loading = false;
                    }
                }
            };

            node.on(listenOn, listener);

            node.one(".refresh").on("click", function () {
                // We are clearing the page so remove all current data
                clearOnPageKeys();
                // This will be picked up by "yahoo_infinite_nav"
                Y.fire("infinite_nav:refresh");
            });

            // Check if any items need smaller text and fix them
            resizeItemText(node);

            cacheOnPageKeys(node);
        },

        loadContent: function (node, offset, callback) {

            var footer,
                params = {
                    body: {
                        offset: offset
                    }
                };

            footer = node.one('.footer');
            footer.addClass('spinner');

            if (node.all('ul li').size() <= this.limit) {
                clearOnPageKeys();
                cacheOnPageKeys(node);
            }

            this.mp.invoke('feed', {params: params}, function (err, html) {

                var newLi;

                if (!html) {
                    callback();
                } else {

                    newLi = Y.Node.create(html);

                    // Set up our new items to be hidden
                    newLi.all("li").addClass("to-fade-in");
                    newLi.all("li").setStyle("opacity", "0");

                    // HACK: hide any dupes bitch!
                    newLi.all("li").each(function (li) {

                        var href = li.one("a").get("href"),
                            title = li.one("a").get("text").toLowerCase().replace(/[^a-z]/g, "");

                        if (!urlsOnPage[href] && !titlesOnPage[title]) {
                            urlsOnPage[href] = true;
                            titlesOnPage[title] = true;
                            // Add them to the DOM
                            node.one('ul').append(li);
                        } else {
                            // Y.log(title + " - " + Y.Object.size(titlesOnPage), "error");
                            // Y.log(href + " - " + Y.Object.size(urlsOnPage), "error");
                        }
                    });

                    // Check if any items need smaller text and fix them
                    // TODO: Do this per-node item not all of them!
                    resizeItemText(node);

                    // Now make them all visable with a transition
                    // It seems iOS does not do the transition while the screen is scrolling
                    if (!iOS) {
                        node.all("li.to-fade-in").show(true);
                    }

                    // Now remove our marker so they don't get effected next time
                    node.all("li.to-fade-in").setStyle("opacity", null);
                    node.all("li.to-fade-in").removeClass("to-fade-in");

                    // Used to allow CSS to take effect before we go on
                    setTimeout(function () {
                        callback();
                    }, 0);
                }
            });
        }
    };

}, '0.0.1', {requires: ['mojito-client', 'node', 'transition', 'event']});
