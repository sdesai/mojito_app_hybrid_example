/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

/*global YUI: true*/

'use strict';

YUI.add('infinitie_feed_binder_index', function (Y, NAME) {

    var urlsOnPage = {},
        titlesOnPage = {},
        idleSince = new Date().getTime();

    function hasScrolledIntoView(node, padding) {

        var docViewTop,
            docViewBottom,
            elemTop,
            elemBottom;

        if (!padding) {
            padding = 0;
        }

        docViewTop = Y.one('body').get('scrollTop') || document.documentElement.scrollTop;
        docViewBottom = docViewTop + node.get('winHeight');

        elemTop = node.getY();

        if (elemTop <= 0) {
            return false;
        }

        // Y.log(docViewBottom + " ? " + elemTop, "error");

        return docViewBottom > (elemTop - padding);
    }

    /*
        Check if the given element has overflowed
    */
    function isOverflowed(el) {

        var curOverflow = el.style.overflow;

        if ( !curOverflow || curOverflow === "visible" )
        el.style.overflow = "hidden";

        var isOverflowing = el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;

        el.style.overflow = curOverflow;

        return isOverflowing;
    }

    /*
        Stores the items title and url to be checked by any future calls
    */
    function isUnique(item) {

        var href = item.one("a").get("href"),
            title = item.one("a").get("text").toLowerCase().replace(/[^a-z]/g, "");

        if (urlsOnPage[href] || titlesOnPage[title]) {
            return false;
        }

        urlsOnPage[href] = true;
        titlesOnPage[title] = true;

        return true;
    }

    /*
        Clears any data stored when calling isUnique()
    */
    function resetIsUnique() {
        // Clear what we have
        urlsOnPage = {};
        titlesOnPage = {};
    }

    /*
        Fixes the layout for items where the text overflowing
    */
    function layoutItemContent(item) {
        var node = item.one(".card").getDOMNode();

        // A bit of a hack so we don't run this 
        // code if we are in full width mode
        // which is less than 500px
        if (item.get('winWidth') < 500) {
            return;
        }

        // If the text has overflowed
        if (isOverflowed(node)) {
            // Make the text smaller
            item.addClass("small-text");
            // If it still over flows just hide it
            if (isOverflowed(node)) {
                item.addClass("hide-text");
            }
        }
    }

    Y.namespace('mojito.binders')[NAME] = {

        lastOffset: 0,

        init: function (mp) {
            this.mp = mp;
            this.limit = this.mp.config.limit || 2;
            this.timeout = this.mp.config.timeout || 300000; // 5 minutes
        },

        bind: function (node) {

            var self = this,
                loading = false,
                listener;

            /*
                The main listener for scrolling events.
                This code loads the new content as the user gets to the bottom of the page.
            */
            listener = function () {

                var moveTime = new Date().getTime(),
                    footer = node.one('.footer'),
                    offset = 0;

                /*
                    If it been n minutes since the last interaction tell someone
                */
                if (moveTime - idleSince > self.timeout) {
                    // This will be picked up by "yahoo_infinite_nav"
                    Y.fire("infinite_nav:reload");
                }

                idleSince = moveTime;

                /*
                    If we are near the bottom of the page load more content
                */
                if (loading === false && footer && hasScrolledIntoView(footer, 1000)) {

                    loading = true; // Stop anyone else from coming in here

                    offset = node.one('ul').get('children').size() + 1;

                    if (self.lastOffset < offset) {

                        self.lastOffset = offset;

                        self.loadContent(node, offset, function () {
                            loading = false;
                        });
                    } else {
                        loading = false;
                    }
                }
            };

            setInterval(listener, 100);

            node.one(".refresh").on("click", function () {
                // We are clearing the page so remove all current data
                resetIsUnique();
                // This will be picked up by "yahoo_infinite_nav"
                Y.fire("infinite_nav:refresh");
            });

            // For any items on the page store their uniqueness and fix their layouts
            node.all("ul li").each(function (item) {
                layoutItemContent(item);
                isUnique(item);
            });
        },

        loadContent: function (node, offset, callback) {

            var self = this,
                params = {
                    body: {
                        offset: offset
                    }
                };

            self.mp.invoke('feed', {params: params}, function (err, html) {

                var items;

                if (!html) {
                    callback();
                } else {

                    /*
                        Check if we have reset the page
                    */
                    if (node.all('ul li').size() <= self.limit) {
                        // Clear all we knew, it's a new world!
                        resetIsUnique();
                        // For any items on the page store their uniqueness
                        node.all("ul li").each(function (item) {
                            isUnique(item);
                        });
                    }

                    // Create the items
                    items = Y.Node.create(html);

                    /*
                        We may not have any items to add if they were all removed
                    */
                    if (!items) {
                        callback();
                        return;
                    }

                    /*
                        In this loop we set up the items as needed
                    */
                    items.all("li").each(function (item) {
                        if (isUnique(item)) {
                            // Make the items invisible so we can fade them in all sexy
                            item.setStyle("opacity", "0");
                            item.addClass("new");
                        } else {
                            item.remove();
                        }
                    });

                    // Add our new items to the page
                    node.one("ul").append(items);

                    /*
                        In this loop make them visible
                    */
                    node.all("ul li.new").each(function (item) {
                        // Get the text sized right (we can only do this once hte item is on the DOM)
                        layoutItemContent(item);
                        setTimeout(function () {
                            // Now show the item to the world
                            item.show(true);
                            item.removeClass("new");
                        }, 200);
                            
                    });

                    /*
                        TODO: I don't like this here. Must be moved to a page level event
                    */
                    if (typeof FB !== 'undefined' && FB.XFBML && typeof FB.XFBML.parse === 'function') {
                        FB.XFBML.parse();
                    }

                    /*
                        Used to allow CSS to take effect before we go on
                    */
                    setTimeout(function () {
                        callback();
                    }, 0);
                }
            });
        }
    };

}, '0.0.1', {requires: ['mojito-client', 'node', 'transition', 'event']});
