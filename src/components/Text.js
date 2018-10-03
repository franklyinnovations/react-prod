import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {rawTranslate} from '../translate';
import {recordIncompleteTranslations} from '../config';

class Text extends React.PureComponent {

	static dispalyName = 'Text';


	static propTypes = {
		children: PropTypes.string.isRequired,
	};

	static getDerivedStateFromProps(props) {
		let {children: str, code, translations} = props;
		if (recordIncompleteTranslations && typeof window !== 'undefined') {
			localStorage.setItem('trd-' + code + '-' +  str, code === 'en' ? (translations[str] || str) : '');
		}
		return null;
	}

	state = {};

	render () {
		return rawTranslate(
			this.props.translations[this.props.children] || this.props.children,
			this.props.options, '[[', ']]'
		);
	}
}

export default connect((state) => ({
	code: state.lang.code,
	translations: state.translations[state.lang.code] || {}
}))(Text);