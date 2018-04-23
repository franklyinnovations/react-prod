import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {Link, IndexLink} from 'react-router';
import Header from '../front/Header';
import Footer from '../front/Footer';
import BannerSimple from '../front/BannerSimple';
import actions from '../redux/actions';
import {imageUrl} from '../../api/config';
import Loading from '../components/Loading';
import makeTranslater from "../translate";

const viewName = 'careerapply';
@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view[viewName]
}))
export default class CareerApply extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			filename:''
		}
	}

	static fetchData(store, params) {
		return store.dispatch(
			actions.careerapply.init(store.getState(), params)
		);
	}

	applyNow = event =>{
		event.preventDefault();
		let data = new FormData(ReactDOM.findDOMNode(this).querySelector('form'));
		this.props.dispatch(
			actions.careerapply.applyNow(this.props, data)
		)
	};

	docfile = event => {
		if(event.target.files.length){
			this.setState({
				filename: event.target.files[0].name
			});
		} else {
			this.setState({
				filename: ''
			});
		}
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
						<div className='careers-box careerdetail-box careerapply-box'>
							{
								this.props.loading ? <Loading />:
								item ?
								<div key={item.id} className='vacancies vacancie-info'>
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
											<div className='description'>{item.jobdetails[0].description}</div>
										</div>
									</div>	
									<div className='row form-apply'>
										<div className='col-md-10'>                                   
											<form>
												<div className='form-group row'>
													<div className='label-field col-md-4'>{__('Name')}<em>*</em></div>
													<div className='input-field col-md-8'>
														<input 
															className='form-control'
															type='text'
															name='name'/>
														{
															this.props.errors.name &&
															<span style={{color: 'red'}}>{this.props.errors.name}</span>
														}
													</div>
												</div>
												<div className='form-group row'>
													<div className='label-field col-md-4'>{__('Email')}<em>*</em></div>
													<div className='input-field col-md-8'>
														<input 
															className='form-control'
															type='text'
															name='email'/>
														{
															this.props.errors.email &&
															<span style={{color: 'red'}}>{this.props.errors.email}</span>
														}
													</div>
												</div>
												<div className='form-group row'>
													<div className='label-field col-md-4'>{__('Phone Number')}<em>*</em></div>
													<div className='input-field col-md-8'>
														<input 
															className='form-control'
															type='text'
															name='mobile'/>
														{
															this.props.errors.mobile &&
															<span style={{color: 'red'}}>{this.props.errors.mobile}</span>
														}
													</div>
												</div>
												<div className='form-group row'>
													<div className='label-field col-md-4'>{__('Total Experience(In Year)')}<em>*</em></div>
													<div className='input-field col-md-8'>
														<input 
															className='form-control'
															type='text'
															name='experience'/>
														{
															this.props.errors.experience &&
															<span style={{color: 'red'}}>{this.props.errors.experience}</span>
														}
													</div>
												</div>
												<div className='form-group row'>
													<div className='label-field col-md-4'>{__('Current Location')}<em>*</em></div>
													<div className='input-field col-md-8'>
														<input 
															className='form-control'
															type='text'
															name='location'/>
														{
															this.props.errors.location &&
															<span style={{color: 'red'}}>{this.props.errors.location}</span>
														}
													</div>
												</div>
												<div className='form-group row'>
													<div className='label-field col-md-4'>{__('Upload Resume')}<em>*</em></div>
													<div className='input-field col-md-8'>
														<div className='file-input'>
															<span>{this.state.filename}</span>
															<label> {__('Choose File')}
																<input type="file" name='doc_file' id="File" onChange={this.docfile}/>
															</label> 
														</div>											    	
														<span>{__('File size should be Max. 2MB')}</span>
														{
															this.props.errors.doc_file &&
															<span style={{color: 'red', display: 'block'}}>{this.props.errors.doc_file}</span>
														}
													</div>
												</div>
												<div className='form-group row'>
													<div className='label-field col-md-4'></div>
													<div className='input-field col-md-8'>													
														<button
														onClick={this.applyNow}
														disabled={this.props.saving}>
														{this.props.saving ? __('SAVING'):__('SUBMIT')}
													</button>
													</div>
												</div>											
											</form>									
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