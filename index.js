var s2 = require('s2'),
	argv = require('minimist')(process.argv.slice(2)),
	fc = require('turf-featurecollection'),
	geocolor = require('geocolor'),
	center = require('turf-center'),
	linestring = require('turf-linestring'),
	fs = require('fs')

if(argv.h || argv.help){
	help();
}
else{
	var ll;
	var geojson = fs.readFileSync(argv._[0]);

	if(geojson.type === 'Point'){
        ll = new s2.S2LatLng(geojson.coordinates[0], 
                        geojson.coordinates[1]);
    }
    else if(geojson.type === 'LineString'){
        ll = geojson.coordinates.map(function(p) {
                return (new s2.S2LatLng(p[0], p[1])).normalized().toPoint();
            });
    }
    else if(geojson.type === 'Polygon'){
        ll = geojson.coordinates[0].map(function(p) {
                return (new s2.S2LatLng(p[0], p[1])).normalized().toPoint();
            });
    }

	//create a bounding box to be covered
	if(!ll){
		ll = new s2.S2LatLngRect(new s2.S2LatLng(22.500496, -126.562500), new s2.S2LatLng(47.544554, -65.039063));
	}

	//compute cover
	var llcover = s2.getCover(ll, {
	    max_cells: 300,
	    min:1,
	    max:8
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
		return b-a
	})
	//rank cells
	for(var i=0;i<cells.features.length;i++){
		cells.features[i].properties.rank = i+1
	}
	if(argv.c || argv.color){
		//color cells
		var cells = geocolor.jenks(cells, 'rank', 100, ['white', 'purple'], 
			{'fill-opacity':.5, 'stroke-width':1})
	}

	if(argv.l || argv.line){
		//calculate hilburt curve by creating a linestring with vertices from the center of each cell in order
		var hilburt = fc([linestring([])])
		cells.features.forEach(function(cell){
			hilburt.features[0].geometry.coordinates.push(center(cell).geometry.coordinates)
		})
		hilburt.features[0].properties = {}
		hilburt = geocolor.all(hilburt, {'stroke':'red'})

		//concat the cells with the curve
		cells.features = cells.features.concat(hilburt.features)
	}

	console.log(JSON.stringify(cells))
}

function help(){
	var h = ''

	h+='\ns2cover\n'
	h+='===\n\n'
	h+='-h --help : show options and usage\n'
	h+='-l --line : draw a hilburt curve throught the cells by index order\n'
	h+='-c --color color the cells from white->purple by index order\n\n'
	h+='example: s2cover myFile.geojson\n'
	h+='\n\n\x1B[1m\x1B[31m           \\\n'
	h+='         /\\/\n'
	h+='        /   /\\\n'
	h+='        \\/\\ \\ \\\n'
	h+='      /\\  / / /\n'
	h+='     / /  \\/  \\/\\\n'
	h+='     \\ \\/\\  /\\   \\\n'
	h+='    \\/   / / / /\\\/\n'
	h+='      /\\/ / \ \\ \\\n'
	h+='      \\   \\/\\ \\/\n'
	h+='       \\/\\   \\\n'
	h+='         / /\\/\n'
	h+='         \\ \\\n'
	h+='          \\/\n'
	h+=''
	h+=''

	console.log(h)
}