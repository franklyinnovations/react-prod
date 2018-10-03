import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import Alert from 'react-bootstrap/lib/Alert';
import Text from './Text';


export default class TagPicker extends React.Component {
	handleTagUpate = event => {
		let id = event.target.getAttribute('data-item-id'),
			selected = this.props.selected;
		if (!selected) {
			selected = id;
		} else {
			selected = selected.split(',');
			let index = selected.indexOf(id);
			if (index === -1)
				selected.push(id);
			else
				selected.splice(index, 1);
			if (selected.length === 0)
				selected = null;
			else
				selected = selected.join(',');
		}
		this.props.onChange(selected);
	};

	render() {
		let selected = {};
		if (this.props.selected) {
			this.props.selected.split(',').forEach(tag => {
				selected[tag] = true;
			});
		}
		return (
			<Modal
				show={this.props.show}
				onHide={this.props.onHide}>
				<Modal.Header closeButton>
					<Modal.Title>
						<Text>Select Tags</Text>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{
						this.props.tags.length === 0 ?
						<Alert>
							<Text>No tags found</Text>
						</Alert> :
						<div className='tag-btn-container'>
							{
								this.props.tags.map(tag => (
									<Button
										key={tag.id}
										data-item-id={tag.id}
										onClick={this.handleTagUpate}
										title={tag.tagdetails[0].description}
										bsStyle={selected[tag.id] ? 'primary' : 'default'}>
										{tag.tagdetails[0].title}
									</Button>
								))
							}
						</div>
					}
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.props.onHide}>
						<Text>Done</Text>
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}

TagPicker.defaultProps = {
	tags: [],
	show: false,
	onChange: () => undefined,
	onHide: () => undefined,
};