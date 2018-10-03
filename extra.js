'use strict';

import {Router, urlencoded} from 'express';
import api from './src/api';
import pdf from 'html-pdf';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import {getColumnColor} from './src/utils';

import makeTranslater from './src/translate';
import locales from './locales';
import {phantomZoom} from './api/config';

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const router = Router();

const classTimetableTemplate = ejs.compile(
	fs.readFileSync(path.join('./views/classtimetable.ejs'), 'utf8')
);

const amw = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/timetable/:id/timetable.pdf', function (req, res) {
	return api({
		url: '/admin/timetable/pdf/' + req.params.id,
		cookies: req.headers.cookie,
		data: {
			academicSessionId: req.session.siteAdmin.selectedSession.id,
			userId: req.session.siteAdmin.userdetails.userId,
			userType: req.session.siteAdmin.user_type,
			masterId: req.session.siteAdmin.masterId
		},
	})
		.then(function ({data: result}) {
			if(result.status) {
				let data = {};
				for (let i = weekdays.length - 1; i >= 0; i--) {
					data[weekdays[i]] = [];
				}
				let allocations = result.data.timetableallocations;
				for (let i = 0; i < allocations.length; i++) {
					data[allocations[i].weekday].push({
						start_time: allocations[i].start_time,
						end_time: allocations[i].end_time,
						subject: allocations[i].subject,
						teacher: allocations[i].teacher,
						is_break: allocations[i].is_break,
						tag: allocations[i].tag ? allocations[i].tag.tagdetails[0].title: '',
						color: getColumnColor()
					});
				}
				let numRows = 0;
				for (let i = weekdays.length - 1; i >= 0; i--) {
					if (data[weekdays[i]].length === 0) {
						delete data[weekdays[i]];
					} else {
						numRows = Math.max(data[weekdays[i]].length, numRows);
					}
				}
				let code = (req.session.lang && req.session.lang.code) || 'en';
				pdf.create(classTimetableTemplate({
					data,
					numRows,
					classTeacher: result.data.teacher.user.userdetails[0].fullname,
					className: result.data.bcsmap.board.boarddetails[0].alias
						+ '/' + result.data.bcsmap.class.classesdetails[0].name
						+ '/' + result.data.bcsmap.section.sectiondetails[0].name,
					moment: moment,
					__: makeTranslater(
						locales[code],
						code
					),
					weekdays: Object.keys(data).sort(
						(x, y) => weekdays.indexOf(x) - weekdays.indexOf(y)
					)
				}), {
					width: "297mm",
					height: "320mm",
					quality: 100
				}).toStream((err, stream) => {
					if (err) {
						res.sendStatus(500);
					} else {
						res.setHeader('content-type', 'application/pdf');
						stream.pipe(res);
					}
				});
			} else if (result.error) {
				res.redirect(result.url ? '/dashboard' : '/logout');
			} else {
				res.sendStatus(500);
			}
		});
});

const teacherTimetableTemplate = ejs.compile(
	fs.readFileSync(path.join('./views/weeklySchedule.ejs'), 'utf8')
); 
router.get('/weekly/:userId/:teacherId/timetable.pdf', function(req, res) {
	return api({
		url: '/admin/classes/teacherTimetable',
		cookies: req.headers.cookie,
		data: {
			academicSessionId: req.session.siteAdmin.selectedSession.id,
			userId: req.params.teacherId,
			id: req.params.userId,
			userType: req.session.siteAdmin.user_type,
			masterId: req.session.siteAdmin.masterId
		},
	}).then(function ({data: result}) {
		if (result.status) {
			let data = {};
			for (let i = weekdays.length - 1; i >= 0; i--) {
				data[weekdays[i]] = [];
			}
			for (let i = 0; i < result.data.length; i++) {
				data[result.data[i].weekday].push({
					period: result.data[i].period,
					subject: result.data[i].subject.subjectdetails[0].name,
					class: result.data[i].timetable.bcsmap.board.boarddetails[0].alias + ' - '
					+ result.data[i].timetable.bcsmap.class.classesdetails[0].name + ' - '
					+ result.data[i].timetable.bcsmap.section.sectiondetails[0].name,
					start_time: result.data[i].start_time,
					end_time: result.data[i].end_time,
					color: getColumnColor()
				});
			}
			let numRows = 0;
			for (let i = weekdays.length - 1; i >= 0; i--) {
				if (data[weekdays[i]].length === 0) {
					delete data[weekdays[i]];
				} else {
					numRows = Math.max(data[weekdays[i]].length, numRows);
				}
			}
			let code = (req.session.lang && req.session.lang.code) || 'en';
			pdf.create(teacherTimetableTemplate({
				data: data,
				numRows: numRows,
				weekdays: Object.keys(data).sort(
					(x, y) => weekdays.indexOf(x) - weekdays.indexOf(y)
				),
				moment: moment,
				teacher: result.teacher,
				__: makeTranslater(
					locales[code],
					code
				),
			}),{
				width: '297mm',
				height: '210mm',
				quality: 100
			}).toStream((err, stream) => {
				if (err) {
					res.sendStatus(500);
				} else {
					res.setHeader('content-type', 'application/pdf');
					stream.pipe(res);
				}
			});
		} else if(result.error){
			res.redirect(result.url ? '/dashboard' : '/logout');
		} else {
			res.sendStatus(500);
		}
	});
});

async function getMarksheetData(req) {
	let lang = (req.session.lang && req.session.lang.code) || 'en',
		langId = (req.session.lang && req.session.lang.id) || 1;
	if (req.query.students) req.query.students = req.query.students.split(',');
	let {data} = await api({
		url: '/admin/marksheet/data',
		cookies: req.headers.cookie,
		data: {
			...req.query,
			lang,
			langId,
			academicSessionId: req.session.siteAdmin.selectedSession.id,
			masterId: req.session.siteAdmin.masterId,
		},
	});
	let __ = makeTranslater(locales[lang], lang);
	if (data.status) {
		data.data.__ = __;
		data.data.siteAdmin = req.session.siteAdmin;
		data.data.moment = moment;
	} else {
		data.message = data.message || __('Internal Error');
	}
	return data;
}

router.get('/marksheet-download', amw(async (req, res) => {
	let {template, data, status, message} = await getMarksheetData(req);
	if (status) {
		res.render('marksheets/' + template + '.ejs', data);
	} else {
		res.send(message);
	}
}));

router.get('/marksheet-pdf', amw(async (req, res) => {
	let {template, data, printOptions, status, message} = await getMarksheetData(req);
	if (!status) {
		res.send(message);
		return;
	}
	data.phantomZoom = phantomZoom;
	req.app.render(
		'marksheets/' + template + '.ejs',
		data,
		(err, html) => {
			if (err) {
				console.error(err);
				res.status(500).end(data.__('Internal Error'));
			} else {
				pdf.create(html, printOptions)
					.toStream((err, stream) => {
						if (err) {
							console.error(err);
							res.status(500).end(data.__('Internal Error'));
						} else {
							res.setHeader('content-type', 'application/pdf');
							stream.pipe(res);
						}
					});
			}
		}
	);
}));

function getTcData(req) {
	let lang = (req.session.lang && req.session.lang.code) || 'en',
		data = JSON.parse(req.body.data),
		__ = makeTranslater(locales[lang], lang);
	data.__ = __;
	data.siteAdmin = req.session.siteAdmin;
	data.moment = moment;
	return data;
}

router.post('/tc-download', urlencoded({extended: false}), amw(async (req, res) => {
	res.render('tc.ejs', getTcData(req));
}));

router.post('/tc-pdf', urlencoded({extended: false}), amw(async (req, res) => {
	const data = getTcData(req);
	data.phantomZoom = phantomZoom;
	req.app.render(
		'tc.ejs',
		data,
		(err, html) => {
			if (err) {
				console.error(err);
				res.status(500).end(data.__('Internal Error'));
			} else {
				pdf.create(html, {
					width: '210mm',
					height: '297mm',
				})
					.toStream((err, stream) => {
						if (err) {
							console.error(err);
							res.status(500).end(data.__('Internal Error'));
						} else {
							res.setHeader('content-type', 'application/pdf');
							stream.pipe(res);
						}
					});
			}
		}
	);
}));

router.get('/teacher-performance/:bcsmapId', amw(async (req, res) => {
	let lang = (req.session.lang && req.session.lang.code) || 'en',
		langId = (req.session.lang && req.session.lang.id) || 1;
	let {data} = await api({
		url: '/admin/reports/teacher-performance',
		cookies: req.headers.cookie,
		data: {
			lang,
			langId,
			academicSessionId: req.session.siteAdmin.selectedSession.id,
			masterId: req.session.siteAdmin.masterId,
			bcsmapId: req.params.bcsmapId,
		},
	});
	let __ = makeTranslater(locales[lang], lang);
	if (data.status) {
		data.data.__ = __;
		data.data.siteAdmin = req.session.siteAdmin;
	} else {
		data.message = data.message || __('Internal Error');
	}
	res.render('teacher-performance.ejs', data.data);
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