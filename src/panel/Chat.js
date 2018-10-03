import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import emojione from 'emojione_minimal';

import {
	Col,
	Row,
	Icon,
	Badge,
	Modal,
	Button,
	Select,
	Popover,
	Overlay,
	Loading,
	FormGroup,
	ServiceImage,
	ControlLabel,
} from '../components';

import {
	messenger,
	createDayString,
	createTimeString,
	MESSAGE_TYPE_TEXT,
} from '../utils';
import {socket} from '../io';
import * as actions from '../redux/actions/chat';

const messageStatusClassNames = {
	'-1': 'failed',
	0: 'sending',
	1: 'sent',
	2: 'received',
	3: 'seen',
	4: 'sent'
};

const chatErrorMessages = [
	'Internal Error',
	'Please login first',
	'Not Permitted to chat with this user',
	'User is inactive',
	'You have blocked this user',
];

let uid = 0;

@connect(state => ({
	session: state.session,
	lang: state.lang,
	translations: state.translations,
	chat: state.chat,
}))
export default class Chat extends React.Component {

	emojiTarget = null;

	setEmojiTarget = (target, onEmojiSelect) => {
		this.emojiTarget = target;
		this.onEmojiSelect = onEmojiSelect;
		this.forceUpdate();
	};

	setOnlineStatus = status => this.props.dispatch(actions.setOnlineStatus(status));

	gotMessage = message => this.props.dispatch(actions.gotMessage(this.props, message));
	gotMyMessage = message => this.props.dispatch(actions.gotMyMessage(this.props, message));

	messageSent = response => {
		if (response.status === 0) {
			this.props.dispatch(actions.messageFailed(response.uid));
			messenger.post({
				type: 'error',
				message: chatErrorMessages[response.error || 0],
			});
		} else {
			this.props.dispatch(actions.messageSent(response));
		}
	};
	messageReceived = id => this.props.dispatch(actions.messageReceived(id));
	messageSeen = id => this.props.dispatch(actions.messageSeen(id));

	startedTyping = userId => this.props.dispatch(actions.changeTypingStatus(userId, true));
	stoppedTyping = userId => this.props.dispatch(actions.changeTypingStatus(userId, false));

	search = event => this.props.dispatch(actions.search(event.currentTarget.value));

	componentDidMount() {
		this.props.dispatch(actions.init(this.props))
			.then(() => {
				this.props.dispatch(actions.setOnlineStatus(socket.connected));
				socket.on('connect', () => this.setOnlineStatus(true));
				socket.on('disconnect', () => this.setOnlineStatus(false));
				socket.on('reconnect', () => this.setOnlineStatus(true));

				socket.on('message', this.gotMessage);
				socket.on('my-message', this.gotMyMessage);

				socket.on('message-sent', this.messageSent);
				socket.on('received', this.messageReceived);
				socket.on('seen', this.messageSeen);

				socket.on('started-typing', this.startedTyping);
				socket.on('stopped-typing', this.stoppedTyping);

				socket.on('online',
					userId => this.props.dispatch(
						actions.setUserOnlineStatus(userId, true)
					)
				);
				socket.on('offline',
					userId => this.props.dispatch(
						actions.setUserOnlineStatus(userId, false)
					)
				);
			});
	}

	render() {
		if (this.props.chat.users === null)
			return <div id='chat'><br/><Loading/></div>;
		let __ = window.__;
		return (
			<div id='chat'>
				<div id='chat-users'>
					<input
						onChange={this.search}
						value={this.props.chat.meta.search}
						key='chat-user-search'
						className='form-control'
						type='text'
						placeholder={__('Search')}/>
					{
						this.props.chat.selector.permissionCount !== 0 &&
						<div id='chat-user-selector' key='chat-user-selector'>
							<div>
								{
									this.props.chat.selector.permissions.student &&
									<span
										title={__('Student')}
										onClick={() => this.startSelection('student')}>
										<img src='/imgs/admin/student.png'/>
									</span>
								}
								{
									this.props.chat.selector.permissions.teacher &&
									<span
										title={__('Teacher')}
										onClick={() => this.startSelection('teacher')}>
										<img src='/imgs/admin/teacher.png'/>
									</span>
								}
								{
									this.props.chat.selector.permissions.institute &&
									<span
										title={__('Institute')}
										onClick={() => this.startSelection('institute')}>
										<img src='/imgs/admin/institute.png'/>
									</span>
								}
								{
									this.props.chat.selector.permissions.admin &&
									<span
										title={__('Institute Admin')}
										onClick={() => this.startSelection('admin')}>
										<img src='/imgs/admin/admin.png'/>
									</span>
								}
								{
									this.props.chat.selector.permissions.parent &&
									<span
										title={__('Parent')}
										onClick={() => this.startSelection('parent')}>
										<img src='/imgs/admin/parent.png'/>
									</span>
								}
							</div>
						</div>
					}
					{this.renderUsers(this.props.chat.users, __)}
				</div>
				<div id='chat-conversations'>
					{
						this.props.chat.conversations.map(
							conversation => (
								<Conversation
									showEmoji={this.setEmojiTarget}
									key={conversation.user.id}
									{...conversation}/>
							)
						)
					}
				</div>
				<EmojiPicker
					onEmojiSelect={this.onEmojiSelect}
					onHide={() => this.setEmojiTarget(null)}
					target={this.emojiTarget}/>
				<ChatUserSelector {...this.props.chat.selector}/>
			</div>
		);
	}

	renderUsers(users, __) {
		let count = 0,
			chats = users.map(user => (
				user.visible && ++count &&
				(
					user.loading ?
					<div key={user.id} className='text-center'>
						<Loading size={30}/>
					</div> :
					<div
						key={user.id}
						className={user.online ? 'online' : 'offline'}
						onClick={() => this.startConversation(user)}>
						<ServiceImage src={user.user_image}/>
						<span>{user.userdetails[0].fullname}</span>
						{user.unread !== 0 && <Badge>{user.unread}</Badge>}
					</div>
				)
			));
		return count === 0 ? <h4 className='text-center'>{__('No result found')}</h4> : chats;
	}

	startConversation(user) {
		this.props.dispatch(
			actions.startConversation(
				this.props,
				user
			)
		);
	}

	startSelection(user_type) {
		this.props.dispatch(actions.startSelection(this.props, user_type));
	}
}

@connect((state, ownProps) => ({
	lang: state.lang,
	session: state.session,
	translations: state.translations,
	messageCount: ownProps.messages.length,
}))
class Conversation extends React.Component {

	typingTimeout = null;
	fileInput = React.createRef();
	messageType = 0;

	setupScrollbar = el => {
		if (el) {
			PerfectScrollbar.initialize(
				this.scrollbarContainer = ReactDOM.findDOMNode(el)
			);
		} else {
			PerfectScrollbar.destroy(this.scrollbarContainer);
		}
	};

	sendMessage = () => {
		let {user, message, file} = this.props;
		if (file) {
			this.props.dispatch(
				actions.uploadFile(
					this.props,
					new FormData(this.fileInput.current.parentNode), {
						uid: uid++,
						data: null,
						type: this.messageType,
						receiverId: this.props.user.id,
					}
				)
			);
			this.fileInput.current.value = '';
			this.messageType = 0;
			this.props.dispatch({
				type: 'CHAT_PREVIEW_FILE',
				receiverId: this.props.user.id,
				file: undefined,
			});
			return;
		}
		message = message.trim();
		if (!message) return;
		this.props.dispatch(
			actions.sendMessage({
				data: message,
				type: MESSAGE_TYPE_TEXT,
				receiverId: user.id,
				uid: uid++,
			}, this.props.session.id)
		);
		if (this.typingTimeout !== null)
			clearTimeout(this.typingTimeout);
		this.stoppedTyping();
	};

	showEmoji = (event) => this.props.showEmoji(event.target, this.onEmojiSelect);

	onEmojiSelect = (e) => {
		this.updateMessage(this.props.user.id, this.props.message.trim() + ' ' + e);
	};

	typing = (event) => {
		if (event.keyCode !== 13) {
			if (this.typingTimeout !== null) {
				clearTimeout(this.typingTimeout);
			} else {
				socket.emit('started-typing', this.props.user.id);
			}
			this.typingTimeout = setTimeout(this.stoppedTyping, 3000);
		} else {
			this.sendMessage();
		}
	};

	stoppedTyping = () => {
		socket.emit('stopped-typing', this.props.user.id);
		this.typingTimeout = null;
	};

	previewFile = event => {
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
			case 'jpe':
			case 'gif':
				messageType = 1;
				break;
			case 'mp3':
			case 'amr':
			case 'aac':
			case 'm4a':
			case 'wav':
				messageType = 2;
				break;
			case '3gp':
			case 'mp4':
			case 'avi':
			case 'wmv':
			case 'mov':
			case 'm4v':
			case 'ogx':
				messageType = 3;
				break;
			case 'pdf':
			case 'xls':
			case 'xlsx':
			case 'csv':
			case 'doc':
			case 'docx':
			case 'txt':
			case 'dot':
			case 'dotx':
			case 'po':
				messageType = 4;
				break;
			default:
				messageType = -1;
		}

		if (messageType === -1) {
			event.currentTarget.value = '';
			return messenger.post({
				message: 'Invalid File Type',
				type: 'error',
			});
		}

		if (file.size > 5242880) {
			event.currentTarget.value = '';
			return messenger.post({
				type: 'error',
				message: window.__('File is too large'),
			});
		}

		this.messageType = messageType;

		this.props.dispatch({
			type: 'CHAT_PREVIEW_FILE',
			receiverId: this.props.user.id,
			file: messageType === 1 ? (
				typeof URL !== 'undefined' ? URL.createObjectURL(file) : '/imgs/admin/file.png'
			) : attachmentImage(messageType),
		});
	};

	cancelFileUpload = () => {
		this.fileInput.current.value = '';
		this.props.dispatch({
			type: 'CHAT_PREVIEW_FILE',
			receiverId: this.props.user.id,
			file: undefined,
		});
	};

	chooseFile = () => this.fileInput.current.click();

	onScroll = event => {
		if (event.target.scrollTop !== 0 || this.props.loading || !this.props.more) return;
		let createdAt = Date.now(), {messages} = this.props;
		for (let i = 0; i < messages.length; i++) {
			if (messages[i].constructor !== String) {
				createdAt = messages[i].createdAt;
				break;
			}
		}

		this.props.dispatch(
			actions.loadMoreMessages(
				this.props,
				this.props.user.id,
				createdAt
			)
		);
	};

	render() {
		let {user, loading, message, messages, typing} = this.props;
		return (
			<div className={user.online ? 'online' : 'offline'}>
				<div className='conversation-heading'>
					<div className='user-details'>
						<ServiceImage src={user.user_image}/>
						<span className='name'>{user.userdetails[0].fullname}</span>
					</div>
					<div className='controls'>
						<Icon
							onClick={() => this.closeConversation(user.id)}
							glyph='fa-times'/>
					</div>
				</div>
				<div
					onScroll={this.onScroll}
					className='conversation-messages'
					ref={this.setupScrollbar}>
					{loading && <Loading size={18}/>}
					{
						messages.length !== 0 &&
						<h4>{createDayString(messages[0].createdAt)}</h4>
					}
					{this.renderMessages(messages)}
					{typing && <Typing/>}
				</div>
				<div className='message-input'>
					{
						!this.props.file ?
						<textarea
							onKeyUp={this.typing}
							value={message}
							onChange={event => this.updateMessage(user.id, event.currentTarget.value)}/> :
						<img src={this.props.file} />
					}
					<form>
						<input
							type='file'
							name='file'
							onChange={this.previewFile}
							ref={this.fileInput}/>
					</form>
					<div className='controls'>
						{
							!this.props.file ?
							<React.Fragment>
								<Icon
									onClick={this.showEmoji}
									glyph='fa-smile'/>
								<Icon
									onClick={this.chooseFile}
									glyph='fa-paperclip'/>
							</React.Fragment> :
							<Icon
								onClick={this.cancelFileUpload}
								glyph='fa-times'/>

						}
						<Icon
							onClick={this.sendMessage}
							glyph='fa-paper-plane'/>
					</div>
				</div>
			</div>
		);
	}

	renderMessages(messages) {
		let userId = this.props.session.id;
		return messages.map(message => {
			if (message.constructor === String) {
				return <h4 key={message}>{message}</h4>;
			}
			return <Message
				key={message.id || 'uid' + message.uid}
				{...message}
				mine={userId === message.senderId}/>;
		});
	}

	updateMessage(userId, value) {
		this.props.dispatch(
			actions.updateMessage(userId, value)
		);
	}

	closeConversation(userId) {
		this.props.dispatch(
			actions.closeConversation(userId)
		);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.file && typeof URL !== 'undefined' && prevProps.file instanceof URL)
			URL.revokeObjectURL(prevProps.file);
	}
}

@connect(state => ({servicePath: state.session.servicePath}))
class Message extends React.Component {

	showFile = event => {
		if (this.props.data === null) {
			event.preventDefault();
		}
	};

	componentDidMount() {
		ReactDOM.findDOMNode(this).scrollIntoView();
		if (this.props.mine) return;
		if (this.props.msg_status < 3)
			this.props.dispatch(actions.sawMessage(this.props.id, this.props.senderId));
	}

	render() {
		let content, {
			type,
			data,
			mine,
			msg_status,
			createdAt,
			servicePath,
		} = this.props;
		switch (type) {
			case 0:
				content = <div><span dangerouslySetInnerHTML={{__html: data}}/></div>;
				break;
			case 1:
			case 2:
			case 3:
			case 4:
				content = (
					<div>
						<a
							target='_blank'
							onClick={this.showFile}
							rel='noopener noreferrer'
							href={data && (servicePath + data)}>
							<ServiceImage
								src={
									data === null ?
									'/imgs/admin/loading.gif'
									: (type === 1 ? data : attachmentImage(type))
								}
								absolute={data === null || type !== 1}
							/>
						</a>
					</div>
				);
				break;
			default:
				return null;
		}
		return (
			<div className={
				(mine ? 'sender' : 'receiver')
				+ ' '
				+ (type === 0 ? 'text' : 'attachment')}>
				{content}
				<div>
					<span className='time'>{createTimeString(createdAt)}</span>
					{mine && <span className={'msg-status ' + (messageStatusClassNames[msg_status])}/>}
				</div>
			</div>
		);
	}
}


class Typing extends React.Component {

	componentDidMount() {
		ReactDOM.findDOMNode(this).scrollIntoView();
	}

	render() {
		return (
			<div>
				<span>typing...</span>
			</div>
		);
	}
}

function EmojiPicker({target, onHide, onEmojiSelect}) {
	return (
		<Overlay
			onHide={onHide}
			rootClose={true}
			placement='top'
			show={!!target}
			target={target}
			container={document.body}>
			<Popover id='chat-emojis'>
				<Emojis onEmojiSelect={onEmojiSelect}/>
			</Popover>
		</Overlay>
	);
}

EmojiPicker.defaultProps = {
	target: null,
};

function Emojis({onEmojiSelect}) {
	let emojis = ['😁','😂','😃','😄','😅','😆','😉','😊','😋','😌','😍','😏','😒',
		'😓','😔','😖','😘','😚','😜','😝','😞','😠','😡','😢','😣','😤','😥','😨',
		'😩','😪','😫','😭','😰','😱','😲','😳','😵','😷','😸','😹','😺','😻','😼',
		'😽','😾','😿','🙀','🙅','🙆','🙇','🙈','🙉','🙊','🙋','🙌','🙍','🙎','🙏'];
	return (
		<div>
			{
				emojis.map(
					e => (
						<span
							key={e}
							onClick={() => onEmojiSelect(emojione.toShort(e))}
							dangerouslySetInnerHTML={{__html: emojione.unicodeToImage(e)}}/>
					)
				)
			}
		</div>
	);
}

function getChatSelectorTitle(user_type) {
	switch (user_type) {
		case 'student':
			return 'Please select student';
		case 'teacher':
			return 'Please select teacher';
		case 'parent':
			return 'Please select parent';
		case 'admin':
			return 'Please select admin';
	}
}

function getChatUserTypeLabel(user_type) {
	switch (user_type) {
		case 'student':
			return 'Student';
		case 'teacher':
			return 'Teacher';
		case 'parent':
			return 'Parent';
		case 'admin':
			return 'Admin';
	}
}

@connect(state => ({
	lang: state.lang,
	translations: state.translations,
	session: state.session,
	chat: state.chat,
}))
class ChatUserSelector extends React.Component {

	changeStudent = event => this.props.dispatch(
		actions.changeStudent(this.props, event.currentTarget.value)
	);
	changeBcsmap = event => this.props.dispatch(
		actions.changeBcsmap(this.props, event.currentTarget.value)
	);
	changeUser = event => this.props.dispatch(
		actions.changeUser(event.currentTarget.value)
	);
	selectUser = () => {
		let {chat: {users}, userId, bcsMapId, studentId, user_type} = this.props,
			__ = window.__;
		if (!userId) {
			if(user_type === 'teacher') {
				return messenger.post({
					message: __('Please select teacher'),
					type: 'error'
				});
			} else if (user_type === 'admin') {
				return messenger.post({
					message: __('Please select admin'),
					type: 'error'
				});
			} else if (user_type === 'student') {
				if (!bcsMapId) {
					return messenger.post({
						message: __('Please select class'),
						type: 'error'
					});
				} else {
					return messenger.post({
						message: __('Please select student'),
						type: 'error'
					});
				}
			} else {
				if (!bcsMapId) {
					return messenger.post({
						message: __('Please select class'),
						type: 'error'
					});
				} else if (!studentId){
					return messenger.post({
						message: __('Please select student'),
						type: 'error'
					});
				} else {
					return messenger.post({
						message: __('Please select parent'),
						type: 'error'
					});
				}
			}
		}
		for (let i = 0; i < users.length; i++) {
			if (users[i].id === userId) {
				this.close();
				return this.props.dispatch(
					actions.startConversation(this.props, users[i])
				);
			}
		}
		this.props.dispatch(
			actions.addChatUser(this.props, this.props.userId)
		);
	};

	render() {
		let {
			bcsmaps,
			users,
			students,
			user_type,
			bcsMapId,
			studentId,
			userId,
		} = this.props;
		let __ = window.__;
		return (
			<Modal
				onHide={::this.close}
				show={user_type !== null}>
				<Modal.Header closeButton>
					<Modal.Title>{__(getChatSelectorTitle(user_type))}</Modal.Title>
					<Modal.Body>
						<Row>
							{
								(user_type === 'student' || user_type === 'parent') &&
								<Col key='bcsmaps' xs={12}>
									<FormGroup>
										<ControlLabel>{__('Class')}</ControlLabel>
										<Select
											value={bcsMapId}
											onChange={this.changeBcsmap}
											isLoading={bcsmaps === null}
											options={bcsmaps || null}
											className='form-control'/>
									</FormGroup>
								</Col>
							}
							{
								user_type === 'parent' &&
								<Col key='students' xs={12}>
									<FormGroup>
										<ControlLabel>{__('Student')}</ControlLabel>
										<Select
											value={studentId}
											onChange={this.changeStudent}
											isLoading={students === null}
											options={students || null}
											className='form-control'/>
									</FormGroup>
								</Col>
							}
							<Col key='users' xs={12}>
								<FormGroup>
									<ControlLabel>
										{__(getChatUserTypeLabel(user_type))}
									</ControlLabel>
									<Select
										value={userId}
										onChange={this.changeUser}
										isLoading={users === null}
										options={users || null}
										className='form-control'/>
								</FormGroup>
							</Col>
						</Row>
					</Modal.Body>
					<Modal.Footer>
						<Button bsStyle='primary' onClick={this.selectUser}>{__('Go')}</Button>
					</Modal.Footer>
				</Modal.Header>
			</Modal>
		);
	}

	close() {
		this.props.dispatch(actions.closeUserSelector());
	}
}

function attachmentImage(type) {
	switch (type) {
		case 2:
			return '/imgs/admin/audio.png';
		case 3:
			return '/imgs/admin/video.png';
		case 4:
			return '/imgs/admin/file.png';
	}
}