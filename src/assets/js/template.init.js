/* global jQuery:false */
/* global NEWLIFE_CHURCH_STORAGE:false */


// Theme-specific first load actions
//==============================================
function newlife_church_theme_ready_actions() {
	"use strict";
	// Put here your init code for the theme-specific actions
	// It will be called before core actions
}


// Theme-specific scroll actions
//==============================================
function newlife_church_theme_scroll_actions() {
	"use strict";
	// Put here your theme-specific code for scroll actions
	// It will be called when page is scrolled (before core actions)
}


// Theme-specific resize actions
//==============================================
function newlife_church_theme_resize_actions() {
	"use strict";
	// Put here your theme-specific code for resize actions
	// It will be called when window is resized (before core actions)
}


// Theme-specific shortcodes init
//=====================================================
function newlife_church_theme_sc_init(cont) {
	"use strict";
	// Put here your theme-specific code for init shortcodes
	// It will be called before core init shortcodes
	// @param cont - jQuery-container with shortcodes (init only inside this container)
}


// Theme-specific post-formats init
//=====================================================
function newlife_church_theme_init_post_formats() {
	"use strict";
	// Put here your theme-specific code for init post-formats
	// It will be called before core init post_formats when page is loaded or after 'Load more' or 'Infonite scroll' actions
}

jQuery(document).ready(function() {
    "use strict";
// Tribe Events buttons
    jQuery('a.tribe-events-gcal').addClass('sc_button_color_style_2');
    jQuery('a.tribe-events-ical').addClass('sc_button_color_style_3');
    jQuery('a.tribe-events-read-more,.tribe-events-button,.tribe-events-nav-previous a,.tribe-events-nav-next a,.tribe-events-widget-link a,.tribe-events-viewmore a').addClass('sc_button_color_style_2');

// Timeline buttons
    jQuery('.read_more').addClass('sc_button sc_button_color_style_2');

// Woocommerce buttons
    jQuery('.woocommerce .button:not(.add_to_cart_button, .checkout)').addClass('sc_button sc_button_style_filled sc_button_color_style_2');
    jQuery('.woocommerce .add_to_cart_button').addClass('sc_button sc_button_style_filled sc_button_color_style_4');
    jQuery('.woocommerce .button.checkout').addClass('sc_button sc_button_style_filled sc_button_color_style_3');

});