"use strict";

var through			= require('through2');
var colors 			= require('colors');

var 	Canvas 		= require('canvas'),
    	Image 		= Canvas.Image;

var utilities 		= require('./utilities');

module.exports = function( totalwidth, totalheight ) {

	var points = [];
	var length = 0;

	var retStream = through.obj( function( chunk, enc, done )  {

		points.push( new RGBPoint( chunk ) );

		length += 1;

		done();
		

	})
	.on('data', function() {

	})
	.on('end', function() {

		var pixelSize = utilities.determineProjectedArea( totalwidth, totalheight, length );

		var width = Math.ceil( totalwidth / pixelSize );

		var height = Math.ceil( totalheight / pixelSize );

		var canvas = new Canvas( totalwidth, totalheight );

		var context = canvas.getContext('2d');

		var widthIndices = Array.apply( null, new Array( width ) ).map( function( _,i ) { return i; });
		var heightIndices = Array.apply( null, new Array( height ) ).map( function( _,i ) { return i; });

		heightIndices.forEach( function( i ) {

			widthIndices.forEach( function( j ) {

				if ( (i * width) + j < length ) {

					context.beginPath();
					context.arc( 
						j * pixelSize + (pixelSize / 2), 
						i * pixelSize + (pixelSize / 2),
						pixelSize / 2, 
						0,
						2 * Math.PI,
						false
					);

					context.fillStyle = points[ (i * width) + j ].toColorString();
					context.fill();
					context.closePath();

				}

			});

		});

		canvas.pngStream().pipe( process.stdout );

	});

	retStream.divisions = function() {
		return 3;
	};

	return retStream;
};


function RGBPoint( serialized ) {

	if (!( this instanceof RGBPoint )) { return new RGBPoint( serialized ); }
	var self = this;

	var R = serialized.slice( 0,2 );
	var G = serialized.slice( 2,4 );
	var B = serialized.slice( 4,6 );

	self.r = function() { return R; };
	self.g = function() { return G; };
	self.b = function() { return B; };

	self.toString = function() {
		return "R: " + R + ", G:" + G + ", B:" + B;
	};

	self.toColorString = function() {
		return '#' + self.r() + self.g() + self.b();
	};

}