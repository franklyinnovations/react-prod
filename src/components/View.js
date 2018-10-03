import React from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Grid from 'react-bootstrap/lib/Grid';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Icon from './Icon';

@withRouter
@connect(() => ({}))
class Search extends React.PureComponent {

	static dispalyName = 'Search';

	removeItem = event => {
		this.props.dispatch({
			type: 'REMOVE_QUERY',
			name: event.currentTarget.getAttribute('data-name'),
		});
		this.reload();
		
	};

	setItem = event => {
		this.props.dispatch({
			type: 'SET_QUERY',
			query: [this.props.items[parseInt(event.currentTarget.getAttribute('data-index'))]]
		});
		this.reload();
	};

	render () {
		if (!this.props.items || this.props.items.length === 0) return null;
		return (
			<Col xs={12} className='search'>
				<Form inline>
					{
						this.props.items.map(
							(item, index) => (
								<FormGroup key={item.name}>
									<ControlLabel>{item.label}</ControlLabel>
									<ButtonGroup>
										<Button data-index={index} onClick={this.setItem}>
											{item.valueLabel}
										</Button>
										<Button data-name={item.name} onClick={this.removeItem}>
											<Icon glyph='fa-times'/>
										</Button>
									</ButtonGroup>
								</FormGroup>
							)
						)
					}
				</Form>
			</Col>
		);
	}

	reload() {
		this.props.router.push(this.props.router.location);
	}
}

function Filters({children, search, remove}) {
	return (
		<Col xs={12} className='filters'>
			<Row>
				{
					React.Children.map(
						children,
						child => child && <Col md={3}>{child}</Col>
					)
				}
				<Col md={2}>
					<Button onClick={search} title={window.__('Search')}>
						<Icon glyph='fa-search'/>
					</Button>
					<Button onClick={remove} title={window.__('Cancel')}>
						<Icon glyph='fa-times'/>
					</Button>
				</Col>
			</Row>
		</Col>
	);
}

function Actions({children, ...props}) {
	return <Col xs={12} className='view-actions' {...props}>{children}</Col>;
}

function Action (props) {
	return <Button {...props}/>;
}


export default class View extends React.PureComponent {
	render () {
		return (
			<Grid fluid className={classnames('view', this.props.className)}>
				{
					(this.props.filters || this.props.actions || this.props.search) &&
					<Row>
						{
							this.props.filters ||
							<React.Fragment>
								{this.props.actions}
								{this.props.search && <Search items={this.props.search}/>}
							</React.Fragment>
						}
					</Row>	
				}
				{this.props.children}
			</Grid>
		);
	}

	static Action = Action;
	static Actions = Actions;
	static Filters = Filters;
}
