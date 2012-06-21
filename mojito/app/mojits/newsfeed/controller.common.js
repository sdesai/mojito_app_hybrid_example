/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

/*global YUI: true*/

'use strict';

YUI.add('newsfeed', function (Y, NAME) {

    Y.mojito.controllers[NAME] = {

        index: function (ac) {

            var cfg = {
                    children: {
                        feed: {
                            type: 'yahoo.hybrid.newsfeed',
                            action: 'feed'
                        }
                    }
                };

            if (ac.config.get('query')) {
                cfg.children.feed.config = {
                    query: ac.config.get('query')
                };
            }

            if (ac.params.route('showSplash')) {
                cfg.children.feed.action = 'splash';
            }

            ac.composite.execute(cfg, function (data) {
                ac.done(data);
            });
        },

        splash: function (ac) {
            ac.done('Splash...');
        },

        feed: function (ac) {

            var offset = ac.params.merged('offset') || 0,
                query = ac.config.get('query');

            ac.model.load('newsfeed').getFeed(query, offset, function (err, items) {

                var data = {};

                if (err) {
                    items = [];
                }

                data.items = items;

                ac.done(data);
            });
        }

    };

}, '0.0.1', {requires: ['mojito', 'mojito_mojit_addon_shared_model']});
