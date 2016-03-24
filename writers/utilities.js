"use strict";

module.exports = {
	determineProjectedArea: function( width, height, length ) {

		var px = Math.ceil(Math.sqrt(length * width / height) );

		var py = Math.ceil(Math.sqrt(length * height / width) );

		var sx = ( Math.floor(px*height/width) * px < length )  ? width/Math.ceil(px*height/width) : width / px; 

		var sy = ( Math.floor(py*width/height) * py < length ) ? width / Math.ceil( width * py / height ) : height / py;

	 	return Math.max( sx,sy );

	},

	linearMap: function( dom, cod ) {
		return function( t ) {
			return ( (cod[1] - cod[0]) / (dom[1] - dom[0]) ) * ( t - dom[0]) + cod[ 0 ];
		};
	}
};