/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

/*global YUI: true*/

'use strict';

YUI.add('yahoo_hybrid_app_usermodel', function (Y, NAME) {

    Y.mojito.models.user = {

        init: function (config) {
            this.cfg = config;
        },

        getConfig: function (userId, callback) {

            var cfg = [
                    {
                        "type": "yahoo.hybrid.newsfeed",
                        "action": "index",
                        "config": {
                            "query": "select title, description, link, pubDate from rss where url='http://news.yahoo.com/rss/stock-markets'"
                        }
                    },
                    {
                        "type": "yahoo.hybrid.newsfeed",
                        "action": "index",
                        "config": {
                            "query": "select title, description, link, pubDate from rss where url='http://news.yahoo.com/rss/business'"
                        }
                    },
                    {
                        "type": "yahoo.hybrid.newsfeed",
                        "action": "index",
                        "config": {
                            "query": "select title, description, link, pubDate from rss where url='http://rss.news.yahoo.com/rss/topstories'"
                        }
                    },
                    {
                        "type": "yahoo.hybrid.newsfeed",
                        "action": "index",
                        "config": {
                            "query": "select title, description, link, pubDate from rss where url='http://news.yahoo.com/rss/tech'"
                        }
                    }
                ];

            callback(null, cfg);
        }
    };

});
