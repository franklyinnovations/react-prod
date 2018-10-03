export function feeTypeOptions(__) {
	return [
		{
			value: 'Academics',
			label: __('Academics')
		},
		{
			value: 'Transportation',
			label: __('Transportation')
		},
		{
			value: 'Entertainment',
			label: __('Entertainment')
		},
		{
			value: 'Social activity',
			label: __('Social activity')
		},
		{
			value: 'Events',
			label: __('Events')
		},
		{
			value: 'Sports',
			label: __('Sports')
		},
		{
			value: 'Others',
			label: __('Others')
		},
	];
}

export function transportationFeeTypeOptions(__) {
	return [
		{
			value: 'lumsum',
			label: __('Lumpsum Fee'),
		},
		{
			value: 'route',
			label: __('Route Based'),
		},
		{
			value: 'stoppage',
			label: __('Stoppage Based'),
		}
	];
}

export function vehicleTypeOptions(__) {
	return [
		{
			value: 'auto',
			label: __('Auto')
		},
		{
			value: 'bus',
			label: __('Bus')
		},
		{
			value: 'van',
			label: __('Van')
		}
	];
}

export function discountTypeOptions(__) {
	return [
		{
			value: -1,
			label: __('None')
		},
		{
			value: 0,
			label: __('Percentage')
		},
		{
			value: 1,
			label: __('Fixed')
		},
	];
}

export function paymentModeOptions(__) {
	return [
		{
			value: 0,
			label: __('Cash')
		},
		{
			value: 1,
			label: __('Cheque')
		},
		{
			value: 2,
			label: __('DD')
		},
	];
}