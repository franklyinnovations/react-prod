import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import {imageUrl} from '../../api/config';

import actions from '../redux/actions';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import Select from '../components/Select';
import TextEditor from '../components/TextEditor';
import makeTranslater from '../translate';
import {getStatusLabel} from '../utils';

import {
	Row,
	Col,
	Grid,
	Panel,
	Table,
	PanelBody,
	PanelHeader,
	PanelContainer,
	Icon,
	Button,
	Form,
	FormGroup,
	ControlLabel,
	InputGroup,
	FormControl,
	Checkbox,
	HelpBlock,
	Clearfix,
	Modal,
	Nav,
	NavItem,
	Tab
} from '@sketchpixy/rubix';

import url from 'url';

const viewName = 'chatpayment';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view[viewName]
}))
export default class ChatPayment extends React.Component {
	constructor(props) {
		super(props);
	}

	static fetchData(store) {
		return store.dispatch(
			actions.chatpayment.init(
				store.getState()
			)
		);
	}

	handleReferenceNoUpdate = event => {
		let value;
		if (event.target.type === 'checkbox')
			value = event.target.checked;
		else
			value = event.target.value;

		this.props.dispatch({
			type: 'UPDATE_CP_RELEASE_VALUE',
			name: event.target.name,
			value
		});
	};

	handleViewDetail = event => {
		event.preventDefault();
		this.props.dispatch(
			actions.chatpayment.viewDetails(this.props, event.target.getAttribute('data-item-doctorId'))
		)
	};

	handleViewACDetail = event => {
		event.preventDefault();
		this.props.dispatch(
			actions.chatpayment.viewACDetails(this.props, event.target.getAttribute('data-item-doctorId'))
		)
	};

	handleRelease = event => {
		this.props.dispatch({
			type: 'SHOW_CHAT_PAYMENT_RELEASE_MODAL',
			doctorprofileId: event.target.getAttribute('data-item-doctorId')
		})
	};

	handleActiveTab = eventKey => this.props.dispatch(
		actions.chatpayment.initList(this.props, eventKey)
	);

	handleViewPaidDetail = event => this.props.dispatch(
		actions.chatpayment.viewPaidDetail(this.props, event.target.getAttribute('data-item-id'))
	);

	changePage(page) {
		this.props.router.push(
			url.format({
				pathname: this.props.location.pathname,
				query: {
					...this.props.location.query,
					page: page
				}
			})
		);
	}

	makeFilter(name) {
		let dispatch = this.props.dispatch;
		return event => {
			dispatch({
				type: 'UPDATE_FILTER',
				name,
				value: event.target.value
			});
		}
	}

	search() {
		this.props.router.push('/admin/chatpayment');
	}

	reset() {
		this.props.dispatch({
			type: 'RESET_FILTERS'
		});
		this.props.router.push('/admin/chatpayment');
	}

	viewList() {
		this.props.dispatch(actions.chatpayment.viewList())
	}

	closeModal() {
		this.props.dispatch({
			type: 'CLOSE_CHAT_PAYMENT_MODAL'
		});
	}

	releasePayment() {
		this.props.dispatch(
			actions.chatpayment.releasePayment(this.props)
		)
	}

	render() {
		if (this.props.loading) return <Loading/>;
		let content, __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		switch(this.props.viewState) {
			case 'VIEW_DATA':
				content = this.props.viewlist.list === 'DUE_LIST' ? this.renderView(__):this.renderPaidView(__);
				break;
			default:
				content = this.renderList(__);
		}
		return (
			<Row>
				<Col xs={12}>
					<PanelContainer controls={false} className="overflow-visible">
						<Panel>
							<PanelHeader className='bg-green'>
								<Grid>
									<Row>
										<Col xs={4} md={10} className='fg-white'>
											<h3>{__("Chat Payments")}</h3>
										</Col>
										<Col xs={8} md={2} className='text-right'>
											<h3>
												{this.props.viewState === 'VIEW_DATA' &&
												<Button
													inverse
													outlined
													style={{marginBottom: 5}}
													bsStyle='default'
													onClick={::this.viewList}
												>
													{__('View List')}
												</Button>}
											</h3>
										</Col>
									</Row>
								</Grid>
							</PanelHeader>
							<PanelBody>
								<Grid>
									{content}
								</Grid>
							</PanelBody>
						</Panel>
					</PanelContainer>
				</Col>
			</Row>
		);
	}

	renderList(__) {
		return (
			<Row key="chatpayment-list">
				<Col xs={12} style={{marginBottom: '10px'}}>
					<Nav bsStyle="tabs" onSelect={this.handleActiveTab} activeKey={this.props.viewlist.list} className='tab-lightgreen'>
						<NavItem eventKey="DUE_LIST">{__('Due Payment')}</NavItem>
						<NavItem eventKey="PAID_LIST">{__('Paid Payment')}</NavItem>
					</Nav>
				</Col>
				{
					this.props.viewlist.loading ? <Loading />:
					<div>
						<Col xs={12}>
							{this.props.viewlist.list === 'DUE_LIST' ? this.renderDueList(__):this.renderPaidList(__)}
						</Col>
						<Col xs={12}>
							<Pagination
								data={this.props.pageInfo}
								onSelect={::this.changePage}
							/>
						</Col>
					</div>
				}
				<Modal show={this.props.acdetails.showModal} onHide={::this.closeModal}>
					<Modal.Header closeButton className="text-center">
						<Modal.Title>{__('Bank Account Details')}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Row>
							<Col md={12}>
								<Table bordered>
									<tbody>
										<tr>
											<td>{__('Account Holder Name')}</td>
											<td>{this.props.acdetails.data.account_holder_name}</td>
										</tr>
										<tr>
											<td>{__('Account Number')}</td>
											<td>{this.props.acdetails.data.account_number}</td>
										</tr>
										<tr>
											<td>{__('Account Type')}</td>
											<td>{this.props.acdetails.data.account_type}</td>
										</tr>
										<tr>
											<td>{__('Bank Name')}</td>
											<td>{this.props.acdetails.data.bank_name}</td>
										</tr>
										<tr>
											<td>{__('Bank Branch City')}</td>
											<td>{this.props.acdetails.data.bank_branch_city}</td>
										</tr>
										<tr>
											<td>{__('Bank IFSC Code')}</td>
											<td>{this.props.acdetails.data.bank_ifsc_code}</td>
										</tr>
									</tbody>
								</Table>
							</Col>
						</Row>
					</Modal.Body>
					<Modal.Footer>
						<div className='text-center'>
							<Button
								outlined
								bsStyle='lightgreen'
								disabled={false}
								onClick={::this.closeModal}
							>
								{__('Close')}
							</Button>
						</div>
					</Modal.Footer>
				</Modal>

				<Modal show={this.props.release.showModal} onHide={::this.closeModal}>
					<Modal.Header closeButton className="text-center">
						<Modal.Title>{__('Payment')}</Modal.Title>
						<p>{__('Please note payment reference no can be \'Online Transaction Number\', \'Cheque no\' etc.')}</p>
					</Modal.Header>
					<Modal.Body>
						<Row>
							<Col md={12}>
								<FormGroup
									controlId='reference_no'
									validationState={this.props.errors.reference_no ? 'error': null}
								>
									<ControlLabel>{__('Payment Reference No')}</ControlLabel>
									<FormControl
										type='text'
										placeholder={__('Payment Reference No')}
										value={this.props.release.reference_no}
										name='reference_no'
										onChange={this.handleReferenceNoUpdate}
									/>
									<HelpBlock>{this.props.errors.reference_no}</HelpBlock>
								</FormGroup>
							</Col>
						</Row>
					</Modal.Body>
					<Modal.Footer>
						<div className='text-center'>
							<Button
								outlined
								bsStyle='lightgreen'
								disabled={false}
								onClick={::this.releasePayment}
							>
								{__('Save')}
							</Button>{' '}
							<Button
								outlined
								bsStyle='default'
								disabled={false}
								onClick={::this.closeModal}
							>
								{__('Close')}
							</Button>
						</div>
					</Modal.Footer>
				</Modal>
			</Row>
		);
	}

	renderDueList(__){
		return (
			<Table condensed striped>
				<thead>
					<tr>
						<th width={'5%'}>{__('S No.')}</th>
						<th>{__('Doctor Name')}</th>
						<th>{__('Consult Details')}</th>
						<th>{__('Total Payment Due')}</th>
						<th>{__('Account Details')}</th>
						<th width={'9%'}>{__('Actions')}</th>
					</tr>
					{/*<tr>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td>
							<Icon
								className={'fg-darkcyan'}
								style={{fontSize: 20}}
								glyph={'icon-feather-search'}
								onClick={::this.search}
							/>
							<Icon
								className={'fg-brown'}
								style={{fontSize: 20}}
								glyph={'icon-feather-reload'}
								onClick={::this.reset}
							/>
						</td>
					</tr>*/}
				</thead>
				<tbody>
				{this.props.items.map(this.getDueDataRow, this)}
				{this.props.items.length === 0 && this.getNoDataRow(__)}
				</tbody>
			</Table>
		);
	}

	getDueDataRow(item, index) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);

		let count = (this.props.pageInfo.pageLimit * (this.props.pageInfo.currentPage - 1));

		return (
			<tr key={item.id}>
				<td>{count + ++index}</td>
				<td>{item.doctorprofile.user.userdetails[0].fullname}</td>
				<td>
					{item.consults}{' '}
					<a
						href="/"
						data-item-doctorId={item.doctorprofile.id}
						onClick={this.handleViewDetail}
						>
						{__('View Details')}
					</a>
				</td>
				<td>{this.props.session.currency + this.getAmount(item)}</td>
				<td>
					<a
						href="/"
						data-item-doctorId={item.doctorprofile.id}
						onClick={this.handleViewACDetail}
						>
						{__('View A/C Details')}
					</a>
				</td>
				<td>
					<Button
						outlined
						bsStyle='lightgreen'
						data-item-doctorId={item.doctorprofile.id}
						onClick={this.handleRelease}
					>
						{__('Release')}
					</Button>
				</td>
			</tr>
		)
	}

	getAmount(item) {
		let commission = this.props.globalcommission,
			amount = item.amount;
		if(item.commission) {
			commission = item.commission;
		}
		return (amount-((item.amount*commission)/100));
	}

	renderPaidList(__){
		return (
			<Table condensed striped>
				<thead>
					<tr>
						<th width={'5%'}>{__('S No.')}</th>
						<th>{__('Doctor Name')}</th>
						<th>{__('Release Amount')}</th>
						<th>{__('Wikicare Fee')}</th>
						<th>{__('Total Amount')}</th>
						<th>{__('Reference No.')}</th>
						<th width={'9%'}>{__('Actions')}</th>
					</tr>
					{/*<tr>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td>
							<Icon
								className={'fg-darkcyan'}
								style={{fontSize: 20}}
								glyph={'icon-feather-search'}
								onClick={::this.search}
							/>
							<Icon
								className={'fg-brown'}
								style={{fontSize: 20}}
								glyph={'icon-feather-reload'}
								onClick={::this.reset}
							/>
						</td>
					</tr>*/}
				</thead>
				<tbody>
				{this.props.items.map(this.getPaidDataRow, this)}
				{this.props.items.length === 0 && this.getNoDataRow(__)}
				</tbody>
			</Table>
		);
	}

	getPaidDataRow(item, index) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);

		let count = (this.props.pageInfo.pageLimit * (this.props.pageInfo.currentPage - 1));

		return (
			<tr key={item.id}>
				<td>{count + ++index}</td>
				<td>{item.doctorprofile.user.userdetails[0].fullname}</td>
				<td>{this.props.session.currency + item.release_amount}</td>
				<td>{this.props.session.currency + item.commision_amount}</td>
				<td>{this.props.session.currency + item.total_amount}</td>
				<td>{item.reference_no}</td>
				<td>
					<Button
						outlined
						bsStyle='lightgreen'
						data-item-id={item.id}
						onClick={this.handleViewPaidDetail}
					>
						{__('View Details')}
					</Button>
				</td>
			</tr>
		)
	}

	getNoDataRow(__) {
		return (
			<tr key={0} className='text-center'>
				<td colSpan={7}>{__('No data found')}</td>
			</tr>
		)
	}

	renderView(__) {
		let data = this.props.item,
			totalAmount = data.data.reduce(((sum, item) =>  sum + item.transaction.amount), 0),
			commissionAmount = ((totalAmount*data.commission)/100);
		return (
			<div>
				<Row>
					<Col md={12}>
						<Table bordered>
							<tbody>
								<tr>
									<td width='33%'>
										<strong>{__('Doctor Name')}</strong>{': '}{data.doctor}
									</td>
									<td width='33%'>
										<strong>{__('Consults')}</strong>{': '}{data.data.length}</td>
									<td width='34%'>
										<strong>{__('Total Consult Amount')}</strong>{': '}{this.props.session.currency + totalAmount}</td>
								</tr>
								<tr>
									<td width='33%'>
										<strong>{__('Total Wikicare Fee')}</strong>{': '}{this.props.session.currency + commissionAmount}</td>
									<td width='33%'>
										<strong>{__('Total Payment Due')}</strong>{': '}{this.props.session.currency + (totalAmount-commissionAmount)}</td>
									<td width='34%'></td>
								</tr>
							</tbody>
						</Table>
					</Col>
				</Row>
				<Row>
					<Col md={12}>
						<Table condensed striped>
							<thead>
								<tr>
									<th>{__('S.No.')}</th>
									<th>{__('Consult ID')}</th>
									<th>{__('Start Date')}</th>
									<th>{__('End Date')}</th>
									<th>{__('Patient')}</th>
									<th>{__('Consult Amount')}</th>
									<th>{__('Wikicare Fee')}</th>
									<th>{__('Amount')}</th>
								</tr>
							</thead>
							<tbody>
								{
									data.data.map((item, index) => 
										<tr key={item.id}>
											<td>{index+1}</td>
											<td>{item.id}</td>
											<td>{moment(item.createdAt).format('YYYY-MM-DD')}</td>
											<td>{moment(item.createdAt).day('add', 7).format('YYYY-MM-DD')}</td>
											<td>{item.name}</td>
											<td>{this.props.session.currency + item.transaction.amount}</td>
											<td>{this.props.session.currency + ((item.transaction.amount*data.commission)/100)}</td>
											<td>{this.props.session.currency + (item.transaction.amount-((item.transaction.amount*data.commission)/100))}</td>
										</tr>
									)
								}
							</tbody>
						</Table>
					</Col>
				</Row>
			</div>
		);
	}

	renderPaidView(__) {
		let data = this.props.item.data;
		return (
			<div>
				<Row>
					<Col md={12}>
						<Table bordered>
							<tbody>
								<tr>
									<td width='33%'>
										<strong>{__('Doctor Name')}</strong>{': '}
										{data.doctorprofile.user.userdetails[0].fullname}
									</td>
									<td width='33%'>
										<strong>{__('Consults')}</strong>{': '}{data.releaseamountrecords.length}</td>
									<td width='34%'>
										<strong>{__('Total Amount')}</strong>{': '}{this.props.session.currency + data.total_amount}</td>
								</tr>
								<tr>
									<td width='33%'>
										<strong>{__('Wikicare Fee')}</strong>{': '}{this.props.session.currency + data.commision_amount}</td>
									<td width='33%'>
										<strong>{__('Release Amount')}</strong>{': '}{this.props.session.currency + data.release_amount}</td>
									<td width='34%'></td>
								</tr>
							</tbody>
						</Table>
					</Col>
				</Row>
				<Row>
					<Col md={12}>
						<Table condensed striped>
							<thead>
								<tr>
									<th>{__('S.No.')}</th>
									<th>{__('Consult ID')}</th>
									<th>{__('Start Date')}</th>
									<th>{__('End Date')}</th>
									<th>{__('Patient')}</th>
									<th>{__('Consult Amount')}</th>
									<th>{__('Wikicare Fee')}</th>
									<th>{__('Amount')}</th>
								</tr>
							</thead>
							<tbody>
								{
									data.releaseamountrecords.map((item, index) => 
										<tr key={item.id}>
											<td>{index+1}</td>
											<td>{item.transaction.chatconsult.id}</td>
											<td>{moment(item.transaction.chatconsult.createdAt).format('YYYY-MM-DD')}</td>
											<td>{moment(item.transaction.chatconsult.createdAt).day('add', 7).format('YYYY-MM-DD')}</td>
											<td>{item.transaction.chatconsult.name}</td>
											<td>{this.props.session.currency + item.transaction.amount}</td>
											<td>{this.props.session.currency + ((item.transaction.amount*data.commission_rate)/100)}</td>
											<td>{this.props.session.currency + (item.transaction.amount-((item.transaction.amount*data.commission_rate)/100))}</td>
										</tr>
									)
								}
							</tbody>
						</Table>
					</Col>
				</Row>
			</div>
		);
	}
}