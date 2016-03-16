"use strict";

var through			= require('through2');
var colors 			= require('colors');

var max 			= 8192000;


module.exports = function() {

	var total = 0;

	return {
		divide: function( divisions ) { 
			return through( function( data, enc, done ) {
				var stream = this;

				data.toString('hex').match( new RegExp( '.{1,'+ divisions +'}', 'g' ) ).forEach( function( chunk ) {

					if ( chunk.length == divisions ) {

						stream.push( chunk );

					}

				});

				done();

			});
		},

		structure: through.obj( function( chunk, enc, done ) {

			if ( total < max ) {

				this.push( chunk.toString('binary') );
				total += chunk.length;

			}

			done();	

		})
	};

};



