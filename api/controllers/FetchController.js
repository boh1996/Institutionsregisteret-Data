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
	"Z" : "%C6",
	"%C6" : "%D8",
	"%D8" : "%C5",
	"%C5" : "",
	"1" : "9" 
};

module.exports = {
	all_list : function ( req, res ) {
		var params = req.params;

		Object.keys(ranges).forEach( function ( key ) {
			var value = ranges[key];
			AllList.get(key, value);
		} );

		//AllList.get("1", "9");

		res.send("Done");
	}
}