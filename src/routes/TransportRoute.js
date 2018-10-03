import React from 'react';
import url from 'url';
import {connect} from 'react-redux';

import makeTranslater from '../translate';

import {
	dialog,
	getStatusOptions,
	filtersFromQuery,
	filterValue,
	queryFromFilters,
	moduleActions,
	getInputValue,
	messenger,
	loadGoogleMapLib,
} from '../utils';

import {
	Row,
	Col,
	Icon,
	Text,
	View,
	Button,
	DataTable,
	FormGroup,
	InputGroup,
	ControlLabel,
	HelpBlock,
	Select,
	Checkbox,
	FormControl,
	Loading,
	ClickButton,
	Pagination,
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/transportroute';
import * as actions from '../redux/actions/transportroute';
addView('transportroute', reducer);

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.state,
}))
export default class TransportRoute extends React.Component {

	static fetchData(store) {
		return store.dispatch(
			actions.init(
				store.getState()
			)
		);
	}

	state = {address: ''};

	permissions = moduleActions(this.props.session.modules, 'route');

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

	updateFilter = event => this.props.dispatch(actions.updateFilter(event));

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
		this.props.router.push(this.props.router.createPath(this.props.router.location.pathname));
	};

	changePage = page => {
		this.props.router.push(
			url.format({
				pathname: this.props.location.pathname,
				query: {
					...this.props.location.query,
					page: page
				}
			})
		);
	};

	startAdd = () => this.props.dispatch(actions.startAdd());

	changeStatus = event => {
		this.props.dispatch(
			actions.changeStatus(
				this.props,
				parseInt(event.currentTarget.getAttribute('data-item-id')),
				event.currentTarget.value,
			)
		);
	};

	remove = event => {
		let id = event.currentTarget.getAttribute('data-item-id');
		dialog.confirm({
			callback: (value => value && this.props.dispatch(actions.remove(this.props, id))),
			message: window.__('Are you sure you want to delete this Route?'),
		});
	};

	updateData = event => {
		this.props.dispatch(actions.update(
			'UPDATE_DATA_VALUE',
			event.currentTarget.name,
			getInputValue(event.currentTarget),
		));
	};

	edit = event => this.props.dispatch(
		actions.edit(
			this.props,
			parseInt(event.currentTarget.getAttribute('data-item-id'))
		)
	);

	sortable = null;

	createSortable = async el => {
		if (el === null) {
			if (this.sortable !== null) {
				this.sortable.destroy();
			}
		} else {
			const Sortable = (await import('sortablejs')).default;
			this.sortable = new Sortable(el, {
				onUpdate: this.updateRouteOrder,
			});
		}
	};

	updateRouteOrder = event => this.props.dispatch(
		actions.updateOrder(
			event.oldIndex,
			event.newIndex
		)
	);

	removeRouteAddress = event => {
		this.props.dispatch(
			actions.removeRouteAddress(
				this.props,
				parseInt(event.target.getAttribute('data-index')),
				event.target.getAttribute('data-item-id'),
			)
		);
	};

	routeSelector = React.createRef();
	updatePlace = () => this.routeSelector.current.updatePlace();
	addPlace = place => this.props.dispatch(actions.addPlace(place));
	startAddPlace = () => this.routeSelector.current.addPlace();
	hideDataModal = () => this.props.dispatch(actions.hideDataModal());
	save = () => this.props.dispatch(actions.save(this.props));

	render() {
		if (this.props.loading) return <Loading/>;

		const __ = makeTranslater(this.props.translations, this.props.lang.code);

		if (this.props.item !== false) {
			return (
				<View actions={
					<View.Actions>
						<View.Action onClick={this.reset} title={__('View List')}>
							<Text>View List</Text>
						</View.Action>
					</View.Actions>
				}>
					{
						this.props.item === null ? <Loading/> :
						<Row>
							<Col md={6}>
								<FormGroup validationState={this.props.errors.name ? 'error' : null}>
									<ControlLabel>
										<Text>Route Name (Ex: Source Name to Destination Name)</Text>
									</ControlLabel>
									<FormControl
										name='name'
										value={this.props.item.name}
										onChange={this.updateData}/>
									<HelpBlock>{this.props.errors.name}</HelpBlock>
								</FormGroup>
								<FormGroup validationState={this.props.errors.routeaddresse ? 'error' : null}>
									<ControlLabel>
										<Text>Select Address</Text>
									</ControlLabel>
									<InputGroup>
										<FormControl
											id='route-address-input'
											onChange={this.updatePlace}/>
										<InputGroup.Addon onClick={this.startAddPlace}>
											<Icon glyph='fa-plus'/>
										</InputGroup.Addon>
									</InputGroup>
									<HelpBlock>{this.props.errors.routeaddresse}</HelpBlock>
								</FormGroup>
								<div className='route-adresses' ref={this.createSortable}>
									{this.renderRouteAddresses(this.props.item.routeaddresses, __)}
								</div>
								<FormGroup controlId='is_active'>
									<Checkbox
										name='is_active'
										onChange={this.updateData}
										value={this.props.item.is_active}>
										<ControlLabel>
											<Text>Status</Text>
										</ControlLabel>
									</Checkbox>
								</FormGroup>
							</Col>
							<RouteSelector
								ref={this.routeSelector}
								onAddPlace={this.addPlace}
								address={this.state.address}
								places={this.props.item.routeaddresses}/>
							<Col xs={12}>
								<Button onClick={this.hideDataModal}>
									<Text>Cancel</Text>
								</Button>
								{' '}
								<Button bsStyle='primary' onClick={this.save}>
									<Text>Submit</Text>
								</Button>
							</Col>
						</Row>
					}
				</View>
			);
		}

		const firstTime = this.props.pageInfo.totalData === 0 &&
			this.props.query.length === 0 &&
			this.props.pageInfo.currentPage === 1;
		if (firstTime)
			return <View>{this.renderFirstMessage()}</View>;
		return (
			<View
				search={this.props.query}
				filters={this.renderFilters(__)}
				actions={this.renderViewActions(__)}>
				{this.renderData()}
			</View>
		);
			
	}

	renderFirstMessage() {
		return (
			<div className='first-message'>
				<Row className='text-center'>
					<Col mdOffset={3} md={6}>
						<h3><Text>Route</Text></h3>
						<div>
							<Text>
								Define the routes for the student's transportation in your city with help of Google Map.
							</Text>
						</div>
					</Col>
				</Row>
				{
					this.permissions.add &&
					<ClickButton
						text='Let’s Add Now'
						btnText='Add Route'
						glyph='fa-plus'
						side='left'
						onClick={this.startAdd}/>
				}
			</div>
		);
	}

	renderData() {
		return (
			<React.Fragment>
				<DataTable>
					<thead>
						<tr>
							<td className='tw-8'><Text>Status</Text></td>
							<td className='tw-20'><Text>Name</Text></td>
							<td><Text>Address</Text></td>
							<td>
								<DataTable.ActionColumnHeading/>
							</td>
						</tr>
					</thead>
					<tbody>{this.renderDataRows()}</tbody>
				</DataTable>
				<Pagination data={this.props.pageInfo} onSelect={this.changePage}/>
			</React.Fragment>
		);
	}

	renderDataRows() {
		if (this.props.items.length === 0) {
			return <DataTable.NoDataRow colSpan={6}/>;
		}

		return this.props.items.map(item => (
			<tr key={item.id}>
				<td className='tw-8'>
					<Checkbox
						inline
						onChange={this.changeStatus}
						data-item-id={item.id}
						data-item-status={item.is_active}
						disabled={!this.permissions.status}
						value={item.is_active}/>
				</td>
				<td className='tw-20'>{item.name}</td>
				<td>
					{
						item.routeaddresses.map(
							(routeaddress, index) => (
								<div key={routeaddress.id}>
									{`${index + 1}. ${routeaddress.address}`}
								</div>
							)
						)
					}
				</td>
				<td className='tw-10'>
					<DataTable.Actions id={'item-actions-' + item.id}>
						{
							this.permissions.edit &&
							<DataTable.Action
								text='Edit'
								glyph='fa-edit'
								onClick={this.edit}
								data-item-id={item.id}/>
						}
						{
							this.permissions.delete &&
							<DataTable.Action
								text='Remove'
								glyph='fa-trash'
								onClick={this.remove}
								data-item-id={item.id}/>
						}
					</DataTable.Actions>
				</td>
			</tr>
		));
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
					name='route__name'
					onChange={this.updateFilter}
					value={filterValue(filters, 'route__name', '')} />
				<Select
					title={__('Status')}
					placeholder={__('Select Status')}
					name='route__is_active'
					onChange={this.updateFilter}
					value={filterValue(filters, 'route__is_active', null)}
					options={getStatusOptions(__)}/>
			</View.Filters>
		);
	}

	renderViewActions(__) {
		return (
			<View.Actions>
				{
					this.permissions.add &&
					<View.Action onClick={this.startAdd}>
						<Text>Add New</Text>
					</View.Action>
				}
				<View.Action onClick={this.toggleFilters} title={__('Filters')}>
					<Icon glyph='fa-filter'/>
				</View.Action>
				<View.Action onClick={this.reset} title={__('Reset')}>
					<Icon glyph='fa-redo-alt'/>
				</View.Action>
			</View.Actions>
		);
	}

	renderRouteAddresses(items) {
		return items.map((item, index) => (
			index === this.props.item.addressIndex ?
			<Loading key={item.theId}/>:
			<div key={item.theId}>
				<span className='controls'>
					<Icon
						glyph='fa-trash'
						data-index={index}
						data-item-id={item.id || ''}
						onClick={this.removeRouteAddress}/>
					{' '}
					<Icon glyph='fa-arrows-alt'/>
				</span>
				<div>
					<span>
						<Text>Address</Text>
					</span>
					{' : '}
					<span>{item.address}</span>
				</div>
				<div>
					<span>
						<Text>Latitude</Text>
					</span>
					{' : '}
					<span>{item.lat}</span>
				</div>
				<div>
					<span>
						<Text>Longitude</Text>
					</span>
					{' : '}
					<span>{item.lang}</span>
				</div>
			</div>
		));
	}
}

class RouteSelector extends React.Component {

	render() {
		let __ = window.__;
		return (
			<Col ref={this.init} md={6}>
				<p>
					<b>{__('Google Map')}</b>{' : '}
					{__('You can drag and drop the marker to the correct location')}
				</p>
				<div id='route-map' style={{width: '100%', height: '400px', position: 'relative'}}/>
			</Col>
		);
	}

	init = async el => {
		if (el === null)
			return this.clean();

		await loadGoogleMapLib();
		this.map = new google.maps.Map(
			document.querySelector('#route-map'),
			{
				zoom: 4,
				center: {
					lat: 0,
					lng: 0,
				},
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
		);
		this.autocomplete = new google.maps.places.Autocomplete(
			document.getElementById('route-address-input')
		);
		this.autocomplete.addListener('place_changed', this.gotSearchResult);
		this.marker = new google.maps.Marker({draggable: true});
		this.marker.addListener('dragend', this.updatePlace);
		this.infoWindow = new google.maps.InfoWindow();
		this.directionsService = new google.maps.DirectionsService();
		this.directionsRenderer = new google.maps.DirectionsRenderer({map: this.map});
		this.updateRoute(this.props.places);
		if (this.props.places.length === 0 && window.navigator && window.navigator.geolocation) {
			window.navigator.geolocation.getCurrentPosition(({coords: {latitude, longitude}}) => {
				this.map.setCenter({
					lat: latitude,
					lng: longitude,
				});
			});
		}
	};

	gotSearchResult = () => {
		let place = this.autocomplete.getPlace();
		if (!place.geometry) return;
		this.map.setCenter(place.geometry.location);
		this.map.fitBounds(place.geometry.viewport);
		this.marker.setMap(this.map);
		this.marker.setPosition(place.geometry.location);
		this.infoWindow.setContent(this.getInfoWindowContent());
		this.infoWindow.open(this.map, this.marker);
	};

	updatePlace = () => {
		this.infoWindow.setContent(this.getInfoWindowContent());
		this.infoWindow.open(this.map, this.marker);
	};

	getInfoWindowContent() {
		let position = this.marker.getPosition();
		if (!position) return;
		return document.getElementById('route-address-input').value
			+ '<br>'
			+ window.__('Coordinates: ')
			+ position.lat()
			+ ' '
			+ position.lng();
	}

	addPlace = () => {
		let position = this.marker.getPosition(),
			addressInput = document.getElementById('route-address-input');
		let address = addressInput.value.trim();
		if (!position || !address) return;
		this.props.onAddPlace({
			address,
			lat: position.lat(),
			lang: position.lng(),
			position: this.props.places.length,
		});
		addressInput.value = '';
		this.marker.setMap(null);
		this.infoWindow.close();
	};

	componentWillReceiveProps(nextProps) {
		if (this.props.places !== nextProps.places)
			this.updateRoute(nextProps.places);
	}

	clean() {
		this.marker.setMap(null);
		this.infoWindow.setMap(null);
		this.marker = null;
		this.infoWindow = null;
		this.directionsService = null;
		this.directionsRenderer.setMap(null);
		this.directionsRenderer = null;
	}

	updateRoute(places) {
		if (places.length < 2) return;

		this.directionsService.route({
			origin: {lat: parseFloat(places[0].lat), lng: parseFloat(places[0].lang)},
			destination: {
				lat: parseFloat(places[places.length - 1].lat),
				lng: parseFloat(places[places.length - 1].lang)
			},
			waypoints: places.slice(1, -1).map(place => ({
				location: {
					lat: parseFloat(place.lat),
					lng: parseFloat(place.lang)
				}
			})),
			travelMode: 'WALKING',
		}, (response, status) => {
			if (status === 'OK') {
				this.directionsRenderer.setDirections(response);
			} else {
				messenger.post({
					message: window.__('Route could not be displayed on the map.'),
					type: 'error',
				});
			}
		});
	}
}