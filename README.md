# gulp-sass dependency node-sass patch (node v0.11.13 and v0.11.14)

[@dlmanning](https://github.com/dlmanning/) has created a gulp sass plugin based on [node-sass](https://github.com/sass/node-sass#workaround-for-node-v01113-v01114). 
When installing [gulp-sass](https://github.com/dlmanning/gulp-sass) with node package manager, dependency modules are installed as well. Dependency module node-sass triggers an error in node version *v0.11.13* and *v0.11.14* when it fails to download the libsass binding.node. 

The error looks like this:

	/node_modules/gulp-sass/node_modules/node-sass/lib/index.js:21  
	    throw new Error('`libsass` bindings not found. Try reinstalling `node-sass   
          ^

## Patch

Node-sass contains pre-compiled binaries. The patch disable the binding connection when installing the dependencies of node-sass. When all dependencies are installed correctly the patch enables the binding again and tries to rebuild the binaries. After all binaries are rebuild, the files are copied to the gulp-sass dependency module node-sass.


### Before using the patch

The patch uses `Q` node package module for using the promises. Make sure you've installed the package before running the patch. You can install `Q` by running `$ npm install q --save-dev`. 

### Run the patch

When gulp-sass is installed you can run the patch `rebuild-node-sass/rebuild-node-sass.js` in a node environment, for instance `$ node ./rebuild-node-sass/rebuild-node-sass.js`

### package.json

When you want this patch to run automatically after the `npm install` command, you can use the `postinstall` hook. The [postinstall script hook](https://docs.npmjs.com/misc/scripts) is called after all package modules are installed. An Example:

	{  
	  "name": "package-name",  
	  "version": "1.0.0",  
	  "scripts": {  
	    "postinstall": "node ./rebuild-node-sass/rebuild-node-sass.js"  
	  },  
	  "engines": {  
	    "node": "0.11.x"  
	  },  
	  "devDependencies": {  
	    "gulp": "^3.8.10",  
	    "gulp-autoprefixer": "^2.0.0",   
	    "gulp-sass": "^1.2.4",  
	    "gulp-sourcemaps": "^1.3.0",  
	    "q": "^1.1.2"  
	  }
	}

