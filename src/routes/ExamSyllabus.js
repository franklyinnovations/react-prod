import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	filterValue,
	moduleActions,
	getInputValue,
	queryFromFilters,
	filtersFromQuery,
} from '../utils';

import {getExamTypeOptions, getExamType} from '../utils/options';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/examsyllabus';
import * as actions from '../redux/actions/examsyllabus';
addView('examsyllabus', reducer);

import {
	Row,
	Col,
	Icon,
	View,
	Text,
	Modal,
	Button,
	Select,
	Loading,
	TextEditor,
	HelpBlock,
	DataTable,
	FormGroup,
	Pagination,
	FormControl,
	ClickButton,
} from '../components';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class ExamSyllabus extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	permissions = {
		syllabus: moduleActions(this.props.session.modules, 'syllabus'),
		examschedule: moduleActions(this.props.session.modules, 'examschedule'),
	};
	startAdd = () => {
		this.props.router.push('/exam/schedule');
	};
	edit = event => this.props.dispatch(
		actions.edit(
			this.props,
			+ event.currentTarget.getAttribute('data-item-index'),
			event.currentTarget.getAttribute('data-action'),
		)
	);
	hideDataModal = () => this.props.dispatch({type: 'HIDE_DATA_MODAL'});
	updateData = event => this.props.dispatch(
		actions.update(
			'UPDATE_DATA_VALUE',
			event.currentTarget.name,
			getInputValue(event.currentTarget),
		)
	);
	save = () => this.props.dispatch(
		actions.save(
			this.props,
			document.getElementById('syllabus-text-input').value,
		)
	);
	changeStatus = event => this.props.dispatch(
		actions.changeStatus(
			this.props,
			+event.currentTarget.getAttribute('data-item-index'),
			+event.currentTarget.value,
		)
	);
	toggleFilters = () => {
		if (this.props.filters === null) {
			this.props.dispatch({
				type: 'SHOW_FILTERS',
				filters: filtersFromQuery(this.props.query)
			});
		} else {
			this.props.dispatch({
				type: 'HIDE_FILTERS',
			});
		}
	};
	search = () => {
		this.props.dispatch({
			type: 'SET_QUERY',
			query: queryFromFilters(this.props.filters),
		});
		this.props.router.push(this.props.router.createPath(this.props.router.location.pathname));
	};
	reset = () => {
		this.props.dispatch({
			type: 'SET_QUERY',
			query: [],
		});
		this.props.router.push(this.props.router.location);
	};
	changePage = page => this.props.router.push(
		this.props.router.createPath({
			pathname: this.props.router.location.pathname,
			query: {page},
		})
	);
	updateFilter = event => this.props.dispatch(actions.updateFilter(event));

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code),
			firstTime = this.props.pageInfo.totalData === 0 &&
				this.props.query.length === 0 &&
				this.props.pageInfo.currentPage === 1;
		return (
			<React.Fragment>
				{
					firstTime ?
					<View>{this.renderFirstMessage()}</View> : 
					<View
						search={this.props.query}
						filters={this.renderFilters(__)}
						actions={this.renderViewActions(__)}>
						{this.renderData(__)}
					</View>
				}
				<Modal
					bsSize='large'
					onHide={this.hideDataModal}
					show={this.props.item !== false}>
					<Modal.Header closeButton>
						{
							this.props.item &&
							<React.Fragment>
								<Modal.Title>
									{
										this.props.item.action === 'edit' ?
										<Text>Edit Exam Syllabus</Text> :
										<Text>View Exam Syllabus</Text>
									}
								</Modal.Title>
								<h5 className='text-center'>{this.props.item.title}</h5>
							</React.Fragment>
						}
					</Modal.Header>
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{
							this.props.item &&
							<React.Fragment>
								{
									this.props.item.action === 'view' ?
									<div
										className='trumbowyg-editor'
										dangerouslySetInnerHTML={this.props.item.syllabus}/> :
									<FormGroup validationState={this.props.errors.syllabus ? 'error' : null}>
										<TextEditor
											id='syllabus-text-input'
											defaultValue={this.props.item.syllabus}/>
										<HelpBlock>{this.props.errors.syllabus}</HelpBlock>
									</FormGroup>
								}
								<div className='text-right'>
									{
										this.props.item.action === 'edit' ?
										<Button
											bsStyle='primary'
											onClick={this.save}>
											<Text>Submit</Text>
										</Button>:
										<Button onClick={this.hideDataModal}>
											<Text>Close</Text>
										</Button>
									}
								</div>
							</React.Fragment>
						}
					</Modal.Body>
				</Modal>
			</React.Fragment>
		);
	}

	renderFirstMessage() {
		return (
			<div className='first-message'>
				<Row className='text-center'>
					<Col mdOffset={3} md={6}>
						<h3><Text>Exam Syllabus</Text></h3>
						<p>
							<Text>Exams come with defined syllabus for students. Define exam wise syllabus here.</Text>
						</p>
						<p>
							<Text>
								{
									this.permissions.examschedule.add ?
										'To define the Exam syllabus, you need to schedule the exam first. Please go to "Exam Schedule" and define the examination Schedule before syllabus.' :
										'No Exam is scheduled to add Syllabus.'
								}
							</Text>
						</p>
					</Col>
				</Row>
				{
					this.permissions.examschedule.add &&
					<ClickButton
						side='left'
						glyph='fa-plus'
						text='Let’s Add Now'
						onClick={this.startAdd}
						btnText='Add Exam Schedule'/>
				}
			</div>
		);
	}

	renderFilters(__) {
		const filters = this.props.filters;
		if (filters === null) return false;
		return (
			<View.Filters search={this.search} remove={this.toggleFilters}>
				<Select
					name='boardClass'
					title={__('Class')}
					placeholder={__('Class')}
					onChange={this.updateFilter}
					options={this.props.meta.classes}
					value={filterValue(filters, 'boardClass', null)} />
				<Select
					title={__('Exam')}
					placeholder={__('Exam')}
					onChange={this.updateFilter}
					name='examschedule__examheadId__eq'
					options={this.props.meta.examheads}
					value={filterValue(filters, 'examschedule__examheadId__eq', null)} />
				<Select
					title={__('Exam Type')}
					onChange={this.updateFilter}
					placeholder={__('Exam Type')}
					options={getExamTypeOptions(__)}
					name='examscheduledetail__exam_type__eq'
					value={filterValue(filters, 'examscheduledetail__exam_type__eq', null)} />
				<FormControl
					type='text'
					title={__('Subject')}
					name='subjectdetail__name'
					placeholder={__('Subject')}
					onChange={this.updateFilter}
					value={filterValue(filters, 'subjectdetail__name', '')} />
			</View.Filters>
		);
	}

	renderViewActions(__) {
		return (
			<View.Actions>
				<View.Action onClick={this.toggleFilters} title={__('Filters')}>
					<Icon glyph='fa-filter'/>
				</View.Action>
				<View.Action onClick={this.reset} title={__('Reset')}>
					<Icon glyph='fa-redo-alt'/>
				</View.Action>
			</View.Actions>
		);
	}

	renderData() {
		return (
			<React.Fragment>
				<DataTable>
					<thead>
						<tr>
							<td className='tw-18'>
								<Text>Class</Text>
							</td>
							<td className='tw-18'>
								<Text>Exam</Text>
							</td>
							<td className='tw-18'>
								<Text>Exam Type</Text>
							</td>
							<td className='tw-18'>
								<Text>Subject</Text>
							</td>
							<td className='tw-18'>
								<Text>Updated By</Text>
							</td>
							<td>
								<DataTable.ActionColumnHeading/>
							</td>
						</tr>
					</thead>
					<tbody>
						{this.renderDataRows()}
					</tbody>
				</DataTable>
				<Pagination data={this.props.pageInfo} onSelect={this.changePage}/>
			</React.Fragment>
		);
	}

	renderDataRows() {
		if (this.props.items.length === 0) {
			return <DataTable.NoDataRow colSpan={5}/>;
		}

		return this.props.items.map((item, index) => (
			<tr key={item.id}>
				<td className='tw-18'>
					{item.examschedule.board.boarddetails[0].alias}
					{'-'}
					{item.examschedule.class.classesdetails[0].name}
				</td>
				<td className='tw-18'>
					{item.examschedule.examhead.examheaddetails[0].name}
				</td>
				<td className='tw-18'>
					<Text>{getExamType(item.exam_type)}</Text>
				</td>
				<td className='tw-18'>
					{item.subject.subjectdetails[0].name}
				</td>
				<td className='tw-18'>
					{item.updater}
				</td>
				<td>
					<DataTable.Actions id={'item-actions-' + item.id}>
						{
							this.permissions.syllabus.add &&
							<DataTable.Action
								text='Edit'
								glyph='fa-edit'
								data-action='edit'
								onClick={this.edit}
								data-item-index={index}/>
						}
						{
							item.updater &&
							<DataTable.Action
								text='View'
								glyph='fa-eye'
								data-action='view'
								onClick={this.edit}
								data-item-index={index}/>
						}
					</DataTable.Actions>
				</td>
			</tr>
		));
	}
}