/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

YUI.add('newsfeed', function(Y, NAME) {

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

            var offset = ac.params.merged('offset') || 0;

            ac.model.load('newsfeed').getFeed(offset, function(err, items) {

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
