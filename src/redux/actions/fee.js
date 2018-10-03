import moment from 'moment';

import api, {makeApiData} from '../../api';
import {paramsFromState} from '../../utils';
export {updateFilter, update} from './index';

const view = 'fee';

export function init(state) {
	return async dispatch => {
		dispatch({
			type: 'LOADING_MODULE',
			view,
		});
		let {data} = await api({
			cookies: state.cookies,
			url: '/admin/fee',
			data: makeApiData(state, {
				academicSessionId: state.session.selectedSession.id,
			}),
			params: paramsFromState(state, view),
		});
		dispatch({
			type: 'INIT_MODULE',
			view,
			data,
			classes: data.classes.map(item => ({
				value: item.id,
				label: item.classesdetails[0].name,
			})),
			boards: data.boards.map(item => ({
				value: item.id,
				label: item.boarddetails[0].alias,
			})),
		});
	};
}

export function save(state) {
	return async dispatch => {
		let error = false, errors = {}, item = state.item;
		if (!item.id && item.classes.length === 0) {
			error = true;
			errors.classes = window.__('This is a required field.');
		}
		let allFeeallocations = [],
			feeheads  = item.feeheads.map(feehead => {
				let feeheadError = false,
					feeallocations = feehead.feeallocations.map(feeallocation => {
						let {amount, date} = feeallocation, errors = {};

						amount = amount.trim();
						if (!amount.trim()) {
							errors.amount = window.__('This is a required field.');
						} else if (! /^(?:\d{1,8}(?:\.\d{1,2})?)?$/.test(amount)) {
							errors.amount = window.__('Please enter valid number.');
						} else {
							amount = Number(amount);
							if (isNaN(amount)) {
								errors.amount = window.__('Please enter valid number.');
							} else if (amount < 0) {
								errors.amount = window.__('Please enter valid number.');
							}
						}
						if (!date) errors.date = window.__('This is a required field.');

						if (Object.keys(errors).length !== 0) {
							feeheadError = true;
						}
						allFeeallocations.push({
							...feeallocation,
							amount: amount.toString(),
							date: moment(date, state.session.userdetails.date_format).format('YYYY-MM-DD'),
						});
						return {...feeallocation, errors};
					});
				if (feeheadError) error = true;
				return {...feehead, feeallocations};
			});

		dispatch({
			type: 'SET_FEE_ERRORS',
			errors,
			feeheads,
		});
		if (error) return;

		dispatch({type: 'SAVING_FEE'});
		await api({
			url: '/admin/fee/save',
			data: makeApiData(state, {
				id: state.item.id,
				is_active: state.item.is_active,
				feeallocations: allFeeallocations,
				feepenalties: state.item.feepenalties,
				academicSessionId: state.session.selectedSession.id,
				classes: state.item.id ? undefined : state.item.classes,
			}),
		});
		state.router.push(state.router.location.pathname);
	};
}

export function startAdd(state) {
	return async dispatch => {
		dispatch({type: 'LOADING_FEE_EDIT_DATA'});
		let {data: {feeheads, classes, feepenalties}} = await api({
			url: '/admin/fee/add',
			data: makeApiData(state, {
				academicSessionId: state.session.selectedSession.id,
			}),
		});

		feeheads.forEach(item => {
			let feeallocations = item.feeallocations = [];
			for (let i = 0; i < item.no_of_installments; i++) {
				feeallocations.push({
					amount: '',
					date: null,
					errors: {},
					installment: i,
					feeheadId: item.id,
				});
			}
		});

		classes.sort((x, y) => {
			if (x.board.display_order !== y.board.display_order)
				return x.board.display_order - y.board.display_order;
			if (x.board.id !== y.board.id)
				return y.board.id - x.board.id;
			if (x.class.display_order !== y.class.display_order)
				return x.class.display_order - y.class.display_order;
			return y.class.id - x.class.id;
		});

		dispatch({
			type: 'START_ADD_FEE',
			data: {
				feeheads,
				classes: [],
				is_active: 1,
				feepenalties: [],
			},
			classes: classes.map(item => ({
				value: item.board.id + ':' + item.class.id,
				label: item.board.boarddetails[0].alias + '-' + item.class.classesdetails[0].name,
			})),
			feeheads,
			feepenalties: feepenalties.map(item => ({
				value: item.id,
				label: item.feepenaltydetails[0].name,
			})),
		});
	};
}

export function edit(state, id) {
	return async dispatch => {
		dispatch({type: 'LOADING_FEE_EDIT_DATA'});
		let {data: {data: item, feeheads, feepenalties}} = await api({
			url: '/admin/fee/edit',
			data: makeApiData(state, {id}),
		});

		feeheads.forEach(feehead => {
			let feeallocations = feehead.feeallocations = item.feeallocations.filter(
				feeallocation => {
					if (feeallocation.feeheadId === feehead.id) {
						feeallocation.errors = {};
						feeallocation.date = moment(feeallocation.date, 'YYYY-MM-DD').format(
							state.session.userdetails.date_format
						);
						feeallocation.amount = feeallocation.amount.toString();
						return true;
					} else {
						return false;
					}
				}
			);
			if (feehead.no_of_installments > feeallocations.length) {
				for (let i = feeallocations.length; i < feehead.no_of_installments; i++) {
					feeallocations.push({
						amount: '',
						date: null,
						errors: {},
						installment: i,
						feeheadId: feehead.id,
					});
				}
			} else if (feehead.no_of_installments < feeallocations.length) {
				feeallocations.splice(feehead.no_of_installments);
			}
		});

		dispatch({
			type: 'SET_FEE_EDIT_DATA',
			data: {
				feeheads,
				id: item.id,
				is_active: 1,
				classes: item.boardId + ':' + item.classId,
				feepenalties: item.feeallocationpenalties.map(({feepenaltyId}) => feepenaltyId),
			},
			classes: [
				{
					value: item.boardId + ':' + item.classId,
					label: item.board.boarddetails[0].alias + '-' + item.class.classesdetails[0].name,
				}
			],
			feepenalties: feepenalties.map(item => ({
				value: item.id,
				label: item.feepenaltydetails[0].name,
			})),
		});
	};
}

export function changeStatus(state, id, status, oldstatus) {
	return async dispatch => {
		dispatch({
			type: 'CHANGE_FEE_STATUS',
			id,
			status: -1
		});

		let {data} = await api({
			data: makeApiData(state, {id, status}),
			url: '/admin/fee/status',
		});

		dispatch({
			type: 'CHANGE_FEE_STATUS',
			id,
			status: data.status ? status : oldstatus
		});
	};
}

export function remove(state, id) {
	return async dispatch => {		
		dispatch({type: 'START_FEE_REMOVE', id});
		let {data: {status}} = await api({
			data: makeApiData(state, {id}),
			url: '/admin/fee/remove'
		});
		if (status) {
			state.router.push(state.router.location.pathname);
		} else {
			dispatch({type: 'FEE_REMOVAL_FAILED',});
		}
	};
}