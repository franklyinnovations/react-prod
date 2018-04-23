import React from 'react';
import {connect} from 'react-redux';
import {Link, IndexLink} from 'react-router';
import Footer from '../front/Footer';
import Header from '../front/Header';
import BannerSimple from '../front/BannerSimple';
import actions from '../redux/actions';
import {imageUrl} from '../../api/config';
import Loading from '../components/Loading';
import makeTranslater from "../translate";
import {
	Well,
	Pagination,
} from '@sketchpixy/rubix';

const viewName = 'careers';
@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view[viewName]
}))
export default class Careers extends React.Component {
	static fetchData(store) {
		return store.dispatch(
			actions.careers.init(store.getState(), 1)
		);
	}

	handlePageChange = event => {
		this.props.dispatch(
			actions.careers.init(this.props, event)
		)
	}

	render() {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
			<div id='front2'>
				<Header />
				<BannerSimple title='Careers' image='/imgs/home/register-icon.png'/>
				<div className='career-content-sec'>		
					<div className='container'>
						<div className='careers-box'>
							{
								this.props.loading ? <Loading />:
								this.props.items.map(item => 
									<div key={item.id} className='vacancies row'>
										<div className='col-md-2'>
											<div className='career-thumb'>
											 <img className='img-responsive img-circle'
												src={item.hospital.hospital_logo ? imageUrl+'/'+item.hospital.hospital_logo:'/imgs/noimage.png'}/>
											</div>
										</div>
										<div className='col-md-8 border-right'>
											<div className='title'>
												<Link to={'/careers/detail/'+item.id}>
													{item.jobdetails[0].title}
												</Link>
											</div>
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
											<div className='description'>{item.jobdetails[0].description}</div>
										</div>
										<div className='col-md-2'>
											<Link className='apply-now' to={'/careers/apply/'+item.id}>{__('APPLY NOW')}</Link>
										</div>
									</div>
								)
							}	
						</div>
						{
							!this.props.loading && this.props.pageInfo.pageCount > 1 &&
							<div className='pagination-sec'>
								<Pagination
									prev
									next
									first
									last
									ellipsis
									boundaryLinks
									activePage={this.props.pageInfo.page}
									items={this.props.pageInfo.pageCount}
									maxButtons={4}
									onSelect={this.handlePageChange}
								/>							
							</div>
						}
						{
							this.props.items.length === 0 &&
							<Well className='text-center'>{__('No record Found.')}</Well>
						}	
					</div>
				</div>		
				<Footer/>
			</div>
		);
	}
}