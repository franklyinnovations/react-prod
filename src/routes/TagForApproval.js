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
	...state.view.tag_for_approval
}))
export default class TagForApproval extends React.Component{
	constructor(props) {
		super(props);
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

		this.approve = (event) => { 
			let id = event.target.getAttribute('data-item-id');
			if("undefined" != typeof id && '' != id) {

				vex.dialog.open({
		  			message: window.__('Are you sure you want to approve this tag ?'),
		  			buttons: [
				        $.extend({}, vex.dialog.buttons.YES, { text: 'Yes' }),
				        $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
				    ],
		  			callback: (status) => {
		  				if(status) {
		  					this.props.dispatch(
								actions.tag_for_approval.approveTag(this.props, id)
							)
		  				}
		  			}
				});
			}
		}
	}

	static fetchData(store){
		return store.dispatch(
			actions.tag_for_approval.init(
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
											<h3>{__('Tag List for Approval')}</h3>
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
				<Col xs={12}>
					<Pagination
						data={this.props.pageInfo}
						onSelect={::this.changePage}
					/>
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
								<th>{__('Actions')}</th>
							</tr>
						</thead>
						<tbody>
							{this.props.tags.map(this.getDataRow, this)}
							{this.props.tags.length === 0 && this.getNoDataRow(__)}
						</tbody>
					</Table>
				</Col>
			</Row>
		);
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
				<td>
					<Icon
						className={'fg-red'}
						style={{fontSize: 20}}
						title={__('Reject')}
						data-item-id={tag.id}
						glyph={'icon-fontello-publish'}
						onClick={this.approve}
					/>
				</td>
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

	getNoDataRow(__) {
		return (
			<tr key={0}>
				<td colSpan={4} className="text-center">{__('No data found')}</td>
			</tr>
		)
	}
}
