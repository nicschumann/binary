"use strict";

var linearMap = require('../utilities').linearMap;

module.exports = {
	before: function() {

	},
	render: function( point, context, size, widthIndex, heightIndex, maxWidth ) {

		var x_d = linearMap([0,255],[0,size])( point.srcX() );
		var y_d = linearMap([0,255],[0,size])( point.srcY() );

		//var x_d = point.srcX();
		//var y_d = point.srcY();

		var x_s = point.x() - (x_d);
		var y_s = point.y() - (y_d);
		var x_e = point.x() + (x_d);
		var y_e = point.y() + (y_d);

		context.moveTo( x_s, y_s );

		context.lineTo( x_e, y_e );

		context.lineWeight = "4";

		context.strokeStyle = "#FF0000";



		
	},
	after: function( context ) {

		context.stroke();

	}
};