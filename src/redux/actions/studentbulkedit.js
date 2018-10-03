import moment from 'moment';
import api, {makeApiData} from '../../api';
export {update} from './index';

const view = 'studentbulkedit';

export function init(state, loading=true) {
	return dispatch => {
		if(loading) {
			dispatch({
				type: 'LOADING_MODULE',
				view
			});
		}
		return Promise.all([
			api({
				url: '/admin/utils/allBcsByMasterId',
				cookies: state.cookies,
				data: makeApiData(state),
				hideMessage: true
			}).then(({data}) => data.data.map(item => ({
				value: item.id,
				label: item.board.boarddetails[0].alias 
				+'-'+item.class.classesdetails[0].name
				+'-'+item.section.sectiondetails[0].name
			}))),
		]).then(([bcsmaps]) => {
			dispatch({
				type: 'INIT_MODULE',
				bcsmaps,
				stopLoading: true,
				view,
			});
		});
	};
}

export function save(state, stdata) {
	return async dispatch => {
		dispatch({
			type: 'SEND_SBE_REQUEST',
		});

		await api({
			data: makeApiData(state, stdata),
			url: '/admin/studentbulkedit/save'
		});

		return dispatch(init(state));
	};
}

export function errors(errors) {
	return {
		type: 'SET_IMPORT_STUDENT_SAVE_ERRORS',
		errors,
	};
}

export function getStudents(state, name, value) {

	return dispatch => {
		dispatch({
			type: 'UPDATE_SBE_DATA_VALUE',
			name,
			value
		});
		if(value && name === 'bcsmapId'){
			return api({
				url: '/admin/studentbulkedit/getStudents',
				data: makeApiData(state, {
					bcsmapId: value,
					academicSessionId: state.session.selectedSession.id
				}),
			}).then(({data}) => {
				data.data.forEach(item => {
					item.student.doa = item.student.doa && moment(item.student.doa).format(state.session.userdetails.date_format);
					item.student.dob = item.student.dob && moment(item.student.dob).format(state.session.userdetails.date_format);
					item.student.date_of_release = item.student.date_of_release && moment(item.student.date_of_release).format(state.session.userdetails.date_format);
					item.student.date_of_expiration = item.student.date_of_expiration && moment(item.student.date_of_expiration).format(state.session.userdetails.date_format);
				});
				dispatch({
					type: 'SET_SBE_STUDENT',
					data: data.data,
					fields: mapFields(window.__, state.session.userdetails.countryISOCode)
				});
			});
		}
	};
}

function mapFields(__, countryISOCode) {
	let fields = [
		{
			type: 'text',
			value: 'student:doa',
			label: __('Admission Date')
		},{
			type: 'text',
			value: 'studentdetails:birthmark',
			label: __('Birthmark')
		},{
			type: 'text',
			value: 'student:blood_group',
			label: __('Blood Group')
		},{
			type: 'text',
			value: 'studentdetails:address',
			label: __('Communication Address')
		},{
			type: 'text',
			value: 'student:dob',
			label: __('Date of Birth')
		},{
			type: 'email',
			value: 'user:email',
			label: __('Email')
		},{
			type: 'number',
			value: 'student:father_contact',
			label: __("Father's Contact")
		},{
			type: 'text',
			value: 'studentdetails:father_name',
			label: __("Father's Name")
		},{
			type: 'text',
			value: 'studentdetails:father_occupation',
			label: __("Father's Occupation")
		},{
			type: 'email',
			value: 'student:father_email',
			label: __("Father's Email")
		},{
			type: 'number',
			value: 'student:father_contact_alternate',
			label: __("Father's Alternate Contact")
		},{
			type: 'number',
			value: 'student:mother_contact',
			label: __("Mother's Contact")
		},{
			type: 'text',
			value: 'studentdetails:mother_name',
			label: __("Mother's Name")
		},{
			type: 'text',
			value: 'studentdetails:mother_occupation',
			label: __("Mother's Occupation")
		},{
			type: 'email',
			value: 'student:mother_email',
			label: __("Mother's Email")
		},{
			type: 'number',
			value: 'student:mother_contact_alternate',
			label: __("Mother's Alternate Contact")
		},{
			type: 'text',
			value: 'userdetails:fullname',
			label: __('Student Name')
		},{
			type: 'text',
			value: 'student:gender',
			label: __('Gender')
		},{
			type: 'text',
			value: 'studentdetails:guardian_address',
			label: __('Guardian Address')
		},{

			type: 'number',
			value: 'student:guardian_contact',
			label: __('Guardian Contact')
		},{
			type: 'text',
			value: 'studentdetails:guardian_name',
			label: __('Guardian Name')
		},{
			type: 'text',
			value: 'studentdetails:guardian_relationship',
			label: __('Guardian Relationship')
		},{
			type: 'number',
			value: 'student:guardian_contact_alternate',
			label: __("Guardian's Alternate Contact")
		},{
			type: 'text',
			value: 'studentdetails:height',
			label: __('Height')
		},{
			type: 'text',
			value: 'studentdetails:weight',
			label: __('Weight')
		},{
			type: 'number',
			value: 'user:mobile',
			label: __('Mobile Number')
		},{
			type: 'text',
			value: 'studentdetails:nationality',
			label: __('Nationality')
		},{
			type: 'text',
			value: 'studentdetails:birthplace',
			label: __('Place of Birth')
		},{
			type: 'text',
			value: 'studentdetails:pre_school_address',
			label: __('Previous Organization Address')
		},{
			type: 'text',
			value: 'studentdetails:pre_school_name',
			label: __('Previous Organization Name')
		},{
			type: 'text',
			value: 'studentdetails:pre_qualification',
			label: __('Previous Qualification')
		},{
			type: 'text',
			value: 'studentdetails:religion',
			label: __('Religion')
		},{
			type: 'number',
			value: 'studentrecord:roll_no',
			label: __('Roll Number')
		},{
			type: 'number',
			value: 'student:no_of_brother',
			label: __('Number of Brothers')
		},{
			type: 'number',
			value: 'student:no_of_sister',
			label: __('Number of Sisters')
		},{
			type: 'text',
			value: 'studentdetails:standard_of_living',
			label: __('Standard of Living')
		},{
			type: 'number',
			value: 'student:no_of_brother_in_school',
			label: __('Number of Brother in School')
		},{
			type: 'number',
			value: 'student:no_of_sister_in_school',
			label: __('Number of Sister in School')
		},{
			type: 'number',
			value: 'student:rank_in_family',
			label: __('Rank of Student in Family')
		},{
			type: 'text',
			value: 'studentdetails:health_issue_detail',
			label: __('Health issue details')
		},{
			type: 'text',
			value: 'studentdetails:allergies_detail',
			label: __('Allergy details')
		},{
			type: 'text',
			value: 'studentdetails:medicine_detail',
			label: __('Medicine details')
		},{
			type: 'text',
			value: 'studentdetails:asthma_detail',
			label: __('Asthma details')
		},{
			type: 'text',
			value: 'studentdetails:disability_detail',
			label: __('Disability details')
		}
	];

	if(countryISOCode === 'IN'){
		fields.push({
			type: 'text',
			value: 'student:aadhar',
			label: __('Aadhar No')
		},{
			type: 'text',
			value: 'student:res_category',
			label: __('Category')
		});
	}

	if(countryISOCode === 'OM'){
		fields.push({
			type: 'text',
			value: 'student:residancy_number',
			label: __('Residency Number (For Non Residential)')
		},{
			type: 'text',
			value: 'student:rn_issuer',
			label: __('RN Issuer (For Non Residential)')
		},{
			type: 'text',
			value: 'student:date_of_release',
			label: __('Date Of Release (For Non Residential)')
		},{
			type: 'text',
			value: 'student:date_of_expiration',
			label: __('Date of Expiration (For Non Residential)')
		});
	}

	return fields;
}

