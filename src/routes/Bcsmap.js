import React from 'react';
import {connect} from 'react-redux';
import makeTranslater from '../translate';
import {
	dialog,
	getStatusTitle,
	moduleActions,
	getInputValue,
} from '../utils';
import {
	Row,
	Col,
	Clearfix,
	Icon,
	Text,
	View,
	Button,
	FormGroup,
	ControlLabel,
	HelpBlock,
	Select,
	Checkbox,
	FormControl,
	Modal,
	Loading,
	ClickButton,
	Alert,
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/bcsmap';
import * as actions from '../redux/actions/bcsmap';
addView('bcsmap', reducer);

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state
}))
export default class Bcsmap extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = {
		board: moduleActions(this.props.session.modules, 'board'),
		class: moduleActions(this.props.session.modules, 'class'),
		section: moduleActions(this.props.session.modules, 'section'),
		bcsmap: moduleActions(this.props.session.modules, 'bcsmap'),
	};

	startAddCurriculum = () => this.props.router.push('/setup/curriculum');

	startAddClass = () => this.props.dispatch({type: 'START_ADD_CLASS'});

	startAddSection = () => this.props.dispatch({type: 'START_ADD_SECTION'});

	hideDataModal = () => this.props.dispatch({type: 'HIDE_DATA_MODAL'});

	updateData = event => this.props.dispatch(
		actions.update(
			'UPDATE_DATA_VALUE',
			event.currentTarget.name,
			getInputValue(event.currentTarget)
		)
	);

	save = () => this.props.dispatch(actions.save(this.props));

	editSection = event => this.props.dispatch(
		actions.edit(
			this.props,
			parseInt(event.currentTarget.getAttribute('data-item-id')),
			'section'
		)
	);

	editClass = event => this.props.dispatch(
		actions.edit(
			this.props,
			parseInt(event.currentTarget.getAttribute('data-item-id')),
			'class'
		)
	);

	removeSection = event => {
		let id = parseInt(event.currentTarget.getAttribute('data-item-id'));
		dialog.confirm({
			callback: (value => value && this.props.dispatch(actions.remove(this.props, id, 'section'))),
			message: window.__('Are you sure you want to delete this Section?'),
		});
	};

	removeClass = event => {
		let id = parseInt(event.currentTarget.getAttribute('data-item-id'));
		dialog.confirm({
			callback: (value => value && this.props.dispatch(actions.remove(this.props, id, 'class'))),
			message: window.__('Are you sure you want to delete this Class?'),
		});
	};

	createOrRemoveBcsmap = event => this.props.dispatch(
		actions.createOrRemoveBcsmap(
			this.props,
			parseInt(event.currentTarget.getAttribute('data-class-id')),
			parseInt(event.currentTarget.getAttribute('data-section-id')),
		)
	);

	changeStatus = event => this.props.dispatch(
		actions.changeStatus(
			this.props,
			parseInt(event.currentTarget.getAttribute('data-class-id')),
			parseInt(event.currentTarget.getAttribute('data-section-id')),
			parseInt(event.currentTarget.getAttribute('data-item-id')),
			event.currentTarget.getAttribute('data-item-status'),
		)
	);

	changeBoard = event => this.props.dispatch(
		actions.changeBoard(
			this.props,
			getInputValue(event.currentTarget)
		)
	);

	render() {
		if (this.props.loading) return <Loading/>;

		if (this.props.meta.boards.length === 0) {
			return (
				<View>
					<div className='first-message'>
						<Row className='text-center'>
							<Col mdOffset={3} md={6}>
								<h3><Text>Classes & Sections</Text></h3>
								<p>
									<Text>Please create at least one active Curriculum Type to add classes and sections</Text>
								</p>
								<p>
									<b><Text>For Example</Text></b> - <Text>CBSE, American, British</Text>
								</p>
							</Col>
						</Row>
						<ClickButton
							text='Let’s Add Now'
							btnText='Add Curriculum'
							glyph='fa-plus'
							side='left'
							onClick={this.startAddCurriculum}/>
					</div>
				</View>
			);
		}

		const __ = makeTranslater(this.props.translations, this.props.lang.code);

		return (
			<View actions={this.renderViewActions()}>
				{
					this.props.items === null ? <Loading/> :
					<React.Fragment>
						<Alert>
							<Text>Mark respective Class and Section which is applicable in your School.</Text>
						</Alert>
						<table className='table table-bordered table-hover pateast-tables'>
							<thead>
								<tr>
									<th>
										<div className='class-section'>
											<div className='classs'>
												<Icon glyph='fa-arrow-down'/>{' '}
												<Text>Class</Text>
											</div>
											<div className='sec'>
												<Text>Sections</Text>{' '}
												<Icon glyph='fa-arrow-right'/>
											</div>
										</div>
									</th>
									{
										this.props.sections.map(item =>
											<th key={item.id}>
												{item.name}
												{
													this.permissions.section.edit &&
													<Icon
														title={__('Edit')}
														bundle='far'
														glyph='fa-edit'
														onClick={this.editSection}
														data-item-id={item.id}/>
												}
												{
													this.permissions.section.delete &&
													<Icon
														title={__('Remove')}
														glyph='fa-trash'
														onClick={this.removeSection}
														data-item-id={item.id}/>
												}
											</th>
										)
									}
								</tr>
							</thead>
							<tbody>
								{
									this.props.classes.map(
										classItem => (
											<tr key={classItem.id}>
												<td>
													<b>{classItem.display_order}</b>
													<span>{classItem.name}</span>
													{
														this.permissions.class.edit &&
														<Icon
															title={__('Edit')}
															bundle='far'
															glyph='fa-edit'
															onClick={this.editClass}
															data-item-id={classItem.id}/>
													}
													{
														this.permissions.class.delete &&
														<Icon
															title={__('Remove')}
															glyph='fa-trash'
															onClick={this.removeClass}
															data-item-id={classItem.id}/>
													}
												</td>
												{
													this.props.sections.map(
														item => {
															let bcsmap = this.props.items[classItem.id + ':' + item.id],
																exists = !!bcsmap && !!bcsmap.id;
															return (
																<td key={item.id}>
																	<div className='c-check'>
																		<input
																			type='checkbox'
																			checked={exists}/>
																		<label
																			data-class-id={classItem.id}
																			data-section-id={item.id}
																			onClick={this.createOrRemoveBcsmap}>
																			&nbsp;
																		</label>
																	</div>		
																	{
																		exists &&
																		<Checkbox
																			inline
																			title={getStatusTitle(bcsmap.is_active, __)}
																			data-section-id={item.id}
																			data-class-id={classItem.id}
																			data-item-status={bcsmap.is_active ? '1' : '0'}
																			data-item-id={bcsmap.id}
																			onChange={this.changeStatus}
																			disabled={!this.permissions.bcsmap.status}
																			value={bcsmap.is_active}/>
																	}
																</td>
															);
														}
													)
												}
											</tr>
										)
									)
								}
							</tbody>
						</table>
					</React.Fragment>
				}
				<Modal
					backdrop='static'
					onHide={this.hideDataModal}
					show={this.props.item !== false}>
					{
						this.props.item &&
						<Modal.Header closeButton>
							<Modal.Title>
								<Text>
									{
										this.props.item.id ?
										(this.props.item.type === 'class' ? 'Edit Class' : 'Edit Section') :
										(this.props.item.type === 'class' ? 'Add Class' : 'Add Section')
									}
								</Text>
							</Modal.Title>
						</Modal.Header>
					}
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{
							this.props.item &&
							<Row>
								<Col md={6}>
									<FormGroup
										controlId='name'
										validationState={this.props.errors.name ? 'error': null}>
										<ControlLabel>Name</ControlLabel>
										<FormControl
											autoFocus
											name='name'
											type='text'
											placeholder={__('Name')}
											value={this.props.item.name}
											onChange={this.updateData}/>
										<HelpBlock>{this.props.errors.name}</HelpBlock>
									</FormGroup>
								</Col>
								<Col md={6}>
									<FormGroup
										controlId='display_order'
										validationState={this.props.errors.display_order ? 'error': null}>
										<ControlLabel>Display Order</ControlLabel>
										<FormControl
											name='display_order'
											type='number'
											min='1'
											placeholder={__('Display Order')}
											value={this.props.item.display_order}
											onChange={this.updateData}/>
										<HelpBlock>{this.props.errors.display_order}</HelpBlock>
									</FormGroup>
								</Col>
								<Clearfix/>
								<Col md={12} className='text-right'>
									<Button onClick={this.save} bsStyle='primary'>
										<Text>Submit</Text>
									</Button>
								</Col>
							</Row>
						}
					</Modal.Body>
				</Modal>
			</View>
		);
	}

	renderViewActions() {
		return (
			<View.Actions>
				<Row>
					<Col md={6} className='form-horizontal'>
						{
							this.props.meta.boards.length > 1 &&
							<React.Fragment>
								<Col md={3} componentClass={ControlLabel}><Text>Curriculum Type</Text></Col>
								<Col md={9}>
									<Select
										backspaceRemoves={false}
										deleteRemoves={false}
										clearable={false}
										instanceId='board-selector'
										onChange={this.changeBoard}
										value={this.props.meta.boardId}
										options={this.props.meta.boards}/>
								</Col>
							</React.Fragment>
						}
					</Col>
					<Col md={6}>
						{
							this.permissions.class.add &&
							<View.Action onClick={this.startAddClass}>
								<Text>Add Class</Text>
							</View.Action>
						}
						{
							this.permissions.section.add &&
							<View.Action onClick={this.startAddSection}>
								<Text>Add Section</Text>
							</View.Action>
						}
					</Col>
				</Row>
			</View.Actions>
		);
	}
}