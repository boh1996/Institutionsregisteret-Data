function children ( res, institution ) {
	InstitutionModel.find({parent : { institute_id : institution["institute_id"]}}).exec( function ( error, children ) {
		if ( children.length > 0 ) {
			institution["children"] = {};
			children.forEach( function ( element, index ) {
				institution["children"][element.institute_id] = element;
			} );
		}

		res.json({
			'result' 		: institution.toJSON(),
			'code' 	 		: 200,
			"error"  		: null,
			'result_count'  : 1
		});
	} );
}

function findObjects ( res, query ) {
	InstitutionModel.find(query).exec( function ( error, institution ) {
		if ( error != null ) {
			console.log(error);
		}

		if ( institution.length > 0 ) {
			institution = institution.pop();

			children(res, institution);
		} else {
			res.json({
				error : 'No institution found, with that details!',
				code  : 404
			});
		}
	} );
}

module.exports = {
	object_id : function ( req, res ) {
		var params = req.params;

		findObjects(res, {id : params.object_id});
	},

	document_id : function ( req, res ) {
		var params = req.params;

		findObjects(res, {document_id : params.document_id});
	},

	institute_id : function ( req, res ) {
		var params = req.params;

		findObjects(res, {institute_id : params.institute_id});
	},

	search : function ( req, res ) {
		var query = req.query;
		var parameters = ["name", "leader.name", "address", "location.zip", "leader.position", "telephone", "email", "website", "location.city", "institute_type","location.zip_city_text","parent.name","parent.institute_id", "law_status", "document_id", "institute_id"];

		var fields = [];

		if (req.param("fields") != undefined ) {
			fields = req.param("fields").split(",");
		} else {
			fields = parameters;
		}

		if ( req.param("q") != undefined ) {
			var search = {};

			fields.forEach( function ( element, index ) {
				search[element] = "/" + req.param("q") + "/";
			} );

			console.log(search);

			/*InstitutionModel.find({ $or : search }).exec( function ( error, results ) {
				console.log(results.length);
			} );*/
		} else {
			res.json({
				error : 'Error while searching, missing query parameters!',
				code  : '400'
			});
		}
	},

	find : function ( req, res ) {
		var search = {};

		if ( req.param("q") != undefined ) {
			try {
				search = JSON.parse(req.param("q"));
			} catch ( error ) {
				res.json({
					'error' : "Invalid query!",
					'code'  : 400
				});
				return;
			} 
		} else if ( req.param("start") != undefined ) {
			if ( req.param("start") == "other" ) {
				search = { name : new RegExp('^([0-9]).*') }
			} else {
				search = {$or : [{name: new RegExp('^'+ req.param("start").toUpperCase())},{name: new RegExp('^' + req.param("start").toLowerCase())}]};
			}
		} else {
			res.json({
				'error' : "Bad request!",
				'code'  : 400
			});
		}

		if ( req.param("after") != undefined ) {
			search["id"] = {$gt : req.param("after")}
		}

		var cursor = InstitutionModel.find(search);

		if ( req.param("limit") != undefined ) {
			cursor.limit(req.param("limit"));
		}

		if ( req.param('offset') != undefined ) {
			cursor.skip(req.param('offset'));
		}

		InstitutionModel.count(search).exec( function ( error, count ) {
			if ( error != null ) {
				res.json({
					'error' : "No institutions found!",
					'code'  : 404
				});
			} else {
				cursor.exec( function ( error, results ) {
					if ( results.length > 0 ) {

						if ( error != null ) {
							console.log(error);
						}

						res.json({
							'results' 		: results,
							'code' 	  		: 200,
							'error'   		: null,
							'result_count'  : results.length,
							'record_count'  : count
						});
					} else {
						res.json({
							'error' : "No institutions found!",
							'code'  : 404
						});
					}
				} );
			}
		} );
	}
}