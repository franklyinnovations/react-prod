import React from 'react';
import {connect} from 'react-redux';

import actions from '../redux/actions';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import Select from '../components/Select';

import makeTranslater from '../translate';
import {makeApiData} from '../api';
import {getStatusLabel, getTagTypes,getTagType} from '../utils';

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
} from '@sketchpixy/rubix';

import url from 'url';

/*tag*/
const viewName = 'tag';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.tag
}))
export default class Tag extends React.Component{
	constructor(props) {
		super(props);

		this.handleDataUpdate = event =>{
			let value;
			value = event.target.value;
			this.updateData(event.target.name, value);
		}
		this.handleDataTag = event =>{
			let value;
			value = event.target.value;
			this.handleDataTag(event.target.name, value);
		}

		this.handleEdit = event =>{
			this.edit(event.target.getAttribute('data-item-id'));
		}
		this.handleState = event => {
			this.changeStatus(
					event.target.getAttribute('data-item-id'),
					event.target.getAttribute('data-item-status') === '1' ? '0' : '1',
					)
			};
		this.state={
	      options : []
	  }

	}
	async componentWillMount(){
	  var options = await getTagType(this.props);
	  this.setState({options : options})
	}
	static fetchData(store){
		return store.dispatch(
			actions.tag.init(
				store.getState()
			)
		)
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
				<Col xs={12}>
					<PanelContainer controls={false} className="overflow-visible">
						<Panel>
							<PanelHeader className='bg-green'>
								<Grid>
									<Row>
										<Col xs={4} md={10} className='fg-white'>
											<h3>{__('Tag List')}</h3>
										</Col>
										<Col xs={8} md={2}>
											<h3>
												{this.props.viewState === 'LIST' &&
												<Button
													inverse
													outlined
													style={{marginBottom: 5}}
													bsStyle='default'
													onClick={::this.startAddNew}
												>
													{__('Add New')}
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
			<Row key="section-list">
				<Col xs={12}>
					<Table condensed striped>
						<thead>
							<tr>
								<th>{__('S No.')}</th>
								<th>{__('Title')}</th>
								<th>{__('Type')}</th>
								<th>{__('Status')}</th>
								<th>{__('Actions')}</th>
							</tr>
							<tr>
								<th></th>
								<th>
									<FormControl
										type='text'
										onChange={this.makeFilter('tagdetail__title')}
										value={this.props.filter.tagdetail__title || ''}
										placeholder={__('Search by title.')}
									/>
								</th>
								<th>

									<Select
										name="tag__tagtypeId__eq"
										onChange={this.makeFilter('tag__tagtypeId__eq')}
										value={this.props.filter.tag__tagtypeId__eq || ''}
										options={this.state.options}
										style={{borderRadius: '0px'}}
									/>
								</th>
								<th>
									<FormControl
									componentClass="select"
									placeholder="select"
									onChange={this.makeFilter('tag__is_active')}
									value={this.props.filter.tag__is_active || ''}
									>
									<option value=''>{__('All')}</option>
									<option value='1'>{__('Active')}</option>
									<option value='0'>{__('Inactive')}</option>
									</FormControl>
            					 </th>
								<th>
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
								</th>
							</tr>
						</thead>
						<tbody>
						{this.props.tags.map(this.getDataRow, this)}
						{this.props.tags.length === 0 && this.getNoDataRow(__)}
						</tbody>
					</Table>
				</Col>
				<Col xs={12}>
					<Pagination
						data={this.props.pageInfo}
						onSelect={::this.changePage}/>
				</Col>
			</Row>
		);
	}

	renderAdd(__) {
		return (
			<Row>
				<Col xs={12} md={8} lg={6}>
					<Form>
						<FormGroup
							controlId='title'
							validationState={this.props.errors.title ? 'error': null}
						>
							<ControlLabel>{__('Title')}</ControlLabel>
							<FormControl
								type='text'
								placeholder={__('Title')}
								value={this.props.tag.title}
								name='title'
									onChange={this.handleDataUpdate}
							/>
							<HelpBlock>{this.props.errors.title}</HelpBlock>
						</FormGroup>
						<FormGroup
							controlId='description'
							validationState={this.props.errors.description ? 'error': null}
						>
							<ControlLabel>{__('Description')}</ControlLabel>
							<FormControl
								componentClass='textarea'
								rows='3'
								type='textarea'
								placeholder={__('Description')}
								value={this.props.tag.description}
								name='description'
								onChange={this.handleDataUpdate}
							/>
							<HelpBlock>{this.props.errors.description}</HelpBlock>
						</FormGroup>
						<FormGroup
							controlId='tagtypeId'
							validationState={this.props.errors.tagtypeId ? 'error': null}
						>
							<ControlLabel>{__('Type')}</ControlLabel>
							<Select
								name="tagtypeId"
								resetValue={''}
								onChange={this.handleDataUpdate}
								value={this.props.tag.tagtypeId}
								options={this.state.options}
								disabled={!!this.props.tag.id}
							/>
							<HelpBlock>{this.props.errors.tagtypeId}</HelpBlock>
						</FormGroup>
					</Form>
					<Row>
						<Col xs={12}>
							<div>
								<Button
									outlined
									bsStyle='lightgreen'
									onClick={::this.viewList}
									disabled={this.props.saving}
									>
									{__('Cancel')}
								</Button>{' '}
								<Button
									outlined
									bsStyle='lightgreen'
									onClick={::this.save}
									/*disabled={this.props.saving}*/
									>
									{__('Submit')}
								</Button>
							</div>
							<br/>
						</Col>
					</Row>
				</Col>
			</Row>
		)
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

	search() {
		this.props.router.push('/admin/tag');
	}

	reset() {
		this.props.dispatch({
			type: 'RESET_FILTERS'
		});
		this.props.router.push('/admin/tag');
	}

	getDataRow(tag, index) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		let serialNo = (this.props.pageInfo.pageLimit * (this.props.pageInfo.currentPage - 1));
		return (
			<tr key={tag.id}>
				<td>{serialNo + ++index}</td>
				<td>{tag.tagdetails[0].title}</td>
				<td>{tag.tagtype.tagtypedetails[0].title}</td>
				<td>{__(getStatusLabel(tag.is_active, __))}</td>
				<td>
					<Icon
						className={'fg-brown'}
						style={{fontSize: 20}}
						glyph={'icon-simple-line-icons-note'}
						onClick={this.handleEdit}
						data-item-id={tag.id}
					/>
					<Icon
						className={tag.is_active === 1 ? 'fg-deepred': 'fg-darkgreen'}
						style={{fontSize: 20}}
						glyph={this.getStatusIcon(tag.is_active)}
						onClick={this.handleState}
						data-item-id={tag.id}
						data-item-status={tag.is_active}
   					 />
				</td>
			</tr>
		)
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
	startAddNew() {
		this.props.dispatch(actions.tag.startAdd());
	}

	viewList() {
		this.props.dispatch(actions.tag.viewList())
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

	getTagType(tagType){
		switch(tagType) {
			case 0:
				return 'Services';
			case 1:
				return 'Specializations';
			case 2:
				return 'Education Qualification';
			case 3:
				return 'Education Colleage/University';
			case 4:
				return 'Registration Council';
			case 5:
				return 'Membership Councils';
			case 6:
				return 'Chonic Diseases';
			case 7:
				return 'Article Health Intrest Topics';
			case 8:
				return 'SYMPTOMS for Doctors Clinic search';
			case 9:
				return 'Problem Type';
		}
	}


	getNoDataRow(__) {
		return (
			<tr key={0}>
				<td colSpan={4}>{__('No data found')}</td>
			</tr>
		)
	}

	updateData(name, value){
		this.props.dispatch({
			type:'UPDATE_DATA_VALUE',
			name,
			value
		});
	}

	save(){
		this.props.dispatch(
			actions.tag.save(this.props, this.props.session.id)
		);
	}

	edit(itemId) {
		this.props.dispatch(
			actions.tag.edit(this.props, itemId)
		);
	}

	changeStatus(itemId, status) {
		this.props.dispatch(
			actions.tag.changeStatus(
				this.props,
				itemId,
				status
			)
		);
	}
	handleDataTag(){

	}
}
