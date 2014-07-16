var s2 = require('s2'),
fc = require('turf-featurecollection'),
geocolor = require('geocolor')

var ll = new s2.S2LatLngRect(new s2.S2LatLng(10, 10), new s2.S2LatLng(11.1, 11.1));

var llcover = s2.getCover(ll, {
    max_cells: 300,
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

var coloredCells = geocolor.jenks(cells, 'rank', 100, ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet','red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'])

console.log(JSON.stringify(coloredCells))
