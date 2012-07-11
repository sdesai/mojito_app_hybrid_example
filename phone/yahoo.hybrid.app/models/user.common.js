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
                        "title": "Top Stories",
                        "config": {
                            "feedId": "topstories"
                        }
                    },
                    {
                        "type": "yahoo.hybrid.newsfeed",
                        "action": "index",
                        "title": "Tech",
                        "config": {
                            "feedId": "tech"
                        }
                    },
                    {
                        "type": "yahoo.hybrid.newsfeed",
                        "action": "index",
                        "title": "Business",
                        "config": {
                            "feedId": "business",
                        }
                    },
                    {
                        "type": "yahoo.hybrid.newsfeed",
                        "action": "index",
                        "title": "Stock Markets",
                        "config": {
                            "feedId": "stock-markets",
                        }
                    }
                ];

            callback(null, cfg);
        }
    };

});
