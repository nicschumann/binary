var ArgumentParser = require('argparse').ArgumentParser;
var package = require('./package.json');

var defaultWidth = 1500;
var defaultPixelSize = 2;

var parser = new ArgumentParser({
	version: package.version,
	addHelp: true,
	description: package.description
});

parser.addArgument(
	['-w', '--width'],
	{
		required: false,
		type: 'int',
		help: "Specify the width in pixels of the resulting PNG snapshot",
		defaultValue: defaultWidth,
		dest: 'width'
	}
);

parser.addArgument(
	['-t', '--height'],
	{
		required: false,
		type: 'int',
		help: "Specify the height in pixels of the resulting PNG snapshot",
		defaultValue: defaultWidth,
		dest: 'height'
	}
);

parser.addArgument(
	['-p', '--pixels'],
	{
		required: false,
		type: 'int',
		help: 'Specify the size of the pixels to work with',
		defaultValue: defaultPixelSize,
		dest: 'pixels'
	}
);

parser.addArgument(
	['-l', '--title'],
	{
		required: false,
		type: 'string',
		help: 'Give a title to the output files, if relevant.',
		defaultValue: "out",
		dest: 'title'
	}
);

module.exports = parser.parseArgs();