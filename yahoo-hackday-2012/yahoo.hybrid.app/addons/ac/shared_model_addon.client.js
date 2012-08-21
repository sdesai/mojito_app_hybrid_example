/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

/*global YUI: true*/

'use strict';

YUI.add('mojito_mojit_addon_shared_model', function (Y, NAME) {

    function Addon(command, adapter, ac) {

        YUI.mojito = YUI.mojito || {};
        YUI.mojito.cache = YUI.mojito.cache || {};
        YUI.mojito.cache.models = YUI.mojito.cache.models || {};

        this.ac = ac;
        this.models = YUI.mojito.cache.models;
    }

    Addon.prototype = {

        namespace: 'model',

        load: function (name) {
            if (!this.models[name]) {
                if (this.ac.models[name]) {
                    this.models[name] = this.ac.models[name];
                } else {
                    Y.log('Model "' + name + '" not found.', 'debug', NAME);
                }
            } else {
                Y.log('Model "' + name + '" served from cache.', 'debug', NAME);
            }
            return this.models[name];
        }

    };

    Y.mojito.addons.ac.model = Addon;

}, '0.1.0', {requires: ['mojito']});
