node-amd-require
================

node-amd-require is a small script which adds AMD-style path resolution and
`define` support to node's `require()` function. It can be used as an AMD
loader or to add [path
configuration](http://requirejs.org/docs/api.html#config-paths) support to
CommonJS modules.


Installation
------------

Using npm:

```
npm install node-amd-require
```


Usage
-----

`require` node-amd-require in your project's main entry point and call with
your desired [AMD-style
configuration](http://requirejs.org/docs/api.html#config). Supports `baseUrl`,
`paths`, and `packages`. Also supports the
[mainConfigFile](http://requirejs.org/docs/optimization.html#mainConfigFile)
property recursively.

```js
/* [your index.js file or similar] */

require('node-amd-require')({
	//configuration from https://github.com/zship/deferreds.js
	baseUrl: '.',
	paths: {
		"deferreds": "src",
		"mout": "lib/mout",
	}
});

var path = require('path');
var fs = require('fs');
//...
```

Or pass a path to a .json file containing your configuration:

```js
/* [your index.js file or similar] */

require('node-amd-require')('/path/to/config.json');

var path = require('path');
var fs = require('fs');
//...
```


Features
--------

* Adds AMD configuration-based path resolution to `require` for AMD and/or
  CommonJS modules
* Adds `define` and RequireJS loader plugin support to `require` via
  [amdefine](https://github.com/jrburke/amdefine) and the
  [require.extensions](http://nodejs.org/api/globals.html#globals_require_extensions)
  mechanism.
* Unlike [requirejs in node](https://github.com/jrburke/r.js/),
  node-amd-require can support downstream scripts which directly call `require`
  on your possibly-AMD-format scripts (such as [grunt](http://gruntjs.com/) and
  [mocha](http://visionmedia.github.io/mocha/)). More on that is in [this
  requirejs
  issue](https://github.com/jrburke/requirejs/issues/450#issuecomment-8465160).
* Does not clobber external libraries (symlinks too)
  * That is, `define` (AMD module support) is only added when `require` is
	called **into** your project (any file calls
	`require("/file/inside/your/project.js"))


License
-------

Released under the [MIT
License](http://www.opensource.org/licenses/mit-license.php).
