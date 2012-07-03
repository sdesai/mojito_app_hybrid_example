/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

/*global YUI: true*/

'use strict';

YUI.add('newsfeedapp', function (Y, NAME) {

    Y.mojito.controllers[NAME] = {

        index: function (ac) {

            var cfg = {children: {}};

            Y.Array.each(ac.config.get('screens'), function (screen, id) {
                cfg.children['screen' + id] = screen;
            });

            ac.composite.execute(cfg, function (data, meta) {

                var slots = [],
                    id = 0;

                Y.Object.each(data, function (content) {

                    slots.push({
                        id: 'screen' + id,
                        content: content,
                        first: (id === 0)
                    });

                    id = id + 1;
                });

                ac.done({slots: slots}, meta);
            });
        }

    };

}, '0.0.1', {requires: ['mojito', 'mojito_mojit_addon_shared_model']});
