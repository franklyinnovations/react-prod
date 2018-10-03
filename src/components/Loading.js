import React from 'react';
import Icon from './Icon';

export default function Loading({size = 64}) {
	return (
		<div className='text-center'>
			<Icon
				glyph='fa-spinner'
				className='pateast-loader'
				style={{
					fontSize: size,
					width: size,
					height: size,
					lineHeight: size + 'px',
					padding: 0
				}}/>
		</div>
	);
}