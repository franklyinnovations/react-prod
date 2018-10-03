import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import makeTranslater from '../translate';

import {
	filterValue,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/partner';
import * as actions from '../redux/actions/partner';
addView('partner', reducer);

import {
	View,
	Text,
	Icon,
	Modal,
	Table,
	Loading,
	DateView,
	DataTable,
	Pagination,
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
export default class Partner extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

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

	view = event => this.props.dispatch(
		actions.viewData(
			this.props,
			+event.currentTarget.getAttribute('data-item-id')
		)
	);
	hideDataModal = () => this.props.dispatch({type: 'HIDE_DATA_MODAL'});

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<React.Fragment>
				<View
					search={this.props.query}
					filters={this.renderFilters(__)}
					actions={this.renderViewActions(__)}>
					{this.renderData()}
				</View>
				<Modal
					onHide={this.hideDataModal}
					show={this.props.item !== false}>
					{
						this.props.item &&
						<Modal.Header closeButton>
							<Modal.Title>
								<Text>Partner Request</Text>
							</Modal.Title>
						</Modal.Header>
					}
					<Modal.Body>
						{this.props.item === null && <Loading/>}
						{
							this.props.item &&
							<Table bordered striped condensed>
								<tbody>		
									<tr>
										<td><strong><Text>Partner Name</Text></strong></td>
										<td>{this.props.item.partner_name}</td>
									</tr>
									<tr>
										<td><strong><Text>Company Name</Text></strong></td>
										<td>{this.props.item.company_name}</td>
									</tr>
									<tr>
										<td><strong><Text>Website URL</Text></strong></td>
										<td>{this.props.item.website_url}</td>
									</tr>
									<tr>
										<td><strong><Text>Address</Text></strong></td>
										<td>{this.props.item.address}</td>
									</tr>
									<tr>
										<td><strong><Text>Name Of Contact Person</Text></strong></td>
										<td>{this.props.item.name}</td>
									</tr>
									<tr>
										<td><strong><Text>Designation</Text></strong></td>
										<td>{this.props.item.designation}</td>
									</tr>
									<tr>
										<td><strong><Text>Mobile Number</Text></strong></td>
										<td>{this.props.item.mobile}</td>
									</tr>
									<tr>
										<td><strong><Text>Email ID</Text></strong></td>
										<td>{this.props.item.email}</td>
									</tr>
									<tr>
										<td><strong><Text>About Your Existing Business</Text></strong></td>
										<td>{this.props.item.about_business}</td>
									</tr>
									<tr>
										<td><strong><Text>Message</Text></strong></td>
										<td>{this.props.item.message}</td>
									</tr>
									<tr>
										<td><strong><Text>Created At</Text></strong></td>
										<td><DateView>{this.props.item.createdAt}</DateView></td>
									</tr>
								</tbody>
							</Table>
						}
					</Modal.Body>
				</Modal>
			</React.Fragment>
		);
	}

	renderFilters(__) {
		const filters = this.props.filters;
		if (filters === null) return false;
		return (
			<View.Filters search={this.search} remove={this.toggleFilters}>
				<FormControl
					type='text'
					name='partner__name'
					onChange={this.updateFilter}
					title={__('Contact Person')}
					placeholder={__('Contact Person')}
					value={filterValue(filters, 'partner__name', '')}/>
				<FormControl
					type='text'
					title={__('Partner Name')}
					name='partner__partner_name'
					onChange={this.updateFilter}
					placeholder={__('Partner Name')}
					value={filterValue(filters, 'partner__partner_name', '')}/>
				<FormControl
					type='text'
					title={__('Company Name')}
					name='partner__company_name'
					onChange={this.updateFilter}
					placeholder={__('Company Name')}
					value={filterValue(filters, 'partner__company_name', '')}/>
				<FormControl
					type='text'
					title={__('Email')}
					name='partner__email'
					placeholder={__('Email')}
					onChange={this.updateFilter}
					value={filterValue(filters, 'partner__email', '')}/>
				<FormControl
					type='text'
					title={__('Mobile')}
					name='partner__mobile'
					placeholder={__('Mobile')}
					onChange={this.updateFilter}
					value={filterValue(filters, 'partner__mobile', '')}/>
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
							<td className='tw-14'><Text>Contact Person</Text></td>
							<td className='tw-14'><Text>Partner Name</Text></td>
							<td className='tw-14'><Text>Company Name</Text></td>
							<td className='tw-14'><Text>Website URL</Text></td>
							<td className='tw-14'><Text>Email</Text></td>
							<td className='tw-14'><Text>Mobile</Text></td>
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
		return this.props.items.map(item => (
			<tr key={item.id}>
				<td className='tw-14'>{item.name}</td>
				<td className='tw-14'>{item.partner_name}</td>
				<td className='tw-14'>{item.company_name}</td>
				<td className='tw-14'>{item.website_url}</td>
				<td className='tw-14'>{item.email}</td>
				<td className='tw-14'>{item.mobile}</td>
				<td>
					<DataTable.Actions id={'item-actions-' + item.id}>
						<DataTable.Action
							text='View'
							glyph='fa-eye'
							onClick={this.view}
							data-item-id={item.id}/>
					</DataTable.Actions>
				</td>
			</tr>
		));
	}
}

