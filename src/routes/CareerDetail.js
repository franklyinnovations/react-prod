import React from 'react';
import {connect} from 'react-redux';
import {Link, IndexLink} from 'react-router';
import Header from '../front/Header';
import Footer from '../front/Footer';
import BannerSimple from '../front/BannerSimple';
import actions from '../redux/actions';
import {imageUrl} from '../../api/config';
import Loading from '../components/Loading';
import moment from 'moment';
import makeTranslater from "../translate";

const viewName = 'careerdetail';
@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view[viewName]
}))
export default class CareerDetail extends React.Component {
	static fetchData(store, params) {
		return store.dispatch(
			actions.careerdetail.init(store.getState(), params)
		);
	}
	render() {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		let item = this.props.item;
		return (
			<div id='front2'>
				<Header />
				<BannerSimple title='Careers' image='/imgs/home/register-icon.png'/>
				<div className='career-content-sec'>		
					<div className='container'>
						<div className='careers-box careerdetail-box'>
							{
								this.props.loading ? <Loading />:
								item ?
								<div key={item.id} className='vacancies'>
									<div className='row'>
										<div className='col-md-2'>
										<div className='career-thumb'>
											<img className='img-responsive img-circle'
												src={item.hospital.hospital_logo ? imageUrl+'/'+item.hospital.hospital_logo:'/imgs/noimage.png'}/>
										 </div>
										</div>
										<div className='col-md-10'>
											<div className='title'>{item.jobdetails[0].title}</div>
											<div className='clinic-info row'>
												<div className='col-md-4'>
													<span>{__('Clinic')}: </span>{item.hospital.hospitaldetails[0].hospital_name}
												</div>
												<div className='col-md-4'>
													<span>{__('Location')}: </span>{item.hospital.hospitaldetails[0].address}
												</div>
												<div className='col-md-4'>
													<span>{__('Exp')}: </span>{item.jobdetails[0].experience}
												</div>
											</div>
											
										</div>
									</div>
									<div className='row'>
										<div className='col-md-12 description'>
											<div className='title'>{__('Job Description')}</div>
											{item.jobdetails[0].description}
										</div>
										<div className='col-md-12 description'>
											<div className='title'>{__('Key Skills')}</div>
											{item.jobdetails[0].key_skills}
										</div>
										<div className='col-md-12 description'>
											<div className='title'>{__('Education/Qualification')}</div>
											{item.jobdetails[0].qualification}
										</div>
										<div className='col-md-12 description'>
											<div className='title'>{__('Open Positions')}</div>
											{item.no_of_post}
										</div>
										<div className='col-md-12 description'>
											<div className='title'>{__('Posted On')}</div>
											{moment(item.createdAt).format('YYYY-MM-DD')}
										</div>
										<div className='col-md-12'>
											<Link className='apply-now' to={'/careers/apply/'+item.id}>{__('APPLY NOW')}</Link>
										</div>
									</div>
								</div>
								:
								<div className='text-center'>
									{__('Post not found')}
								</div>
							}
						</div>
					</div>
				</div>
				<Footer/>
			</div>
		);
	}
}