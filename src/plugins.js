import 'babel-polyfill/dist/polyfill';
import 'js/modernizr.js';
import 'jquery/dist/jquery.min.js';
import 'js/perfect-scrollbar.js';
import 'moment/min/moment.min.js';
import 'vex-js/dist/js/vex.combined.js';
import 'messenger-hubspot/build/js/messenger.min.js';
import 'messenger-hubspot/build/js/messenger-theme-flat.js';
import 'slick.js';
import 'syncHeight.js';

Messenger.options = {
	theme: 'flat',
	extraClasses: 'messenger-on-right messenger-on-top messenger-fixed',
	messageDefaults: {
		hideAfter: 3,
		showCloseButton: true,
	},
};

vex.defaultOptions.className = 'vex-theme-plain';