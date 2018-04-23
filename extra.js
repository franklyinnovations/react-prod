'use strict';

import {Router, urlencoded} from 'express';
import api from './src/api';
import pdf from 'html-pdf'
const router = Router();

const amw = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/invoice/:id', amw(async (req, res) => {
	let id = req.params.id,
		lang = (req.session.lang && req.session.lang.code) || 'en',
		langId = (req.session.lang && req.session.lang.id) || 1;
	let {data} = await api({
		url: '/admin/transaction/invoice',
		data: {
			id,
			lang,
			langId,
			currency: req.session.siteAdmin.currency
		},
	});

	pdf.create(data).toStream((err, stream) => {
		if (err) {
			res.sendStatus(500);
		} else {
			res.setHeader('content-type', 'application/pdf');
			stream.pipe(res);
		}
	});
	
}));

router.get('/:code/terms-condition-app', amw(async (req, res) => {
  var code = req.params.code;
  res.render(code+'/terms_condition-app.ejs');
}));

router.get('/:code/privacy-policy-app', amw(async (req, res) => {
  var code = req.params.code;
  res.render(code+'/privacy_policy-app.ejs');
}));

export default router;