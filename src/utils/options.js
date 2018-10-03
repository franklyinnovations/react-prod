import React from 'react';
import {Text} from '../components';

export function getLeaveStatus(__) {
	return [
		{
			value: '0',
			label: __('Pending')
		},
		{
			value: '1',
			label: __('Approved')
		},
		{
			value: '2',
			label: __('Cancelled')
		},
		{
			value: '3',
			label: __('Rejected')
		}
	];
}

export function getTicketStatusTitle(status, __) {
	switch (status) {
		case 0:
			return __('Open');
		case 1:
			return __('Processing');
		case 2:
			return __('Resolved');
		case 3:
			return __('Closed');
		case 4:
			return __('Reopen');
		case -1:
			return __('Updating');
	}
}

export function getTicketStatusOptions(__) {
	return [
		{
			value: '0',
			label: __('Open')
		},
		{
			value: '1',
			label: __('Processing')
		},
		{
			value: '2',
			label: __('Resolved')
		},
		{
			value: '3',
			label: __('Closed')
		},
		{
			value: '4',
			label: __('Reopen')
		},
	];
}

export function getPriorityTitle(status, __) {
	switch (status) {
		case 0:
			return __('Low');
		case 1:
			return __('Normal');
		case 2:
			return __('High');
	}
}

export function getPenalityStatusOptions(__) {
	return [
		{
			value: '1',
			label: __('Yes')
		},
		{
			value: '0',
			label: __('No')
		},
	];
}

export function getStatusCahllan(__) {
	return [
		{
			value: '1',
			label: __('Approved')
		},
		{
			value: '0',
			label: __('Pending')
		},
	];
}

export function getvehicleTypes(__) {
	return [
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
	];
}

export function getSMSProvider(__) {
	return [
		{
			value: 1,
			label: __('Msg91')
		},
		{
			value: 3,
			label: __('MessageBird')
		}
	];
}

export function getDigestIntervalOptions() {
	return [
		{
			value: 0,
			label: <Text>Off</Text>,
		},
		{
			value: 1,
			label: <Text>Daily</Text>,
		},
		{
			value: 7,
			label: <Text>Weekly</Text>,
		}
	];
}

export function getSalutation(__) {
	return [
		{
			value: 'Mr',
			label: __('Mr')
		},
		{
			value: 'Mrs',
			label: __('Mrs')
		},
		{
			value: 'Miss',
			label: __('Miss')
		},
		{
			value: 'Ms',
			label: __('Ms')
		},
		{
			value: 'Dr',
			label: __('Dr')
		},
		{
			value: 'Prof',
			label: __('Prof')
		}
	];
}

export function getGender(__) {
	return [
		{
			value: 'male',
			label: __('Male')
		},
		{
			value: 'female',
			label: __('Female')
		}
	];
}

export function getBloodGroup(__) {
	return [
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
	];
}

export function getResCategory(__) {
	return [
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
	];
}

export function getAssignmentStatus(__) {
	return [
		{
			value: 'Draft',
			label: __('Draft')
		},
		{
			value: 'Published',
			label: __('Published')
		},
		{
			value: 'Canceled',
			label: __('Cancelled')
		},
		{
			value: 'Completed',
			label: __('Completed')
		}
	];
}

export function getExamTypeOptions(__) {
	return [
		{
			label: __('Theory'),
			value: 'theory'
		},
		{
			label: __('Practical'),
			value: 'practical'
		}
	];
}

export function getExamType(type) {
	switch(type) {
		case 'theory':
			return 'Theory';
		case 'practical':
			return 'Practical';
	}
}

export function getUserTypes(__) {
	return [
		{
			label: __('Teacher'),
			value: 'teacher'
		},
		{
			label: __('Driver'),
			value: 'driver'
		},
		{
			label: __('Helper'),
			value: 'helper'
		}
	];
}

export function getLanguageDirection(__) {
	return [
		{
			value: 'lr',
			label: __('Left to Right')
		},
		{
			value: 'rl',
			label: __('Right to Left')
		},
	];
}

export function getDemoOptions(__) {
	return [
		{
			value: 'Yes',
			label: __('Yes')
		},
		{
			value: 'No',
			label: __('No')
		},
	];
}

export function getFeeHeadMode(__) {
	return [
		{
			value: 'Yearly',
			label: __('Yearly')
		},
		{
			value: 'Half Yearly',
			label: __('Half Yearly')
		},
		{
			value: 'Quarterly',
			label: __('Quarterly')
		},
		{
			value: 'Monthly',
			label: __('Monthly')
		},
		{
			value: 'Bi-Monthly',
			label: __('Bi-Monthly')
		},
		{
			value: 'One Time',
			label: __('One Time')
		},
	];
}

export function getTransportType(__) {
	return [
		{
			value: '1',
			label: __('Two Way Transport')
		},
		{
			value: '2',
			label: __('Only In')
		},
		{
			value: '3',
			label: __('Only Out')
		}
	];
}

export function getGenderFromSalutation(status) {
	switch (status) {
		case 'Mr':
			return 'male';
		case 'Mrs':
			return 'female';
		case 'Miss':
			return 'female';
		case 'Ms':
			return 'female';
		case 'Dr':
			return null;
		case 'Prof':
			return null;
	}
}