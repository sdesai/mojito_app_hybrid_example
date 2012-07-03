/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

/*global YUI: true*/

'use strict';

YUI.add('newsfeedbinderindex', function (Y, NAME) {

    function isScrolledIntoView(node) {

        var docViewTop,
            docViewBottom,
            elemTop,
            elemBottom;

        docViewTop = Y.one('body').get('scrollTop');
        docViewBottom = docViewTop + node.get('winHeight');

        elemTop = node.getY();
        elemBottom = elemTop + parseInt(node.getStyle('height'), 10);

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

    Y.namespace('mojito.binders')[NAME] = {

        init: function (mp) {
            this.mp = mp;
        },

        bind: function (node) {

            var self = this,
                footer = node.one('.footer'),
                loading = false,
                handler,
                listener;

            listener = function () {
                if (!loading && isScrolledIntoView(footer)) {
                    loading = true;
                    self.loadContent(node, function (more) {

                        if (more === true) {
                            loading = false;
                        } else {
                            handler.detach();
                        }
                        // We are all done so tell the world there is more data
                        Y.fire('more-data');
                    });
                }
            };

            handler = node.on(['gesturemovestart', 'mousewheel'], listener);
        },

        loadContent: function (node, callback) {

            var footer,
                params = {
                    body: {
                        offset: node.one('ul').get('children').size()
                    }
                };

            footer = node.one('.footer');
            footer.addClass('spinner');

            this.mp.invoke('feed', {params: params}, function (err, html) {

                if (err || html === '') {
                    footer.remove();
                    callback(false);
                } else {
                    node.one('ul').append(html);
                    // Used to allow CSS to take effect
                    setTimeout(function () {
                        footer.removeClass('spinner');
                        callback(true);
                    }, 0);
                }
            });
        }
    };

}, '0.0.1', {requires: ['mojito-client', 'node', 'event-move', 'event-mousewheel']});
