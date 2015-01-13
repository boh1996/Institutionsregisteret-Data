var cheerio = require('cheerio');
var request = require('request');
var datetime = require('datetimejs');
var regex = require('named-regexp').named;
var moment = require('moment');
var momenttimezone = require('moment-timezone');
var util = require('util');

module.exports = {
	construct_url : function ( start_key, end_key ) {
		if ( end_key != "" ) {
			return "http://www.service.uvm.dk/InstReg/instreg2.nsf/alfabet?OpenView&StartKey=" + start_key +  "&UntilKey=" + end_key;
		} else {
			return "http://www.service.uvm.dk/InstReg/instreg2.nsf/alfabet?OpenView&StartKey=" + start_key;
		}
	},

	get : function ( start_key, end_key ) {
		var url = this.construct_url(start_key, end_key);

		request({
			"url": url
		}, function ( error, response, body ) {
			if ( ! error && response.statusCode == 200 ) {
				AllList.parse_data(body);
			} else {
				console.log("Error, while requesting!");
			}
		});
	},

	parse_data : function ( body ) {
		$ = cheerio.load(body);

		// RegEx to match the url, to retrieve the ObjectID
		var url_regex = regex(/weballeinst\/(:<id>.*)\?Opendocument/g);
		var url = "";

		var count = 0;
	
		$("a").each( function ( index, element ) {
			element = $(element);
			if ( element.attr("href").substring(0,1) == "w" ) {
				count = count + 1;
				url = element.attr("href").trim();

				var id_match = url_regex.exec(url);
				var id = null;

				if ( id_match == null ) {
					id_match = url_regex.exec(url);
				}

				if ( id_match != null ) {
					id = id_match.capture("id");
				}

				InstituteService.get(id);
			}
		} );

		console.log(count);
	}
}