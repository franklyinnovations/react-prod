export default class Redirect {
	constructor(url = '/') {
		this.url = url;
	}

	toString() {
		return `Redirect(${this.url})`;
	}
}