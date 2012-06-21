/*
 * Copyright (c) 2012 Yahoo! Inc. All rights reserved.
 */

YUI.add('newsfeedappbinderindex', function(Y, NAME) {

    Y.namespace('mojito.binders')[NAME] = {

        init: function(mp) {
            
            this.mp = mp;
            this.scrollable = null;
            this.height = NaN;
            this.width = NaN;
            this.position = 0;

            /* This code prevents users from dragging the page */
            var preventDefaultScroll = function(event) {
              event.preventDefault();
              window.scroll(0,0);
              return false;
            };
            document.addEventListener('touchmove', preventDefaultScroll, false);
        },

        bind: function(node) {

            var self = this;

            self.scrollable = node.one(".scrollable");

            // First make sure we have the screen size set right
            self.setScreenSize(node, function () {

                // Now tell all the children what size they should be
                node.all('li.page').each(function (item) {
                    item.setStyle('height', (self.height - 4) + "px");
                    item.setStyle('width', (self.width - 0) + "px");
                });

                function slide(scroll, distance){
                    scroll.transition({
                        duration: 0.2, // seconds
                        transform: 'translateX(' + distance + 'px)',
                        'z-index': '1000'
                    });
                }

                /*
                 * The big one! We look for "flicks" to move the page.
                 */
                node.on("gesturemovestart", function(e) {

                    var item = e.currentTarget;

                    // Prevent Text Selection in IE
                    item.once("selectstart", function(e) {
                        e.preventDefault();
                    });

                    item.setData("swipeStartX", e.pageX);
                    item.setData("swipeStartY", e.pageY);

                    item.once("gesturemoveend", function(e) {

                        var swipeStartX = item.getData("swipeStartX"),
                            swipeStartY = item.getData("swipeStartY"),
                            swipeEndX = e.pageX,
                            swipeEndY = e.pageY,
                            isSwipeLeft = (swipeStartX - swipeEndX) > 60,
                            isSwipeRight = (swipeEndX - swipeStartX) > 60,
                            isSwipeVert = Math.abs(swipeEndY - swipeStartY) < 30;

                        if (isSwipeLeft && isSwipeVert) {
                            if (self.position < node.all('li.page').size() - 1) {
                                self.position = self.position + 1;
                                slide(self.scrollable, self.position * self.width * -1);
                            }
                        }

                        if (isSwipeRight && isSwipeVert) {
                            if (self.position > 0) {
                                self.position = self.position - 1;
                                slide(self.scrollable, self.position * self.width * -1);
                            }
                        }
                    });

                });
            });
        },

        setScreenSize: function (node, cb){

            var self = this;

            self.height = parseInt(node.get('winHeight'));
            self.width = parseInt(node.get('winWidth'));

            self.scrollable.setStyle('height', (self.height - 0) + "px");
            self.scrollable.setStyle('width', (self.width * node.all('li.page').size()) + "px");

            cb();
        }
    };

}, '0.0.1', {requires: ['mojito-client', 'node', 'transition', 'scrollview', 'scrollview-paginator']});
