var s2 = require('s2'),
	fc = require('turf-featurecollection'),
	geocolor = require('geocolor')
	center = require('turf-center')
	linestring = require('turf-linestring')

//create a bounding box to be covered
var ll = new s2.S2LatLngRect(new s2.S2LatLng(10, 10), new s2.S2LatLng(11, 11));

//compute cover
var llcover = s2.getCover(ll, {
    max_cells: 30,
    min:12,
    max:2
});

//convert cover to geojson
var cells = fc([])
cells.features = llcover.map(function(cover){
	return {
		type: 'Feature',
		geometry: cover.toGeoJSON(),
		properties: {
			id: cover.id().toToken()
		}
	}
})
//sort cells by alphanumeric token
cells.features.sort(function(a,b){
	return a>b
})
//rank cells
for(var i=0;i<cells.features.length;i++){
	cells.features[i].properties.rank = i+1
}
//color cells
var coloredCells = geocolor.jenks(cells, 'rank', 100, ['white', 'blue'])

//calculate hilbut curve by creating a linestring with vertices from the center of each cell in order
var hilburt = fc([linestring([])])
coloredCells.features.forEach(function(cell){
	hilburt.features[0].geometry.coordinates.push(center(cell).geometry.coordinates)
})

//concat the cells with the curve
coloredCells.features = coloredCells.features.concat(hilburt.features)

console.log(JSON.stringify(coloredCells))