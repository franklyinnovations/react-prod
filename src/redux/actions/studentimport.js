import api, {makeErrors, makeApiData} from '../../api';
import {messenger} from '../../utils';
import moment from 'moment';

const view = 'studentimport';
let uploadXLSXInput = false;

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view
		});
		const [{data: role}, {data: {data: bcsmaps}}] = await Promise.all([
			api({
				data: makeApiData(state),
				cookies: state.cookies,
				url: '/admin/role/getAutoRoleId/' + state.session.masterId + '/student',
				hideMessage: true
			}),
			api({
				url: '/admin/utils/allBcsByMasterId',
				cookies: state.cookies,
				data: makeApiData(state),
				hideMessage: true
			})
		]);
		dispatch({
			type: 'INIT_MODULE',
			role,
			bcsmaps: bcsmaps.map(item => ({
				value: item.id,
				label: item.board.boarddetails[0].alias 
					+'-'+item.class.classesdetails[0].name
					+'-'+item.section.sectiondetails[0].name
			})),
			languages: state.session.languages.map(item => ({
				value: item.id,
				label: item.name
			})),
			academicSessions: state.session.userdetails.academicSessions.map(item => ({
				value: item.id,
				label: item.academicsessiondetails[0].name
			})),
			view,
		});
	};
}

export function save(state) {
	return async dispatch => {
		dispatch({
			type: 'SEND_IMPORT_STUDENT_REQUEST',
		});

		let errors = {};
		if(!state.item.bcsMapId){
			errors.bcsMapId = 'This is a required field.';
		}
		if(!state.item.academicSessionId){
			errors.academicSessionId = 'This is a required field.';
		}
		if(!state.item.languageId){
			errors.languageId = 'This is a required field.';
		}

		if(Object.keys(errors).length !== 0) {
			return dispatch({
				type: 'SET_IMPORT_STUDENT_SAVE_ERRORS',
				errors,
			});	
		} else {
			let totalStudents = (state.item.data.length - 1), percentage = 0, pSuccess = 0, pError = 0;
			dispatch({
				type: 'SI_SHOW_IMPORT_PROGRESS',
				pSuccess,
				pError,
			});
			await asyncForEach(state.item.data, async (student, index) => {

				let {data} = await api({
					data: makeApiData(state, makeImportData(state, student, state.item.cols)),
					url: '/admin/import/importStudent'
				});
				percentage = ((index * 100) / totalStudents);
				if(data.status)
					pSuccess = Math.round(percentage - pError);
				else {
					pError = Math.round(percentage - pSuccess);
					if(data.errors) {
						let errorsObj = makeErrors(data.errors), errors = [];
						Object.keys(errorsObj).forEach(key => {
							errors.push({
								path: key,
								message:errorsObj[key]
							});
						});
						data.errors = errors;
					}
				}
				dispatch({
					type: 'SI_SHOW_IMPORT_PROGRESS',
					pSuccess,
					pError,
					percentage,
					data
				});
			}, 1);
		}
	};
}

function asyncForEach(array, cb, index = 0, thisArg = null) {
	if (index === array.length) return Promise.resolve(true);
	return Promise.resolve(cb.call(thisArg, array[index], index, array))
		.then(() => asyncForEach(array, cb, index + 1, thisArg));
}

export function errors(errors) {
	return {
		type: 'SET_IMPORT_STUDENT_SAVE_ERRORS',
		errors,
	};
}

export function uploadXLSX(state) {
	return async dispatch => {
		let input;
		if (uploadXLSXInput) {
			input = uploadXLSXInput;
		} else {
			input = uploadXLSXInput = document.createElement('input');
			input.setAttribute('type', 'file');
			input.style.display = 'none';
			document.body.appendChild(input);
			input.onchange = async () => {
				if (input.files.length === 0) return;
				if (!/\.(xlsx|xls)$/.test(input.value))
					return messenger.post({
						message: window.__('Only .xls, .xlsx files are allowed to upload'),
						type: 'error',
					});
				dispatch({
					type: 'LOAD_SI_SHEET_DATA'
				});
				let [xlsx, fileReaderStream] = await Promise.all([
					import('exceljs/dist/es5/exceljs.browser'),
					import('filereader-stream'),
				]);
				xlsx = xlsx.default;
				fileReaderStream = fileReaderStream.default;
				let workbook = new xlsx.Workbook();
				await workbook.xlsx.read(fileReaderStream(input.files[0]));
				input.value = '';
				let worksheet = false;
				workbook.eachSheet(ws => {
					if (!worksheet) worksheet = ws;
				});
				if (! worksheet) {
					messenger.post({
						message: window.__('No record found in selected file.'),
						type: 'error',
					});
					return dispatch({
						type: 'SI_EMPTY_SHEET'
					});
				}

				let headerRow = [], data = [];
				worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell, colNumber) => {
					headerRow.push(cell.value);
				});
				worksheet.eachRow({includeEmpty: false}, (row, rowNumber) => {
					let dataRow = [];
					row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
						if(headerRow[colNumber-1])
							dataRow.push(cell.value instanceof Date ? cell.value : cell.text);
					});
					data.push(dataRow);
				});
				if(data.length > 1){
					return dispatch({
						type: 'SET_SI_SHEET_DATA',
						data,
						fields: mapFields(window.__, state.session.userdetails.countryISOCode)
					});
				} else {
					messenger.post({
						message: window.__('No record found in selected file.'),
						type: 'error',
					});
					return dispatch({
						type: 'SI_EMPTY_SHEET'
					});
				}
			};
		}
		input.click();
	};
}

function mapFields(__, countryISOCode) {
	let fields = [
		{
			value: 'ignore',
			label: __('Ignore Column')
		},{
			value: 'doa',
			label: __('Admission Date')
		},{
			value: 'birthmark',
			label: __('Birthmark (Optional)')
		},{
			value: 'blood_group',
			label: __('Blood Group (Optional)')
		},{
			value: 'address',
			label: __('Communication Address')
		},{
			value: 'dob',
			label: __('Date of Birth')
		},{
			value: 'email',
			label: __('Email')
		},{
			value: 'enrollment_no',
			label: __('Enrollment Number')
		},{
			value: 'father_name',
			label: __("Father's Name")
		},{
			value: 'father_occupation',
			label: __("Father's Occupation (Optional)")
		},{
			value: 'father_email',
			label: __("Father's Email (Optional)")
		},{
			value: 'father_contact',
			label: __("Father's Contact")
		},{
			value: 'father_contact_alternate',
			label: __('Father’s Alternate Contact (Optional)')
		},{
			value: 'fee_receipt_no',
			label: __('Fee Receipt No (Optional)')
		},{
			value: 'form_no',
			label: __('Form No (Optional)')
		},{
			value: 'fullname',
			label: __('Student Name')
		},{
			value: 'gender',
			label: __('Gender')
		},{
			value: 'guardian_address',
			label: __('Guardian Address (Optional)')
		},{
			value: 'guardian_contact',
			label: __('Guardian Contact (Optional)')
		},{
			value: 'guardian_name',
			label: __('Guardian name (Optional)')
		},{
			value: 'guardian_relationship',
			label: __('Guardian Relationship (Optional)')
		},{
			value: 'guardian_contact_alternate',
			label: __("Guardian's Alternate Contact (Optional)")
		},{
			value: 'height',
			label: __('Height (Optional)')
		},{
			value: 'weight',
			label: __('Body Weight (Optional)')
		},{
			value: 'mobile',
			label: __('Mobile Number')
		},{
			value: 'mother_name',
			label: __("Mother's Name")
		},{
			value: 'mother_occupation',
			label: __("Mother's Occupation (Optional)")
		},{
			value: 'mother_email',
			label: __("Mother's Email (Optional)")
		},{
			value: 'mother_contact',
			label: __("Mother's Contact (Optional)")
		},{
			value: 'mother_contact_alternate',
			label: __("Mother's Alternate Contact (Optional)")
		},{
			value: 'nationality',
			label: __('Nationality')
		},{
			value: 'birthplace',
			label: __('Place of Birth')
		},{
			value: 'address_2',
			label: __('Permanent Address')
		},{
			value: 'pre_school_address',
			label: __('Pre Organization Address (Optional)')
		},{
			value: 'pre_school_name',
			label: __('Pre Organization Name (Optional)')
		},{
			value: 'pre_qualification',
			label: __('Pre Qualification (Optional)')
		},{
			value: 'religion',
			label: __('Religion (Optional)')
		},{
			value: 'roll_no',
			label: __('Roll Number')
		},{
			value: 'no_of_brother',
			label: __('Number of Brothers (Optional)')
		},{
			value: 'no_of_sister',
			label: __('Number of Sisters (Optional)')
		},{
			value: 'standard_of_living',
			label: __('Standard of Living (Optional)')
		},{
			value: 'no_of_brother_in_school',
			label: __('Number of Brother in School (Optional)')
		},{
			value: 'no_of_sister_in_school',
			label: __('Number of Sister in School (Optional)')
		},{
			value: 'rank_in_family',
			label: __('Rank of Student in Family (Optional)')
		},{
			value: 'health_issue_detail',
			label: __('Health issue details (Optional)')
		},{
			value: 'allergies_detail',
			label: __('Allergy details (Optional)')
		},{
			value: 'medicine_detail',
			label: __('Medicine details (Optional)')
		},{
			value: 'asthma_detail',
			label: __('Asthma details (Optional)')
		},{
			value: 'disability_detail',
			label: __('Disability details (Optional)')
		}
	];

	if(countryISOCode === 'IN'){
		fields.push({
			value: 'aadhar',
			label: __('Aadhar No')
		},{
			value: 'res_category',
			label: __('Category')
		});
	}

	if(countryISOCode === 'OM'){
		fields.push({
			value: 'residancy_number',
			label: __('Residency Number (For Non Residential)')
		},{
			value: 'rn_issuer',
			label: __('RN Issuer (For Non Residential)')
		},{
			value: 'date_of_release',
			label: __('Date Of Release (For Non Residential)')
		},{
			value: 'date_of_expiration',
			label: __('Date of Expiration (For Non Residential)')
		});
	}

	return fields;
}

function makeImportData(state, row, cols) {
	let data = [],
		item = {};
	row.forEach((col, index) => {
		if(cols[index] && cols[index] !== 'ignore') item[cols[index]] = col;
	});

	let stData = {}, 
		form_no = item.form_no ? item.form_no.toString().trim() : null, 
		fee_receipt_no = item.fee_receipt_no ? item.fee_receipt_no.toString().trim() : null,
		roll_no = item.roll_no ? item.roll_no.toString().trim() : null,
		guardian_name = item.guardian_name ? item.guardian_name.toString().trim() : null,
		guardian_relationship = item.guardian_relationship ? item.guardian_relationship.toString().trim() : null,
		guardian_address = item.guardian_address ? item.guardian_address : null,
		birthmark = item.birthmark ? item.birthmark.toString().trim() : null,
		pre_school_name = item.pre_school_name ? item.pre_school_name.toString().trim() : null,
		pre_school_address = item.pre_school_address ? item.pre_school_address.toString().trim() : null,
		pre_qualification = item.pre_qualification ? item.pre_qualification.toString().trim() : null,
		smobile = item.mobile || item.father_contact || '',
		fmobile = item.father_contact || item.mobile || '';

	stData.user_detail = {};
	stData.student_detail = {};
	stData.student_record = {};
	stData.student = {};

	//---- User---------
	stData.parentId = state.session.masterId;
	stData.roleId = state.item.roleId;
	stData.masterId = state.session.masterId;
	stData.mobile = smobile;
	stData.email = item.email || '';
	stData.user_name = state.session.masterId;
	stData.user_type = 'student';
	stData.secondary_lang = state.session.secondary_lang;
	stData.is_active = 1;
	stData.loginUrl = window.location.origin+'/login';
	stData.institute_name = state.session.userdetails.institute_name;

	//----- User Details-----
	stData.user_detail.languageId = state.item.languageId;
	stData.user_detail.fullname = item.fullname || '';

	//-------student------------
	stData.student.masterId = state.session.masterId;
	stData.student.enrollment_no = item.enrollment_no || '';
	if (form_no) {
		stData.student.form_no = form_no;
	}
	if (fee_receipt_no) {
		stData.student.fee_receipt_no = fee_receipt_no;
	}

	stData.student.doa = item.doa instanceof Date ? moment(item.doa).format('YYYY-MM-DD') : (item.doa || '');
	stData.student.dob = item.dob instanceof Date ? moment(item.dob).format('YYYY-MM-DD') : (item.dob || '');
	stData.student.age = 0;
	stData.student.blood_group = item.blood_group ? item.blood_group.toString().trim().toUpperCase() : '';
	stData.student.gender = item.gender ? item.gender.toString().trim().toLowerCase() : '';
	stData.student.countryId = state.session.userdetails.countryId;
	stData.student.stateId = state.session.userdetails.stateId;
	stData.student.cityId = state.session.userdetails.cityId;
	stData.student.countryId_2 = state.session.userdetails.countryId;
	stData.student.stateId_2 = state.session.userdetails.stateId;
	stData.student.cityId_2 = state.session.userdetails.cityId;
	stData.student.father_contact = fmobile;
	stData.student.father_contact_alternate = item.father_contact_alternate ? item.father_contact_alternate : '';
	stData.student.mother_contact = item.mother_contact ? item.mother_contact : '';
	stData.student.mother_contact_alternate = item.mother_contact_alternate ? item.mother_contact_alternate : '';
	stData.student.guardian_contact = item.guardian_contact ? item.guardian_contact : '';
	stData.student.guardian_contact_alternate = item.guardian_contact_alternate ? item.guardian_contact_alternate : '';
	stData.student.mother_email = item.mother_email ? item.mother_email : '';
	stData.student.father_email = item.father_email ? item.father_email : '';
	stData.student.no_of_brother = item.no_of_brother ? item.no_of_brother : null;
	stData.student.no_of_sister = item.no_of_sister ? item.no_of_sister : null;
	stData.student.no_of_brother_in_school = item.no_of_brother_in_school ? item.no_of_brother_in_school : null;
	stData.student.no_of_sister_in_school = item.no_of_sister_in_school ? item.no_of_sister_in_school : null;
	stData.student.rank_in_family = item.rank_in_family ? item.rank_in_family : null;
	stData.student.same_as_comm_add = item.address_2 ? 0 : 1;

	if(state.session.userdetails.countryISOCode === 'IN'){
		//Start For only India
		stData.student.res_category = item.res_category ? item.res_category.toString().trim().toLowerCase() : '';
		stData.student.aadhar = item.aadhar ? item.aadhar.toString().trim() : '';
		if (!stData.student.aadhar || (stData.student.aadhar.length === 0)) {
			stData.student.aadhar = null;
		}
		//End For India
	}

	if(state.session.userdetails.countryISOCode === 'OM'){
		//Start For only Oman
		stData.student.residancy_number = item.residancy_number ? item.residancy_number.toString().trim() : '';
		stData.student.rn_issuer = item.rn_issuer ? item.rn_issuer.toString().trim() : '';
		stData.student.date_of_release = item.date_of_release instanceof Date ? moment(item.date_of_release).format('YYYY-MM-DD') : (item.date_of_release || null);
		stData.student.date_of_expiration = item.date_of_expiration instanceof Date ? moment(item.date_of_expiration).format('YYYY-MM-DD') : (item.date_of_expiration || null);
		//End For Oman
	}

	//----------student details--------
	stData.student_detail.masterId = state.session.masterId;
	stData.student_detail.languageId = state.item.languageId;
	stData.student_detail.father_name = item.father_name ? item.father_name.toString().trim() : '';
	stData.student_detail.mother_name = item.mother_name ? item.mother_name.toString().trim() : '';
	if (guardian_name) {
		stData.student_detail.guardian_name = guardian_name;
	}
	if (guardian_relationship) {
		stData.student_detail.guardian_relationship = guardian_relationship;
	}
	if (guardian_address) {
		stData.student_detail.guardian_address = guardian_address;
	}
	if (birthmark) {
		stData.student_detail.birthmark = birthmark;
	}
	stData.student_detail.height = item.height ? item.height.toString().trim() : '';
	stData.student_detail.weight = item.weight ? item.weight.toString().trim() : '';
	stData.student_detail.address = item.address ? item.address.toString().trim() : '';
	stData.student_detail.address_2 = item.address_2 ? item.address_2.toString().trim() : '';
	stData.student_detail.religion = item.religion ? item.religion.toString().trim() : '';
	stData.student_detail.nationality = item.nationality ? item.nationality.toString().trim() : '';
	stData.student_detail.birthplace = item.birthplace ? item.birthplace.toString().trim() : '';
	stData.student_detail.father_occupation = item.father_occupation ? item.father_occupation.toString().trim() : '';
	stData.student_detail.mother_occupation = item.mother_occupation ? item.mother_occupation.toString().trim() : '';
	stData.student_detail.standard_of_living = item.standard_of_living ? item.standard_of_living.toString().trim() : '';
	if(item.health_issue_detail){
		stData.student_detail.health_issue_detail = item.health_issue_detail.toString().trim();
		stData.student.is_health_issue = true;
	}
	if(item.allergies_detail){
		stData.student_detail.allergies_detail = item.allergies_detail.toString().trim();
		stData.student.is_allergies	= true;
	}
	if(item.medicine_detail){
		stData.student_detail.medicine_detail = item.medicine_detail.toString().trim();
		stData.student.is_medicine = true;
	}
	if(item.asthma_detail){
		stData.student_detail.asthma_detail = item.asthma_detail.toString().trim();
		stData.student.is_asthma = true;
	}
	if(item.disability_detail){
		stData.student_detail.disability_detail = item.disability_detail.toString().trim();
		stData.student.is_disability = true;
	}

	if (pre_school_name) {
		stData.student_detail.pre_school_name = pre_school_name;
	}
	if (pre_school_address) {
		stData.student_detail.pre_school_address = pre_school_address;
	}
	if (pre_qualification) {
		stData.student_detail.pre_qualification = pre_qualification;
	}

	//------student records---------
	stData.student_record.masterId = state.session.masterId;
	stData.student_record.academicSessionId = state.item.academicSessionId;
	stData.student_record.bcsMapId = state.item.bcsMapId;
	if (roll_no) {
		stData.student_record.roll_no = roll_no;
	}

	return stData;
}
