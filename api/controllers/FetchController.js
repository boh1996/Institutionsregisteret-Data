var ranges = {
	"A" : "B",
	"B" : "C",
	"C" : "D",
	"D" : "E",
	"E" : "F",
	"F" : "G",
	"G" : "H",
	"H" : "I",
	"I" : "J",
	"J" : "K",
	"K" : "L",
	"L" : "M",
	"M" : "N",
	"N" : "O",
	"O" : "P",
	"P" : "Q",
	"Q" : "R",
	"R" : "S",
	"S" : "T",
	"T" : "U",
	"U" : "V",
	"V" : "W",
	"W" : "X",
	"X" : "Y",
	"Y" : "Z",
	"Z" : "Æ",
	"Æ" : "Ø",
	"Ø" : "Å",
	"Å" : "",
	"1" : "9" 
};

module.exports = {
	all_list : function ( req, res ) {
		var params = req.params;

		Object.keys(ranges).forEach( function ( key ) {
			var value = ranges[key];
			AllList.get(key, value);
		} );

		res.send("Working on it!");
	},

	fetch_one : function ( req, res ) {
		var params = req.params;

		InstituteService.get(params.document_id);

		res.send("Done!");
	},

	fetch_start : function ( req, res ) {
		var params = req.params;

		AllList.get(params.start, params.end);

		res.send("Working on it!");
	},
}