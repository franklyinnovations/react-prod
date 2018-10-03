import React from 'react';
import {connect} from 'react-redux';

import {
	loadGoogleMapLib,
} from '../utils';
import {socket} from '../io';

import {
	Text,
	Table,
	Modal,
	Loading,
} from '../components';

import {addView} from '../redux/reducers/views';
import reducer from '../redux/reducers/vehicletracking';
import * as actions from '../redux/actions/vehicletracking';
addView('vehicletracking', reducer);

@connect(state => ({
	session: state.session,
	loading: state.view.loading || false,
	lang: state.lang,
	translations: state.translations,
	...state.view.state,
}))
export default class VehicleTracking extends React.Component {

	static fetchData(store) {
		return store.dispatch(actions.init(store.getState()));
	}

	markers = [];
	mapElementRef = React.createRef();
	onStartPickUp = tripId => socket.emit('join-trip-room', tripId);
	onTripPosition = data => {
		let
			tripId = data.tripId,
			position = {
				lat: data.latitude,
				lng: data.longitude,
			},
			marker = this.markers.find(marker => marker.tripId === data.tripId);
		if (marker) {
			marker.setPosition(position);
		} else {
			marker = new window.google.maps.Marker({
				position,
				map: this.map,
			});
			marker.tripId = tripId;
			this.markers.push(marker);
			this.fitBounds();
			marker.addListener('click', () => {
				this.props.dispatch(actions.showTrip(this.props, tripId));
			});
		}
	};
	onStopDrop = tripId => {
		socket.emit('leave-trip-room', tripId);
		this.markers.splice(this.markers.findIndex(marker => marker.tripId === tripId), 1);
	};
	hideDataModal = () => this.props.dispatch({type: 'HIDE_DATA_MODAL'});

	render() {
		let item = this.props.item;
		return (
			<React.Fragment>
				{this.props.loading && <Loading/>}
				<div id='vehicletracking-map' ref={this.mapElementRef}/>
				<Modal
					show={item !== false}
					onHide={this.hideDataModal}>
					<Modal.Header closeButton>
						<Modal.Title>
							<Text>Trip Details</Text>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{item === null && <Loading/>}
						{
							item &&
							<Table bordered striped>
								<tbody>
									<tr>
										<td>Vehicle Name</td>
										<td>{item.vehicle.vehicledetails[0].name}</td>
									</tr>
									<tr>
										<td>Vehicle Type</td>
										<td>{item.vehicle.vehicle_type}</td>
									</tr>
									<tr>
										<td>Vehicle Number</td>
										<td>{item.vehicle.number}</td>
									</tr>
									<tr>
										<td>Driver</td>
										<td>{item.driver.userdetails[0].fullname}</td>
									</tr>
									<tr>
										<td>Driver Contact</td>
										<td>{item.driver.mobile}</td>
									</tr>
									<tr>
										<td>Route Name</td>
										<td>{item.rvdhsmap.route.name}</td>
									</tr>
									<tr>
										<td>On Board Students</td>
										<td>{item.onboard_students}</td>
									</tr>
									<tr>
										<td>Status</td>
										<td>{VehicleTracking.status(item.status)}</td>
									</tr>
								</tbody>
							</Table>
						}
					</Modal.Body>
				</Modal>
			</React.Fragment>
		);
	}

	async componentDidMount() {
		$('#body').addClass('full-height-content');
		let google = await loadGoogleMapLib();

		socket.on('start-pick-up', this.onStartPickUp);
		socket.on('trip-position', this.onTripPosition);
		socket.on('stop-drop', this.onStopDrop);

		let {rvdhsmaps, trips} = this.props.meta;
		if (rvdhsmaps) {
			for (let i = rvdhsmaps.length - 1; i >= 0; i--) {
				socket.emit('join-rvdhsmap-room', rvdhsmaps[i].id);
			}
		}
		if (trips) {
			for (let i = trips.length - 1; i >= 0; i--) {
				socket.emit('join-trip-room', trips[i].id);
			}
		}

		this.map = new google.maps.Map(this.mapElementRef.current, {
			zoom: 12,
			center: {lat: 0,lng: 0},
			mapTypeId: google.maps.MapTypeId.ROADMAP,
		});
		this.markers.forEach(marker => marker.setMap(this.map));
	}

	componentWillUnmount() {
		this.map = null;
		$('#body').removeClass('full-height-content');
		this.markers.forEach(marker => marker.setMap(null));
		this.markers = [];
		socket.off('start-pick-up', this.onStartPickUp);
		socket.off('trip-position', this.onTripPosition);
		socket.off('stop-drop', this.onStopDrop);
	}

	fitBounds() {
		let bounds = new window.google.maps.LatLngBounds(),
			markers = this.markers;
		if (this.markers.length === 0) {
			return;
		} else if (this.markers.length === 1) {
			this.map.setCenter(this.markers[0].getPosition());
		} else {
			for (let i = markers.length - 1; i >= 0; i--)
				bounds.extend(markers[i].getPosition());
			this.map.fitBounds(bounds);
		}
	}

	componentDidUpdate(prevProps) {
		let {rvdhsmaps, trips} = this.props.meta;
		if (rvdhsmaps && prevProps.meta.rvdhsmaps !== rvdhsmaps) {
			for (let i = rvdhsmaps.length - 1; i >= 0; i--) {
				socket.emit('join-rvdhsmap-room', rvdhsmaps[i].id);
			}
		}
		if (trips && prevProps.meta.trips !== trips) {
			for (let i = trips.length - 1; i >= 0; i--) {
				socket.emit('join-trip-room', trips[i].id);
			}
		}
	}
	
	static status(value) {
		switch (value) {
			case 0:
				return 'Will start pick up';
			case 1:
				return 'Picking up students';
			case 2:
				return 'Pick up finished';
			case 3:
				return 'Droping off students';
			case 4:
				return 'Trip finished';
		}
	}	
}