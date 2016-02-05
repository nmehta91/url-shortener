'use strict';

var path = process.cwd();

module.exports = function (app, passport) {

	app.get('/', function(req, res){
		res.sendFile(process.cwd() + '/public/index.html');	
	});
};
