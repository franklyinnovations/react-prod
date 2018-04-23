/* Import your third-Party plugins here */

import 'js/modernizr.js';
import 'js/jquery.js';
import 'js/perfect-scrollbar.js';
import 'bower_components/moment/min/moment.min.js';
import 'bower_components/eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker.js';
import 'bower_components/vex/js/vex.combined.min.js';
import 'bower_components/messenger/build/js/messenger.min.js';
import 'bower_components/messenger/build/js/messenger-theme-flat.js';
import "bower_components/blueimp-gallery/js/blueimp-gallery.js";
import 'bower_components/trumbowyg/dist/trumbowyg.min.js';

Messenger.options = {
	theme: 'flat',
	extraClasses: 'messenger-on-right messenger-on-top messenger-fixed',
	messageDefaults: {
		showCloseButton: true
	}
};

vex.defaultOptions.className = 'vex-theme-flat-attack';

Pace.options.ajax.trackMethods.push("POST");
Pace.options.ajax.trackWebSockets = false;
Pace.options.ajax.ignoreURLs = [/socket\.io/];