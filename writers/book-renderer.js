"use strict";

var fs 			= require('fs');

var through			= require('through2');
var colors 			= require('colors');

var 	Canvas 		= require('canvas'),
    	Image 		= Canvas.Image;

var utilities 		= require('./utilities');

module.exports = function( constraint, renderer, totalwidth, totalheight, pixelSize, title ) {
	if ( typeof pixelSize === "undefined" ) throw new Error('No specified pixelsize!');
	if ( typeof totalwidth === "undefined" ) throw new Error('No specified width!');
	if ( typeof totalheight === "undefined" ) throw new Error('No specified height!');

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
		

		var width = Math.ceil( totalwidth / pixelSize );

		var height = Math.ceil( totalheight / pixelSize );

		var pages = Math.ceil( length / (width * height));

		var pageIndices = Array.apply( null, new Array( pages ) ).map( function( _,i ) { return i; });

		var widthIndices = Array.apply( null, new Array( width ) ).map( function( _,i ) { return i; });

		var heightIndices = Array.apply( null, new Array( height ) ).map( function( _,i ) { return i; });



		pageIndices.forEach( function( page ) {

			var pageBase = page * width * height;

			var canvas = new Canvas( totalwidth, totalheight );

			var context = canvas.getContext('2d');

			renderer.before( context, pixelSize, 0, 0 );

			heightIndices.forEach( function( i ) {

				widthIndices.forEach( function( j ) {

					if ( pageBase + (i * width) + j < length ) {

						var pt = points[ pageBase + (i * width) + j ];

						if ( constraint( pt ) ) {

							pt.x( Math.round( j * pixelSize ) );

							pt.y( Math.round( i * pixelSize ) );

							renderer.render( pt, context, pixelSize, j, i );

						}
					}
				});

			});

			renderer.after( context );

			var output = fs.createWriteStream( title + "-" + page + ".png" );

			canvas.pngStream().pipe( output );

		});




	});

	retStream.divisions = function() {
		return 6;
	};

	return retStream;
};


function RGBPoint( serialized ) {

	if (!( this instanceof RGBPoint )) { return new RGBPoint( serialized ); }
	var self = this;

	var R = serialized.slice( 0,2 );
	var G = serialized.slice( 2,4 );
	var B = serialized.slice( 4,6 );

	var x, y;

	self.r = function() { return R; };
	self.g = function() { return G; };
	self.b = function() { return B; };

	self.x = function( newX ) {
		if ( typeof newX === "undefined" ) {
			return x;
		}

		x = newX;

		return self;
	};

	self.y = function( newY ) {
		if ( typeof newY === "undefined" ) {
			return y;
		}

		y = newY;

		return self;
	};

	self.toString = function() {
		return "R: " + R + ", G:" + G + ", B:" + B;
	};

	self.toColorString = function() {
		return '#' + self.r() + self.g() + self.b();
	};

}