var s2 = require('s2'),
fc = require('turf-featurecollection'),
geocolor = require('geocolor')
center = require('turf-center')
linestring = require('turf-linestring')

var ll = new s2.S2LatLngRect(new s2.S2LatLng(10, 10), new s2.S2LatLng(11, 11));

var llcover = s2.getCover(ll, {
    max_cells: 30,
    min:12,
    max:2
});

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

cells.features.sort(function(a,b){
	return a>b
})

for(var i=0;i<cells.features.length;i++){
	cells.features[i].properties.rank = i+1
}

var coloredCells = geocolor.jenks(cells, 'rank', 100, ['white', 'blue'])


var hilburt = fc([linestring([])])
coloredCells.features.forEach(function(cell){
	hilburt.features[0].geometry.coordinates.push(center(cell).geometry.coordinates)
})

coloredCells.features = coloredCells.features.concat(hilburt.features)

console.log(JSON.stringify(coloredCells))