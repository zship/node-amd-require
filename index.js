'use strict';


var path = require('path');
var fs = require('fs');
var Module = require('module');

var resolve = require('amd-tools/modules/resolve');
var getConfigRecursive = require('amd-tools/getConfigRecursive');


var _isInProject = function(filename) {
	return (
		filename.indexOf(path.resolve('.')) !== -1 &&
		filename.indexOf(path.resolve('node_modules')) === -1
	);
};


var augmentRequireWithAmd = function(rjsconfig) {
	rjsconfig = rjsconfig || {
		baseUrl: process.cwd()
	};

	rjsconfig = getConfigRecursive(rjsconfig);

	var _resolveFilename = Module._resolveFilename;
	Module._resolveFilename = function(request, parent) {
		var dirname = path.dirname(parent.filename);
		if (!_isInProject(dirname)) {
			return _resolveFilename.apply(this, arguments);
		}

		var filename = resolve(request, dirname, rjsconfig);
		if (filename) {
			return filename;
		}

		return _resolveFilename.apply(this, arguments);
	};

	var _extensionsJs = require.extensions['.js'];
	require.extensions['.js'] = function(localModule, filename) {
		if (!_isInProject(filename)) {
			return _extensionsJs.apply(this, arguments);
		}

		var contents = fs.readFileSync(filename, 'utf8');
		contents = 'if (typeof define !== "function") { var define = require("amdefine")(module); }\n\n' + contents;
		localModule._compile(contents, filename);
	};

};


module.exports = augmentRequireWithAmd;
