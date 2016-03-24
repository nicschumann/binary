"use strict";

module.exports = {
	before: function() {

	},
	render: function( point, context, size ) {

		context.fillStyle = point.toColorString();

		context.fillRect( 
			point.x(), 
			point.y(),
			size, 
			size
		);

		// context.fill();
		
	},
	after: function( context ) {

	}
};