import React from 'react';
import {
	Row,
	Col,
	Icon,
} from '@sketchpixy/rubix';

export default function Loading() {
	return (
		<Row>
			<Col xs={12} className='text-center'>
				<Icon
					className={'fg-darkcyan pateast-loader'}
					style={{fontSize: 64}}
					glyph={'icon-ikons-loading'}/>
			</Col>
		</Row>
	)
}