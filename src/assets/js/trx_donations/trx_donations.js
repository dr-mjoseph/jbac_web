/* global jQuery */
jQuery(document).ready(function () {
	"use strict";
	
	// Donations form handlers
	if (jQuery('.sc_donations_form').length > 0) {

		// Change amount
		jQuery('.sc_donations_form .sc_donations_form_field_amount input[type="radio"]').click(function(e) {
			"use strict";
			jQuery(this).siblings('.sc_donations_form_amount').val(jQuery(this).val());
		});
		jQuery('.sc_donations_form .sc_donations_form_amount').focus(function() {
			"use strict";
			jQuery(this).siblings('input[type="radio"]').removeAttr('checked');
			jQuery(this).siblings('#sc_donations_form_amount_0').attr('checked', 'checked');
		});
		
		// Pack 'Website' and 'Show in rating' to one field
		jQuery('.sc_donations_form #sc_donations_form_site, .sc_donations_form #sc_donations_form_name, .sc_donations_form #sc_donations_form_rating').change(function(e) {
			"use strict";
			var os0 = '';
			jQuery(this).parents('.sc_donations_form')
				.find('#sc_donations_form_site, #sc_donations_form_name').each(function() {
					"use strict";
					os0 += (os0 ? '|' : '') + jQuery(this).attr('name') + '=' + jQuery(this).val();
				})
				.end()
				.find('#sc_donations_form_rating').each(function() {
					"use strict";
					os0 += (os0 ? '|' : '') + jQuery(this).attr('name') + '=' + (jQuery(this).attr('checked')=='checked' ? '1' : '0');
				})
				.end()
				.find('[name="os0"]')
				.val(os0);
		});

		// Change Name
		jQuery('.sc_donations_form #sc_donations_form_name').change(function(e) {
			"use strict";
			var name = jQuery(this).val().split(' ');
			jQuery(this).parents('.sc_donations_form')
				.find('[name="last_name"]').val(name[0])
				.siblings('[name="first_name"]').val(name[1]!==undefined ? name[1] : '');
		});

		// Submit donations form
		jQuery('.sc_donations_form .sc_donations_form_submit').click(function(e) {
			"use strict";
			var error = false;
			jQuery('.sc_donations_form *').removeClass('trx_donations_form_error');
			if (jQuery('.sc_donations_form #sc_donations_form_amount').val() <= 0) {
				error = true;
				jQuery('.sc_donations_form #sc_donations_form_amount').addClass('sc_donations_form_error');
			}
			if (jQuery('.sc_donations_form #sc_donations_form_name').val() == '') {
				error = true;
				jQuery('.sc_donations_form #sc_donations_form_name').addClass('sc_donations_form_error');
			}
			if (jQuery('.sc_donations_form #sc_donations_form_email').val() == '') {
				error = true;
				jQuery('.sc_donations_form #sc_donations_form_email').addClass('sc_donations_form_error');
			}
			if (jQuery('.sc_donations_form #sc_donations_form_email').val() == '') {
				error = true;
				jQuery('.sc_donations_form #sc_donations_form_email').addClass('sc_donations_form_error');
			}
			if (!error) {
				jQuery(this).parents('form').submit();
			}
		});

		// Hide result window after 3 sec.
		if (jQuery('.sc_donations_form .sc_donations_result').length > 0) {
			jQuery('body,html').scrollTo('.sc_donations_form', {offsetTop : '100'});
			setTimeout(function() {
				"use strict";
				jQuery('.sc_donations_form .sc_donations_result').fadeOut();
			}, 5000);
		}
	}
});

jQuery.fn.scrollTo = function( target, options, callback ){
	"use strict";
	if (typeof options == 'function' && arguments.length == 2) { callback = options; options = target; }
	var settings = jQuery.extend({
		scrollTarget  : target,
		offsetTop     : 50,
		duration      : 500,
		easing        : 'swing'
		}, options);
	return this.each(function() {
		"use strict";
		var scrollPane = jQuery(this);
		var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : jQuery(settings.scrollTarget);
		var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top - parseInt(settings.offsetTop);
		scrollPane.animate({scrollTop: scrollY}, parseInt(settings.duration), settings.easing, function() {
			"use strict";
			if (typeof callback == 'function') { callback.call(this); }
		});
	});
}
