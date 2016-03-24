"use strict";

var util = require('util');


var utilities 		= require('./utilities');
var through			= require('through2');
var colors 			= require('colors');
var THREE 			= require('three');

var precision 		= 1; 

module.exports = function( totalwidth, totalheight ) {

	var length = 0;

	var pts = [];

	var retStream = through.obj( function( chunk, enc, done ) {

		pts.push( new Section( chunk ) );

		length += 1;

		done();

	})
	.on('data', function() {})
	.on('end', function() {

		var uvUnitDistance = utilities.determineProjectedArea( totalwidth, totalheight, length );

		var width = Math.ceil( totalwidth / uvUnitDistance );

		var height = Math.ceil( totalheight / uvUnitDistance );

		var widthIndices = Array.apply( null, new Array( width + 1 ) ).map( function( _,i ) { return i; });

		var heightIndices = Array.apply( null, new Array( height + 1 ) ).map( function( _,i ) { return i; });

		var curves = [];

		heightIndices.forEach( function( i ) {

			var curve = [];

			widthIndices.forEach( function( j ) {

				if ( (i * width) + j < length ) {

					var slice = pts[ (i * width) + j ].getDeformation( uvUnitDistance * 10 );
					var color = pts[ (i * width) + j ].getColor();

					//process.stderr.write( util.inspect( slice ) );
					
					curve.push({

						vector: new THREE.Vector3(

							j * uvUnitDistance, 
							i * uvUnitDistance,
							0 + slice.z + slice.x + slice.y

						), 
						color: color 

					});


				} else {

					curve.push({

						vector: new THREE.Vector3(

							j * uvUnitDistance, 
							i * uvUnitDistance,
							0

						), 
						color: 0x000000 

					});

				}

			});

			curves.push( curve );

		});

		var scene = new THREE.Scene();

		var surface = new THREE.ParametricGeometry(
			function( u,v ) {
				//process.stderr.write( util.inspect(v) + " --> " + util.inspect( utilities.linearMap([0,1],[0,height])(v) ) + '\n' );
				//process.stderr.write( util.inspect(u) + " --> " + util.inspect( utilities.linearMap([0,1],[0,width])(u) ) + '\n\n' );

				
				

				return curves
					[ Math.round( utilities.linearMap([0,1],[0,height])( v ) ) ]
					[ Math.round( utilities.linearMap([0,1],[0,width])( u ) ) ].vector;
			},
			width, // this parameter varies inside, and corresponds to u
			height // this one varies outside, and corresponds to v.
		);

		var material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe:true});

		var mesh = new THREE.Mesh( surface, material );

		scene.add( mesh );

		var exporter = new THREE.STLExporter();

		process.stdout.write( exporter.parse( scene ) );

	});

	retStream.divisions = function() {
		return 6; // this is the word alignment on x86 cpus = 2^6 = 64 bits
	};

	return retStream;

};



function Section( serialized ) {

	var pt = {
		x: parseInt( serialized.slice(0,2), 16 ) / 8,			
		y: parseInt( serialized.slice(2,4), 16 ) / 8,
		z: parseInt( serialized.slice(4,6), 16 ) / 8,
	};

	this.getDeformation = function( max ) {

		var mapping = utilities.linearMap( [0,255], [0,max] );

		return {
			x: mapping( pt.x ),
			y: mapping( pt.y ),
			z: mapping( pt.z ),
		};
	};

	this.getColor = function() {
		return parseInt( [ serialized.slice(0,2), serialized.slice(2,4), parseInt( serialized.slice(4,6), 16 ) ].join(''), 16 );
	};

}
