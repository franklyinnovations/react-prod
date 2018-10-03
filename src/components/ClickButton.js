import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Icon from './Icon';
import Text from './Text';

export default function ClickButton ({text, btnText, glyph, side, onClick}) {
	return (
		<div className={'click-btn ' + side}>
			<div>
				{
					side === 'left' &&
					<div>
						<img src='/imgs/admin/button-arrow.png'/>
						<div className='text-muted'><big><Text>{text}</Text></big></div>
					</div>
				}
				<Button bsStyle='primary' bsSize='large' onClick={onClick}>
					{glyph && <Icon glyph={glyph}/>}
					<Text>{btnText}</Text>
				</Button>
				{
					side === 'right' &&
					<div>
						<img src='/imgs/admin/button-arrow.png'/>
						<div className='text-muted'><big><Text>{text}</Text></big></div>
					</div>
				}
			</div>
		</div>
	);
}
