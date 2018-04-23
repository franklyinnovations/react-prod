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
	Label,
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

const viewName = 'article';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.article
}))


export default class Article extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			displayModal: false,
			modalData: null
		}

		this.closeModal = (event) => { this.setState({displayModal: false}) }

		this.handleViewAction = event => {
			event.preventDefault();
			let index = event.target.getAttribute('data-index'), modalData;
			this.props.articles.filter((item) => {if(item.id === parseInt(index)) modalData = item; })

			this.setState({displayModal: true, modalData: modalData})
		}

		this.handleState = event => {
			this.changeActiveStatus(
				event.target.getAttribute('data-item-id'),
				event.target.getAttribute('data-item-status') === '1' ? '0' : '1',
			)
		};
	}

	static fetchData(store) {
		return store.dispatch(
			actions.article.init(
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
					isVisible={this.state.displayModal} 
					closeModal={this.closeModal}
					data={this.state.modalData}
					allArticleTags={this.props.helperData.article_tags}
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
								<th>{__('Author Name')}</th>
								<th>{__('Status')}</th>
								<th>{__('Active')}</th>
								<th>{__('Likes')}</th>
								<th>{__('Actions')}</th>
							</tr>
							<tr>
								<td></td>
								<td>
									<FormControl
						             	type='text'
						             	onChange={this.makeFilter('articledetail__title')}
						             	value={this.props.filter.articledetail__title || ''}
						             	placeholder={__('Title') }
						            />
								</td>
								<td>
									<FormControl
						             	type='text'
						             	onChange={this.makeFilter('doctorprofiledetail__name')}
						             	value={this.props.filter.doctorprofiledetail__name || ''}
						             	placeholder={__('Name') }
						            />
								</td>
								<td>
									<FormControl
										componentClass="select"
										placeholder="select"
										onChange={this.makeFilter('article__status')}
										value={this.props.filter.article__status || ''}
									>
										<option value=''>{__('All')}</option>
										<option value='1'>{__('Live')}</option>
										<option value='2'>{__('Rejected')}</option>
									</FormControl>
								</td>
								<td>
									<FormControl
										componentClass="select"
										placeholder="select"
										onChange={this.makeFilter('article__is_active')}
										value={this.props.filter.article__is_active || ''}
									>
										<option value=''>{__('All')}</option>
										<option value='1'>{__('Active')}</option>
										<option value='0'>{__('Inactive')}</option>
									</FormControl>
								</td>
								<td></td>
								<td>
									<Icon
										className={'fg-darkcyan'}
										style={{fontSize: 20}}
										glyph={'icon-feather-search'}
										onClick={::this.search}
									/>
										<Icon
										className={'fg-brown'}
										style={{fontSize: 20}}
										glyph={'icon-feather-reload'}
										onClick={::this.reset}
									/>
								</td>
							</tr>
						</thead>
						<tbody>
							{this.props.articles.map(this.getDataRow, this)}
							{this.props.articles.length === 0 && this.getNoDataRow(__)}
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

		

		let serialNo = (this.props.pageInfo.pageLimit * (this.props.pageInfo.currentPage - 1));
		return (
			<tr key={item.id}>
				<td>{serialNo + ++index}</td>
				<td>{text_truncate(item.articledetails[0].title, 50)}</td>
				<td>{item.doctorprofile.doctorprofiledetails[0].name}</td>
				<td>{::this.getStatusIcon(item.status)}</td>
				<td>{__(getStatusLabel(item.is_active, __))}</td>
				<td>{item.total_likes}</td>
				<td>
					<Icon
						className={'fg-green'}
						style={{fontSize: 20}}
						glyph={'icon-ikons-view'}
						title={__('View')}
						data-index={item.id}
						data-index={item.id}
						onClick={this.handleViewAction}
					/>
					<Icon
						className={item.is_active === 1 ? 'fg-deepred': 'fg-darkgreen'}
						style={{fontSize: 20}}
						glyph={this.getActiveIcon(item.is_active)}
						onClick={this.handleState}
						data-item-id={item.id}
						title={__('Status')}
						data-item-status={item.is_active}
					/>
				</td>
			</tr>
		);
	}

	getStatusIcon(status) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		switch(status) {
			case 0:
				return <Label bsStyle='warning'>{__('Pending')}</Label>;
			case 1:
				return <Label bsStyle='success'>{__('Live')}</Label>;
			case 2:
				return <Label bsStyle='danger'>{__('Rejected')}</Label>;
			case 3:
				return <Label bsStyle='info'>{__('Draft')}</Label>;
			case -1:
				return 'icon-fontello-spin4';
		}
	}

	getActiveIcon(status) {
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
				<td colSpan={7} className='text-center'>{__('No data found')}</td>
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

	changeActiveStatus(itemId, status) {
		this.props.dispatch(
			actions.article.changeActiveStatus(
				this.props,
				itemId,
				status
			)
		)
	}

	search() {
		this.props.router.push('/admin/articles');
	}
	reset() {
		this.props.dispatch({
			type: 'RESET_FILTERS'
		});
		this.props.router.push('/admin/articles');
	}
}

class ArticleModalView extends React.Component {
	render() {
		let data = this.props.data;
		if(data) {
			let getArticleTags = data.article_tags.split(","), viewarticletags = [];
			this.props.allArticleTags.filter((item) => {
				if(getArticleTags.indexOf(item.value.toString()) !== -1) viewarticletags.push(item.label)
			})
			return (
	  			<Modal show={this.props.isVisible} onHide={this.props.closeModal} bsSize="large">
			        <Modal.Header closeButton>
			          	<Modal.Title>
			          		{data.articledetails[0].title}
			          	</Modal.Title>
			          	{
			          		viewarticletags.map((item) => 
			          			<Label bsStyle='primary' style={{marginRight: '1px'}}>{item}</Label>
			          		)	
			          	}
			        </Modal.Header>
			        <Modal.Body>
			          	<Row>
			          		<Col sm={12}>
			          			<img src={imageUrl+'/'+data.article_image} style={{maxHeight: '200px', float: 'left', marginRight: '15px', marginBottom: '12px'}} />
			          			<div dangerouslySetInnerHTML={{__html: data.articledetails[0].body}} >
			          				
			          			</div>
			          		</Col>
				          	</Row>
			        </Modal.Body>
			    </Modal>	
	  		)
	  	} else {
	  		return (null);
	  	}
  	}
}
