import React from 'react';
import moment from 'moment';
import {Label} from '@sketchpixy/rubix';
import api,{makeApiData} from 'api';
import { log } from 'util';

export async function getTagType(state){
	var newdata;
	var value = await api({
		data: makeApiData(state),
		url: '/admin/tag/tagtypes',
		hideMessage: true
	});
	if(value.data.data) {
		newdata = value.data.data.map(item => ({
			value: item.id,
			label: item.tagtypedetails[0].title
		}));
	} else {
		newdata = []
	}

	return newdata;
}

export async function serviceTag(state,Id){
	let	data = makeApiData(state);
	data.id = Id;
	data.userId = state.session ? state.session.id : "";

	var value = await api({
		data,
		url: '/admin/tag/tagsbyType',
		hideMessage: true
	});
	let newdata;
	if(value.data.data) {
		newdata = value.data.data.tags.map(item => ({
			value: item.id,
			label: item.tagdetails[0].title
		}));
	} else {
		newdata = [];
	}

	return newdata;
}

export async function getAllCityAtOnce(state){
	let	data = makeApiData(state);
	var value = await api({
		data,
		url: '/admin/city/getAllCityAtOnce'
	});

	let newdata;
	newdata = value.data.data.map(item => ({
		value: item.id,
		label: item.citydetails[0].name
	}));

	return newdata;
}

export function timeData(initValue){
	
	var x = 30; //minutes interval
	var times = []; // time array
	var tt = 0; // start time
	var ap = ['AM', 'PM']; // AM-PM
	if(initValue>0){
		var tt=(30*initValue);
	}
	//loop to increment the time and push results in array
	var j=0;
	for (var i=initValue;tt<24*60; i++) {
		var hh = Math.floor(tt/60); // getting hours of day in 0-24 format
		var mm = (tt%60); // getting minutes of the hour in 0-55 format
		
		let pp = ("0" + (hh % 24)).slice(-2) + ':' + ("0" + mm).slice(-2) + ":00";
		let op = ("0" + (hh % 12)).slice(-2) + ':' + ("0" + mm).slice(-2);

		if(hh === 0 && mm === 0){
			pp = "00:05:00";
			op = "00:05";
		}

		times[j] = {
			value:i,
			seconds : convertTimeInSeconds(pp),
			label: op + ap[Math.floor(hh/12)]
		}; // pushing data in array in [00:00 - 12:00 AM/PM format]
		tt = tt + x;
		j++;
	}
	return times;
}

export function timeDropdown(initValue = 0){
	var x = 10; //minutes interval
	var times = []; // time array
	var tt = 10; // start time
	var ap = ['AM', 'PM']; // AM-PM
	if(initValue>0){
		var tt=(30*initValue);
	}
	//loop to increment the time and push results in array
	var j=0;
	
	for (var i=initValue;tt<60; i++) {
		var hh = Math.floor(tt/60); // getting hours of day in 0-24 format
		var mm = (tt%60); // getting minutes of the hour in 0-55 format
		times[j] = {
			value:i,
			seconds : ("0" + mm).slice(-2),
			label:("0" + mm).slice(-2) + " Mins"
		}; // pushing data in array in [00:00 - 12:00 AM/PM format]
		tt = tt + x;
		j++;
	}
	return times;
}


function convertTimeInSeconds(hms){
	var a = hms.split(':'); // split it at the colons

	// minutes are worth 60 seconds. Hours are worth 60 minutes.
	return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
}

export function getInputValue(el) {
	let value;
	if (el.type === 'checkbox')
	value = el.checked;
	else if (el.type === 'select-multiple') {
		value = [];
		let options = el.options;
		for (var i = options.length - 1; i >= 0; i--) {
			if (options[i].selected)
			value.push(options[i].value);
		}
	}
	else
	value = el.value;
	return value;
}

export function getStatusLabel(status, __){
	switch(status) {
		case 0:
		return <Label bsStyle="danger">{__('Inactive')}</Label>;
		case 1:
		return <Label bsStyle="success">{__('Active')}</Label>;
		case -1:
		return <Label bsStyle="warning">{__('Updating')}</Label>;
	}
}

export function getJobStatusLabel(status, __){
	switch(status) {
		case 0:
		return <Label bsStyle="danger">Inactive</Label>;
		case 1:
		return <Label bsStyle="default">Drafts</Label>;
		case 2:
		return <Label bsStyle="success">Published</Label>;
		case -1:
		return <Label bsStyle="warning">Updating</Label>;
	}
}

export function getStatusOptions(__) {
	return [
		{
			value: '',
			label: __('All')
		},
		{
			value: '0',
			label: __('Inactive')
		},
		{
			value: '1',
			label: __('Active')
		}
	]
}


export function getvehicleTypes(__) {
	return [
		{
			value: '',
			label:'--'+__('Please select vehicle type')+'--'
		},
		{
			value: 'auto',
			label: __('Auto')
		},
		{
			value: 'bus',
			label: __('Bus')
		},
		{
			value: 'van',
			label: __('Van')
		}
	]
}

export function getSMSProvider(__) {
	return [
		{
			value: '',
			label:'--'+__('Please select SMS Provider')+'--'
		},
		{
			value: 1,
			label: __('Msg91')
		},
		{
			value: 2,
			label: __('AWS')
		},
		{
			value: 3,
			label: __('MessageBird')
		}
	]
}

export function getSalutation(__){
	return [
		{
			value: 'Dr.',
			label: __('Dr')
		},
		{
			value: 'M.D.',
			label: __('M.D.')	
		},
		{
			value: 'Mr.',
			label: __('Mr')
		},
		{
			value: 'Mrs.',
			label: __('Mrs')
		},
	]
}

export function getStatusIcon(status) {
	switch(status) {
		case 0:
		return 'icon-simple-line-icons-check';
		case 1:
		return 'icon-simple-line-icons-close';
		case -1:
		return 'icon-fontello-spin4';
	}
}

export function getGender(__){
	return [
		{
			value: '',
			label:'--'+__('Please select Gender')+'--'
		},
		{
			value: 'male',
			label: __('Male')
		},
		{
			value: 'female',
			label: __('Female')
		}
	]
}

export function getBloodGroup(__){
	return [
		{
			value: '',
			label:'--'+__('Please select Blood Group')+'--'
		},
		{
			value: 'A+',
			label: __('A+')
		},
		{
			value: 'A-',
			label: __('A-')
		},
		{
			value: 'B+',
			label: __('B+')
		},
		{
			value: 'B-',
			label: __('B-')
		},
		{
			value: 'O+',
			label: __('O+')
		},
		{
			value: 'O-',
			label: __('O-')
		},
		{
			value: 'AB+',
			label: __('AB+')
		},
		{
			value: 'AB-',
			label: __('AB-')
		},
	]
}

export function getResCategory(__){
	return [
		{
			value: '',
			label:'--'+__('Please select Blood Group')+'--'
		},
		{
			value: 'gen',
			label: __('General')
		},
		{
			value: 'sc',
			label: __('SC')
		},
		{
			value: 'st',
			label: __('ST')
		},
		{
			value: 'obc',
			label: __('OBC')
		},
		{
			value: 'ews',
			label: __('EWS')
		},
		{
			value: 'dg',
			label: __('Disadvantage Group')
		}
	]
}

export function getYears() {
	let currentYear = (new Date()).getFullYear();
	var yearArray = [];
	for(var i = currentYear; i >= 1970; i--) {
		yearArray.push(i);
	}
	return yearArray;
}

export function getClaimStatusLabel(status, __){
	switch(status) {
		case 'non-claimed':
			return <Label bsStyle="danger">{__('Not Claimed')}</Label>;
		case 'pending':
			return __('Pending');
		case 'approved':
			return <Label bsStyle="success">{__('Approved')}</Label>;
		case 'user-created':
			return <Label bsStyle="primary">{__('User Created')}</Label>;
		case 'rejected':
			return <Label bsStyle="primary">{__('Rejected')}</Label>;
	}
}

export function getVerificationStatusLabel(status, __){
	switch(status) {
		case 'pending':
			return __('Pending');
		case 'verified':
			return <Label bsStyle="success">{__('Verified')}</Label>;
		case 'incomplete-profile':
			return <Label bsStyle="warning">{__('Profile Incomplete')}</Label>;
		default:
			return null;
	}
}

export function text_truncate(str, length, ending) {
    if (length == null) {
      	length = 100;
    }
    if (ending == null) {
      	ending = '...';
    }
    if (str.length > length) {
      	return str.substring(0, length - ending.length) + ending;
    } else {
      	return str;
    }
};

export function tagtypeIds() {
	return {
        ServiceTagId: 1,
        SpecializationTagId: 2,
        EducationQualificationTagId: 3,
        EducationCollegetagId: 4,
        RegistrationCluncilTagId: 5,
        MembershipCouncilTagId: 6,
        ChronicDiseaseTagId: 7,
        ArticleHealthIntrestTopicsTagId: 8,
        SymptomsforDoctorsClinicTagId: 9,
        ProbleTypeTagId: 10,
        InsuranceCompaniesTagId: 11,
        MembershipsTagId: 12,
        AllergiesTagId: 13,
        InjuriesTagId: 14,
        SurgeriestagId: 15,
        Occupation: 16,
        FoodPreferenceTagId: 17,
        LifestyleTagId: 18,
        AlcoholConsumptionTagId: 19,
        CigaretteSmokeTagId: 20,
        MedicalRecordTypeTagId: 21
    }
}

export function getTotalExperienceOfDoctor(experiencesArray) {
	if(experiencesArray.length === 0) { return 0; }

	let minYear = experiencesArray[0].duration_from, maxYear = experiencesArray[0].duration_to;

	for (var i = 1, len = experiencesArray.length; i < len; i++) {
		var fromValue = experiencesArray[i].duration_from; var toValue = experiencesArray[i].duration_to; 
		minYear = (fromValue < minYear) ? fromValue : minYear;
		maxYear = (toValue > maxYear) ? toValue : maxYear;
	}

	let totalYearArray = [];
	for(var j = minYear; j <= maxYear; j++) {
		totalYearArray.push(j)
	}

	var totalExperience = 0;
	for(var j = minYear; j <= maxYear; j++) {
		for(var k = 0; k < experiencesArray.length; k++) {
			if(experiencesArray[k].duration_from < j && j <= experiencesArray[k].duration_to && totalYearArray.indexOf(j) !== -1) {
				totalExperience = totalExperience + 1;

				var indexx = totalYearArray.indexOf(j);
				totalYearArray.splice(indexx, 1);
			}
		}
	}

	return totalExperience;
}

export let messenger = false;
if (typeof Messenger !== 'undefined')
messenger = Messenger();

let serverLocalTimeDiff = 0;

export function getServerTime(time) {
	return time + serverLocalTimeDiff;
}

export function getLocalTime(time) {
	return time - serverLocalTimeDiff;
}

export function setServerLocalTimeDiff(diff) {
	serverLocalTimeDiff = diff;
}

export function createDayString(time) {
	return moment(time).calendar(null, {
		sameDay: '[Today]',
		nextDay: '[Tomorrow]',
		nextWeek: 'dddd',
		lastDay: '[Yesterday]',
		lastWeek: 'dddd',
		sameElse: 'Do MMM YYYY',
	});
}

export function createTimeString(time) {
	return moment(time).calendar(null, {
		sameDay: 'hh:mm a',
		sameElse: 'Do MMM YYYY hh:mm a',
	});
}

export let dialog = false;
if (typeof vex !== 'undefined')
	dialog = vex.dialog;