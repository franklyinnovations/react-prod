import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import makeTranslater from '../translate';

import {
	dialog,
	filterValue,
	getInputValue,
	getStatusTitle,
	getStatusOptions,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';

import {getExamType} from '../utils/options';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/studentexam';
import * as actions from '../redux/actions/studentexam';
addView('studentexam', reducer);

import {
	Row,
	Col,
	Icon,
	View,
	Text,
	Modal,
	Alert,
	PanelGroup,
	Panel,
	Table,
	Button,
	Select,
	Loading,
	DateView,
	FormControl,
} from '../components';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class StudentExam extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	view = event => this.props.dispatch(
		actions.viewSyllabus(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
		)
	);

	hideSyllabus = () => this.props.dispatch({type: 'HIDE_SYLLABUS'});

	startAdd = () => this.props.dispatch(actions.startAdd(this.props));

	hideDataModal = () => this.props.dispatch({type: 'HIDE_DATA_MODAL'});

	updateData = event => this.props.dispatch(
		actions.update(
			'UPDATE_DATA_VALUE',
			event.currentTarget.name,
			getInputValue(event.currentTarget),
		)
	);

	remove = event => {
		let id = parseInt(event.currentTarget.getAttribute('data-item-id'));
		dialog.confirm({
			callback: (value => value && this.props.dispatch(actions.remove(this.props, id))),
			message: window.__('Are you sure you want to delete this Exam Schedule?'),
		});
	};

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

	viewList = () => this.props.router.push(this.props.router.location);

	changePage = page => this.props.router.push(
		this.props.router.createPath({
			pathname: this.props.router.location.pathname,
			query: {page},
		})
	);

	updateFilter = event => this.props.dispatch(actions.updateFilter(event));

	updateData = event => this.props.dispatch(
		actions.updateData(
			event.currentTarget.name,
			event.currentTarget.value
		)
	);

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		if (this.props.viewState === 'LIST') {
			let firstTime = this.props.pageInfo.totalData === 0 &&
				this.props.query.length === 0 &&
				this.props.pageInfo.currentPage === 1;
			if (firstTime) return <View>{this.renderFirstMessage()}</View>;
			return (
				<React.Fragment>
					<View
						search={this.props.query}
						filters={this.renderFilters(__)}
						actions={this.renderViewActions(__)}>
						{this.renderExams(__)}
					</View>
					<Modal
						bsSize='large'
						onHide={this.hideSyllabus}
						show={this.props.examsyllabus !== false}>
						<Modal.Header closeButton>
							<Modal.Title>
								<Text>Exam Syllabus</Text>
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							{this.props.examsyllabus === null && <Loading/>}
							{
								this.props.examsyllabus &&
								<React.Fragment>
									<span><strong><Text>Subject</Text>: &nbsp;{this.props.examsyllabus.subject.subjectdetails[0].name}</strong></span>
									<br/><strong><Text>Syllabus</Text>: &nbsp;</strong>
									<span dangerouslySetInnerHTML={{__html:this.props.examsyllabus.examsyllabuses[0].syllabus}}/>
								</React.Fragment>
							}
						</Modal.Body>
						<Modal.Footer>
							<Button onClick={this.hideSyllabus}>
								<Text>Close</Text>
							</Button>
						</Modal.Footer>
					</Modal>
				</React.Fragment>
			);
		}
	}

	renderFirstMessage() {
		return (
			<div className='first-message'>
				<Row className='text-center'>
					<Col mdOffset={3} md={6}>
						<h3><Text>Exam Schedules</Text></h3>
						<div>
							<Text>Examination details of your class.</Text>
						</div>
					</Col>
				</Row>
			</div>
		);
	}

	renderFilters(__) {
		const filters = this.props.filters;
		if (filters === null) return false;
		return (
			<View.Filters search={this.search} remove={this.toggleFilters}>
				<FormControl
					type='text'
					title={__('Name')}
					placeholder={__('Name')}
					name='examheaddetail__name'
					onChange={this.updateFilter}
					value={filterValue(filters, 'examheaddetail__name', '')} />
				<Select
					title={__('Status')}
					onChange={this.updateFilter}
					name='examschedule__is_active'
					placeholder={__('Select Status')}
					value={filterValue(filters, 'examschedule__is_active', null)}
					options={getStatusOptions(__)}/>
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

	renderExams(__) {
		if (this.props.items === null) return <Loading/>;
		if (this.props.items.length === 0)
			return <Alert bsStyle='warning'><Text>No exams found.</Text></Alert>;
		return (
			<PanelGroup accordion id='att-classes' defaultActiveKey={0}>
				{
					this.props.items.map((item, index) =>
						<Panel key={item.id} eventKey={index}>
							<Panel.Heading>
								<div>
									<strong>{item.examhead.examheaddetails[0].name}</strong>
									<Panel.Toggle className='pull-right lead'>
										<Icon glyph='fa-chevron-circle-down'/>
									</Panel.Toggle>
								</div>
								<div>
									<Text>Class</Text>: &nbsp;
									{item.board.boarddetails[0].alias}{'-'}{item.class.classesdetails[0].name}
								</div>
							</Panel.Heading>
							<Panel.Body collapsible>
								<Row>
									<Col xs={12}>
										<Table responsive condensed bordered striped>
											<thead>
												<tr>
													<th><Text>S.No.</Text></th>
													<th><Text>Subject</Text></th>
													<th><Text>Exam Type</Text></th>
													<th><Text>Date</Text></th>
													<th><Text>Start Time</Text></th>
													<th><Text>End Time</Text></th>
													<th><Text>Duration</Text></th>
													<th><Text>Max. Marks</Text></th>
													<th><Text>Min. Marks</Text></th>
													<th><Text>Syllabus</Text></th>
												</tr>
											</thead>
											<tbody>
												{
													item.examscheduledetails.map((item, index) =>
														this.renderExamScheduleDetail(item, index, __)
													)
												}
												{
													item.examscheduledetails.length === 0 &&
													<tr>
														<td colSpan={9} className='text-center'>
															<Text>No Result Found</Text>
														</td>
													</tr>
												}
											</tbody>
										</Table>
									</Col>
								</Row>
							</Panel.Body>
						</Panel>
					)
				}
			</PanelGroup>
		);
	}

	renderExamScheduleDetail(item, index, __) {
		return (
			<tr key={item.id}>
				<td>{index + 1}</td>
				<td>{item.subject.subjectdetails[0].name}</td>
				<td><Text>{getExamType(item.exam_type)}</Text></td>
				<td><DateView>{item.date}</DateView></td>
				<td>{moment(item.start_time, 'HH:mm:ss').format('hh:mm a')}</td>
				<td>{moment(item.end_time, 'HH:mm:ss').format('hh:mm a')}</td>
				<td>{item.duration}</td>
				<td>{item.max_mark}</td>
				<td>{item.min_passing_mark}</td>
				<td>
					{
						item.examsyllabuses.length > 0 &&
						<Icon
							className={'icon-primary'}
							glyph='fa-eye'
							title={__('View Syllabus')}
							data-item-id={item.id}
							onClick={this.view}>
							&nbsp;
						</Icon>	
					}
				</td>
			</tr>
		);
	}
}