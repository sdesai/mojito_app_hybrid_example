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

    /*
     * An ordered array of cached objects
     */

    var cache = [];

    /*
     * @method inCache
     * @param {string} key
     * @param {string} match
     * @retrun {boolean}
     */
    
    function inCache(key, match) {
        return getCacheValue(key, match) ? true : false;
    }

    /*
     * @method getCacheSize
     * @retrun {int}
     */

    function getCacheSize() {
        return cache.length;
    }

    /*
     * @method setCacheValue
     * @param {string} key
     * @param {string} match
     * @param {object} value
     */
    
    function setCacheValue(key, match, value) {

        Y.Array.each(cache, function (object, pos) {
            if (object[key] === match) {
                cache[pos] = value;
            }
        });

        cache.push(value);
    }

    /*
     * @method getCacheValue
     * @param {string} key
     * @param {string} match
     * @retrun {object}
     */
    
    function getCacheValue(key, match) {

        var ret = null;

        Y.Array.each(cache, function (object) {
            if (object[key] === match) {
                ret = object;
            }
        });

        return ret;
    }

    /*
     * @method getCacheSlice
     * @param {string} query
     * @param {int} limit
     * @param {int} offset
     * @param {function} cb
     */
    
    function getCacheSlice(query, limit, offset, cb) {

        if (getCacheSize() < limit + offset) {
            
            query = query + ' limit 100';

            fillCache(query, function () {
                cb(cache.slice(offset, offset + limit - 1));
            });
        } else {
            cb(cache.slice(offset, offset + limit - 1));
        }
    }

    /*
     * @method fillCache
     * @param {string} query
     * @param {function} cb
     */
    
    function fillCache(query, cb) {

        Y.YQL(query, function (data) {

            var items;

            if (!data.query || !data.query.results || !data.query.results.item) {
                cb();
                return;
            }

            items = data.query.results.item;

            // Walk over the items and cache and add any we don't have
            Y.Array.each(items, function (item) {

                var read;

                if (inCache('url', item.link) === false) {

                    read = poorMansReadability(item.description);

                    setCacheValue('url', item.link, {
                        title: item.title,
                        body: read.body,
                        images: read.images,
                        url: item.link,
                        date: item.pubDate
                    });
                }
            });

            // Sort the cache by "date"
            cache.sort(function (a, b) {
                if (a.date > b.date) {
                    return -1;
                }
                if (a.date < b.date) {
                  return 1;
                }
                return 0;
            });

            cb();
        });
    }

    /*
     * @method poorMansReadability
     * @param {string} html
     * @retrun {object}
     */
    
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
            this.cfg = config;
        },

        getFeed: function(offset, callback) {

            // If the offset is not a number or lower than zero fix it
            if (!offset || offset < 0) {
                offset = 0;
            }

            getCacheSlice(this.cfg.query, this.cfg.pageSize, offset, function (feed) {
                callback(null, feed);
            });
        }
    };

}, '0.0.1', {
    requires: ['yql']
});
