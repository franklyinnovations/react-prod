import React from 'react';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Icon from './Icon';
import Text from './Text';

export class Actions extends React.Component {
	render() {
		return (
			<Dropdown id={this.props.id} pullRight className='table-actions'>
				<Dropdown.Toggle bsStyle='primary' bsSize='sm'>
					<Text>Actions</Text>
				</Dropdown.Toggle>
				<Dropdown.Menu>{this.props.children}</Dropdown.Menu>
			</Dropdown>
		);
	}
}

export function Action ({text, glyph, bundle, ...props}) {
	return (
		<MenuItem {...props}>
			<Icon bundle={bundle} glyph={glyph}/>
			<span>
				<Text>{text}</Text>
			</span>
		</MenuItem>
	);
}

export function NoDataRow({colSpan}) {
	return (
		<tr>
			<td colSpan={colSpan} style={{textAlign: 'center'}}>
				<Text>No Result Found</Text>
			</td>
		</tr>
	);
}

export default function DataTable ({id, children}) {
	return (
		<table id={id} className='table data-table table-condensed table-striped'>
			{children}
		</table>
	);
}

export function ActionColumnHeading() {
	return <span className='action-column-heading'><Text>Actions</Text></span>;
}

DataTable.Action = Action;
DataTable.Actions = Actions;
DataTable.NoDataRow = NoDataRow;
DataTable.ActionColumnHeading = ActionColumnHeading;