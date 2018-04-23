import React from 'react';
import ReactDOM from 'react-dom';

export default class TextEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state= {
			content: this.props.value || '',
		}
	}

	componentWillReceiveProps(props){
		this.setState({
			content: this.props.value
		});
	}

	textEditor = el => {
		$(ReactDOM.findDOMNode(el)).trumbowyg({
			autogrow: true,
			dir: $('html').attr('dir'),
			svgPath:'/imgs/icons.svg',
			btns: [
				['viewHTML'],
				['undo', 'redo'],
				['formatting'],
				'btnGrp-semantic',
				['superscript', 'subscript'],
				['link'],
				['insertImage'],
				'btnGrp-justify',
				'btnGrp-lists',
				['horizontalRule'],
				['removeformat'],
			]
		}).on('tbwchange tbwblur tbwpaste', () => {
			let value = $('#' + this.props.name.replace(/[\[\]]/g, '_')).html();
			this.props.onChange({
				target:{
					name: this.props.name,
					value
				}
			})
		}).trumbowyg('html', this.state.content);
	};

	render() {
		return (
			<div id={this.props.name.replace(/[\[\]]/g, '_')} ref={this.textEditor} className={this.props.className}></div>
		);
	}
}