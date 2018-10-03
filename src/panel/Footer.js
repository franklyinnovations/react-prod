import React from 'react';
import {connect} from 'react-redux';
import makeTranslater from '../translate';

const Footer = ({lang, translations}) => {
	let __ = makeTranslater(translations, lang.code);
	return (
		<footer id='footer'>
			{__('Copyright © {{year}} Pateast', {year: new Date().getFullYear()})}
		</footer>
	);
};

export default (connect(state => ({
	lang: state.lang,
	translations: state.translations,
}))(Footer))