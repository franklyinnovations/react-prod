import React from 'react';
import {connect} from 'react-redux';
import { Link, withRouter } from 'react-router';
import moment from 'moment';

import {imageUrl} from '../../../api/config';
import actions from '../../redux/actions';
import Loading from '../../components/Loading';
import Select from '../../components/Select';
import Pagination from '../../components/Pagination';

import makeTranslater from '../../translate';

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
	Well,
	LoremIpsum,
	Accordion,
	BPanel,
	ButtonGroup,
	OverlayTrigger,
	Popover,
	Clearfix,
	Modal
} from '@sketchpixy/rubix';

import url from 'url';

const viewName = 'freeqa';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view[viewName]
}))
export default class FreeQA extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			eventKey: 1,
			showImgModal: false,
			src: ''
		}
	}

	static fetchData(store) {
		return store.dispatch(
			actions.freeqa.init(
				store.getState()
			)
		);
	}

	handleSelect = event => {
		this.setState({eventKey: this.state.eventKey === event ? null: event})
	};

	handleSkipQuestion = event => {
		this.props.dispatch(
			actions.freeqa.skipQuestion(this.props, event.target.getAttribute('data-item-id'))
		)
	};

	handleAnswerNow = event => {
		this.props.dispatch(
			actions.freeqa.answerNow(this.props, event.target.getAttribute('data-item-id'))
		)
	};

	handleViewAnswer = event => {
		this.props.dispatch(
			actions.freeqa.answerNow(this.props, event.target.getAttribute('data-item-id'), true)
		)
	};

	handleDataUpdate = event => {
		this.props.dispatch({
			type: 'FQA_UPDATE_DATA_VALUE',
			name: event.target.name,
			value: event.target.type === 'checkbox' ? event.target.checked:event.target.value
		});
	};

	handleFilter = event => {
		let name,value;
		if(event.target.name && event.target.value){
			name = event.target.name;
			value = event.target.value;
		} else {
			name = event.target.getAttribute('data-item-name');
			value = event.target.getAttribute('data-item-btn');
		}
		this.props.dispatch({
			type: 'FQA_UPDATE_FILTER',
			name,
			value
		});
		this.props.router.push(this.props.location.pathname);
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

	closeImgModal() {
		this.setState({
			showImgModal: false,
			src: ''
		});
	}

	viewList() {
		this.props.dispatch({
			type: 'VIEW_FQA_LIST'
		});
	}

	save() {
		this.props.dispatch(
			actions.freeqa.saveAnswer(this.props)
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

	reportQuestion(type) {
		this.props.dispatch(
			actions.freeqa.reportQuestion(this.props, type)
		);
	}

	render() {
		if (this.props.loading) return <Loading/>;
		let content, __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		switch(this.props.viewState) {
			case 'DATA_FORM':
				content = this.renderAdd(__);
				break;
			default:
				content = this.renderList(__);
		}
		return (
			<Row>
				<Col xs={12}>
					<PanelContainer controls={false}>
						<Panel>
							<PanelHeader className='bg-green'>
								<Grid>
									<Row>
										<Col xs={6} className='fg-white'>
											<h3>{__('Free QA')}</h3>
										</Col>
										<Col xs={6} className="text-right">
											{this.props.viewState === 'DATA_FORM' &&
												<h3>
													<Button
														inverse
														outlined
														style={{marginBottom: 5}}
														bsStyle='default'
														onClick={::this.viewList}
													>
														{__('View List')}
													</Button>
												</h3>
											}
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
			</Row>
		);
	}

	renderList(__) {
		return (
			<Row key="freeqa-list" className="freeqa-list">
				<Col xs={6} className="fqa-list-top">
					<FormGroup controlId='inlinehelp'>
						<Col sm={3} componentClass={ControlLabel}>{__('Filter By')}:</Col>
						<Col sm={6}>
							<Select
								name="tagId"
								clearable= {false}
								placeholder={__('All Type')}
								value={this.props.filter.tagId || 'all'}
								options={this.props.helperData.tags}
								onChange={this.handleFilter}
							/>
						</Col>
					</FormGroup>
				</Col>
				<Col xs={6} className="text-right fqa-list-top">
					<ButtonGroup>
						<Button
							lg
							data-item-btn="new"
							data-item-name="showlist"
							className={this.props.filter.showlist !== 'answered' ? 'fqa-btn-active':''}
							onClick={this.handleFilter}>
							{__('New Questions Assigned')}
						</Button>
						<Button
							lg
							className={this.props.filter.showlist === 'answered' ? 'fqa-btn-active':''}
							data-item-btn="answered"
							data-item-name="showlist"
							onClick={this.handleFilter}>
							{__('Already Answered')}
						</Button>
					</ButtonGroup>
				</Col>
				<Col xs={12} style={{minHeight: '200px'}}>
					{
						this.props.filter.loading ? <Loading />: this.renderQuestion(__)
					}
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

	renderQuestion(__){
		return (
			this.props.items.length === 0 ? 
			<Well className="text-center">{__('No result found.')}</Well>
			:
			<Accordion defaultActiveKey={this.state.eventKey} onSelect={this.handleSelect}>
				{
					this.props.items.map((item, index) => (
						item.skipped ? <Loading key={item.id}/> :
						<BPanel
							key={item.id}
							header={this.renderTopHeader(item, (index+1), __)}
							eventKey={index+1}>
							<Grid>
								<Row>
									<Col md={12}>
										{item.description}
										<Clearfix />
										{
											item.image !== '' &&
											<img 
												src={imageUrl+'/'+item.image}
												width='50'
												style={{marginTop: '10px'}}
												onClick={this.handleShowImage}/>
										}
									<hr />
									</Col>
									<Col md={6}>
										<Icon
											style={{fontSize: 20}}
											glyph={'icon-fontello-user-1'}
										/>{' '}
										{__('Asked for')}{': '}
										{item.age+' '+ (item.gender == 1 ? __('Female'):__('Male'))}
										{', '}{item.patient_name}
									</Col>
									{
										this.props.filter.showlist !== 'answered' ?
										<Col md={6} className="text-right">
											<Button
												outlined
												bsStyle='default'
												data-item-id={item.id}
												onClick={this.handleSkipQuestion}>
												{__('Skip')}
											</Button>{' '}
											<Button
												outlined
												bsStyle='lightgreen'
												data-item-id={item.id}
												onClick={this.handleAnswerNow}>
												{__('Answer Now')}
											</Button>
										</Col>
										:
										<Col md={6} className="text-right">
											<Button
												outlined
												bsStyle='default'
												data-item-id={item.id}
												onClick={this.handleViewAnswer}>
												{__('View Answer')}
											</Button>{' '}
											<Button
												outlined
												bsStyle='lightgreen'
												data-item-id={item.id}
												onClick={this.handleAnswerNow}>
												{__('Edit Answer')}
											</Button>
										</Col>
									}
								</Row>
							</Grid>
						</BPanel>
					))
				}
			</Accordion>
		);
	}

	renderTopHeader(item, eventKey, __) {
		return (
			<div className='fqa-question'>
				<div className="icon-title">
					<span className='icon-fqa'>
						<img src="/imgs/common/question.png" width="35"/>
					</span>
					<span className='title'>
						<strong>{item.problem_title}</strong>
						<Clearfix />
						<span>{item.tag.tagdetails[0].title}</span>
					</span>
					<span className='date'>
						{moment(item.createAt).format('YYYY/MM/DD')}
					</span>
				</div>
			</div>
		);
	}

	renderAdd(__) {
		let data = this.props.item.data;
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
					<Col md={4}>
						{
							(this.props.item.id !== '' || this.props.item.answerView) ? '' :
							<OverlayTrigger
								trigger="click"
								placement="bottom"
								overlay={
									<Popover id="popover-positioned-bottom">
										<strong 
											style={{cursor: 'pointer'}}
											onClick={this.reportQuestion.bind(this, 1)}>
											{__('Mark Abusive')}
										</strong>
										<hr style={{marginBottom: '5px', marginTop: '5px'}}/>
										<strong
											style={{cursor: 'pointer'}}
											onClick={this.reportQuestion.bind(this, 2)}>
											{__('Mark Irrelevant')}
										</strong>
										<hr style={{marginBottom: '5px', marginTop: '5px'}}/>
										<strong
											style={{cursor: 'pointer'}}
											onClick={this.reportQuestion.bind(this, 3)}>
											{__('Mark Fake')}
										</strong>
									</Popover>
								}>	
								<div style={{cursor: 'pointer'}}>
									<Icon
										style={{fontSize: 20}}
										glyph={'icon-fontello-bookmark-1'}
									/>{' '}
									{__('Report About Question')}
								</div>
							</OverlayTrigger>
						}
					</Col>
					<Col md={8} className="text-right">
						<Icon
							style={{fontSize: 20}}
							glyph={'icon-fontello-user-1'}
						/>{' '}
						{__('Asked for')}{': '}
						{data.age+' '+ (data.gender == 1 ? __('Female'):__('Male'))}
						{', '}{data.patient_name}
					</Col>
				</Row>
				<Row>
					<Col md={12}>
						{
							this.props.item.answerView ?
							<div style={{marginBottom: '10px'}}>
								<h3 style={{color: '#333'}}>{__('Answer')}{':- '}</h3>
								<span dangerouslySetInnerHTML={{__html:this.props.item.answer}} />
							</div>
							:
							<FormGroup
								controlId='answer'
								validationState={this.props.errors.answer ? 'error': null}
							>
								<ControlLabel>{__('Write Answer')}</ControlLabel>
								<FormControl
									componentClass='textarea'
									rows='5'
									name='answer'
									value={this.props.item.answer}
									onChange={this.handleDataUpdate}/>
								<HelpBlock>{this.props.errors.answer}</HelpBlock>
							</FormGroup>
						}
					</Col>
					{!this.props.item.answerView &&
						<Col md={6}>
							<FormGroup controlId='is_for_profile'>
								<Checkbox
									name='is_for_profile'
									onChange={this.handleDataUpdate}
									checked={this.props.item.is_for_profile}
								>
									{__('Check to post & show on your profile for viewers')}
								</Checkbox>
							</FormGroup>
						</Col>
					}
				</Row>
				<Row>
					<Col md={12}>
						{this.props.item.answerView ?
							<div>
								<Button
									outlined
									bsStyle='lightgreen'
									data-item-id={this.props.item.patientquestionId}
									onClick={this.handleAnswerNow}>
									{__('Edit Answer')}
								</Button>
							</div>
							:
							<div>
								<Button
									outlined
									bsStyle='default'
									onClick={::this.viewList}
									disabled={this.props.saving}
								>
									{__('Cancel')}
								</Button>{' '}
								<Button
									outlined
									bsStyle='lightgreen'
									onClick={::this.save}
									disabled={this.props.saving}
								>
									{__(this.props.saving ? 'Saving' : 'Submit')}
								</Button>
							</div>
						}
						<br/>
					</Col>
				</Row>
			</div>
		);
	}
}

