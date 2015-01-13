var cheerio = require('cheerio');
var request = require('request');
var datetime = require('datetimejs');
var regex = require('named-regexp').named;
var moment = require('moment');
var momenttimezone = require('moment-timezone');
var util = require('util');
var iconv  = require('iconv-lite');

module.exports = {
	construct_url : function ( document_id ) {
		return "http://www.service.uvm.dk/InstReg/instreg2.nsf/weballeinst/" + document_id + "?Opendocument";
	},

	get : function ( document_id ) {
		var url = this.construct_url(document_id);

		request({
			"url": url,
			encoding: null
		}, function ( error, response, body ) {
			if ( ! error && response.statusCode == 200 ) {
				body = iconv.decode(new Buffer(body), "ISO-8859-1");
				InstituteService.parse_data(body, document_id);
			} else {
				console.log("Error, while requesting!");
			}
		});
	},

	parse_data : function ( body, document_id ) {
		$ = cheerio.load(body);

		var mapping = {
			"Institutionsnr." : "institute_id",
			"Navn" : "name",
			"Leder" : "leader",
			"Adresse" : "address",
			"Telefon" : "telephone",
			"E-mail" : "email",
			"Webadresse" : "website",
			"Juridisk status" : "law_status"
		}
		var documentObject = {
			"document_id" : document_id
		};
		var divideRegex = regex(/(:<first>[0-9]*) (:<second>.*)/g);

		$("table tr").each( function ( index, element ) {
			element = $(element);
			var cells = element.find("td");
			var key = $(cells[0]).html().trim();
			var value = $(cells[1]).text().trim();

			if ( mapping.hasOwnProperty(key) ) {
				if ( key == "Telefon") {
					value = value.replace(" ", "");
				}

				key = mapping[key];
				if ( $(cells[1]).find("a").length > 0 ) {
					documentObject[key] = $(cells[1]).find("a").text();
				} else {
					documentObject[key] = value;
				}
			} else if ( key == "Postnr. og by" ) {
				var matches = divideRegex.exec(value);

				if ( matches == null ) {
					matches = divideRegex.exec(value);
				}

				if ( matches != null ) {
					documentObject["zip"] = matches.capture("first");
					documentObject["city"] = matches.capture("second");
				}

				documentObject["zip_city_text"] = value;
			} else if ( key == "Afdeling til" ) {
				documentObject["parent"] = {};
				documentObject["parent"]["institute_id"] = value.substring(0,value.indexOf(" ") - 1).trim();
				documentObject["parent"]["name"] = value.substring(value.indexOf(" "), value.length).trim();
			} else if ( key == "Institutionstype" ) {
				documentObject["institute_type"] = value;

				// Add to type database
			} else if ( key.length > 0 ) {
				documentObject[key] = value;
			}
		} );

		SyncService.sync({document_id : document_id}, documentObject);
	}
}