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
$ npm serve
```

In browser, open [http://localhost:8819](http://localhost:8819)

## What do we need?
A default PWA needs: 

*	Special meta tags in index.html to tell the browser, that this is a web app and to load some icons and to make other modifications. (You can find a collection for PWA related meta tags [here](https://github.com/gokulkrishh/awesome-meta-and-manifest))

*	Splash screen and icons because Progressive Web Apps need some static content, which is shown immediately

*	A Web App Manifest to describe our application. 

*	A service worker to guarantee offline compatibility
For more details, you can look up the [PWA Checklist](https://developers.google.com/web/progressive-web-apps/checklist)

--> The Service Worker is only able to see asynchron requests. So the application has to load everything asynchronosly.

## Let's begin

### 1. Metatags
First, we will add some needed meta tags to the header to link the manifest, load the icons and tell the browser, that this is a Web App:

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
