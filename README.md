# Convert a OpenUI5 Application into a Progressive Web App: 
Progressive Web Apps have opened us a lot of new ways in delivering amazing user experiences on the web. They combine the best of web and the best of apps, regardless of any operating system and browser choice. After being installed they feel and look like native applications without requiring special skills for development. Modern business applications must work on desktop and mobile systems, which is no limitation thanks to responsiveness of PWAs. And the best of all: It’s working fully offline.

UI5 gives us the opportunity to build fast, reliable and responsive user interfaces for the Web. 

So how can we combine them?

# Example: Icon Explorer
The icon explorer is a small tool to find and preview icons by browsing through categories and tags or just by searching. 
It loads up the SAP-Icons font, gives an overview of the icons and shows them in different use cases with UI5-Controls.
It is a great base for testing the PWA compatibility of UI5.

### [Live Demo](https://iconexplorerpwa.cfapps.eu10.hana.ondemand.com)

### Installation

#### `Step 1` - clone the repo
  
```bash
$ git clone https://github.com/kizilcali81/openui5-pwa-iconexplorer
```

#### `Step 2` - cd in the repo

```bash
$ cd openui5-pwa-iconexplorer
```

#### `Step 3` - install dependencies

```bash
$ npm install
$ bower install
$ grunt build
```

#### `Step 4` - run application

```bash
$ npm run serve
```

In browser, open [http://localhost:8819](http://localhost:8819)

## What do we need?
A default PWA needs: 

*	Special meta tags in index.html to tell the browser, that this is a web app and to load some icons and to make other modifications.

*	Splash screen and icons because Progressive Web Apps need some static content, which is shown immediately

*	A Web App Manifest to describe our application. 

*	A service worker to guarantee offline compatibility
For more details, you can look up the [PWA Checklist](https://developers.google.com/web/progressive-web-apps/checklist)

--> The Service Worker is only able to see asynchron requests. So the application has to load everything asynchronosly.

## Let's begin

### 1. Metatags
First, we will add meta tags to the header to link the manifest, load the icons and tell the browser, that this is a Web App:
(You can find a collection for PWA related meta tags [here](https://github.com/gokulkrishh/awesome-meta-and-manifest))

```html
<!-- PWA related meta tags -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
	
<!-- PWA manifest -->
<link rel="manifest" href="manifest.json">
	
<!-- Add to home screen for Safari on iOS -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="Icon Explorer">
	
<!-- Windows related -->
<meta name="msapplication-TileImage" content="icons/mstile-150x150.png">
<meta name="msapplication-TileColor" content="#427CAC">

<!-- Statusbar Color for Chrome, Firefox OS and Opera -->
<meta name="theme-color" content="#427CAC">
	
<!-- Icons -->
<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png">
<link rel="shortcut icon" href="/icons/favicon.svg">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5">
```

The ```viewport``` tag will instruct the browser on how to control the page’s dimensions and scaling. ```device-width``` is the width of screen at a scale of 100%. The ```initial-scale``` property controls the zoom level when the page is first loaded. 

```apple-mobile-web-app-capable``` tag will tell safari that this web page is a web application and can be added to the home screen.

```apple-mobile-web-app-title``` is the name of the application shown below the icon in the home screen.

With ```theme-color``` you can specify the color of the address bar for browsers, which support this feature. Chrome will also set the status bar color to a darken version of the value you have specified.

The other tags are relevant for linking icons and theming. In this case the icons are saved in an icons folder.


### 2. Splash Screen
PWAs always require static content to be shown instantly to guarantee native-like user experience, so the splash screen will be the very first thing seen on our Web Application. It will be displayed before the rendering of UI5 begins and while the libraries are being loaded.

In this case we will add a title and a logo to the body of our ```index.html```:

```html
<body class="sapUiBody" id="content">
        <div id="splash-screen">
            <h1>UI5 IconExplorer as a Progressive Web Application</h1>
            <img src="icons/icon.svg" alt="PWA UI5 IconExplorer">
        </div>
</body>
```

You can also change colors by adding a ```<style>``` tag to the header:
```html
<style>
        body {
            background: white;
        }

        #splash-screen {
            color: #244C7C;
            text-align: center;
        }
</style>
```

### 3. Manifest
The Manifest is a description of our web app. You are able to define a name, link icons, give a short description of your application and name an author. UI5 already requires a manifest, meaning that we can merge them by adding PWA related terms in the existing ```manifest.json``` file:

```json
    "_version": "1.2.0",
    "name": "PWA UI5 Icon Explorer",
    "short_name": "Icon Explorer",
    "icons": [
        
        {
            "src": "icons/icon.svg",
            "sizes": "48x48 72x72 96x96 128x128 144x144 152x152 192x192   
                      256x256 512x512"
        },

        {
            "src": "icons/icon-128x128.png",
            "sizes": "128x128",
            "type": "image/png"
        },
        {
            "src": "icons/icon-144x144.png",
            "sizes": "144x144",
            "type": "image/png"
        },
        {
            "src": "icons/icon-152x152.png",
            "sizes": "152x152",
            "type": "image/png"
        },
        {
            "src": "icons/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "icons/icon-256x256.png",
            "sizes": "256x256",
            "type": "image/png"
        },
        {
            "src": "icons/icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ],
    "start_url": "index.html",
    "display": "standalone",
    "background_color": "#FFFFFF",
    "theme_color": "#427CAC",
```

```“display”: “standalone”``` will have the effect, that our UI is displayed like a normal native app.

### 4. Service Worker
A service worker is a separate script, running in the background independent from the main thread. It allows us to implement various features, but the main goals are the ability of push notifications and offline resource loading.

The service worker’s life cycle starts with the install process. This is the only point, where it has online connectivity and can be used to cache needed resources. Once all required files are loaded, it gets activated and can now handle fetch and message requests.

Let us begin with building a service worker and see what is happening:

```javascript
const CACHE_NAME = 'ui5-iconexplorer-pwa-v1.0.0';
var RESOURCES_TO_PRELOAD = [
	'Component-preload.js',
	'/openui5/resources/sap-ui-messagebundle-preload.js',
	'/icons/icon.svg',
	'index.html',
    'register-worker.js'
];

//Preload UI5 core and libraries by install
const cdnBase = 'https://openui5.hana.ondemand.com/resources/';
RESOURCES_TO_PRELOAD = RESOURCES_TO_PRELOAD.concat([
    `${cdnBase}sap-ui-core.js`,
    `${cdnBase}sap/ui/core/library-preload.js`,
    `${cdnBase}sap/m/themes/sap_belize/library.css`,
    `${cdnBase}sap/ui/core/themes/base/fonts/SAP-icons.woff2`,
    `${cdnBase}sap/m/library-preload.js`,
    `${cdnBase}sap/ui/core/themes/sap_belize/library.css`
]);

// Preload some resources during install
self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
			return cache.addAll(RESOURCES_TO_PRELOAD);
		})
	);
});

// Delete obsolete caches during activate
self.addEventListener('activate', function (event) {
	event.waitUntil(
		caches.keys().then(function (keyList) {
			return Promise.all(keyList.map(function (key) {
				if (key !== CACHE_NAME) {
					return caches.delete(key);
				}
			}));
		})
	);
});

// During runtime, get files from cache or -> fetch, then save to cache
self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			if (response) {
				return response; // There is a cached version of the resource already
			}

			let requestCopy = event.request.clone();
			return fetch(requestCopy).then(function (response) {
				if (!response) {
					return response;
				}
				// If a resource is retrieved, save a copy to the cache.
				// Unfortunately, it is not possible to check if the response form CDN
				// was successful (responses with type === 'opaque' have zero status). 
				// For example, a 404 CDN error will be cached, too.
				if (response.status === 200 || response.type === 'opaque') {
					let responseCopy = response.clone();
					caches.open(CACHE_NAME).then(function (cache) {
						cache.put(event.request, responseCopy);
					});
				}
				return response;
			});
		})
	);
});
```

We also have to register the service worker. This is easily done by creating this ```register-worker.js``` file: 

```javascript
/**
 * Register the service worker
 */
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./service-worker.js')
        .then(function () { 
            console.log('Service Worker Registered'); 
        });
}
```

and adding this to ```index.html```, before the bootstrapping of UI5:
```html
<!-- Register service worker -->
<script src="register-worker.js"></script>
```


Now, we can open our Web Applicaion with Chrome, start ```Developer tools```, click on ```Network``` and see, which files are loaded by our service worker:
(When we first start the page the service worker will be registered and installed. When you now reload it the service worker will start serving the files.)

![requests.png](https://preview.ibb.co/dBhNyG/requests.png)

This gives us an overview of all files requested by the Icon Explorer. You can realize, that there are already a lot of files loaded by the service worker, but there are still various files, not coming from there. This is where the main problem begins. 

The service worker is not able to see any ```synchronous XMLHttpRequest```. So, we must reduce all XHRs and load every component and library ```asynchronously```.

### 5. Preload Components
A component preload will combine all needed components in one file. This will help us to get fewer XHRs and to improve the start-up performance for delivering a better user experience.
To create a ```Component-Preload.js``` file you can either use the [SAPUI5 Web IDE](https://cloudplatform.sap.com/capabilities/devops/web-ide.html) or you can make it with [Grunt](https://gruntjs.com/). 

In this case, we will use ```Grunt```.

We need to create a ```Gruntfile.js```:
```javascript
module.exports = function(grunt) {
      grunt.initConfig({
        dir:{
            webapp: 'IconExplorer/src',
            dist: 'dist'
        },

        clean: {
            "preload": ["src/Component-preload.js"],
            "openui5": ['src/openui5']
        },
        
        "openui5_preload": {
            component: {
                options: {
                    compress: false,
                    resources: {
                        cwd: "src",
                        prefix: "sap/ui/demo/iconexplorer",
                        src: [
                            "Component.js",
                            "**/*.js",
                            "**/*.fragment.xml",
                            "**/*.view.xml",
                            "**/*.properties",
                            "manifest.json",
                            "!Component-preload.js",
                            "!test/**",
                            "!openui5/**"
                        ]
                    },
                    dest: "src"
                },
                components: "sap/ui/demo/iconexplorer"
            }
        },
    });
    
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-openui5");
    
    grunt.registerTask('build', ['clean', 'openui5_preload']);
    grunt.registerTask('default', ['build']);
};
```
The ```openui5_preload``` task will generate our ```Component-preload.js``` file, containing our Component.js, manifest.json and all other .js, .xml and .properties files. 

### 6. Make load of components asynchronous
We created the ```Component-preload.js``` file to reduce the ```XMLHttpRequests```, but the components are still being loaded ```synchronously```. Luckily UI5 delivers us several opportunities to make things ```asynchronous```.

To fix this, we need to modify the ```index.html``` file:
```html
<script>
        sap.ui.getCore().attachInit(function () {
            sap.ui.require([
                "sap/m/Shell",
                "sap/ui/core/ComponentContainer"
            ], function (Shell, ComponentContainer) {
                var oCompContainer = new ComponentContainer({
                    height: "100%",
                });

                // initialize the UI component with async property
                var oComponent = sap.ui.component({
                    async: true,
                    manifestFirst: true,
                    name: "sap.ui.demo.iconexplorer"
                }).then(function(oComponent){
                    oCompContainer.setComponent(oComponent);
                });

                new Shell({
                    showLogout:false,
                    app: oCompContainer
                }).placeAt("content");
                });
        });
</script>
```
Instead of just placing a ```Component-Container```, we have to initialize the UI Component with two additional properties: ```async: true``` and ```manifestFirst: true```.

### 7. Make load of libraries asynchronous
After having all components loading asynchronously, we also need to do this with the libraries:
Just add this to the bootstrapping part of ```index.html```:

```html
data-sap-ui-preload="async"
```

This will affect, that the libraries are being loaded asynchronously, but you have to check, if there are still synchronous requests for libraries. In our case, there are synchrony requests for ```Avatar.js``` and ```library.js``` file from ```sap.f```-library. This means we must preload the ```sap.f``` library.

### 8. Preload libraries
To preload libraries, we just have to add them to ```data-sap-ui-libs``` in ```bootstrap``` of ```index.html```:

```html
data-sap-ui-libs="sap.m, sap.ui.layout, sap.ui.core, sap.f"
```

Now let us check the ```XMLHttpRequests``` in ```Developer tools``` again:
![requests_library_parameters.png](https://preview.ibb.co/kjmt5w/requests_library_parameters.png)

There are only eight XHTTPRequests left, after having made all this changes.
The ```library-parameters.json``` file is being requested, because the browser tries to render the UI before the ```theme``` is fully loaded. To solve this, we have to tell the browser in bootstrapping of UI5 in ```index.html```, that it has to wait for the theme:

```html
data-sap-ui-xx-waitForTheme="true"
```

### 9. Messagebundles-preload
##### We do not need this step, when we use the ```OpenUI5 Nightlies```, because after version ```1.52``` of ```OpenUI5``` the messagebundles are being loaded asynchronously. But for older versions we need to preload these files, to prevent requests.

After having fixed this, we only have six XHRs. Three of them are asynchronous, so there are just three synchronous requests leftover.

![requests_messagebundles.png](https://preview.ibb.co/csTjTG/requests_messagebundles.png)

These three files are the ```messagebundle``` files. They are for standard texts in Components, for example the ```"Search"``` text of a ```Search field```. 

To make them load asynchronously, there is unfortunately no property or tag. We need a workaround:

Firstly, we have to download packaged versions of our libraries with [Bower](https://bower.io/), to reach the messagebundle.properties files, by creating this ```bower.json``` file:

```json
{
    "name": "iconexplorer",
    "dependencies": {
      "openui5-sap.ui.core": "openui5/packaged-sap.ui.core",
      "openui5-sap.m": "openui5/packaged-sap.m",
      "openui5-sap.f": "openui5/packaged-sap.f",
      "openui5-sap.ui.layout": "openui5/packaged-sap.ui.layout"
    }
}
```

Secondly, we need to run this command in ```terminal```

```bash
$ bower install
```

```Bower``` will now save our libraries in ```bower_components``` directory.

Thirdly, we must must extend our existing ```Gruntfile.js``` with one more task called ```concat```:

```javascript
concat: {
	"sap-ui-messagebundle-preload.js": {
		options: {
			process: function(src, filepath) {
				var moduleName = filepath.substr(filepath.indexOf("resources/") + "resources/".length);
				var preloadName = moduleName.replace(/\//g, ".").replace(/\.js$/, "-preload");
				var preload = {
					"version": "2.0",
					"name": preloadName,
					"modules": {}
				};
				preload.modules[moduleName] = src;
				return "jQuery.sap.registerPreloadedModules(" + JSON.stringify(preload) + ");";
			}
		},
		src: [
			"bower_components/openui5-sap.ui.core/resources/sap/ui/core/*.properties",
                        "bower_components/openui5-sap.m/resources/sap/m/*.properties",
                        "bower_components/openui5-sap.ui.layout/resources/sap/ui/layout/*.properties",
                        "bower_components/openui5-sap.f/resources/sap/f/*.properties"
		],
		dest: "src/openui5/resources/sap-ui-messagebundle-preload.js"
	}
}
```
This task will concentrate all ```messagebundle``` files in one javascript file and register each file as preloded, so it does not need to be requested. 

The generated ```sap-ui-messagebundle-preload.js``` file by Grunt needs to be called in ```index.html```, to be recognized:

```html
<!-- Preload Messagebundle files -->
<script src="openui5/resources/sap-ui-messagebundle-preload.js"></script>
```

At least, we also have to add this to bootstrapping of UI5 in ```index.html```:

```html
data-sap-ui-xx-supportedLanguages="default"
```

If we do not define a language for our application (e.g with ```sap-ui-language```), UI5 tries to load the messagebundle according to the browser language. This can lead to requests for very specific languages like ```de_DE```, but UI5 is "only" translated into ~38 languages with one version of German (```de```), causing a language loading fallback. Our preload also contains only these languages, so we have to tell UI5, that it has to load just ```supported languages```. Setting the supported languages to ```default``` will avoid any request for languages not existing in UI5.

### 10. Audit
Finally, our application should now load everything from the service worker. This means, that our Progrssive Web App is finished and fully working offline. 

<a href="https://ibb.co/gvjcXb"><img src="https://image.ibb.co/mB56Qw/iconexplorer.gif" alt="iconexplorer.gif" border="0"></a>

Chrome gives us the ability to run an audit in ```Developer tools``` with ```Lighthouse```, to test how our application is performing as Progressive Web App:

![audit.png](https://image.ibb.co/hdgzCb/audit.png)

The Icon Explorer passes ```10 audits``` and only fails ```1 audit```, the performance test with 3G. This is due to the loading of OpenUi5. It takes some time to load all the needed stuff, but this is not further tragic.

# Conclusion
This example showed us, that Progressive Web Apps are indeed no limitation for OpenUI5. In summary we can say, that it is enough to create a ```Gruntfile.js```, which preloads all components and libraries, to convert our existing OpenUI5 application into a Progressive Web App. 

But we also have to point out, that the Icon Explorer is a standalone application with no synchronization. 
For the future we should also consider to examine how OpenUI5 is performing as PWA, when it comes to synchronization and data exchange. 
