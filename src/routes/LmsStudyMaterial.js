import React from 'react';
import {connect} from 'react-redux';

import {
	messenger,
	moduleActions,
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/lmsstudymaterial';
import * as actions from '../redux/actions/lmsstudymaterial';
addView('lmsstudymaterial', reducer);

import {
	Row,
	Col,
	Tab,
	Tabs,
	View,
	Text,
	Alert,
	Button,
	Select,
	Loading,
	FormGroup,
	ControlLabel,
} from '../components';

@connect(state => ({
	session: state.session,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class LmsStudyMaterial extends React.Component {
	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = moduleActions(this.props.session.modules, 'lmsstudymaterial');
	changeClass = event => this.props.dispatch(
		actions.changeClass(
			this.props,
			event.currentTarget.value
		)
	);
	changeSubject = event => this.props.dispatch(
		actions.changeSubject(
			this.props,
			event.currentTarget.value
		)
	);
	changeChapter = event => this.props.dispatch(
		actions.changeChapter(
			this.props,
			event.currentTarget.value
		)
	);
	changeTopic = event => this.props.dispatch({
		type: 'UPDATE_SML_TOPIC',
		value: event.currentTarget.value,
	});
	load = () => {
		if(! this.props.selector.bcsmapId){
			messenger.post({
				type: 'error',
				message: window.__('Please select class.'),
			});
			return;
		}
		if(! this.props.selector.subjectId){
			messenger.post({
				type: 'error',
				message: window.__('Please select subject.'),
			});
			return;
		}
		if(! this.props.selector.chapterId){
			messenger.post({
				type: 'error',
				message: window.__('Please select chapter.'),
			});
			return;
		}
		if(! this.props.selector.topicId){
			messenger.post({
				type: 'error',
				message: window.__('Please select topic.'),
			});
			return;
		}
		this.props.dispatch(actions.load(this.props));
	};

	render() {
		if (this.props.loading) return <Loading/>;
		return (
			<View>
				<Row key='selector'>
					<Col md={6}>
						<ControlLabel><Text>Class</Text></ControlLabel>
						<FormGroup>
							<Select
								instanceId='bcsmapId'
								onChange={this.changeClass}
								options={this.props.meta.bcsmaps}
								value={this.props.selector.bcsmapId}/>
						</FormGroup>
					</Col>
					<Col md={6}>
						<ControlLabel><Text>Subject</Text></ControlLabel>
						<FormGroup>
							<Select
								instanceId='subjectId'
								onChange={this.changeSubject}
								value={this.props.selector.subjectId}
								isLoading={this.props.meta.subjects === null}
								options={this.props.meta.subjects || undefined}/>
						</FormGroup>
					</Col>
					<Col md={6}>
						<ControlLabel><Text>Chapter</Text></ControlLabel>
						<FormGroup>
							<Select
								instanceId='chapterId'
								onChange={this.changeChapter}
								value={this.props.selector.chapterId}
								isLoading={this.props.meta.chapters === null}
								options={this.props.meta.chapters || undefined}/>
						</FormGroup>
					</Col>
					<Col md={6}>
						<ControlLabel><Text>Topic</Text></ControlLabel>
						<FormGroup>
							<Select
								instanceId='topicId'
								onChange={this.changeTopic}
								value={this.props.selector.topicId}
								isLoading={this.props.meta.topics === null}
								options={this.props.meta.topics || undefined}/>
						</FormGroup>
					</Col>
				</Row>
				<FormGroup>
					<Button
						bsStyle='primary'
						onClick={this.load}>
						<Text>View</Text>
					</Button>
				</FormGroup>
				{this.renderMaterial()}
			</View>
		);
	}

	renderMaterial() {
		let studymaterial = this.props.studymaterial;
		if (studymaterial === false) return null;
		if (studymaterial === null) return <Loading/>;
		return (
			<Tabs id='studymaterial'>
				<Tab eventKey={0} title={<Text>Videos & Animation</Text>}>
					{
						this.props.studymaterial.videos_animation.length === 0 ?
						<Alert><Text>No Result Found</Text></Alert> :
						<div className='thumbnail-container'>
							{
								this.props.studymaterial.videos_animation.map(item =>
									<div className='text-center' key={item.id}>
										<a 
											target='_blank'
											rel='noopener noreferrer'
											href={this.props.session.servicePath + item.path}>
											<p>
												<img
													width='128'
													className='img img-thumbnail'
													src='/imgs/admin/video-icon.png'/>
											</p>
											<p>{item.name}</p>
										</a>
									</div>
								)
							}
						</div>
					}
				</Tab>
				<Tab eventKey={1} title={<Text>Presentations</Text>}>
					{
						this.props.studymaterial.presentations.length === 0 ?
						<Alert><Text>No Result Found</Text></Alert> :
						<div className='thumbnail-container'>
							{
								this.props.studymaterial.presentations.map(item =>
									<div className='text-center' key={item.id}>
										<a 
											target='_blank'
											rel='noopener noreferrer'
											href={this.props.session.servicePath + item.path}>
											<p>
												<img
													width='128'
													className='img img-thumbnail'
													src={`/imgs/admin/${item.type.substring(1)}.png`}/>
											</p>
											<p>{item.name}</p>
										</a>
									</div>
								)
							}
						</div>
					}
				</Tab>
				<Tab eventKey={2} title={<Text>Notes</Text>}>
					{
						this.props.studymaterial.notes.length === 0 ?
						<Alert><Text>No Result Found</Text></Alert> :
						<div className='thumbnail-container'>
							{
								this.props.studymaterial.notes.map(item =>
									<div className='text-center' key={item.id}>
										<a 
											target='_blank'
											rel='noopener noreferrer'
											href={this.props.session.servicePath + item.path}>
											<p>
												<img
													width='128'
													className='img img-thumbnail'
													src={`/imgs/admin/${item.type.substring(1)}.png`}/>
											</p>
											<p>{item.name}</p>
										</a>
									</div>
								)
							}
						</div>
					}
				</Tab>
				<Tab eventKey={3} title={<Text>Points to be Remember</Text>}>
					<div
						className=''
						dangerouslySetInnerHTML={this.props.studymaterial.content}/>
				</Tab>
			</Tabs>
		);
	}
}