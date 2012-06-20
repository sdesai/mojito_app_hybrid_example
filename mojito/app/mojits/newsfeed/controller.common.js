/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

YUI.add('newsfeed', function(Y, NAME) {

    Y.mojito.controllers[NAME] = {

        index: function(ac) {

            ac.model.load('newsfeed').getFeed(function(err, items) {

                var data = {};

                data.items = items;

                ac.done(data);
            });
        }

    };

}, '0.0.1', {requires: ['mojito', 'mojito_mojit_addon_shared_model']});
