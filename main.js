var always				= function( pt ) { return true; };				
var redOrBlue 			= function( pt ) { return pt.b() === "00"; };
var green 				= function( pt ) { return pt.r() === "00" && pt.g() === "00"; };

var render 				= require('./writers/renderers/blocks');

var args 				= require('./arguments');
var linear 				= require('./readers/linear')();
var renderer 			= require('./writers/book-renderer')( always, render, args.width, args.height, args.pixels, args.title );


var encoding 			= "binary";

		// Set the encoding to a hexadecimal representation of bytes.
		// Each byte is encoded as two hexadecimal numbers, IE, a 
		// range from 0 - 255.
process	.stdin.setEncoding( encoding );

		// read input off of STDIN
process	.stdin

		// divide the input into chunks defined by the frontend we've selected
		.pipe( linear.divide( renderer.divisions() ) )

		// structure the chunks into an output structure
		.pipe( linear.structure )

		// write these output structures to an aggregate form
		.pipe( renderer );





