import React from 'react';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	filterValue,
	getStatusTitle,
	getStatusOptions,
	filtersFromQuery,
	queryFromFilters,
} from '../utils';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/emailprovider';
import * as actions from '../redux/actions/emailprovider';
addView('emailprovider', reducer);

import {
	Icon,
	View,
	Text,
	Select,
	Loading,
	Checkbox,
	DataTable,
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
export default class EmailProvider extends React.Component {

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
	activate = event => this.props.dispatch(
		actions.activate(
			this.props,
			+event.currentTarget.getAttribute('data-item-id'),
		)
	);

	render() {
		if (this.props.loading) return <Loading/>;
		let __ = makeTranslater(this.props.translations, this.props.lang.code);
		return (
			<View
				search={this.props.query}
				filters={this.renderFilters(__)}
				actions={this.renderViewActions(__)}>
				{this.renderData(__)}
			</View>
		);
	}

	renderFilters(__) {
		const filters = this.props.filters;
		if (filters === null) return false;
		return (
			<View.Filters search={this.search} remove={this.toggleFilters}>
				<FormControl
					type='text'
					title={__('Title')}
					placeholder={__('Title')}
					onChange={this.updateFilter}
					name='emailprovider__display_name'
					value={filterValue(filters, 'emailprovider__display_name', '')} />
				<Select
					title={__('Status')}
					onChange={this.updateFilter}
					name='emailprovider__is_active'
					options={getStatusOptions(__)}
					placeholder={__('Select Status')}
					value={filterValue(filters, 'emailprovider__is_active', null)}/>
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

	renderData(__) {
		return (
			<React.Fragment>
				<DataTable>
					<thead>
						<tr>
							<td className='tw-8'><Text>Status</Text></td>
							<td className='text-left'><Text>Name</Text></td>
						</tr>
					</thead>
					<tbody>
						{this.renderDataRows(__)}
					</tbody>
				</DataTable>
			</React.Fragment>
		);
	}

	renderDataRows(__) {
		if (this.props.items.length === 0) {
			return <DataTable.NoDataRow colSpan={5}/>;
		}
		return this.props.items.map(item => (
			<tr key={item.id}>
				<td className='tw-8'>
					<Checkbox
						inline
						data-item-id={item.id}
						value={item.is_active}
						onChange={this.activate}
						title={getStatusTitle(item.is_active, __)}/>
				</td>
				<td className='text-left'>{item.display_name}</td>
			</tr>
		));
	}
}