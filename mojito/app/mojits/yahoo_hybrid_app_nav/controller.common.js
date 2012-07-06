/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

/*global YUI: true*/

'use strict';

YUI.add('yahoo_hybrid_app_nav', function (Y, NAME) {

    Y.mojito.controllers[NAME] = {

        /*
         * This funciton is the main entry point to the app
         */
        index: function (ac) {

            var cfg = {children: {}};

            /*
             * Hack for context "device:phone" not working in spec configs.
             *
             * This will trigger on all requests that are not found as a device.
             */
            if (ac.context.runtime === 'server' && ac.context.device !== '') {
                this.loader(ac);
                return;
            }

            ac.model.load('user').getConfig('user_id', function (error, screens) {

                var jitStart = ac.config.get('jit') || 100;

                // Add the screens as composite children
                Y.Array.each(screens, function (screen, id) {

                    // Here we use the JIT loader for future screens
                    if (id < jitStart) {
                        cfg.children['screen' + id] = screen;
                    } else {
                        cfg.children['screen' + id] = {
                            type: 'yahoo.hybrid.app_nav',
                            action: 'jit',
                            title: screen.title,
                            config: {
                                jit: JSON.stringify(screen)
                            }
                        };
                    }
                });

                // Now execute the composite
                ac.composite.execute(cfg, function (data, meta) {

                    var slots = [screens.length - 1],
                        screen = 0;

                    Y.Object.each(data, function (content, screenName) {

                        // We do this to keep the ordering of the screen.
                        var screen = parseInt(screenName.slice(6), 10);

                        slots[screen] = {
                            id: screenName,
                            screen: screen,
                            title: cfg.children[screenName].title,
                            content: content,
                            first: (screen === 0)
                        };
                    });

                    ac.done({slots: slots}, meta);
                });
            });
        },

        /*
         * This funciton does nothing but show the loading page.
         * 
         * Once running on the client it then invokes "index" and populates
         * the page at runtime.
         */
        loader: function (ac) {
            ac.done({}, 'loader');
        },

        /*
         * This function returns JITs the mojit config it's given
         */
        jit: function (ac) {

            var data = {};

            data.jit = ac.config.get('jit');

            ac.done(data);
        },

        runJit: function (ac) {

            var cfg = {
                    children: {
                        html: ac.params.body('config')
                    }
                };

            ac.composite.execute(cfg, function (data, meta) {
                ac.done(data.html, meta);
            });
        }

    };

}, '0.0.1', {requires: ['mojito', 'yahoo_hybrid_app_usermodel', 'mojito_mojit_addon_shared_model']});
