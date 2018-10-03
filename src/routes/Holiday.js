import React from 'react';
import moment from 'moment';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	moduleActions,
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/holiday';
import * as actions from '../redux/actions/holiday';
addView('holiday', reducer);

import {
	View,
	Text,
	Modal,
	Button,
	Loading,
	HelpBlock,
	FormGroup,
	FormControl,
	ControlLabel,
} from '../components';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class Holiday extends React.Component {
	static fetchData(store) {
		return store.dispatch(actions.init());
	}

	calendarEl = React.createRef();

	permissions = moduleActions(this.props.session.modules, 'holiday');

	hideDataModal = () => this.props.dispatch({type: 'HIDE_DATA_MODAL'});
	updateData = event => this.props.dispatch({
		type: 'UPDATE_DATA_VALUE',
		name: event.currentTarget.name,
		value: event.currentTarget.value,
	});
	save = async () => {
		let item = this.props.item,
			id = await this.props.dispatch(actions.save(this.props));
		if (id === false) return;
		if (item.id) {
			let event = $(this.calendarEl.current).fullCalendar('clientEvents', item.id)[0];
			event.title = item.name;
			event.start = moment(item.start_date, 'YYYY-MM-DD');
			event.end = moment(item.end_date, 'YYYY-MM-DD').add(1, 'days');
			$(this.calendarEl.current).fullCalendar('updateEvent', event);
		} else {
			$(this.calendarEl.current).fullCalendar('refetchEvents', 'unselect');
		}
	};
	remove = async () => {
		let id = this.props.item.id;
		await this.props.dispatch(actions.remove(this.props));
		$(this.calendarEl.current).fullCalendar('removeEvents', [id]);
	};

	async componentDidMount() {
		await import('fullcalendar');
		$(this.calendarEl.current).fullCalendar({
			header: {
				right: 'today prev,next',
			},
			buttonText:  {
				today:'Today'
			},
			defaultDate: new Date(),
			editable: this.permissions.delete || this.permissions.edit || this.permissions.add,
			eventLimit: true,
			defaultView:'month',
			selectable: true,
			selectHelper: true,
			select: (start, end) => {
				if (!this.permissions.add) return;
				let start_date = start.format('YYYY/MM/DD');
				let end_date = end.subtract(1, 'days').format('YYYY/MM/DD');
				this.props.dispatch({
					type: 'SET_HOLIDAY_DATA',
					data: {name:'', start_date, end_date}	
				});
			},
			eventClick: event => {
				if (!this.permissions.edit || !this.permissions.delete) return;
				let start_date = event.start.format('YYYY/MM/DD');
				let end_date = event.end.subtract(1, 'days').format('YYYY/MM/DD');
				this.props.dispatch({
					type: 'SET_HOLIDAY_DATA',
					data: {id:event.id, name:event.title, start_date, end_date}	
				});
			},
			events: async (start, end, timezone, callback) =>
				callback(await actions.loadEvents(this.props, start, end)),
		});
	}

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
			<React.Fragment>
				<View>
					<div ref={this.calendarEl}/>
				</View>
				{
					this.props.item &&
					<Modal show={true} onHide={this.hideDataModal}>
						<Modal.Header closeButton>
							<Modal.Title><Text>Holiday</Text></Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<FormGroup
								controlId='name'
								validationState={this.props.errors.name ? 'error': null}>
								<ControlLabel><Text>Holiday Title</Text></ControlLabel>
								<FormControl
									type='text'
									name='name'
									value={this.props.item.name}
									onChange={this.updateData}
									placeholder={__('Holiday Title')}/>
								<HelpBlock>{__(this.props.errors.name)}</HelpBlock>
							</FormGroup>
							<FormGroup>
								<div className='static-form-control'>
									<strong><Text>When</Text>:&nbsp;</strong>
									{this.props.item.start_date}
									{
										this.props.item.start_date !== this.props.item.end_date && 
										<React.Fragment>
											<strong>&nbsp;<Text>To</Text>&nbsp;</strong>
											{this.props.item.end_date}
										</React.Fragment>
									}
								</div>
							</FormGroup>
							<div className='text-right'>
								{
									!!this.props.item.id && this.permissions.delete &&
									<Button
										bsStyle='danger'
										onClick={this.remove}>
										<Text>Delete</Text>
									</Button>
								}
								&nbsp;
								&nbsp;
								{
									(this.permissions.add || this.permissions.edit) &&
									<Button
										bsStyle='primary'
										onClick={this.save}
										disabled={this.props.saving}>
										<Text>{this.props.saving ? 'Saving' : 'Submit'}</Text>
									</Button>
								}
							</div>
						</Modal.Body>
					</Modal>
				}
			</React.Fragment>
		);
	}

	componentWillUnmount() {
		$.fullCalendar && $(this.calendarEl.current).fullCalendar('destroy');
	}
}

