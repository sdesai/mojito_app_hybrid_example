/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

YUI.add('newsfeedmodel', function(Y, NAME) {

    var regexps = {
            replaceBrsRe:   /(<br[^>]*>[ \n\r\t]*){2,}/gi,
            replaceFontsRe: /<(\/?)font[^>]*>/gi,
            trimRe:         /^\s+|\s+$/g,
            normalizeRe:    /\s{2,}/g,
            killBreaksRe:   /(<br[^\/>]*\/?>(\s|&nbsp;?)*){1,}/g,
            linkRe1:        /<a[^>]*>/gi,
            linkRe2:        /<\/a[^>]*>/gi,
            imgRe:          /<img[^>]*>/gi,
            imgSrc:         /src="([^"]*)/i,
            pTag1:          /<p[^>]*>/gi,
            pTag2:          /<\/p[^>]*>/gi
        };

    function poorMansReadability(html){

        var data = {},
            text,
            images = [],
            i, src;

        if(!html){
            return data;
        }

        images = html.match(regexps.imgRe);

        text = html.replace(regexps.replaceBrsRe, '')
            .replace(regexps.replaceFontsRe, '')
            .replace(regexps.pTag1, '')
            .replace(regexps.pTag2, '')
            .replace(regexps.linkRe1, '')
            .replace(regexps.linkRe2, '')
            .replace(regexps.trimRe, '')
            .replace(regexps.normalizeRe, '')
            .replace(regexps.killBreaksRe, '')
            .replace(regexps.imgRe, '');

        data.body = text;
        data.images = [];

        for(i in images){

            src = images[i].match(regexps.imgSrc);

            if(src && src[1]){
                data.images.push({
                    src:src[1]
                });
            }
        }

        return data;
    }

    Y.mojito.models.newsfeed = {

        init: function(config) {
            this.config = config;
        },

        /**
         * Method that will be invoked by the mojit controller to obtain data.
         *
         * @param callback {function(err,data)} The callback function to call when the
         *        data has been retrieved.
         */
        getFeed: function(callback) {

            Y.YQL(this.config.query, function (data) {

                var items,
                    feed = [];

                if (!data.query || !data.query.results || !data.query.results.item) {
                    callback('Error');
                }

                items = data.query.results.item;

                Y.Array.each(items, function (item) {
                    var read = poorMansReadability(item.description);

                    feed.push({
                        title: item.title,
                        body: read.body,
                        images: read.images,
                        url: item.link,
                        date: item.pubDate
                    });

                });

                callback(null, feed);
            });

        }

    };

}, '0.0.1', {
    requires: ['yql']
});
