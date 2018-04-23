import React from 'react';
import ReactDOM from 'react-dom';

import {connect} from 'react-redux';
import actions from '../../redux/actions';
import Pagination from '../../components/Pagination';
import Loading from '../../components/Loading';
import makeTranslater from '../../translate';
import {makeApiData} from '../../api';
import {imageUrl} from '../../../api/config';
import {getClaimStatusLabel, getVerificationStatusLabel, text_truncate, getSalutation, getStatusLabel} from '../../utils';
import ReactStars from 'react-stars';
var moment = require('moment');


import {
	Row,
	Col,
	Grid,
	Panel,
	Table,
	PanelBody,
	PanelHeader,
	PanelContainer,
	Icon,
	Button,
	Form,
	Label,
	FormGroup,
	ControlLabel,
	InputGroup,
	FormControl,
	Checkbox,
	HelpBlock,
	PanelTabContainer,
	Modal,
	ButtonGroup,
	Image,
	BPanel,
	Media
} from '@sketchpixy/rubix';

import url from 'url';

const viewName = 'hospital_feedback';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.hospital_feedback
}))


export default class HospitalFeedback extends React.Component {

	constructor(props) {
		super(props);
	}

	static fetchData(store) {
		return store.dispatch(
			actions.hospital_feedback.init(
				store.getState()
			)
		);
	}

	render() {
		if (this.props.loading) return <Loading/>;
		let content, __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		switch(this.props.viewState) {
			default:
				content = this.renderList(__);
		}

		return (
			<Row>
				<Col xs={12}>
					<PanelContainer controls={false} className="overflow-visible">
						<Panel>
							<PanelHeader className='bg-green'>
								<Grid>
									<Row>
										<Col xs={4} md={10} className='fg-white'>
											<h3>{__('Feedbacks')}</h3>
										</Col>
										<Col xs={8} md={2}>
											{
												this.props.helperData.average_rating && 
												<ReactStars
													count={5}
													edit={false}
													value={ Math.round(this.props.helperData.average_rating * 2)/2 }
													half={true}
													size={24}
													color2={'#ffff00'} 
												/>
											}
										</Col>
									</Row>
								</Grid>
							</PanelHeader>
							<PanelBody>
								<Grid>
									{content}
								</Grid>
							</PanelBody>
						</Panel>
					</PanelContainer>
				</Col>
			</Row>
		);
	}

	renderList(__) {
		return (
			<Row key="feedback-list" className="social">
				<Col sm={12}>
					<Row>
						<Col sm={5}></Col>	
						<Col sm={3}>
							<FormGroup controlId='date'>
								<FormControl
									componentClass="select"
									placeholder="select"
									onChange={::this.makeFilter}
									name='date'
									value={this.props.location.query.date}
								>
									<option value={''}>{__('Sort by date')}</option>
									<option value={'desc'}>{__('Descending')}</option>
									<option value={'asc'}>{__('Ascending')}</option>
								</FormControl>
							</FormGroup>
						</Col>
						<Col sm={3}>
							<FormGroup controlId='date'>
								<FormControl
									componentClass="select"
									placeholder="select"
									onChange={::this.makeFilter}
									name='rating'
									value={this.props.location.query.rating}
								>
									<option value={''}>{__('Filter by rating')}</option>
									<option value={1}>{__('1 Star')}</option>
									<option value={2}>{__('2 Stars')}</option>
									<option value={3}>{__('3 Stars')}</option>
									<option value={4}>{__('4 Stars')}</option>
									<option value={5}>{__('5 Stars')}</option>
								</FormControl>
							</FormGroup>
						</Col>
						<Col sm={1}>
							<Icon
								className={'fg-darkcyan'}
								style={{fontSize: 30}}
								title={__('Reset')}
								glyph={'icon-simple-line-icons-reload'}
								onClick={::this.reset}
							/>
						</Col>
					</Row>
					
					
				</Col>
				<Col sm={12}>
					{this.props.feedbacks.length === 0 && <p className='text-center'>{__('No record found')}</p>}

					{this.props.feedbacks.map(this.getDataRow, this) }
				</Col>
				<Col xs={12}>
					<Pagination
						data={this.props.pageInfo}
						onSelect={::this.changePage}
					/>
				</Col>
			</Row>
		);
	}

	getDataRow(item, index) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);

		return (
			<BPanel key={'feedback-'+index}>
				<Row>
					<Col sm={2}><Image circle style={{height: '64px'}} src={imageUrl+'/'+item.patient.user.user_image} alt={item.patient.user.user_image}/></Col>
					<Col sm={10} style={{paddingLeft: '0px'}}>
						<Row>
							<Col sm={9} style={{paddingLeft: '0px'}}>
								<h4 style={{marginTop: '0px', paddingLeft: '0px'}}>{item.patient.user.userdetails[0].fullname}</h4>
								{__('Date')}: {moment(item.createdAt).format("DD/MM/YYYY")}
							</Col>
							<Col sm={3}>
								<ReactStars
									count={5}
									edit={false}
									value={parseFloat(item.rating)}
									half={true}
									size={24}
									color2={'#34bfd2'} 
								/>
							</Col>
							<Col sm={12} style={{paddingLeft: '0px'}}>
								{item.feedback}
							</Col>
						</Row>
					</Col>
				</Row>
			</BPanel>
		);
	}

	changePage(page) {
		this.props.router.push(
			url.format({
				pathname: this.props.location.pathname,
				query: {
					...this.props.location.query,
					page: page
				}
			})
		);
	}

	makeFilter(event) {
		this.props.router.push(
			url.format({
				pathname: this.props.location.pathname,
				query: {
					...this.props.location.query,
					[event.target.name]: event.target.value
				}
			})
		);
	}

	reset() {
		this.props.router.push('/hospital/feedback');
	}
}