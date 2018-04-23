const fs = require('fs'),
path = require('path');

const ssl_options = false;

const host = '192.168.100.179';
const port = 8080;
const ssl_port = 8081;
const wp_port = 8079;
const apiUrl = 'http://192.168.100.179:3555';

const clientId = 'demo';
const clientSecret = 'demo';
const basicAuth = "Basic " + Buffer.from(clientId + ':' + clientSecret).toString('base64');

const imageUrl ='http://192.168.100.179/wikicare-service';

process.on('unhandledRejection', err => console.error(err));
module.exports = {
	host,
	port,
	wp_port,
	ssl_port,
	apiUrl,

	clientId,
	clientSecret,
	basicAuth,

	ssl_options,

	imageUrl
};