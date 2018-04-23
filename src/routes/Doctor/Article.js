import React from 'react';
import ReactDOM from 'react-dom';

import {connect} from 'react-redux';
import actions from '../../redux/actions';
import Pagination from '../../components/Pagination';
import Loading from '../../components/Loading';
import Select from '../../components/Select';
import makeTranslater from '../../translate';
import {makeApiData} from '../../api';
import {imageUrl} from '../../../api/config';
import {getClaimStatusLabel, getVerificationStatusLabel, text_truncate, getSalutation, getStatusLabel} from '../../utils';
import Editor from '../../components/TextEditor';
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
	FormGroup,
	ControlLabel,
	InputGroup,
	FormControl,
	Checkbox,
	HelpBlock,
	PanelTabContainer,
	Modal,
	ButtonGroup,
	BPanel,
	Label
} from '@sketchpixy/rubix';

import url from 'url';

const viewName = 'doctor_article';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.doctor_article
}))


export default class DoctorArticle extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			displayModal: false,
			displayViewModal: false,
			modalViewData: null
		}

		this.handleDataUpdate = event => {
			let value;
			if (event.target.type === 'checkbox')
				value = event.target.checked;
			else
				value = event.target.value;
			this.updateData(event.target.name, value);
		}

		this.publish = (event) => { 
			this.props.dispatch({type: 'SHOW_MODAL', modal: 'displayPublishArticleModal'})
		}

		this.closeModal = (event) => { 
			this.props.dispatch({type: 'CLOSE_MODAL'})
		}

		this.viewDetail = event => {
			let id = event.target.getAttribute('data-id'), modalData;
			this.props.articles.filter((item) => {if(item.id === parseInt(id)) modalData = item; })

			this.setState({modalViewData: modalData})

			this.props.dispatch({type: 'SHOW_MODAL', modal: 'displayViewDetailModal'})
		}

		this.editDetail = event => {
			let id = event.target.getAttribute('data-id');
			this.props.dispatch(actions.doctor_article.edit(this.props, id))
		}
	}

	static fetchData(store) {
		return store.dispatch(
			actions.doctor_article.init(
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
			case 'DATA_FORM':
				content = this.renderAdd(__);
				break;
			default:
				content = this.renderList(__);
		}

		return (
			<Row>
				<Col xs={12} >
					<PanelContainer controls={false} className="overflow-visible article-list-box">
						<Panel>
							<PanelHeader className='bg-green'>
								<Grid>
									<Row>
										<Col xs={12} sm={8} className='fg-white'>
											<h3>{__('Article List')}</h3>
										</Col>
										<Col xs={12} sm={4}>
											<h3 className="text-right">
												{this.props.viewState === 'LIST' &&
												<Button
													inverse
													outlined													
													bsStyle='default'
													onClick={::this.startAdd}
												>
													{__('Write new article')}
												</Button>}
												{this.props.viewState === 'DATA_FORM' &&
												<Button
													inverse
													outlined
													style={{marginBottom: 5}}
													bsStyle='default'
													onClick={::this.viewList}
												>
													{__('View List')}
												</Button>}
											</h3>
										</Col>
									</Row>
								</Grid>
							</PanelHeader>
							<PanelBody>
								<Grid className='dash-article-list'>
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
			<Row key="article-list">
				<Col xs={12} className='no-padding'>
					<div>
						{this.props.articles.map(this.getDataRow, this)}
						{this.props.articles.length === 0 && this.getNoDataRow(__)}
					</div>
				</Col>
				<Col xs={12} className='no-padding'>
					<br/>
					<Pagination
						data={this.props.pageInfo}
						onSelect={::this.changePage}
					/>
				</Col>
				<ArticleModalViewData 
					isVisible={this.props.modalActivity.displayViewDetailModal} 
					closeModal={this.closeModal} 
					data={this.state.modalViewData}
				/>
			</Row>
		);
	}

	getDataRow(item, index) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);

		let serialNo = (this.props.pageInfo.pageLimit * (this.props.pageInfo.currentPage - 1));
		let getArticleTags = item.article_tags.split(","), viewarticletags = [];
		this.props.helperData.article_tags.filter((item) => {
			if(getArticleTags.indexOf(item.value.toString()) !== -1) viewarticletags.push(item.label)
		})
		return (
			<BPanel key={index}>
				<Row>
					<Col sm={2}><img  src={imageUrl+'/'+item.article_image} alt={item.article_image}/></Col>
					<Col sm={10} style={{paddingLeft: '0px'}}>
						<Row>
						    <Col sm={9} className="article-likes-status" >
						    	{
						    		item.is_active == 0 && item.status == 1 ? 
						    		<Label bsStyle='danger'>{__('Inactive by Admin')}</Label> :
						    		__(::this.getStatusIcon(item.status))	
						    	}&nbsp;&nbsp;
								<div key='article-like' className='article-like-sec'>
									<div className='article-like'>
                						{moment(item.createdAt).format("DD/MM/YYYY")}
              						</div>  
									{
										item.status === 1 && item.is_active === 1 && 
								       	<div className='article-like'>
                    						<Icon glyph='icon-nargela-heart'/><span>{item.total_likes}</span>
                  						</div>
									}
								</div>
							</Col>
							<Col sm={3} className='text-right'>
						<div className="article-btns">
							<Button bsStyle="primary" outlined onClick={this.viewDetail} data-id={item.id}>{__('View')}</Button>
                            {
								item.status === 3 && 
								<Button bsStyle="primary" outlined onClick={this.editDetail} data-id={item.id} title={__('Edit')}>{__('Edit')}</Button>
							}
						</div>
					</Col>
							<Col sm={12}>
								<h3>{item.articledetails[0].title}</h3>								
							</Col>							
							<Col sm={12}>
								<div dangerouslySetInnerHTML={{__html: text_truncate(item.articledetails[0].body.replace(/<[^>]+>/g, ''), 500)}}></div>
							</Col>
							<Col sm={12}>
								
								    <div className='article-tags'>
									<Col sm={2}><strong>{__('Article Tags')}</strong></Col>
									<Col sm={7} style={{paddingLeft: '0px'}}>
										{
											viewarticletags.map((aitem, aindex) => 
												<Label style={{margin: '2px'}} key={'article-tag-'+aindex} bsStyle='primary'>{aitem}</Label>
											)
										}
									</Col>
									</div>	
							</Col>
							
						</Row>
					</Col>
				</Row>				
			</BPanel>
		);
	}

	getNoDataRow(__) {
		return (
			<p className='text-center'>{__('No data found')}</p>
		)
	}

	renderAdd(__) {
		return (
			<Grid>
				<Row>
					<Col sm={12}>
						<Form className='doctor-article-form' horizontal>
							<FormGroup controlId='title'>
								<Col sm={2} componentClass={ControlLabel}>{__('Title')}</Col>
	                  			<Col sm={10}>
	                  				<FormControl type='text' name='article_details[title]' placeholder={__('Enter title')} onChange={this.handleDataUpdate} value={this.props.modelData['article_details[title]']}/>
	                  				<span className='text-danger'>{this.props.errors.title}</span>
	                  			</Col>
	                    	</FormGroup>
							<FormGroup controlId="article_tags">
								<Col sm={2} componentClass={ControlLabel}>{__('Article tags')}</Col>
			                    <Col sm={10}>
				                    <Select
				                        multi
				                        name='article_tags'
				                        onChange={this.handleDataUpdate}
				                        value={this.props.modelData.article_tags}
				                        options={this.props.helperData.article_tags}/>
				                    <span className='text-danger'>{this.props.errors.article_tags}</span>
				                </Col>
			                </FormGroup>
							<FormGroup controlId="body">
								<Col sm={2} componentClass={ControlLabel}>{__('Article body')}</Col>
								<Col sm={10}>
			                    	<Editor
			                    		name='article_details[body]'
			                    		onChange={this.handleDataUpdate}
			                    		value={this.props.modelData['article_details[body]']}/>
			                    	<span className='text-danger'>{this.props.errors.body}</span>
			                    </Col>
			                </FormGroup>
							<FormGroup controlId="article_image">
								<Col sm={2} componentClass={ControlLabel}>{__('Article image')}</Col>
								<Col sm={4}>
		                      		<FormControl type="file" name="article_image"/>
		                      		<span className='text-danger'>{this.props.errors.article_image}</span>
		                      	</Col>
		                      	{
		                      		this.props.modelData.id != '' && 
		                      		<Col sm={3}>
			                      		<img src={imageUrl+'/'+this.props.modelData.article_image} style={{height: '50px'}}/>
			                      	</Col>
		                      	}
		                    </FormGroup>
						</Form>
					</Col>
				</Row>
				<Row>
					<Col sm={2}></Col>
					<Col sm={10}>
						<div>
							<ButtonGroup>
	                      		<Button outlined bsStyle='lightgreen' style={{width: '33%'}} onClick={::this.save} data-action-index={3}>{__('Save')}</Button>
	                      		<Button outlined bsStyle='lightgreen' style={{width: '33%'}} onClick={this.publish} disabled={!this.props.modelData['article_details[title]'] || !this.props.modelData['article_details[body]']}>{__('Publish')} </Button>
	                      		<Button outlined bsStyle='lightgreen' style={{width: '33%'}} onClick={::this.viewList}>{__('Cancel')} </Button>
	                    	</ButtonGroup>
	                    </div><br/>
					</Col>
				</Row>
				<ArticleModalView 
					isVisible={this.props.modalActivity.displayPublishArticleModal} 
					closeModal={this.closeModal} 
					header={this.props.modelData['article_details[title]']} 
					body={this.props.modelData['article_details[body]']}
					publish={::this.save}
					__={__}
				/>
			</Grid>
		);
	}

	getStatusIcon(status) {
		switch(status) {
			case 0:
				return <Label bsStyle='warning' style={{height: '20px'}}>Pending</Label>;
			case 1:
				return <Label bsStyle='success' style={{height: '20px'}}>Live</Label>;
			case 2:
				return <Label bsStyle='danger'>Rejected</Label>;
			case 3:
				return <Label bsStyle='info'>In Draft</Label>;
			case -1:
				return 'icon-fontello-spin4';
		}
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

	makeFilter(name) {
		let dispatch = this.props.dispatch;
		return event => {
			dispatch({
				type: 'UPDATE_FILTER',
				name,
				value: event.target.value
			});
		}
	}

	updateData(name, value) {
		this.props.dispatch({
			type: 'UPDATE_DATA_VALUE',
			name,
			value
		});
	}

	startAdd() {
		this.props.dispatch(actions.doctor_article.startAdd(this.props));
	}

	viewList() {
		this.props.dispatch(actions.doctor_article.viewList())
	}

	edit(itemId) {
		this.props.dispatch(actions.doctor_article.edit(this.props, itemId));
	}

	changeStatus(itemId, status) {
		this.props.dispatch(
			actions.doctor_article.changeStatus(
				this.props,
				itemId,
				status
			)
		)
	}

	save(event) {
		this.props.dispatch(
			actions.doctor_article.save(this.props, new FormData(ReactDOM.findDOMNode(this).querySelector('.doctor-article-form')), event.target.getAttribute('data-action-index'))
		);
	}
}

@connect(state => ({
	translations: state.translations,
	lang: state.lang
}))
class ArticleModalView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {isDisableContinueBtn: false}
	}
	render() {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		return (
  			<Modal show={this.props.isVisible} onHide={this.props.closeModal} bsSize="large">
		        <Modal.Header closeButton>
		          	<Modal.Title>{this.props.header}</Modal.Title>
		        </Modal.Header>
		        <Modal.Body>
		          	<Row>
		          		<Col sm={12}>
		          			<div dangerouslySetInnerHTML={{__html: this.props.body}} />
		          		</Col>
		          	</Row>
		        </Modal.Body>
		        <Modal.Footer>
		        	<Row>
		        		<Col sm={12} className='text-left'>
		        			<Checkbox defaultChecked={true} onChange={ev => this.setState({isDisableContinueBtn: !ev.target.checked})}>{__('I agree to the "Terms & Condition" for publishing the Article')}</Checkbox>
		        		</Col>
		        	</Row>
		        	<Button bsStyle='primary' disabled={this.state.isDisableContinueBtn} data-action-index={0} onClick={this.props.publish}>{__('Continue')}</Button>
		        </Modal.Footer>
		    </Modal>	
  		)
  	}
}

class ArticleModalViewData extends React.Component {
	render() {
		let data = this.props.data;
		if(data) {
			return (
	  			<Modal show={this.props.isVisible} onHide={this.props.closeModal} bsSize="large">
			        <Modal.Header closeButton>
			          	<Modal.Title>{data.articledetails[0].title}</Modal.Title>
			        </Modal.Header>
			        <Modal.Body>
			          	<Row>
			          		<Col sm={12}>
			          			<img src={imageUrl+'/'+data.article_image} style={{maxHeight: '200px', float: 'left', marginRight: '15px', marginBottom: '12px'}} />
			          			<div dangerouslySetInnerHTML={{__html: data.articledetails[0].body}} />
			          		</Col>
			          	</Row>
			        </Modal.Body>
			    </Modal>	
	  		)
		} else {
			return(null)
		}
  	}
}
