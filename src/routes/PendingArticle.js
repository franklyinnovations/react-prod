import React from 'react';
import ReactDOM from 'react-dom';

import {connect} from 'react-redux';
import actions from '../redux/actions';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import Select from '../components/Select';
import makeTranslater from '../translate';
import {makeApiData} from '../api';
import {imageUrl} from '../../api/config';
import {getClaimStatusLabel, getVerificationStatusLabel, text_truncate, getSalutation, getStatusLabel} from '../utils';
import Editor from '../components/Common/Editor'

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
	ButtonGroup
} from '@sketchpixy/rubix';

import url from 'url';

const viewName = 'pending_article';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.pending_article
}))


export default class PendingArticle extends React.Component {

	constructor(props) {
		super(props);

		this.handleDataUpdate = event => {
			let value;
			if (event.target.type === 'checkbox')
				value = event.target.checked;
			else
				value = event.target.value;
			this.updateData(event.target.name, value);
		}

		this.publish = (event) => { 
			let id = event.target.getAttribute('data-id');
			if("undefined" != typeof id && '' != id) {
				this.props.dispatch(
					actions.pending_article.handleAction(this.props, id, 'publish')
				)
			}
		}

		this.reject = (event) => { 
			let id = event.target.getAttribute('data-id');
			if("undefined" != typeof id && '' != id) {

				vex.dialog.open({
		  			message: window.__('Are you sure you want to reject ?'),
		  			buttons: [
				        $.extend({}, vex.dialog.buttons.YES, { text: 'Yes' }),
				        $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
				    ],
		  			callback: (status) => {
		  				if(status) {
		  					this.props.dispatch(
								actions.pending_article.handleAction(this.props, id, 'reject')
							)
		  				}
		  			}
				});
			}
		}

		this.closeModal = (event) => { this.props.dispatch({ type: 'CLOSE_MODAL', data: null }) }

		this.handleViewAction = event => {
			event.preventDefault();
			let index = event.target.getAttribute('data-index'), modalData;
			this.props.pending_articles.filter((item) => {if(item.id === parseInt(index)) modalData = item; })

			this.props.dispatch({ type: 'VIEW_MODAL', data: modalData });
		}
	}

	static fetchData(store) {
		return store.dispatch(
			actions.pending_article.init(
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
					<PanelContainer controls={false} className="overflow-visible">
						<Panel>
							<PanelHeader className='bg-green'>
								<Grid>
									<Row>
										<Col xs={4} md={10} className='fg-white'>
											<h3>{__('Article')}</h3>
										</Col>
										<Col xs={8} md={2}>
											
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
				<ArticleModalView 
					isVisible={this.props.modalAction.displayModal} 
					closeModal={this.closeModal}
					publish={this.publish}
					reject={this.reject}
					disableHandlers={this.props.modalAction.disableHandlers}
					data={this.props.modalAction.data}
				/>
			</Row>
		);
	}

	renderList(__) {
		return (
			<Row key="article-list">
				<Col xs={12}>
					<Table condensed striped>
						<thead>
							<tr>
								<th width={'6%'}>{__('S No.')}</th>
								<th>{__('Article Title')}</th>
								<th>{__('Article Tags')}</th>
								<th>{__('Author Name')}</th>
								<th>{__('Actions')}</th>
							</tr>
						</thead>
						<tbody>
							{this.props.pending_articles.map(this.getDataRow, this)}
							{this.props.pending_articles.length === 0 && this.getNoDataRow(__)}
						</tbody>
					</Table>
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

		let getArticleTags = item.article_tags.split(","), viewarticletags = [];
		this.props.helperData.article_tags.filter((item) => {
			if(getArticleTags.indexOf(item.value.toString()) !== -1) viewarticletags.push(item.label)
		})

		let serialNo = (this.props.pageInfo.pageLimit * (this.props.pageInfo.currentPage - 1));
		return (
			<tr key={item.id}>
				<td>{serialNo + ++index}</td>
				<td>{text_truncate(item.articledetails[0].title, 50)}</td>
				<td>{viewarticletags.join(" , ")}</td>
				<td>{item.doctorprofile.doctorprofiledetails[0].name}</td>
				<td>
					<div>
					<Icon
						className={'fg-darkcyan'}
						style={{fontSize: 20}}
						glyph={'icon-fontello-publish'}
						title={__('View & Publish')}
						data-index={item.id}
						onClick={this.handleViewAction}
					/>
					<Icon
						className={'fg-red'}
						style={{fontSize: 20}}
						title={__('Reject')}
						data-id={item.id}
						glyph={'icon-feather-circle-cross'}
						onClick={this.reject}
					/>
					</div>
				</td>
			</tr>
		);
	}

	getStatusIcon(status) {
		switch(status) {
			case 0:
				return 'icon-simple-line-icons-check';
			case 1:
				return 'icon-simple-line-icons-close';
			case -1:
				return 'icon-fontello-spin4';
		}
	}

	getNoDataRow(__) {
		return (
			<tr key={0}>
				<td colSpan={5} className='text-center'>{__('No data found')}</td>
			</tr>
		)
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

	search() {
		this.props.router.push('/admin/article');
	}

	reset() {
		this.props.dispatch({
			type: 'RESET_FILTERS'
		});
		this.props.router.push('/admin/doctors');
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

	handleEditorChange(name, value) {
		this.props.dispatch({
			type: 'UPDATE_DATA_VALUE',
			name,
			value
		});
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
	render() {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		let data = this.props.data;
		if(data) {
			return (
	  			<Modal show={this.props.isVisible} onHide={this.props.closeModal} bsSize="large">
			        <Modal.Header closeButton>
			        	<Modal.Title>
			        		{data ? data.articledetails[0].title : null}
			        	</Modal.Title>
			        </Modal.Header>
			        <Modal.Body>
			          	<Row>
			          		<Col sm={12}>
			          			<img src={imageUrl+'/'+data.article_image} style={{maxHeight: '200px', float: 'left', marginRight: '15px', marginBottom: '12px'}} />
			          			<div dangerouslySetInnerHTML={{__html: data ? data.articledetails[0].body : null}} />
			          		</Col>
			          	</Row>
			        </Modal.Body>
			        <Modal.Footer>
			        	{
			        		this.props.disableHandlers && 
			        		<span>{__('Processing')}...</span>
			        	}
			        	<Button bsStyle='primary' disabled={this.props.disableHandlers} data-id={data.id} onClick={this.props.publish}>{__('Publish')}</Button>
			        	<Button bsStyle='danger' disabled={this.props.disableHandlers} data-id={data.id} onClick={this.props.reject}>{__('Reject')}</Button>
			        </Modal.Footer>
			    </Modal>	
	  		);
		} else {
			return (null);
		}

  	}
}
