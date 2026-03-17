my_is_mobile_global = 0;
(function($) {
    "use strict";
    var test = false;
    $(window).load(function() {
        if (!test) timeline_init_2($(document));
    });

    function timeline_init_2($this) {
        "use strict";
        $this.find(".scrollable-content").mCustomScrollbar();
        $this.find("a[rel^='prettyPhoto']").prettyPhoto();
        $this.find("#tl2").timeline({
            my_show_years: 9,
            my_del: 130,
            my_is_years: 0,
            my_trigger_width: 800,
            my_sizes: {
                "card": {
                    "item_width": "370",
                    "item_height": "380",
                    "margin": "30"
                },
                "active": {
                    "item_width": "370",
                    "item_height": "380",
                    "image_height": "0"
                }
            },
            my_id: 2,
            my_debug: 0,
            is_mobile: 0,
            autoplay: 0,
            autoplay_mob: 0,
            autoplay_step: 10000,
            itemMargin: 30,
            scrollSpeed: 500,
            easing: "easeOutSine",
            openTriggerClass: '.read_more',
            swipeOn: true,
            startItem: "07/09/2015",
            yearsOn: true,
            hideTimeline: false,
            hideControles: false,
            closeText: "Close",
            closeItemOnTransition: true
        });
        $this.find("#tl2").on("ajaxLoaded.timeline", function(e) {
            var scrCnt = e.element.find(".scrollable-content");
            scrCnt.height(scrCnt.parent().height() - scrCnt.parent().children("h2").height() - parseInt(scrCnt.parent().children("h2").css("margin-bottom")));
            scrCnt.mCustomScrollbar({
                theme: "light-thin"
            });
            e.element.find("a[rel^='prettyPhoto']").prettyPhoto();
            e.element.find(".timeline_rollover_bottom").timelineRollover("bottom");
        });
    }
})(jQuery);