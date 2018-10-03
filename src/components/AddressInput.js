import React from 'react';
import {connect} from 'react-redux';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

import Text from './Text';
import Select from './Select';

import api, {makeApiData} from '../api';

@connect(state => ({
	session: state.session,
	lang: state.lang,
}))
export default class AddressInput extends React.Component {

	state = {
		countryId: null,
		stateId: null,
		cityId: null,
		countries: [],
		states: [],
		cities: [],
		address: '',
		loadingCountryId: 0,
		loadingStateId: 0,
	};

	handleCountryChange = event => this.changeCountry(event.currentTarget.value);
	handleStateChange = event => this.changeState(event.currentTarget.value);
	handleCityChange = event => this.changeCity(event.currentTarget.value);
	handleAddressChange = event => this.changeAddress(event.currentTarget.value);

	render() {
		let __ = this.props.__,
			errors = this.props.errors || {},
			names = this.props.names || {};
		return (
			<Row>
				<Col md={6}>
					<FormGroup validationState={errors.countryId ? 'error' : null}>
						<ControlLabel><Text>Country</Text></ControlLabel>
						<Select
							className='form-control'
							name={names.countryId}
							placeholder={__('Please Select Country')}
							options={this.state.countries}
							onChange={this.handleCountryChange}
							value={this.state.countryId}/>
						<HelpBlock>{errors.countryId}</HelpBlock>
					</FormGroup>
					<FormGroup validationState={errors.stateId ? 'error' : null}>
						<ControlLabel>{__('State')}</ControlLabel>
						<Select
							className='form-control'
							placeholder={__('Please Select State')}
							name={names.stateId}
							options={this.state.states}
							isLoading={this.state.loadingCountryId !== 0}
							onChange={this.handleStateChange}
							value={this.state.stateId}/>
						<HelpBlock>{errors.stateId}</HelpBlock>
					</FormGroup>
					<FormGroup validationState={errors.cityId ? 'error' : null}>
						<ControlLabel>{__('City')}</ControlLabel>
						<Select
							className='form-control'
							placeholder={__('Please Select City')}
							name={names.cityId}
							options={this.state.cities}
							isLoading={this.state.loadingStateId !== 0}
							onChange={this.handleCityChange}
							value={this.state.cityId}/>
						<HelpBlock>{errors.cityId}</HelpBlock>
					</FormGroup>
				</Col>
				<Col md={6}>
					<FormGroup validationState={errors.address ? 'error': null}>
						<ControlLabel>{__('Address')}</ControlLabel>
						<FormControl
							componentClass='textarea'
							name={names.address}
							style={{height: '12.7em'}}
							onChange={this.handleAddressChange}
							value={this.state.address}/>
						<HelpBlock>{errors.address}</HelpBlock>
					</FormGroup>
				</Col>
			</Row>
		);
	}

	async componentDidMount() {
		const {data} = await api({
			url: '/admin/country/list',
			data: makeApiData(this.props)
		});
		this.setState({
			countries: data.map(country => ({
				label: country.countrydetails[0].name,
				value: country.id
			}))
		});
		if (this.props.value.countryId)
			this.value = this.props.value;
	}

	get value() {
		return {
			countryId: this.state.countryId,
			stateId: this.state.stateId,
			cityId: this.state.cityId,
			address: this.state.address
		};
	}

	set value(val) {
		if (this.state.countryId !== val.countryId)
			this.changeCountry(val.countryId);
		if (this.state.stateId !== val.stateId)
			this.changeState(val.stateId);
		if (this.state.cityId !== val.cityId)
			this.changeCity(val.cityId);
		this.changeAddress(val.address);

	}

	async changeCountry(countryId) {
		if (!countryId)
			return this.setState({
				countryId,
				states: [],
				cities: [],
			});
		if (countryId === this.state.countryId) return;
		this.setState({
			countryId,
			loadingCountryId: countryId,
			states: [],
			cities: [],
		});
		const {data} = await api({
			url: '/admin/state/listByCountryId',
			data: makeApiData(this.props, {
				countryId
			})
		});
		if (this.state.loadingCountryId !== countryId) return;
		this.setState({
			states: data.data.map(state => ({
				label: state.statedetails[0].name,
				value: state.id
			})),
			loadingCountryId: 0
		});
	}

	async changeState(stateId) {
		if (!stateId)
			return this.setState({
				stateId,
				cities: [],
			});
		if (stateId === this.props.stateId) return;
		this.setState({
			stateId,
			loadingStateId: stateId,
			cities: []
		});
		const {data} = await api({
			url: '/admin/city/listByStateId',
			data: makeApiData(this.props, {
				stateId
			})
		});
		if (this.state.loadingStateId !== stateId) return;
		this.setState({
			cities: data.data.map(city => ({
				label: city.citydetails[0].name,
				value: city.id
			})),
			loadingStateId: 0
		});
	}

	changeCity(cityId) {
		this.setState({cityId});
	}

	changeAddress(address) {
		this.setState({address: address});
	}
}