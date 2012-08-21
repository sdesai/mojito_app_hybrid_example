/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

/*global YUI: true*/

'use strict';

YUI.add('yahoo_hybrid_app_usermodel', function (Y, NAME) {

    var users = new Y.CacheOffline();

    Y.mojito.models.user = {

        init: function (config) {
            this.cfg = config;
        },

        setUser: function (userId, config) {
            users.add(userId, Y.Array.unique(config));
        },

        getUser: function (userId) {

            // If there is not cache
            if (!users.retrieve(userId)) {
                return [];
            }

            return users.retrieve(userId).response || [];
        },

        getConfig: function (userId, callback) {

            callback(null, this.getUser(userId));
        },

        toggleFeed: function (userId, feedId, callback) {

            var topics = this.getUser(userId),
                removed = false;

            Y.Array.each(topics, function (topic, index) {
                if (topic.feedId === feedId) {
                    delete topics[index];
                    removed = true;
                }
            });

            if (!removed) {
                topics.push({
                    feedId: feedId
                });
            }

            this.setUser(userId, topics);

            callback();
        }
    };

}, "", {
    requires: ["cache"]
});
