import React from 'react';
import classnames from 'classnames';
import Loading from './Loading';

export default class TextEditor extends React.Component {

	state = {intialized: false};
	editorInput = React.createRef();

	render() {
		return (
			<React.Fragment>
				<textarea
					{...this.props}
					className={
						classnames(
							'trumbowyg-textarea',
							this.props.className,
							!this.state.intialized && 'hide'
						)
					}
					ref={this.editorInput}/>
				{!this.state.intialized && <Loading/>}
			</React.Fragment>
		);
	}

	async componentDidMount() {
		const [,{default: svgPath}] = await Promise.all([
			import('trumbowyg'),
			import('trumbowyg/dist/ui/icons.svg')
		]);

		$(this.editorInput.current).trumbowyg({
			svgPath,
		});
		this.setState({intialized: true});
	}

	componentWillUnmount() {
		if (this.state.intialized)
			$(this.editorInput.current).trumbowyg('destroy');
	}
}