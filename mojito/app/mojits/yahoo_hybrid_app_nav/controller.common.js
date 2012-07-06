/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

/*global YUI: true*/

'use strict';

YUI.add('yahoo_hybrid_app_nav_phone', function (Y, NAME) {

    Y.mojito.controllers[NAME] = {

        /*
         * This funciton is the main entry point to the app
         */
        index: function (ac) {

            var cfg = {children: {}};

            /*
             * Quick hack around for context "device:phone" not working in the configs.
             */
            if (ac.context.runtime === 'server' && ac.context.device !== '') {
                this.loader(ac);
                return;
            }

            ac.model.load('user').getConfig('user_id', function (error, screens) {

                // Add the screens as composite children
                Y.Array.each(screens, function (screen, id) {
                    cfg.children['screen' + id] = screen;
                });

                // Now execute the composite
                ac.composite.execute(cfg, function (data, meta) {

                    var slots = [],
                        screen = 0;

                    Y.Object.each(data, function (content) {

                        var screenName = 'screen' + screen;

                        slots.push({
                            id: screenName,
                            screen: screen,
                            title: cfg.children[screenName].title,
                            content: content,
                            first: (screen === 0)
                        });

                        screen = screen + 1;
                    });

                    ac.done({slots: slots}, meta);
                });
            });
        },

        /*
         * This funciton does nothing but a show the loading page.
         * 
         * Once running on the client it then invokes "index" and populates
         * the page at runtime.
         */
        loader: function (ac) {
            ac.done({}, 'loader');
        }

    };

}, '0.0.1', {requires: ['mojito', 'yahoo_hybrid_app_usermodel', 'mojito_mojit_addon_shared_model']});
