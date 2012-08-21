/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

/*global YUI: true*/

'use strict';

YUI.add('yahoo_infinite_nav', function (Y, NAME) {

    Y.mojito.controllers[NAME] = {

        /*
         * This funciton is the main entry point to the app
         */
        index: function (ac) {

            var cfg = {
                    children: {
                        feed: {
                            type: "yahoo.hybrid.infinitiefeed",
                            action: "index"
                        }
                    }
                };

            // Now execute the composite
            ac.composite.execute(cfg, function (data, meta) {
                ac.done({
                    feed: data.feed
                }, meta);
            });
        },

        topics: function (ac) {

            var cfg = {
                    children: {
                        feed: {
                            type: "yahoo.hybrid.infinitiefeed",
                            action: "index"
                        }
                    }
                };

            // Now execute the composite
            ac.composite.execute(cfg, function (data, meta) {
                ac.done(data.feed, meta);
            });
        },

        selectors: function (ac) {

            var cfg = {
                children: {
                    // menu: {},
                    selector: {
                        type: "yahoo.hybrid.infinitiefeed",
                        action: "selectTopics"
                    }
                }
            };

            // Now execute the composite
            ac.composite.execute(cfg, function (data, meta) {
                ac.done(data.selector, meta);
            });
        },

        /*
         * This funciton does nothing but show the loading page.
         * 
         * Once running on the client it then invokes "index" and populates
         * the page at runtime.
         */
        loader: function (ac) {
            ac.done({}, 'loader');
        }
    };

}, '0.0.1', {requires: ['mojito', 'mojito_mojit_addon_shared_model']});
