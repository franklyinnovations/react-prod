import {host, ssl_options, wp_port} from '../../api/config';

export default function (dir = 'ltr') {
	let static_path = (ssl_options ? 'https://' : 'http://') + host + ":" + wp_port,
		mainjs = 'main.js',
		maincss = 'main.css';

	if (dir === 'rtl') {
		mainjs = 'main-rtl.js';
		maincss = 'main-rtl.css';
	}

	return (req, res, next) => {
		res.locals.dir = dir;
		switch (process.env.NODE_ENV) {
			case "development":
				if (dir === 'rtl' && process.env.RTL !== 'true') {
					res.status(500).send('ERROR: Launch with "npm run dev:rtl -s" instead of "npm run dev -s"');
					return;
				}

				res.locals.pretty = true;
				res.locals.app_stylesheets = '<script src=\'' + static_path + '/assets/js/devServerClient.js\'></script><script src=\'' + static_path + '/assets/js/' + mainjs + '\'></script>';
				res.locals.app_scripts = '<script src=\'' + static_path + '/assets/js/plugins.js\'></script><script src=\'' + static_path + '/assets/js/app.js\'></script>';
				break;
			default:
				res.locals.app_stylesheets = '<link rel=\'stylesheet\' href=\'/css/' + maincss + '\' />';
				res.locals.app_scripts = '<script src=\'/js/plugins.js\'></script><script src=\'/js/app.js\'></script>';
				break;
		}
		next();
	};
}