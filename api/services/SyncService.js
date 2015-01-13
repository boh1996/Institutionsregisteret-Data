module.exports = {
	sync : function ( query, data  ) {
		InstitutionModel.find(query).exec( function findCB( error, document ) {
			if ( document.length > 0 ) {
				InstitutionModel.update(query, data).exec( function updateCB ( err, other ) {
					if ( err != null ) {
						console.log(data);
						console.log(err);
					}
				} );
			} else {
				InstitutionModel.create(data).exec( function createCB () {});
			}
		} );
	}
}