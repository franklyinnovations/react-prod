import api, {makeErrors, makeApiData} from '../../api';
import {messenger} from '../../utils';
import fileReaderStream from 'filereader-stream';
export {update} from './index';

const view = 'teacherimport';
let uploadXLSXInput = false;

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		const [{data: {id: roleId}}, {data: subjects}] = await Promise.all([
			api({
				data: makeApiData(state),
				url: '/admin/role/getAutoRoleId/' + state.session.masterId + '/teacher'
			}),
			api({
				data: makeApiData(state),
				url: '/admin/subject/list'
			}),
		]);
		dispatch({
			type: 'INIT_MODULE',
			view,
			roleId,
			subjects: subjects.map(subject=>({
				value:subject.id,
				label:subject.subjectdetails[0].name,
			})),
		});
	};
}

export function save(state){
	return async dispatch=>{
		dispatch({
			type:'SEND_IMPORT_TEACHER_REQUEST',
		});
		let totalTeachers = (state.item.data.length - 1), percentage = 0, pSuccess = 0, pError = 0;
		dispatch({
			type:'TI_SHOW_IMPORT_PROGRESS',
			percentage,
			pSuccess,
			pError
		});
		await asyncForEach(state.item.data, async (teacher, index) => {
			teacher = makeImportData(state, teacher, state.item.cols);
			let {data} = await api({
				data: makeApiData(state, teacher),
				url: '/admin/teacher/save',
				hideMessage: true,
			});
			percentage = ((index*100)/totalTeachers);
			if(data.status){
				pSuccess = Math.round(percentage - pError);
				data.name = teacher.user_detail.fullname;
			}else{
				pError = Math.round(percentage - pSuccess);
				if(data.errors){
					let errorsObj = makeErrors(data.errors), errors = [];
					Object.keys(errorsObj).forEach(key => {
						errors.push({
							path: key,
							message: errorsObj[key]
						});
					});
					data.errors = errors;
					data.name = teacher.user_detail.fullname;
				}
			}
			dispatch({
				type: 'TI_SHOW_IMPORT_PROGRESS',
				pSuccess,
				pError,
				percentage,
				data
			});

		}, 1);
	};
}

function asyncForEach(array, cb, index = 0, thisArg = null) {
	if (index === array.length) return Promise.resolve(true);
	return Promise.resolve(cb.call(thisArg, array[index], index, array))
		.then(() => asyncForEach(array, cb, index + 1, thisArg));
}

export function uploadXLSX() {
	return async dispatch => {
		let input;
		if (uploadXLSXInput) {
			input = uploadXLSXInput;
		} else {
			input =  uploadXLSXInput = document.createElement('input');
			input.setAttribute('type', 'file');
			input.style.display = 'none';
			document.body.appendChild(input);
			input.onchange = async() => {
				if(input.files.length === 0) return;
				if (!/\.(xlsx|xls)$/.test(input.value))
					return messenger.post({
						message: window.__('Only .xls, .xlsx files are allowed to upload'),
						type: 'error',
					});
				dispatch({
					type: 'LOAD_TI_SHEET_DATA'
				});
				const xlsx = (await import('exceljs/dist/es5/exceljs.browser')).default;
				let workbook = new xlsx.Workbook();
				await workbook.xlsx.read(fileReaderStream(input.files[0]));
				input.value = '';
				let worksheet = workbook.getWorksheet(1),
					headerRow = [],
					data = [];
				worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell) => {
					headerRow.push(cell.text);
				});
				worksheet.eachRow({includeEmpty: false}, (row) => {
					let dataRow = [];
					row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
						if(headerRow[colNumber-1]) dataRow.push(cell.text);
					});
					dataRow.push([]);
					data.push(dataRow);
				});
				if(data.length > 0){
					return dispatch({
						type: 'SET_TI_SHEET_DATA',
						data,
						fields: mapFields(window.__)
					});
				}else{
					messenger.post({
						message: window.__('No record found in selected file.'),
						type: 'error',
					});
					return dispatch({
						type: 'TI_EMPTY_SHEET'
					});
				}
			};
		}
		input.click();
	};
}

export function mapFields(__){
	let fields = [
		{
			value: 'ignore',
			label: __('Ignore Column')
		},
		{
			value: 'fullname',
			label: __('Name')
		},
		{
			value: 'email',
			label: __('Email')
		},
		{
			value: 'mobile',
			label: __('Mobile')
		}
	];
	return fields;
}

function makeImportData(state, row, cols){
	let item = {};
	row.forEach((col,index)=>{
		if(cols[index] && cols[index] !== 'ignore') item[cols[index]] = col;
	});	

	let trData = {};
	trData.user_detail = {};
	trData.teacher_detail = {};
	trData.teacher = {};

	//---- User---------
	trData.email = item.email || '';
	trData.mobile = item.mobile || '';
	trData.roleId = state.meta.roleId;
	trData.is_active = 1;
	trData.loginUrl = window.location.origin+'/login';
	trData.parentId = state.session.masterId;

	//----- User Details-----
	trData.user_detail.fullname = item.fullname || '';

	//----- Teacher Subject-----
	trData.teacher.subjectId = row[row.length - 1];

	return trData;
}
