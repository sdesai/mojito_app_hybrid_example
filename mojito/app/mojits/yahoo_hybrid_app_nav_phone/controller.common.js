/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

/*global YUI: true*/

'use strict';

YUI.add('yahoo_hybrid_app_nav_phone', function (Y, NAME) {

    Y.mojito.controllers[NAME] = {

        index: function (ac) {

            var cfg = {children: {}};

            ac.model.load('user').getConfig('user_id', function (error, screens) {

                // Add the screens as composite children
                Y.Array.each(screens, function (screen, id) {
                    cfg.children['screen' + id] = screen;
                });

                // Now execute the composite
                ac.composite.execute(cfg, function (data, meta) {

                    var slots = [],
                        id = 0;

                    Y.Object.each(data, function (content) {

                        var idname = 'screen' + id;

                        slots.push({
                            id: idname,
                            title: cfg.children[idname].title,
                            content: content,
                            first: (id === 0)
                        });

                        id = id + 1;
                    });

                    ac.done({slots: slots}, meta);
                });
            });
        }

    };

}, '0.0.1', {requires: ['mojito', 'yahoo_hybrid_app_usermodel', 'mojito_mojit_addon_shared_model']});
