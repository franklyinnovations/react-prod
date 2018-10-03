import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	getFile,
	messenger,
	freeFileInput,
	moduleActions,
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/feed';
import * as actions from '../redux/actions/feed';
addView('feed', reducer);

import {
	Row,
	Col,
	Icon,
	Text,
	Alert,
	Button,
	Select,
	Loading,
	FormGroup,
	FormControl,
	ButtonGroup,
	ServiceImage,
} from '../components';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class Feed extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	uid = 0;
	permissions = moduleActions(this.props.session.modules, 'feed');
	update = event => this.props.dispatch({
		type: 'UPDATE_DATA_VALUE',
		name: event.currentTarget.name,
		value: event.currentTarget.value,
	});
	addFile = async () => {
		let [file] = await getFile();
		freeFileInput();

		if (!file) return;
		if (file.size === 0) {
			return messenger.post({
				message: 'File is empty',
				type: 'error',
			});
		}
		let url, ext = file.name.lastIndexOf('.');
		ext = file.name.substring(ext + 1).toLowerCase();
		switch (ext) {
			case 'png':
			case 'jpg':
			case 'jpeg':
			case 'jpe':
			case 'gif':
				url = typeof URL !== 'undefined' ? URL.createObjectURL(file) : '/imgs/admin/file.png';
				break;
			case 'mp3':
			case 'amr':
			case 'aac':
			case 'm4a':
			case 'wav':
				url = '/imgs/admin/audio.png';
				break;
			case '3gp':
			case 'mp4':
			case 'avi':
			case 'wmv':
			case 'mov':
			case 'm4v':
			case 'ogx':
				url = '/imgs/admin/video.png';
				break;
			default:
				url = -1;
		}
		if (url === -1) {
			return messenger.post({
				type: 'error',
				message: 'Invalid File Type',
			});
		}
		if (file.size > 2.5e+7) {
			return messenger.post({
				type: 'error',
				message: window.__('File is too large'),
			});
		}
		this.props.dispatch({
			type: 'FEED_ADD_FILE',
			feedrecord: {
				url,
				file,
				id: this.uid++,
			},
		});
	};
	removeFile = event => this.props.dispatch({
		type: 'FEED_REMOVE_FILE',
		id: +event.currentTarget.getAttribute('data-item-id'),
	});
	loadBcsmaps = () => actions.loadBcsmaps(this.props);
	loadTeachers = () => actions.loadTeachers(this.props);
	save = () => this.props.dispatch(actions.save(this.props));

	selectAll = () => {
		this.props.dispatch({
			type: 'UPDATE_FEED_SELECTOR',
			selector: 0,
		});
		this.props.dispatch(actions.load());
	};
	selectMine = () => {
		this.props.dispatch({
			type: 'UPDATE_FEED_SELECTOR',
			selector: 1,
		});
		this.props.dispatch(actions.load());
	};
	selectControlled = () => {
		this.props.dispatch({
			type: 'UPDATE_FEED_SELECTOR',
			selector: 2,
		});
		this.props.dispatch(actions.load());
	};
	more = () => this.props.dispatch(actions.load());

	remove = id => this.props.dispatch(actions.remove(this.props, id));
	approve = (id, type) => this.props.dispatch(actions.approve(this.props, id, type));
	like = (id, liked) => this.props.dispatch(actions.like(this.props, id, liked));

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		let selector = this.props.meta.selector;
		return (
			<div id='feeds'>
				<Compose
					__={__}
					save={this.save}
					update={this.update}
					addFile={this.addFile}
					item={this.props.item}
					meta={this.props.meta}
					removeFile={this.removeFile}
					loadBcsmaps={this.loadBcsmaps}
					loadTeachers={this.loadTeachers}
					user_type={this.props.session.user_type}/>
				<ButtonGroup id='feed-selector'>
					<Button
						onClick={this.selectAll}
						bsStyle={selector === 0 ? 'primary' : 'default'}>
						<Text>All</Text>
					</Button>
					<Button
						onClick={this.selectMine}
						bsStyle={selector === 1 ? 'primary' : 'default'}>
						<Text>Mine</Text>
					</Button>
					{
						this.props.session.user_type === 'teacher' &&
						<Button
							onClick={this.selectControlled}
							bsStyle={selector === 2 ? 'primary' : 'default'}>
							<Text>Approvals</Text>
						</Button>
					}
				</ButtonGroup>
				{
					this.props.items.map(item =>
						<FeedItem
							{...item}
							key={item.id}
							like={this.like}
							remove={this.remove}
							approve={this.approve}/>
					)
				}
				{
					this.props.meta.loading ? <Loading/> : (
						this.props.meta.more !== 0 &&
						<div className='text-center'>
							<Button onClick={this.more} bsSize='large'>
								<Text>Load More</Text>
							</Button>
						</div>
					)
				}
				{
					!this.props.meta.loading &&
					this.props.meta.more === 0 &&
					<Alert bsStyle='warning'>
						<Text>No more feed found</Text>
					</Alert>
				}
			</div>
		);
	}
}

class Compose extends React.PureComponent {

	state = {
		bcsmaps: this.props.user_type !== 'student' && null,
		teachers: this.props.user_type === 'student' && null,
	};

	render() {
		let {item, update, addFile, removeFile, __} = this.props;
		return (
			<form id='feed-uploader'>
				<h4>Compose Post</h4>
				<FormGroup>
					<FormControl
						onChange={update}
						name='description'
						value={item.description}
						componentClass='textarea'
						placeholder={__('Write something here...')}/>
					<div className='files'>
						{
							item.feedrecords.map(feedrecord =>
								<div key={feedrecord.id}>
									<img src={feedrecord.url}/>
									<Icon
										glyph='fa-trash'
										onClick={removeFile}
										data-item-id={feedrecord.id}/>
								</div>
							)
						}
					</div>
				</FormGroup>
				<Row>
					{
						this.props.user_type === 'student' ?
						<React.Fragment>
							<Col md={1}>
								<FormControl.Static>
									<Text>Teacher</Text>
								</FormControl.Static>
							</Col>
							<Col md={5}>
								<Select
									onChange={update}
									name='controlUserId'
									value={item.controlUserId}
									placeholder={__('Select teacher')}
									isLoading={this.state.teachers === null}
									options={this.state.teachers === null ? [] : this.state.teachers}/>
							</Col>
						</React.Fragment> : 
						<React.Fragment>
							<Col md={1}>
								<FormControl.Static>
									<Text>Class</Text>
								</FormControl.Static>
							</Col>
							<Col md={5}>
								<Select
									name='bcsmapId'
									onChange={update}
									value={item.bcsmapId}
									placeholder={__('Select class')}
									isLoading={this.state.bcsmaps === null}
									options={this.state.bcsmaps === null ? [] : this.state.bcsmaps}/>
							</Col>
						</React.Fragment>
					}
					<Col md={6}>
						<Button onClick={addFile} bsStyle='primary'>
							<Icon glyph='fa-file-image'/>
							&nbsp;&nbsp;
							<Text>Add Photo/Video</Text>
						</Button>
						&nbsp;&nbsp;
						<Button
							bsStyle='primary'
							disabled={item.saving}
							className='pull-right'
							onClick={this.props.save}>
							<Text>Post</Text>
						</Button>
					</Col>
				</Row>
			</form>
		);
	}

	async componentDidMount() {
		if (this.state.bcsmaps !== false) {
			this.setState({
				bcsmaps: await this.props.loadBcsmaps(),
			});
		}
		if (this.state.teachers !== false) {
			this.setState({
				teachers: await this.props.loadTeachers(),
			});
		}
	}
}

class FeedItem extends React.PureComponent {

	state = {selected: 0};
	selectFeedrecord = event => this.setState({
		selected: +event.currentTarget.getAttribute('data-item-index')
	});

	images = React.createRef();
	remove = () => this.props.remove(this.props.id);
	approve = () => this.props.approve(this.props.id, 1);
	unapprove = () => this.props.approve(this.props.id, 0);
	approveForAll = () => this.props.approve(this.props.id, 2);
	like = () => this.props.like(this.props.id, this.props.liked);

	render() {
		let {user, feedrecords} = this.props;
		return (
			<div className='feed-item'>
				<div className='heading'>
					<ServiceImage className='img img-responsive img-circle img-thumbnail' src={user.user_image}/>
					<strong>
						{user.userdetails[0].fullname}
					</strong>
				</div>
				{
					feedrecords.length !== 0 &&
					<ServiceImage
						className='image'
						src={feedrecords[this.state.selected].file}/>
				}
				{
					feedrecords.length > 1 &&
					<div className='images' ref={this.images}>
						<div>
							{
								feedrecords.map((feedrecord, index) =>
									<ServiceImage
										play={false}
										key={feedrecord.id}
										src={feedrecord.file}
										data-item-index={index}
										onClick={this.selectFeedrecord}/>
								)
							}
						</div>
					</div>
				}
				{this.props.description && <p>{this.props.description}</p>}
				<div className='actions'>
					<Icon
						onClick={this.like}
						glyph='fa-thumbs-up'
						className='text-primary'
						bundle={this.props.liked ? 'fas' : 'far'}/>
					&nbsp;&nbsp;
					{this.props.likes}
					{
						this.props.controlled &&
						<span className='pull-right'>
							<Icon
								glyph='fa-trash'
								onClick={this.remove}/>
							{
								!this.props.mine &&
								<React.Fragment>
									&nbsp;&nbsp;
									{
										!this.props.approved ?
										<React.Fragment>
											<Icon
												glyph='fa-check'
												onClick={this.approve}/>
											&nbsp;&nbsp;
											<Icon
												glyph='fa-check-double'
												onClick={this.approveForAll}/>
										</React.Fragment> :
										<Icon
											glyph='fa-times-circle'
											onClick={this.unapprove}/>
									}
								</React.Fragment>
							}
						</span>
					}
				</div>
			</div>
		);
	}

	getSnapshotBeforeUpdate(prevProps, prevState) {
		if (prevState.selected !== this.state.selected) {
			return {
				scroll: $('#body').scrollTop(),
				top: $(this.images.current).position().top,
			};
		} else {
			return null;
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (!snapshot) return;
		$('#body').scrollTop(
			snapshot.scroll + $(this.images.current).position().top - snapshot.top
		);
	}
}