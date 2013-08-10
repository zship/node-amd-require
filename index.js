'use strict';


var path = require('path');
var fs = require('fs');
var Module = require('module');

var resolve = require('amd-tools/modules/resolve');
var getConfigRecursive = require('amd-tools/getConfigRecursive');


var _paths = [];
var _shouldTransform = function(filename) {
	var isInPathsConfig = _paths.some(function(p) {
		return filename.indexOf(p) !== -1;
	});
	var isWithinProject = (
		filename.indexOf(path.resolve('.')) !== -1 &&
		filename.indexOf(path.resolve('node_modules')) === -1
	);
	return isInPathsConfig || isWithinProject;
};


var augmentRequireWithAmd = function(rjsconfig) {
	rjsconfig = getConfigRecursive(rjsconfig);
	rjsconfig.baseUrl = rjsconfig.baseUrl || process.cwd();
	rjsconfig.paths = rjsconfig.paths || {};

	_paths = Object.keys(rjsconfig.paths).map(function(key) {
		return path.resolve(rjsconfig.baseUrl, rjsconfig.paths[key]);
	});

	var _resolveFilename = Module._resolveFilename;
	Module._resolveFilename = function(request, parent) {
		if (request === 'node-amd-require-amdefine') {
			// use our copy of amdefine
			return require.resolve('amdefine');
		}

		var dirname = path.dirname(parent.filename);
		var filename = resolve(request, dirname, rjsconfig);

		if (!filename) {
			filename = _resolveFilename.apply(this, arguments);
		}

		return filename;
	};

	var _extensionsJs = require.extensions['.js'];
	require.extensions['.js'] = function(localModule, filename) {
		if (!_shouldTransform(filename)) {
			return _extensionsJs.apply(this, arguments);
		}

		var contents = fs.readFileSync(filename, 'utf8');
		contents = 'if (typeof define !== "function") { var define = require("node-amd-require-amdefine")(module); } ' + contents;
		localModule._compile(contents, filename);
	};

};


module.exports = augmentRequireWithAmd;
