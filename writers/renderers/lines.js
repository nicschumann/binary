"use strict";

var previous = {
	one: undefined
};

module.exports = {
	before: function( context, size ) {

		context.moveTo( Math.floor( size/2 ), Math.floor( size/2 ) );

		previous.one = {
			x: Math.floor( size/2 ),
			y: Math.floor( size/2 )
		};

	},
	render: function( point, context, size ) {

		context.lineTo( point.x(), point.y() );

		previous.one = {
			x: point.x(),
			y: point.y()
		};

		
	},
	after: function( context ) {

		context.lineWeight = "2";

		context.stroke();

	}
};