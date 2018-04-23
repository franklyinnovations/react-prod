import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import emojione from 'emojione';
import actions from '../../redux/actions';
import makeTranslater from '../../translate';
import {imageUrl} from '../../../api/config';
import {
	createTimeString,
	messenger,
} from '../../utils';
import {socket} from '../../io';
import {
	Col,
	Row,
	Icon,
	Grid,
	Panel,
	PanelBody,
	PanelHeader,
	PanelContainer,
	Button,
	ButtonGroup,
	Table,
	Popover,
	OverlayTrigger,
	Modal,
	FormControl,
} from '@sketchpixy/rubix';
import Loading from '../../components/Loading';
import ServiceImage from '../../components/ServiceImage';
import Pagination from '../../components/Pagination';
import Select from '../../components/Select';

const messageStatusClasses = {
	'-1': 'failed',
	0: 'sending',
	1: 'sent',
	2: 'received',
	3: 'seen',
};
let uid = 1;

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.chat,
}))
export default class Chat extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.chat.init(store.getState()));
	}

	update = event => this.props.dispatch({
		name: event.target.name,
		value: event.target.value,
		type: event.target.getAttribute('data-action-type'),
	});

	changeView = event => this.props.dispatch(
		actions.chat.changeView(
			this.props,
			event.target.getAttribute('data-view')
		)
	);

	loadConsult = event => {
		const itemId = parseInt(event.currentTarget.getAttribute('data-consult-id'));
		if (this.props.item.id === itemId) return;
		this.props.dispatch(
			actions.chat.loadConsult(
				this.props,
				itemId
			)
		);
	};

	sendMessage = () => {
		let {item: chatconsult, meta: {message}} = this.props;
		message = message.trim();
		if (!message) return;
		this.props.dispatch(
			actions.chat.sendMessage({
				type: 0,
				sender: 0,
				uid: uid++,
				data: emojione.shortnameToUnicode(message),
				chatconsultId: chatconsult.id,
				createdAt: moment(),
				status: 0,
			}, this.props.item.id)
		);
	};

	selectEmoji = e => {
		this.props.dispatch({
			type: 'UPDATE_CHAT_MESSAGE',
			value: `${this.props.meta.message} ${
					emojione.toShort(e.currentTarget.getAttribute('data-emoji'))}`
		});
		$('#chat-emoji-btn').click();
	};

	emojis = ['😁','😂','😃','😄','😅','😆','😉','😊','😋','😌','😍','😏','😒',
		'😓','😔','😖','😘','😚','😜','😝','😞','😠','😡','😢','😣','😤','😥','😨',
		'😩','😪','😫','😭','😰','😱','😲','😳','😵','😷','😸','😹','😺','😻','😼',
		'😽','😾','😿','🙀','🙅','🙆','🙇','🙈','🙉','🙊','🙋','🙌','🙍','🙎','🙏'];

	emojis = (
		<Popover id='chat-emojis'>
			<div>
				{
					this.emojis.map(
						e => (
							<span
								key={e}
								data-emoji={e}
								onClick={this.selectEmoji}
								dangerouslySetInnerHTML={{__html: emojione.unicodeToImage(e)}}/>
						)
					)
				}
			</div>
		</Popover>
	);

	gotMessage = message => this.props.dispatch(actions.chat.gotMessage(this.props, message));
	gotMyMessage = message => this.props.dispatch(actions.chat.gotMyMessage(this.props, message));
	messageSent = response => {
		if (response.status === 0) {
			this.props.dispatch(actions.chat.messageFailed(response.uid));
			messenger.post({
				type: 'error',
				message: chatErrorMessages[response.error || 0],
			});
		} else {
			this.props.dispatch(actions.chat.messageSent(response));
		}
	};
	messageReceived = id => this.props.dispatch(actions.chat.messageReceived(id));
	messageSeen = id => this.props.dispatch(actions.chat.messageSeen(id));
	setFileInput = el => this.fileInput = el;
	uploadFile = event => {
		if (event.target.files.length === 0) return;
		let file = event.target.files[0];
		if (file.size === 0) {
			return messenger.post({
				message: 'File is empty',
				type: 'error',
			});
		}
		let messageType, ext = file.name.lastIndexOf('.');
		ext = file.name.substring(ext + 1).toLowerCase();
		switch (ext) {
			case 'png':
			case 'jpg':
			case 'jpeg':
				messageType = 1;
				break;
			default:
				messageType = -1;
		}

		if (messageType === -1) {
			event.target.value = '';
			return messenger.post({
				message: 'Invalid File Type',
				type: 'error',
			});
		}

		if (file.size > 5242880) {
			event.target.value = '';
			return messenger.post({
				message: 'File is too large',
				type: 'error',
			});
		}

		let data = new FormData(event.target.parentNode);
		event.target.value = '';

		this.props.dispatch(
			actions.chat.uploadFile(
				this.props,
				data,
				{
					sender: 0,
					chatconsultId: this.props.item.id,
					type: messageType,
					uid: uid++,
					data: 'public/loading.gif',
					status: 0,
				}
			)
		);
	};
	chooseFile = () => this.fileInput.click();
	viewChatconsult =  event => this.props.dispatch(
		actions.chat.loadConsult(
			this.props,
			+(event.target.getAttribute('data-item-id'))
		)
	);
	viewChatconsultDetail = () => this.props.dispatch(
		actions.chat.viewChatconsultDetail(this.props)
	);
	closeChatconsultDetail = () => this.props.dispatch({
		type: 'CLOSE_CHAT_CONSULT_DETAIL',
	});
	changePage = page => this.props.dispatch(actions.chat.changeView(this.props, 'CLOSED', page));
	search = () => this.props.dispatch(actions.chat.changeView(this.props, 'CLOSED', 1));
	reset = () => {
		this.props.dispatch({
			type: 'RESET_FILTERS'
		});
		this.props.dispatch(actions.chat.changeView({...this.props, filter: {}}, 'CLOSED', 1))
	};

	searchPayment = () => this.props.dispatch(actions.chat.changeView(this.props, 'PAYMENT', 1));
	resetPayment = () => {
		this.props.dispatch({
			type: 'RESET_FILTERS'
		});
		this.props.dispatch(actions.chat.changeView({...this.props, filter: {}}, 'PAYMENT', 1))
	};

	typing = event => {
		if (event.keyCode === 13) {
			this.sendMessage();
			event.preventDefault();
			event.stopPropogation();
		}
	};
	
	componentDidMount() {
		socket.on('message', this.gotMessage);
		socket.on('my-message', this.gotMyMessage);

		socket.on('message-sent', this.messageSent);
		socket.on('received', this.messageReceived);
		socket.on('seen', this.messageSeen);
		$('#footer-container').hide();
	}

	componentWillUnmount() {
		$('#footer-container').show();
	}

	render() {
		if (this.props.loading) return <Loading/>;
		let content, __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);

		switch (this.props.viewState) {
			case 'NEW':
			case 'FOLLOW_UP':
				content = this.renderChatView(__);
				break;
			case 'CLOSED':
				content = this.renderArchiveView(__);
				break;
			case 'PAYMENT':
				content = this.renderPaymentSummary(__);
				break;
		}
		return (
			<Grid>
				<Row className='chatconsult-heading'>
					<Col md={6}>
						{__('Chat Consults')}
					</Col>
					<Col md={6} className='text-right'>
						<ButtonGroup>
							<button
								data-view='NEW'
								onClick={this.changeView}
								className={
									`btn ${this.props.viewState === 'NEW' ? 'active' : ''}`
								}>
								{__('New')}
							</button>
							<button
								data-view='FOLLOW_UP'
								onClick={this.changeView}
								className={
									`btn ${this.props.viewState === 'FOLLOW_UP' ? 'active' : ''}`
								}>
								{__('Follow Up')}
							</button>
							<button
								data-view='CLOSED'
								onClick={this.changeView}
								className={
									`btn ${this.props.viewState === 'CLOSED' ? 'active' : ''}`
								}>
								{__('Closed')}
							</button>
							<button
								data-view='PAYMENT'
								onClick={this.changeView}
								className={
									`btn ${this.props.viewState === 'PAYMENT' ? 'active' : ''}`
								}>
								{__('Payment Summary')}
							</button>
						</ButtonGroup>
					</Col>
				</Row>
				{content}
				<Modal show={this.props.itemdetail !== false} onHide={this.closeChatconsultDetail}>
					<Modal.Body className="chat-modal">
						{this.props.itemdetail === null && <Loading/>}
						{
							this.props.itemdetail &&
							<Grid className="no-padding-modal">
							  <Grid className="chat-header">
								<Row>
									<Col xs={12}>
										<Row>											
											<Col xs={12} className="chat-header-detail">
											    <div className="chat-icon">
											      <ServiceImage
											      	className="img-responsive img-circle"
											      	src={`${imageUrl}/${this.props.itemdetail.patient.user.user_image}`}
											      	style={{width:'74px', height: '74px'}}/>
											    </div>
												<div className="chat-title">{this.props.itemdetail.name}</div>
												<div className="chat-city">	
                                                 {
													__('{{gender}}, {{age}} year', {
														gender: this.props.itemdetail .gender === 0 ? 'Male' : 'Female',
														age: this.props.itemdetail.age
													})
												}
												</div>
												<div className="chat-id-phone">
													<Icon glyph='icon-fontello-mobile' style={{padding: 0}}/>
													{' '}
													{this.props.itemdetail.contact}
													{' '}
													<Icon glyph='icon-fontello-mail-1' style={{padding: 0}}/>
													{' '}
													{this.props.itemdetail.email}
												</div>
											</Col>											
										</Row>
									</Col>
								</Row>
								</Grid>

								<Grid className="chat-problem">
                                   <Row>
									<Col xs={12}>
										<b>{__('Problem')}</b>
									</Col>
									</Row>
								</Grid>

								<Grid className="chat-problem-detail">
                                  <Row>									
									<Col xs={2}>
										<img src="/imgs/common/question.png" width="50"/>
									</Col>
									<Col xs={10}>
										<h2>{this.props.itemdetail.title}</h2>
										<h3>{this.props.itemdetail.tag.tagdetails[0].title}</h3>
										<p>{this.props.itemdetail.description}</p>
									</Col>									
									</Row>
								</Grid>

								<Grid className="chat-problem">
								  <Row>
									<Col xs={6}>{__('Charges')}</Col>
									<Col className='text-right' xs={6}>
									   <span>{'Consult ID :'}{this.props.itemdetail.id}</span>
									 </Col>
									</Row>
								</Grid>
								<Grid className="chat-section">
								   <Row>								
									<Col xs={6}>
										<h2>
											{
												this.props.itemdetail.transaction ? 
												this.props.session.currency + this.props.itemdetail.transaction.amount:''
											}
										</h2>
									</Col>
									<Col xs={6}>
										{
											(
												this.props.itemdetail.transaction &&
												this.props.itemdetail.transaction.payment_status === 'success'
											) ? <a
													className='invoice'
													style={{marginLeft: '10px'}}
													href={'/invoice/'+this.props.itemdetail.id}
													download='invoice.pdf'>
													{__('Invoice')}
												</a>
											:
											''
										}
										<span>
											{
												this.props.itemdetail.transaction ? 
												(this.props.itemdetail.transaction.payment_status === 'success' ? __('Paid'):__('Failed'))
												:
												__('Padding')
											}
										</span>{' '}
									</Col>
								  </Row>
								</Grid>
								<Grid className="chat-footer">	
								<Row>
									<Col xs={12}>
									   <h4>{__('Consult Date:')}
									   <span>{moment(this.props.itemdetail.createdAt).format('DD/MM/YYYY')}</span> </h4>
									</Col>
									<Col xs={12}>
									  <h4>
									     {__('Consult Closed Date:')}
								    	 <span>{moment(this.props.itemdetail.createdAt).add(7, 'day').format('DD/MM/YYYY')}</span> 
								    	</h4>
									</Col>									
								</Row>
							</Grid>
							</Grid>
						}
					</Modal.Body>
				</Modal>
			</Grid>
		);
	}

	renderArchiveView(__) {
		return (
			<Row>
				<Col xs={this.props.item === false ? 12 : 6} className='consults'>
					<Table>
						<thead>
							<tr>
								<th>{__('Name')}</th>
								<th>{__('Date & Time')}</th>
								<th>{__('Actions')}</th>
							</tr>
							<tr>
								<td>
									<FormControl
										type='text'
										onChange={this.makeFilter('name')}
										value={this.props.filter.name || ''}
										placeholder={__('Name')}/>
								</td>
								<td/>
								<td>
									<Icon
										className={'fg-darkcyan'}
										style={{fontSize: 20}}
										glyph={'icon-feather-search'}
										onClick={this.search}/>
									<Icon
										className={'fg-brown'}
										style={{fontSize: 20}}
										glyph={'icon-feather-reload'}
										onClick={this.reset}/>
								</td>
							</tr>
						</thead>
						<tbody>
							{
								this.props.items.map(item => (
									<tr key={item.id}>
										<td>{item.name}</td>
										<td>{createTimeString(item.createdAt)}</td>
										<td>
											<Icon
												onClick={this.viewChatconsult}
												data-item-id={item.id}
												glyph='icon-simple-line-icons-eye'
												style={{fontSize: 20}}/>
										</td>
									</tr>
								))
							}
							{
								this.props.items.length === 0 &&
								<tr>
									<td colSpan='3' className='text-center'>
										{__('No consults found')}
									</td>
								</tr>
							}
						</tbody>
					</Table>
					{
						this.props.meta.pageInfo &&
						<Pagination
							data={this.props.meta.pageInfo}
							onSelect={this.changePage}/>
					}
				</Col>
				{
					this.props.item !== false &&
					<Col xs={6} className='consult-conversation'>
						{
							this.props.item === null ? <Loading/> :
							<div>
								<Row>
									<Col xs={3}>
										<ServiceImage className="img-responsive img-circle img-thumbnail" src={
											imageUrl + '/' +
											this.props.item.patient.user.user_image
										}/>
									</Col>
									<Col xs={9} collapseRight collapseLeft>
										<Row>
											<Col xs={12}>
												<div className="chat-title-name">{this.props.item.name}</div>		
												<div>{this.props.item.contact}</div>
											</Col>
										</Row>
									</Col>
								</Row>
								<div>
									<div className='info' key='info'>
										<h4><b>{__('Problem Type')}</b></h4>
										<h4>{__(this.props.item.tag.tagdetails[0].title)}</h4>
										<h4><b>{__('Problem')}</b></h4>
										<h4>{this.props.item.title}</h4>
										<h4><b>{__('Description')}</b></h4>
										<p>{this.props.item.description}</p>
									</div>
									{
										this.props.item.chatconsultmessages.map(
											message => <Message {...message} key={message.id}/>
										)
									}
								</div>
								<Icon
									onClick={this.viewChatconsultDetail}
									glyph='icon-simple-line-icons-eye'
									style={{fontSize: 20}}/>
							</div>
						}
					</Col>
				}
			</Row>
		)
	}

	renderChatView(__) {
		let itemId = this.props.item && this.props.item.id,
			search = this.props.meta.search.trim();
		search = !!search && search;
		return (
			<Row>
				<Col
					className='consults'
					xs={this.props.items.length === 0 ? 12 : 4}>
					{
						this.props.items.length !== 0 &&
						<span key='search'>
							<i className='fa fa-search'/>
							<input
								onChange={this.update}
								value={this.props.meta.search}
								data-action-type='UPDATE_CHAT_SEARCH'
								placeholder={__('Search')}/>
						</span>
					}
					{
						this.props.items.map(
							chatconsult => (
								<Row
									className={
										`${chatconsult.id === itemId ? 'selected' : ''} ${search && chatconsult.name.toLowerCase().indexOf(search) === -1 ? 'hide' : ''}`
									}
									onClick={this.loadConsult}
									data-consult-id={chatconsult.id}
									key={chatconsult.id}>
									<Col xs={3}>
										<ServiceImage className="img-responsive img-circle img-thumbnail" src={
											imageUrl + '/' +
											chatconsult.patient.user.user_image
										}
										style={{width:'74px', height: '74px'}}/>
									</Col>
									<Col xs={9} collapseRight collapseLeft>
										<div><strong>{chatconsult.name}</strong></div>
										<div>
											{
												chatconsult.chatconsultmessage === null ?
												shortString(chatconsult.title) :
												shortMessage(chatconsult.chatconsultmessage)
											}
										</div>
										<div>
											{
												createTimeString(
													chatconsult.chatconsultmessage === null ?
													chatconsult.createdAt :
													chatconsult.chatconsultmessage.createdAt
												)
											}
										</div>
									</Col>
									{
										chatconsult.unread !== 0 &&
										<span>{chatconsult.unread}</span>
									}
								</Row>
							)
						)
					}
					{
						this.props.items.length === 0 && 
						<h4 className='text-center'>{__('No consults found')}</h4>
					}
				</Col>
				{
					this.props.items.length !== 0 && 
					<Col xs={8} className='consult-conversation'>
						{
							this.props.item === false &&
							<h4 className='text-center'>{__('Please select a consult')}</h4>
						}
						{this.props.item === null && <Loading/>}
						{
							!!this.props.item &&
							<div>
								<Row>
									<Col xs={2}>
										<ServiceImage className="img-responsive img-circle img-thumbnail" src={
											imageUrl + '/' +
											this.props.item.patient.user.user_image
										}
										style={{width:'74px', height: '74px'}}/>
									</Col>
									<Col xs={10} collapseRight collapseLeft>
										<Row>
											<Col xs={12}>
												<div className="chat-title-name">{this.props.item.name}</div>
												<div>{this.props.item.contact}</div>
											</Col>
										</Row>
									</Col>
								</Row>
								<div>
									<div className='info' key='info'>
										<h4><b>{__('Problem Type')}</b></h4>
										<h4>{__(this.props.item.tag.tagdetails[0].title)}</h4>
										<h4><b>{__('Problem')}</b></h4>
										<h4>{this.props.item.title}</h4>
										<h4><b>{__('Description')}</b></h4>
										<p>{this.props.item.description}</p>
									</div>
									{
										this.props.item.chatconsultmessages.map(
											message => (
												<Message
													dispatch={this.props.dispatch}
													{...message}
													key={message.uid ? `uid${message.uid}` : message.id}/>
											)
										)
									}
								</div>
								<div>
									<textarea
										placeholder={__('Type a message here')}
										onChange={this.update}
										onKeyDown={this.typing}
										value={this.props.meta.message}
										data-action-type='UPDATE_CHAT_MESSAGE'/>
									<form style={{display: 'none'}}>
										<input
											onChange={this.uploadFile}
											type='file'
											name='image'
											ref={this.setFileInput}/>
									</form>
									<div>
										<Icon
											onClick={this.chooseFile}
											glyph='icon-fontello-attach-1'/>
										<OverlayTrigger
											trigger='click'
											rootClose={true}
											placement='top'
											overlay={this.emojis}>
											<Icon
												id='chat-emoji-btn'
												onClick={this.sendSmile}
												glyph='icon-simple-line-icons-emoticon-smile'/>
										</OverlayTrigger>
										<Icon
											onClick={this.sendMessage}
											glyph='icon-simple-line-icons-paper-plane'/>
									</div>
								</div>
								<Icon
									onClick={this.viewChatconsultDetail}
									glyph='icon-simple-line-icons-eye'
									style={{fontSize: 20}}/>
							</div>
						}
					</Col>
				}
			</Row>
		);
	}

	renderPaymentSummary(__) {
		return (
			<Row>
				<Col xs={12} className='consults'>
					<Table>
						<thead>
							<tr>
								<td/>
								<td/>
								<td/>
								<td colSpan={2}>
									<FormControl
										type='text'
										onChange={this.makeFilter('consultId')}
										value={this.props.filter.consultId || ''}
										placeholder={__('Consult ID')}/>
								</td>
								<td colSpan={2}>
									<FormControl
										type='text'
										onChange={this.makeFilter('patient_name')}
										value={this.props.filter.patient_name || ''}
										placeholder={__('Patient Name')}/>
								</td>
								<td colSpan={2}>
									<Select
										name="is_released"
										onChange={this.makeFilter('is_released')}
										value={this.props.filter.is_released || ''}
										clearable={false}
										options={[{
											value: '',
											label: __('All')
										}, {
											value: '0',
											label: __('Pending')
										}, {
											value: 1,
											label: __('Released')
										}]}
									/>
								</td>
								<td>
									<Icon
										className={'fg-darkcyan'}
										style={{fontSize: 20}}
										glyph={'icon-feather-search'}
										onClick={this.searchPayment}/>
									<Icon
										className={'fg-brown'}
										style={{fontSize: 20}}
										glyph={'icon-feather-reload'}
										onClick={this.resetPayment}/>
								</td>
							</tr>
							<tr>
								<th>{__('S.No.')}</th>
								<th>{__('Start Date')}</th>
								<th>{__('End Date')}</th>
								<th>{__('Consult ID')}</th>
								<th>{__('Patient Name')}</th>
								<th>{__('Total Charges')}</th>
								<th>{__('Wikicare Fee')}</th>
								<th>{__('Amount')}</th>
								<th>{__('Status')}</th>
								<th>{__('Reference id')}</th>
							</tr>
						</thead>
						<tbody>
							{
								this.props.items.map((item, index) => (
									<tr key={item.id}>
										<td>{index+1}</td>
										<td>{moment(item.createdAt).format('YYYY-MM-DD')}</td>
										<td>{moment(item.createdAt).add(7, 'days').format('YYYY-MM-DD')}</td>
										<td>{item.chatconsultId}</td>
										<td>{item.chatconsult.name}</td>
										<td>{this.props.session.currency + item.amount}</td>
										<td>{this.props.session.currency + ((item.amount*this.props.meta.commission)/100)}</td>
										<td>{this.props.session.currency + (item.amount-((item.amount*this.props.meta.commission)/100))}</td>
										<td>{item.is_released ? __('Released'):__('Pending')}</td>
										<td>{item.ref_id}</td>
									</tr>
								))
							}
							{
								this.props.items.length === 0 &&
								<tr>
									<td colSpan='10' className='text-center'>
										{__('No consults found')}
									</td>
								</tr>
							}
						</tbody>
					</Table>
					{
						this.props.meta.pageInfo &&
						<Pagination
							data={this.props.meta.pageInfo}
							onSelect={this.changePage}/>
					}
				</Col>
			</Row>
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
}

class Message extends React.Component {

	componentDidMount() {
		ReactDOM.findDOMNode(this).scrollIntoView();
		if (this.props.sender === 0) return;
		if (this.props.status < 3)
			this.props.dispatch(actions.chat.sawMessage(this.props.id, this.props.chatconsultId))
	}

	render() {
		const
			message = this.props,
			sender = message.sender === 0 ? 'sender' : 'receiver',
			type = message.type === 0 ? 'text' : 'image';
		return (
			<div
				className={`${sender} ${type}`}>
				{
					message.type === 0 ?
					<span dangerouslySetInnerHTML={{__html: message.data}}/> :
					<span><img src={`${imageUrl}/${message.data}`}/></span>
				}
				<div>
					<span>{createTimeString(message.createdAt)}</span>
					{
						message.sender === 0 &&
						<span
							className={`msg-status ${messageStatusClasses[message.status]}`}/>
					}
				</div>
			</div>
		);
	}
}

function shortMessage(message) {
	switch (message.type) {
		case 0:
			return shortString(message.data);
		case 1:
			return 'Image';
	}
}

function shortString(string) {
	if (string.length >= 23)
		return string.substring(0, 20) + '...';
	else
		return string;
}