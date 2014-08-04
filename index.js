#! /usr/bin/env node
var s2 = require('s2'),
	argv = require('minimist')(process.argv.slice(2)),
	fc = require('turf-featurecollection'),
	geocolor = require('geocolor'),
	center = require('turf-center'),
	linestring = require('turf-linestring'),
	fs = require('fs'),
	cover = require('geojson-cover')

if(argv.h || argv.help){
	help();
}
else{
	var geojson = JSON.parse(fs.readFileSync(argv._[0]));
	var cells = cover.geometryGeoJSON(geojson);

	//sort cells by alphanumeric token
	cells.features.sort(function(a,b){
		return b-a;
	})
	//rank cells
	for(var i=0;i<cells.features.length;i++){
		cells.features[i].properties.rank = i+1
	}
	if(argv.c || argv.color){
		//color cells
		var cells = geocolor.jenks(cells, 'rank', 50, ['white', 'purple'], 
			{'fill-opacity':.5, 'stroke-width':1})
	}

	if(argv.l || argv.line){
		//calculate hilburt curve by creating a linestring with vertices from the center of each cell in order
		var hilburt = fc([linestring([])]);
		cells.features.forEach(function(cell){
			hilburt.features[0].geometry.coordinates.push(center(cell).geometry.coordinates);
		})
		hilburt.features[0].properties = {};
		hilburt = geocolor.all(hilburt, {'stroke':'red'});

		//concat the cells with the curve
		cells.features = cells.features.concat(hilburt.features);
	}

	console.log(JSON.stringify(cells));
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

	console.log(h);
}