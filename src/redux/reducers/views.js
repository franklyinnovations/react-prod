const views = {};

export function addView(name, reducer) {
	views[name] = reducer;
}

export default views;
