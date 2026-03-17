(function() {
    "use strict";
    if (typeof NEWLIFE_CHURCH_STORAGE === 'undefined') window.NEWLIFE_CHURCH_STORAGE = {};
    if (NEWLIFE_CHURCH_STORAGE['theme_font'] == '') NEWLIFE_CHURCH_STORAGE['theme_font'] = 'Raleway';
    NEWLIFE_CHURCH_STORAGE['theme_skin_color'] = '#212121';
    NEWLIFE_CHURCH_STORAGE['theme_skin_bg_color'] = '#FFFFFF';

    NEWLIFE_CHURCH_STORAGE["strings"] = {
        name_empty: "The name can&#039;t be empty",
        name_long: "Too long name",
        email_empty: "Too short (or empty) email address",
        email_long: "Too long email address",
        email_not_valid: "Invalid email address",
        subject_empty: "The subject can&#039;t be empty",
        subject_long: "Too long subject",
        text_empty: "The message text can&#039;t be empty",
        text_long: "Too long message text",
        send_complete: "Send message complete!",
        send_error: "Transmit failed!",
        login_empty: "The Login field can&#039;t be empty",
        login_long: "Too long login field",
        login_success: "Login success! The page will be reloaded in 3 sec.",
        login_failed: "Login failed!",
        password_empty: "The password can&#039;t be empty and shorter then 4 characters",
        password_long: "Too long password",
        password_not_equal: "The passwords in both fields are not equal"
    };

    NEWLIFE_CHURCH_STORAGE['ajax_url'] = '#';
    NEWLIFE_CHURCH_STORAGE['ajax_nonce'] = '9272c5ff71';
    NEWLIFE_CHURCH_STORAGE['site_url'] = '#';
    NEWLIFE_CHURCH_STORAGE['vc_edit_mode'] = false;
    NEWLIFE_CHURCH_STORAGE['theme_font'] = 'Raleway';
    NEWLIFE_CHURCH_STORAGE['theme_skin'] = 'default';
    NEWLIFE_CHURCH_STORAGE['theme_skin_color'] = '#212121';
    NEWLIFE_CHURCH_STORAGE['theme_skin_bg_color'] = '#FFFFFF';
    NEWLIFE_CHURCH_STORAGE['slider_height'] = 100;
    NEWLIFE_CHURCH_STORAGE['system_message'] = {
        message: '',
        status: '',
        header: ''
    };
    NEWLIFE_CHURCH_STORAGE['user_logged_in'] = false;
    NEWLIFE_CHURCH_STORAGE['toc_menu'] = 'float';
    NEWLIFE_CHURCH_STORAGE['toc_menu_home'] = true;
    NEWLIFE_CHURCH_STORAGE['toc_menu_top'] = true;
    NEWLIFE_CHURCH_STORAGE['menu_fixed'] = true;
    NEWLIFE_CHURCH_STORAGE['menu_mobile'] = 1024;
    NEWLIFE_CHURCH_STORAGE['menu_slider'] = false;
    NEWLIFE_CHURCH_STORAGE['menu_cache'] = false;
    NEWLIFE_CHURCH_STORAGE['demo_time'] = 0;
    NEWLIFE_CHURCH_STORAGE['media_elements_enabled'] = true;
    NEWLIFE_CHURCH_STORAGE['ajax_search_min_length'] = 3;
    NEWLIFE_CHURCH_STORAGE['ajax_search_delay'] = 200;
    NEWLIFE_CHURCH_STORAGE['css_animation'] = true;
    NEWLIFE_CHURCH_STORAGE['menu_animation_in'] = 'fadeIn';
    NEWLIFE_CHURCH_STORAGE['menu_animation_out'] = 'fadeOutDown';
    NEWLIFE_CHURCH_STORAGE['popup_engine'] = 'magnific';
    NEWLIFE_CHURCH_STORAGE['email_mask'] = '^([a-zA-Z0-9_\-]+\.)*[a-zA-Z0-9_\-]+@[a-z0-9_\-]+(\.[a-z0-9_\-]+)*\.[a-z]{2,6}$';
    NEWLIFE_CHURCH_STORAGE['contacts_maxlength'] = 1000;
    NEWLIFE_CHURCH_STORAGE['comments_maxlength'] = 1000;
    NEWLIFE_CHURCH_STORAGE['remember_visitors_settings'] = false;
    NEWLIFE_CHURCH_STORAGE['admin_mode'] = false;
    NEWLIFE_CHURCH_STORAGE['isotope_resize_delta'] = 0.3;
    NEWLIFE_CHURCH_STORAGE['error_message_box'] = null;
    NEWLIFE_CHURCH_STORAGE['viewmore_busy'] = false;
    NEWLIFE_CHURCH_STORAGE['video_resize_inited'] = false;
    NEWLIFE_CHURCH_STORAGE['top_panel_height'] = 0;

    var wc_cart_fragments_params = {
        "ajax_url": "#",
        "wc_ajax_url": "#",
        "fragment_name": "wc_fragments"
    };

    var woocommerce_price_slider_params = {
        "currency_symbol": "\u00a3",
        "currency_pos": "left",
        "min_price": "",
        "max_price": ""
    };

    var wc_single_product_params = {
        "i18n_required_rating_text": "Please select a rating",
        "review_rating_required": "yes"
    };

    var tribe_bootstrap_datepicker_strings = {
        "dates": {
            "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "daysShort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            "daysMin": ["S", "M", "T", "W", "T", "F", "S", "S"],
            "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            "monthsShort": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            "clear": "Clear",
            "today": "Today"
        }
    };

    var tribe_js_config = {
        "permalink_settings": "\/%postname%\/",
        "events_post_type": "tribe_events",
        "events_base": "#"
    };

    jQuery(document).ready(function (jQuery) {
        jQuery.datepicker.setDefaults({
            "closeText": "Close",
            "currentText": "Today",
            "monthNames": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            "monthNamesShort": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            "nextText": "Next",
            "prevText": "Previous",
            "dayNames": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "dayNamesShort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            "dayNamesMin": ["S", "M", "T", "W", "T", "F", "S"],
            "dateFormat": "DD, MM d, yy",
            "firstDay": 1,
            "isRTL": false
        });
    });

    var wc_country_select_params = {
        "i18n_select_state_text": "Select an option\u2026",
        "i18n_matches_1": "One result is available, press enter to select it.",
        "i18n_matches_n": "%qty% results are available, use up and down arrow keys to navigate.",
        "i18n_no_matches": "No matches found",
        "i18n_ajax_error": "Loading failed",
        "i18n_input_too_short_1": "Please enter 1 or more characters",
        "i18n_input_too_short_n": "Please enter %qty% or more characters",
        "i18n_input_too_long_1": "Please delete 1 character",
        "i18n_input_too_long_n": "Please delete %qty% characters",
        "i18n_selection_too_long_1": "You can only select 1 item",
        "i18n_selection_too_long_n": "You can only select %qty% items",
        "i18n_load_more": "Loading more results\u2026",
        "i18n_searching": "Searching\u2026"
    };
})();

    my_timeline_front_ajax_nonce = "46f182de5b";
    my_timeline_front_ajax_url = "#";

