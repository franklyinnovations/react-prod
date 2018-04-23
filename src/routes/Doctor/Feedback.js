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

const viewName = 'doctor_feedback';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.doctor_feedback
}))


export default class DoctorFeedback extends React.Component {

	constructor(props) {
		super(props);
	}

	static fetchData(store) {
		return store.dispatch(
			actions.doctor_feedback.init(
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
		content = this.renderList(__);

		return (
			<Row>
				<Col xs={12}>
					<PanelContainer controls={false} className="overflow-visible article-list-box">
						<Panel>
							<PanelHeader className='bg-green'>
								<Grid>
									<Row>
										<Col xs={12} md={10} className='fg-white'>
											<h3>{__('Feedbacks')}</h3>
										</Col>
										<Col xs={12} md={2}>
										<h3 className="text-right">
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
											</h3>
										</Col>
									</Row>
								</Grid>
							</PanelHeader>
							<PanelBody>
								<Grid className='dash-article-list dash-feedback-list'>
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
				<Col sm={12} className="feedback-sort">
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
								glyph={'icon-feather-search'}
								title={__('Reset')}
								onClick={::this.reset}
							/>
						</Col>
					</Row>
					
					
				</Col>
				<Col sm={12} className='no-padding'>
					{this.props.feedbacks.length === 0 && <p className='text-center'>{__('No record found')}</p>}

					{this.props.feedbacks.map(this.getDataRow, this) }
				</Col>
				<Col xs={12} className='no-padding'>
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
					<Col sm={2} className="text-center"><Image circle style={{height: '64px', width: '64px'}} src={imageUrl+'/'+item.patient.user.user_image} alt="Image"/></Col>
					<Col sm={10} style={{paddingLeft: '0px'}}>
						<Row>
							<Col sm={12}>
								<h3>{item.patient.user.userdetails[0].fullname}</h3>
								<p className='feedback-date'>{__('Date')}: {moment(item.createdAt).format("DD/MM/YYYY")} 
								{' | '} 
								</p>
								<ReactStars className='feedback-star'
									count={5}
									edit={false}
									value={parseFloat(item.rating)}
									half={true}									
								/>
							</Col>
							
							<Col sm={12}>
								<p>{item.feedback}</p>
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
		this.props.router.push('/doctor/feedback');
	}
}