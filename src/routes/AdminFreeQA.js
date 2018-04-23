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
	Modal
} from '@sketchpixy/rubix';

import url from 'url';

const viewName = 'adminfreeqa';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view[viewName]
}))
export default class AdminFreeQA extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showImgModal: false,
			src: ''
		}
	}

	static fetchData(store) {
		return store.dispatch(
			actions.adminfreeqa.init(
				store.getState()
			)
		);
	}

	handleDataUpdate = event => {
		let value;
		if (event.target.type === 'checkbox')
			value = event.target.checked;
		else
			value = event.target.value;

		this.props.dispatch({
			type: 'UPDATE_FQA_MAIL_VALUE',
			name: event.target.name,
			value
		});
	};

	handleEdit = event => {
		this.props.dispatch(
			actions.adminfreeqa.edit(
				this.props,
				event.target.getAttribute('data-item-id')
			)
		);
	};

	handleState = event => {
		this.props.dispatch(
			actions.adminfreeqa.changeStatus(
				this.props,
				event.target.getAttribute('data-item-id'),
				event.target.getAttribute('data-item-status') === '1' ? '0' : '1'
			)
		)
	};

	handleView = event => {
		this.props.dispatch(
			actions.adminfreeqa.viewDetails(
				this.props,
				event.target.getAttribute('data-item-id')
			)
		)
	};

	handleShowImage = event => {
		let imageUrl = event.target.src;
		if(imageUrl){
			this.setState({
				showImgModal: true,
				src: imageUrl
			});
		}
	};

	handleSendMail = event => {
		this.props.dispatch({
			type: 'SHOW_FQA_SEND_MAIL_MODAL',
			itemId: event.target.getAttribute('data-item-id')
		});
	};

	closeImgModal() {
		this.setState({
			showImgModal: false,
			src: ''
		});
	}

	closeMailModal() {
		this.props.dispatch({
			type: 'CLOSE_FQA_SEND_MAIL_MODAL'
		});
	}

	submitSendEmail() {
		this.props.dispatch(
			actions.adminfreeqa.sendEmail(this.props)
		);
	}

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
		this.props.router.push('/admin/freeqa');
	}

	reset() {
		this.props.dispatch({
			type: 'RESET_FILTERS'
		});
		this.props.router.push('/admin/freeqa');
	}

	viewList() {
		this.props.dispatch(actions.adminfreeqa.viewList())
	}

	getStatusIcon(status) {
		switch(status) {
			case 0:
				return 'icon-simple-line-icons-check';
			case 1:
				return 'icon-simple-line-icons-close';
			case -1:
				return 'icon-fontello-spin4';
		}
	}

	render() {
		if (this.props.loading) return <Loading/>;
		let content, __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		switch(this.props.viewState) {
			case 'VIEW_DATA':
				content = this.renderView(__);
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
											<h3>{__("Free QA's")}</h3>
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

				<Modal show={this.props.mail.showModal} onHide={::this.closeMailModal}>
					<Modal.Header closeButton className="text-center">
						<Modal.Title>{__('Email Information')}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Row>
							<Col md={12}>
								<FormGroup
									controlId='subject'
									validationState={this.props.errors.subject ? 'error': null}
								>
									<ControlLabel>{__('Subject')}</ControlLabel>
									<FormControl
										placeholder={__('Subject')}
										name='subject'
										value={this.props.mail.subject}
										onChange={this.handleDataUpdate}
									/>
									<HelpBlock>{this.props.errors.subject}</HelpBlock>
								</FormGroup>
							</Col>
						</Row>
						<Row>
							<Col md={12}>
								<FormGroup
									controlId='message'
									validationState={this.props.errors.message ? 'error': null}
								>
									<ControlLabel>{__('Message')}</ControlLabel>
									<TextEditor
										name='message'
										placeholder={__('Message')}
										value={this.props.mail.message}
										onChange={this.handleDataUpdate}/>
									<HelpBlock>{this.props.errors.message}</HelpBlock>
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
								onClick={::this.submitSendEmail}
							>
								{__('Send')}
							</Button>
						</div>
					</Modal.Footer>
				</Modal>
			</Row>
		);
	}

	renderList(__) {
		return (
			<Row key="country-list">
				<Col xs={12}>
					<Table condensed striped>
						<thead>
							<tr>
								<th width={'5%'}>{__('S No.')}</th>
								<th>{__('Date')}</th>
								<th>{__('Patient Name')}</th>
								<th width={'15%'}>{__('Problem Type')}</th>
								<th>{__('Q. Title')}</th>
								<th>{__('Skipped By')}</th>
								<th>{__('Reported By')}</th>
								<th>{__('Answered Status')}</th>
								<th>{__('Status')}</th>
								<th width={'9%'}>{__('Actions')}</th>
							</tr>
							<tr>
								<td></td>
								<td></td>
								<td>
									<FormControl
										type='text'
										onChange={this.makeFilter('patientquestion__patient_name')}
										value={this.props.filter.patientquestion__patient_name || ''}
										placeholder={__('Name') }
									/>
								</td>
								<td>
									<Select
										name="patientquestion__tagId__eq"
										title={__('Problem Type')}
										placeholder={__('Problem Type')}
										clearable= {false}
										onChange={this.makeFilter('patientquestion__tagId__eq')}
										value={this.props.filter.patientquestion__tagId__eq || 'all'}
										options={this.props.helperData.tags}
									/>
								</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td>
									<FormControl
										componentClass="select"
										placeholder="select"
										onChange={this.makeFilter('patientquestion__is_active')}
										value={this.props.filter.patientquestion__is_active || ''}
									>
										<option value=''>{__('All')}</option>
										<option value='1'>{__('Active')}</option>
										<option value='0'>{__('Inactive')}</option>
									</FormControl>
								</td>
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
							</tr>
						</thead>
						<tbody>
						{this.props.items.map(this.getDataRow, this)}
						{this.props.items.length === 0 && this.getNoDataRow(__)}
						</tbody>
					</Table>
				</Col>
				<Col xs={12}>
					<Pagination
						data={this.props.pageInfo}
						onSelect={::this.changePage}
					/>
				</Col>
			</Row>
		);
	}

	getDataRow(item, index) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);

		let count = (this.props.pageInfo.pageLimit * (this.props.pageInfo.currentPage - 1));

		return (
			<tr key={item.id}>
				<td>{count + ++index}</td>
				<td>{moment(item.createdAt).format('YYYY/MM/DD')}</td>
				<td>{item.patient_name}</td>
				<td>{item.tag.tagdetails[0].title}</td>
				<td>{item.problem_title}</td>
				<td className='text-center'>{item.skipped}</td>
				<td className='text-center'>
					{item.reported ? __('Reported({{reported}})', {reported:item.reported}):__('No')}
				</td>
				<td className='text-center'>
					{item.answered ? __('Answered({{answered}})', {answered:item.answered}):__('Unanswered')}
				</td>
				<td>{__(getStatusLabel(item.is_active, __))}</td>
				<td>
					<Icon
						className={'fg-brown'}
						style={{fontSize: 20}}
						glyph={'icon-simple-line-icons-eye'}
						onClick={this.handleView}
						title={__('View')}
						data-item-id={item.id}
					/>
					<Icon
						className={item.is_active === 1 ? 'fg-deepred': 'fg-darkgreen'}
						style={{fontSize: 20}}
						glyph={this.getStatusIcon(item.is_active)}
						onClick={this.handleState}
						data-item-id={item.id}
						data-item-status={item.is_active}
						title={__('Status')}
					/>
					<Icon
						className={'fg-brown'}
						style={{fontSize: 20}}
						glyph={'icon-simple-line-icons-envelope'}
						onClick={this.handleSendMail}
						title={__('Send Mail')}
						data-item-id={item.id}
					/>
				</td>
			</tr>
		)
	}

	getNoDataRow(__) {
		return (
			<tr key={0} className='text-center'>
				<td colSpan={9}>{__('No data found')}</td>
			</tr>
		)
	}

	renderView(__) {
		let data = this.props.item;
		return (
			<div>
				<Row>
					<Col md={12} className='fqa-question'>
						<div className="icon-title">
							<span className='icon-fqa'>
								<img src="/imgs/common/question.png" width="50"/>
							</span>
							<span className='title'>
								<strong>{data.problem_title}</strong>
								<Clearfix />
								<strong>{data.tag.tagdetails[0].title}</strong>
							</span>
							<span className='date'>
								{moment(data.createAt).format('YYYY/MM/DD')}
							</span>
						</div>
						<div className='question-desc'>
							{data.description}
							<Clearfix />
							{
								data.image !== '' &&
								<img 
									src={imageUrl+'/'+data.image}
									width='50'
									style={{marginTop: '10px'}}
									onClick={this.handleShowImage}/>
							}
						</div>
					</Col>
				</Row>
				<Row
					className="fqa-report-about"
					style={{borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd'}}>
					<Col md={12} className="text-right">
						<Icon
							style={{fontSize: 20}}
							glyph={'icon-fontello-user-1'}
						/>{' '}
						{__('Asked for')}{': '}
						{data.age+' '+ (data.gender == 1 ? __('Female'):__('Male'))}
						{', '}{data.patient_name}
					</Col>
				</Row>
				{
					data.question_answers.map(item =>
						<Row className='answer-box' key={item.id}>
							<Col md={2} className='doctor-info text-center'>
								{
									(item.doctorprofile && item.doctorprofile.doctor_profile_pic) ?
									<img src={imageUrl+'/'+item.doctorprofile.doctor_profile_pic} />
									:
									<img src='/imgs/noimage.png' />

								}
								{
									(item.doctorprofile &&
									item.doctorprofile.user &&
									item.doctorprofile.user.userdetails.length > 0) ?
									<div>{item.doctorprofile.user.userdetails[0].fullname}</div>
									: <div>{__('Unknown User')}</div>
								}
							</Col>
							{
								item.type !== 0 ?
								<Col md={10} className='answer'>
									<strong>
										{__('Reported as')}{' '}
										{item.type === 1 && __('Abusive')}
										{item.type === 2 && __('Irrelevant')}
										{item.type === 3 && __('Fake')}
									</strong>
								</Col>
								:
								<Col md={10} className='answer'>
									<strong>{__('Answer')}{':- '}</strong>
									<span dangerouslySetInnerHTML={{__html:item.answer}} />
								</Col>
							}
						</Row>
					)
				}
				<Row>
					<Col md={12} className='text-center'>
						<Button
							outlined
							bsStyle='lightgreen'
							style={{marginTop: '20px', marginBottom:'20px'}}
							data-item-id={data.id}
							onClick={this.handleSendMail}>
							{__('Send Mail')}
						</Button>
					</Col>
				</Row>
				<Modal show={this.state.showImgModal} onHide={::this.closeImgModal}>
					<Modal.Header closeButton className="text-center">
						<Modal.Title>{__('Image')}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="text-center">
							<img src={this.state.src} />
						</div>
					</Modal.Body>
					<Modal.Footer>
						<div className='text-center'>
							<Button
								onClick={::this.closeImgModal}
								bsStyle='default'
							>
								{__('Close')}
							</Button>
						</div>
					</Modal.Footer>
				</Modal>

			</div>
		);
	}
}

