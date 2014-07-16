var s2 = require('s2'),
fc = require('turf-featurecollection')

var ll = new s2.S2LatLngRect(new s2.S2LatLng(10, 10), new s2.S2LatLng(11, 11));

var llcover = s2.getCover(ll, {
    max_cells: 300,
    min_level:2,
    max_level:3
});

var cells = fc([])

llcover.forEach(function(cover){
	//console.log(cover.id().toToken())
	//console.log(Object.prototype.toString.call(cover))
	//console.log(cover.toGeoJSON())
})

cells.features = llcover.map(function(cover){
	return {
		type: 'Feature',
		geometry: cover.toGeoJSON(),
		properties: {
			id: cover.id().toToken()
		}
	}
})

console.log(JSON.stringify(cells))