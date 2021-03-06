module.exports = {
	sync : function ( query, data, model  ) {
		model.find(query).exec( function findCB( error, document ) {
			if ( error != null ) {
				console.log(error);
			}

			if ( document.length > 0 ) {
				document = document.pop();
				var change = false;

				Object.keys(data).forEach( function ( index ) {
					var element = data[index];
					if ( ! document.hasOwnProperty(index) ) {
						change = true;
					} else {	
						if ( document[index] != element ) {
							change = true;
						}
					}
				} );

				if ( change == true ) {
					model.update(query, data).exec( function updateCB ( err, other ) {
						if ( err != null ) {
							console.log(data);
							console.log(err);
						}
					} );
				}
			} else {
				/*console.log(data);
				model.create(data).exec( function createCB () {});*/
				model.native( function ( err, collection ) {
					collection.update(query, { "$set" : data, "$setOnInsert" : {"createdAt" : new Date(),"updatedAt" : new Date()}}, { upsert: true}, function ( err ) {
						if ( err != null ) {
							console.log(err);
						}
					});
				} );
			}
		} );
	}
}