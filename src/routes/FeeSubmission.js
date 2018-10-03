import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import {webApiUrl} from '../config';
import makeTranslater from '../translate';

import {
	messenger,
	moduleActions,
} from '../utils';

import {
	paymentModeOptions,
	discountTypeOptions,
} from '../utils/fee';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/feesubmission';
import * as actions from '../redux/actions/feesubmission';
addView('feesubmission', reducer);

import {
	Row,
	Col,
	Icon,
	View,
	Text,
	Table,
	Label,
	Button,
	Select,
	Loading,
	DateView,
	Clearfix,
	HelpBlock,
	FormGroup,
	Datepicker,
	FormControl,
	ControlLabel,
} from '../components';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class FeeSubmission extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'feesubmission');

	loadStudents = event => this.props.dispatch(
		actions.loadStudents(this.props, event.currentTarget.value)
	);
	updateSelector = event => this.props.dispatch({
		type: 'UPDATE_FSM_SELECTOR',
		name: event.currentTarget.name,
		value: event.currentTarget.value,
	});

	loadFeeAllocations = () => {
		if (!this.props.selector.studentId && !this.props.selector.enrollment_no.trim()) {
			messenger.post({
				type: 'error',
				message: window.__('Please select a student or enrollment number'),
			});
			return;
		}
		this.props.dispatch(actions.loadFeeAllocations(this.props));
	};
	toggleFeeAllocation = event => this.props.dispatch({
		type: 'TOGGLE_FSM_FEE_ALLOCATION',
		index: +event.currentTarget.getAttribute('data-index'),
	});
	toggleAllFeeAllocation = event => this.props.dispatch({
		checked: event.currentTarget.checked,
		type: 'TOGGLE_ALL_FSM_FEE_ALLOCATION',
	});
	loadFees = () => {
		if (!this.props.selector.payment_date) {
			messenger.post({
				type: 'error',
				message: window.__('Please select a payment date.'),
			});
			return;
		}
		let feeallocations = this.props.feeallocations.filter(item => item.selected);
		if (feeallocations.length === 0) {
			messenger.post({
				type: 'error',
				message: window.__('Please select at least one installment.'),
			});
			return;	
		}
		let items = [], feesubmissionrecords = [], total = 0, payment_date = moment(
			this.props.selector.payment_date,
			this.props.session.userdetails.date_format,
		);
		feeallocations.forEach(feeallocation => {
			let feesubmissionrecord = {
				amount: feeallocation.amount,
				feeheadId: feeallocation.feeheadId,
				installment: feeallocation.installment,
				feesubmissiondiscounts: [],
				feesubmissionpenalties: [],
			};
			items.push({
				amount: feeallocation.amount,
				particulars: feeallocation.feehead.feeheaddetails[0].name
					+ ' #' + (feeallocation.installment + 1),
			});
			feeallocation.feehead.feediscounts.forEach(feediscount => {
				let amount = feediscount.type === 0 
						? ((feediscount.value * feediscount) / feeallocation.amount).toFixed(2)
						: feediscount.value;
				items.push({
					amount: -amount,
					particulars: feediscount.feediscountdetails[0].name,
				});
				feesubmissionrecord.feesubmissiondiscounts.push({
					amount,
					feediscountId: feediscount.id,
				});
				total -= amount;
			});
			let days = Math.round(payment_date.diff(feeallocation.date, 's') / 86400);
			feeallocation.fee.feeallocationpenalties.forEach(({feepenalty}) => {
				let i = 0, slabs = feepenalty.feepenaltyslabs;
				if (days < slabs[i].days) return;
				while (i < slabs.length && days >= slabs[i].days) i++;
				items.push({
					amount: slabs[i - 1].amount,
					particulars: feepenalty.feepenaltydetails[0].name,
				});
				feesubmissionrecord.feesubmissionpenalties.push({
					amount: slabs[i - 1].amount,
					feepenaltyId: feepenalty.id,
				});
				total += slabs[i - 1].amount;
			});
			total += feeallocation.amount;
			feesubmissionrecords.push(feesubmissionrecord);
		});
		this.props.dispatch({
			type: 'LOAD_FSM_FEES',
			data: {
				items,
				total,
				feesubmissionrecords,
			}
		});
	};
	startPayment = () => this.props.dispatch({
		type: 'FSM_START_PAYMENT',
		data: {
			bank: '',
			cheque: '',
			mode: null,
			errors: {},
			remarks: '',
			discount_value: '',
			discount_type: -1,
		},
	});
	updatePayment = event => this.props.dispatch({
		type: 'UPDATE_FSM_PAYMENT',
		name: event.currentTarget.name,
		value: event.currentTarget.value,
	});
	pay = () => this.props.dispatch(actions.pay(this.props));
	generateChallan = () => this.props.dispatch(actions.pay(this.props, true));
	sendInvoice = event => actions.sendInvoice(
		this.props,
		+event.currentTarget.getAttribute('data-item-id'),
	);

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<View>
				{this.renderSelector()}
				{this.renderFeeAllocations(__)}
				{this.renderFees()}
				{this.renderPayment(__)}
			</View>
		);
	}

	renderSelector() {
		let {selector} = this.props;
		return (
			<React.Fragment>
				<Row>
					<Col md={3}>
						<FormGroup>
							<ControlLabel>
								<Text>Class</Text>
							</ControlLabel>
							<Select
								name='bcsmapId'
								value={selector.bcsmapId}
								options={selector.bcsmaps}
								onChange={this.loadStudents}/>
						</FormGroup>
					</Col>
					<Col md={3}>
						<ControlLabel>
							<Text>Student</Text>
						</ControlLabel>
						<FormGroup>
							<Select
								name='studentId'
								value={selector.studentId}
								onChange={this.updateSelector}
								options={selector.students || []}
								isLoading={selector.students === null}/>
						</FormGroup>
					</Col>
					<Col md={1} className='text-center'>
						<ControlLabel className='invisible'>OR</ControlLabel>
						<FormControl.Static>
							<Text>OR</Text>
						</FormControl.Static>
					</Col>
					<Col md={5}>
						<ControlLabel>
							<Text>Enrollment No</Text>
						</ControlLabel>
						<FormGroup>
							<FormControl
								name='enrollment_no'
								value={selector.enrollment_no}
								onChange={this.updateSelector}/>
						</FormGroup>
					</Col>
				</Row>
				<FormGroup>
					<Button bsStyle='primary' onClick={this.loadFeeAllocations}>
						<Text>Submit</Text>
					</Button>
				</FormGroup>
			</React.Fragment>
		);
	}

	renderFeeAllocations(__) {
		let {feeallocations, selector} = this.props;
		if (feeallocations === false) return null;
		if (feeallocations === null) return <Loading/>;
		return (
			<React.Fragment>
				<Row>
					<Col md={3}>
						<FormGroup>
							<ControlLabel>
								<Text>Payment Date</Text>
							</ControlLabel>
							<Datepicker
								name='payment_date'
								disabled={!!this.props.fees}
								value={selector.payment_date}
								onChange={this.updateSelector}/>
						</FormGroup>
					</Col>
				</Row>
				<Table bordered condensed>
					<thead>
						<tr>
							<td>
								<input
									type='checkbox'
									onClick={this.toggleAllFeeAllocation}/>
							</td>
							<td>
								<Text>Status</Text>
							</td>
							<td>
								<Text>Fee Head</Text>
							</td>
							<td>
								<Text>Installment</Text>
							</td>
							<td>
								<Text>Fee</Text>
							</td>
							<td>
								<Text>Due Date</Text>
							</td>
							<td>
								<Text>Submitted Fee</Text>
							</td>
							<td>
								<Text>Submission Date</Text>
							</td>
							<td>
								<Text>Actions</Text>
							</td>
						</tr>
					</thead>
					<tbody>
						{
							feeallocations.map((item, index) =>
								<tr key={index}>
									<td>
										{
											!item.feesubmissionrecord &&
											<input
												type='checkbox'
												data-index={index}
												checked={item.selected}
												onChange={this.toggleFeeAllocation}/>
										}
									</td>
									<td>
										<Label bsStyle={item.feesubmissionrecord ? 'success' : 'danger'}>
											<Text>{item.feesubmissionrecord ? (item.feesubmissionrecord.feesubmission.approved ? 'Paid' : 'Challan') : 'Unpaid'}</Text>
										</Label>
									</td>
									<td>
										{item.feehead.feeheaddetails[0].name}
									</td>
									<td>
										{item.installment + 1}
									</td>
									<td>
										{item.amount === undefined ? '--' : item.amount}
									</td>
									<td>
										{item.amount === undefined ? '--' : <DateView>{item.date}</DateView>}
									</td>
									<td>
										{item.feesubmissionrecord ? item.feesubmissionrecord.amount : '--'}
									</td>
									<td>
										{
											item.feesubmissionrecord ?
											<DateView>{item.feesubmissionrecord.feesubmission.date}</DateView> :
											'--'
										}
									</td>
									<td className='text-primary'>
										{
											item.feesubmissionrecord &&
											!!item.feesubmissionrecord.feesubmission.approved &&
											<React.Fragment>
												<a
													target='_blank'
													rel='noopener noreferrer'
													href={
														webApiUrl + '/admin/feesubmission/'+ 
														item.feesubmissionrecord.feesubmissionId + '/invoice.pdf' +
														'?lang=' + this.props.lang.code + 
														'&langId=' + this.props.lang.id +
														'&dir=' + this.props.lang.dir
													}>
													<Icon 
														glyph='fa-file-invoice' 
														title={__('Invoice')}
													/>
												</a>
												&nbsp;&nbsp;
												<Icon
													glyph='fa-envelope'
													title={__('Send Invoice')}
													onClick={this.sendInvoice}
													data-item-id={item.feesubmissionrecord.feesubmissionId}/>
											</React.Fragment>
										}
									</td>
								</tr>
							)
						}
					</tbody>
				</Table>
				<FormGroup>
					<Button bsStyle='primary' onClick={this.loadFees}>
						<Text>Calculate Fee</Text>
					</Button>
				</FormGroup>
			</React.Fragment>
		);
	}

	renderFees() {
		if (this.props.fees === false) return null;
		return (
			<React.Fragment>
				<Table condensed bordered>
					<thead>
						<tr>
							<th>
								<Text>Particulars</Text>
							</th>
							<th>
								<Text>Amount</Text>
							</th>
						</tr>
					</thead>
					<tbody>
						{
							this.props.fees.items.map((item, index) =>
								<tr key={index}>
									<td>
										{item.particulars}
									</td>
									<td>
										{item.amount}
									</td>
								</tr>
							)
						}
					</tbody>
					<tfoot>
						<tr>
							<th>
								<Text>Total</Text>
							</th>
							<th>
								{this.props.fees.total}
							</th>
						</tr>
					</tfoot>
				</Table>
				<FormGroup>
					<Button disabled={this.props.saving} bsStyle='primary' onClick={this.startPayment}>
						<Text>Pay Now</Text>
					</Button>
					&nbsp;&nbsp;
					<Button disabled={this.props.saving} bsStyle='primary' onClick={this.generateChallan}>
						<Text>Generate Challan</Text>
					</Button>
				</FormGroup>
			</React.Fragment>
		);
	}

	renderPayment(__) {
		let payment = this.props.payment;
		if (payment === false) return;
		return (
			<React.Fragment>
				<Row>
					<Col md={4}>
						<FormGroup>
							<ControlLabel>
								<Text>Discount Type</Text>
								<Select
									name='discount_type'
									value={payment.discount_type}
									onChange={this.updatePayment}
									options={discountTypeOptions(__)}/>
							</ControlLabel>
						</FormGroup>
					</Col>
					<Col md={4}>
						<FormGroup validationState={payment.errors.discount_value ? 'error' : null}>
							<ControlLabel>
								<Text>Discount</Text>
							</ControlLabel>
							<FormControl
								name='discount_value'
								onChange={this.updatePayment}
								value={payment.discount_value}/>
							<HelpBlock>{payment.errors.discount_value}</HelpBlock>
						</FormGroup>
					</Col>
					<Col md={4}>
						<FormGroup>
							<ControlLabel>
								<Text>Amount</Text>
							</ControlLabel>
							<FormControl readOnly value={this.getPaymentAmount()}/>
						</FormGroup>
					</Col>
					<Clearfix/>
					<Col md={4}>
						<FormGroup validationState={payment.errors.mode ? 'error' : null}>
							<ControlLabel>
								<Text>Payment Mode</Text>
							</ControlLabel>
							<Select
								name='mode'
								value={payment.mode}
								onChange={this.updatePayment}
								options={paymentModeOptions(__)}/>
							<HelpBlock>{payment.errors.mode}</HelpBlock>
						</FormGroup>
					</Col>
					<Col md={4}>
						<FormGroup validationState={payment.errors.cheque ? 'error' : null}>
							<ControlLabel>
								<Text>Cheque/DD Number</Text>
							</ControlLabel>
							<FormControl
								name='cheque'
								value={payment.cheque}
								onChange={this.updatePayment}/>
							<HelpBlock>{payment.errors.cheque}</HelpBlock>
						</FormGroup>
					</Col>
					<Col md={4}>
						<FormGroup validationState={payment.errors.bank ? 'error' : null}>
							<ControlLabel>
								<Text>Bank Name</Text>
							</ControlLabel>
							<FormControl
								name='bank'
								value={payment.bank}
								onChange={this.updatePayment}/>
							<HelpBlock>{payment.errors.bank}</HelpBlock>
						</FormGroup>
					</Col>
				</Row>
				<FormGroup>
					<ControlLabel>
						<Text>Remarks if any</Text>
					</ControlLabel>
					<FormControl
						rows='5'
						name='remarks'
						placeholder={__('Remarks')}
						value={payment.remarks}
						componentClass='textarea'
						onChange={this.updatePayment}/>
				</FormGroup>
				<FormGroup>
					<Button disabled={this.props.saving} bsStyle='primary' onClick={this.pay}>
						<Text>Submit</Text>
					</Button>
				</FormGroup>
			</React.Fragment>
		);
	}

	getPaymentAmount() {
		let {fees: {total: amount}, payment: {discount_type, discount_value}} = this.props;
		if (!discount_value || isNaN(Number(discount_value)) || discount_type === -1 || discount_type === null) return amount;
		amount = amount - (discount_type === 0 ? ((discount_value * amount) / 100) : discount_value);
		return Math.max(amount, 0);
	}
}

