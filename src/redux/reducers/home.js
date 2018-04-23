export default function (state, action) {
	return {
		session: action.session || {}
	};
}