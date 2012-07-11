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
                            action: 'feed',
                            config: {
                                feedId: ac.config.get('feedId')
                            }
                        }
                    }
                };

            ac.composite.execute(cfg, function (data) {
                ac.done(data);
            });
        },

        feed: function (ac) {

            var feedId = ac.params.merged('feedId') || ac.config.get('feedId'),
                offset = ac.params.merged('offset'),
                limit = ac.config.get('limit');

            ac.model.load('newsfeed').getFeed(feedId, offset, limit, function (err, items) {

                var data = {};

                if (err) {
                    Y.log('Newsfeed "' + feedId + '" was empty.');
                    items = [];
                }

                data.feed_id = feedId;
                data.items = items;

                ac.done(data);
            });
        }

    };

}, '0.0.1', {requires: ['mojito', 'mojito_mojit_addon_shared_model']});
