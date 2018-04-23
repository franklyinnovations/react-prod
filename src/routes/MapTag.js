import React from 'react';
import ReactDOM from 'react-dom';

import {connect} from 'react-redux';
import actions from '../redux/actions';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import makeTranslater from '../translate';
import {makeApiData} from '../api';
import {imageUrl} from '../../api/config';
import Select from '../components/Select';
import {getClaimStatusLabel, getVerificationStatusLabel, text_truncate, getSalutation, getStatusLabel} from '../utils';

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
} from '@sketchpixy/rubix';

import url from 'url';

const viewName = 'map_tag';

@connect(state => ({
	session: state.session,
	location: state.location,
	loading: state.view.loading || false,
	translations: state.translations,
	lang: state.lang,
	...state.view.map_tag
}))


export default class MapTags extends React.Component {

	constructor(props) {
		super(props);

		this.handleDataUpdate = event => {
			this.updateData(event.target.name, event.target.value);
		}
	}

	static fetchData(store) {
		return store.dispatch(
			actions.map_tag.init(
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
				<Col xs={12}>
					<PanelContainer controls={false} className="overflow-visible">
						<Panel>
							<PanelHeader className='bg-green'>
								<Grid>
									<Row>
										<Col xs={4} md={10} className='fg-white'>
											<h3>{__('Map Tags')}</h3>
										</Col>
										<Col xs={8} md={2}>
											<h3>
												{this.props.viewState === 'LIST' &&
												<Button
													inverse
													outlined
													style={{marginBottom: 5}}
													bsStyle='default'
													onClick={::this.startAdd}
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
			<Row key="country-list">
				<Col xs={12}>
					<Table condensed striped>
						<thead>
							<tr>
								<th width={'6%'}>{__('S No.')}</th>
								<th>{__('Specialization')}</th>
								<th>{__('Problem Type')}</th>
								<th>{__('Actions')}</th>
							</tr>
						</thead>
						<tbody>
							{this.props.mapped_tags.map(this.getDataRow, this)}
							{this.props.mapped_tags.length === 0 && this.getNoDataRow(__)}
						</tbody>
					</Table>
				</Col>
			</Row>
		);
	}

	renderAdd(__) {
		return(
			<Row>
				<Col xs={12} md={12} lg={12}>
					<FormGroup controlId="specializationTagId" validationState={this.props.errors.specializationTagId ? 'error': null}>
	                    <ControlLabel>{__('Specialization')} </ControlLabel>
	                    <Select
	                        name='specializationTagId'
	                        value={this.props.addData.specializationTagId}
	                        onChange={this.handleDataUpdate}
	                        options={this.props.helperData.specializationTags}/>
	                    <HelpBlock>{this.props.errors.specializationTagId}</HelpBlock>
	                </FormGroup>
				</Col>
				<Col xs={12} md={12} lg={12}>
					<FormGroup controlId="problemtypeTagId" validationState={this.props.errors.problemtypeTagId ? 'error': null}>
	                    <ControlLabel>{__('Problem Type')} </ControlLabel>
	                    <Select
	                    	multi
	                    	name='problemtypeTagId'
	                        value={this.props.addData.problemtypeTagId}
	                        onChange={this.handleDataUpdate}
	                        options={this.props.helperData.problemtypeTags}/>
	                    <HelpBlock>{this.props.errors.problemtypeTagId}</HelpBlock>
	                </FormGroup>
				</Col>
				<Col sm={12}>
					<div>
						<Button
							outlined
							bsStyle='lightgreen'
							onClick={::this.viewList}>
							{__('Cancel')}
						</Button>{' '}
						<Button
							outlined
							bsStyle='lightgreen'
							onClick={::this.save}>
							{__('Save')}
						</Button>
					</div>
					<br/>
				</Col>
			</Row>
		)
	}

	startAdd() {
		this.props.dispatch(actions.map_tag.startAdd(this.props));
	}

	viewList() {
		this.props.dispatch(actions.map_tag.viewList())
	}

	updateData(name, value) {
		this.props.dispatch({
			type: 'UPDATE_DATA_VALUE',
			name,
			value
		});
	}

	save() {
		this.props.dispatch(
			actions.map_tag.save(this.props)
		)
	}

	getDataRow(item, index) {
		let __ = makeTranslater(
			this.props.translations,
			this.props.lang.code
		);
		let prbltypetags = this.getProblemTypeTagDetail(item.problemtypetags)
		let serialNo = (this.props.pageInfo.pageLimit * (this.props.pageInfo.currentPage - 1));
		return (
			<tr key={item.id}>
				<td>{serialNo + ++index}</td>
				<td>{item.specialization.tagdetails[0].title}</td>
				<td>{text_truncate(prbltypetags.join(" , "), 70)}</td>
				<td>
					<Icon
						className={'fg-brown'}
						style={{fontSize: 20}}
						glyph={'icon-fontello-edit'}
						onClick={::this.edit}
						data-spec-id={item.specializationTagId}
						data-prob-id={item.problemtypeTagId}
					/>
					<Icon
						className={'fg-deepred'}
						style={{fontSize: 20}}
						glyph={'icon-flatline-trash'}
						data-item-id={item.id}
						title={__('Delete')}
						onClick={::this.delete}
					/>
				</td>
			</tr>
		);
	}
	getNoDataRow(__) {
		return (
			<tr key={0}>
				<td colSpan={6} className='text-center'>{__('No data found')}</td>
			</tr>
		)
	}

	delete(event) {
		let itemId = event.target.getAttribute('data-item-id');
		vex.dialog.open({
  			message: window.__('Are you sure you want to delete ?'),
  			buttons: [
		        $.extend({}, vex.dialog.buttons.YES, { text: 'Yes' }),
		        $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
		    ],
  			callback: (status) => {
  				if(status) {
  					if(itemId) {
						this.props.dispatch(
							actions.map_tag.deletetag(this.props, itemId)
						)	
					}
  				}
  			}
		});
	}

	edit(event) {
		let editHelData = {
			specializationTagId: event.target.getAttribute('data-spec-id')
		}
		
		this.props.dispatch(
			actions.map_tag.edit(this.props, editHelData)
		)
	}

	getProblemTypeTagDetail(values) {
		if(!values) return null;
		let tagsArray = values.split(','), tagDetail = [];
		this.props.helperData.problemtypeTags.filter((item) => {
			if(tagsArray.indexOf(item.value.toString()) !== -1) {
				tagDetail.push(item.label)
			}
		})

		return tagDetail;
	}
}