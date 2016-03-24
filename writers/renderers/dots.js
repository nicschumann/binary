"use strict";

module.exports = {
	before: function() {

	},
	render: function( point, context, size ) {

		context.beginPath();

		context.arc( 
			point.x(), 
			point.y(),
			size / 2, 
			0,
			2 * Math.PI,
			false
		);

		context.fillStyle = point.toColorString();
		context.fill();
		context.closePath();
		
	},
	after: function( context ) {

	}
};