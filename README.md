# openui5-pwa-iconexplorer

# Convert a SAPUI5 Application into a Progressive Web App: 
Progressive Web Apps have opened us a lot of new ways in delivering amazing user experiences on the web. They combine the best of web and the best of apps, regardless of any operating system and browser choice. After being installed they feel and look like native applications without requiring special skills for development. Modern business applications must work on desktop and mobile systems, which is no limitation thanks to responsiveness of PWAs. And the best of all: It’s working fully offline.
UI5 gives us the opportunity to build fast, reliable and responsive user interfaces for the Web. So how can we combine them?

# Example: Icon Explorer
The icon explorer is a small tool to find and preview icons by browsing through categories and tags or just by searching. 
It loads up the SAP-Icons font, gives an overview of the icons and shows them in different use cases with UI5-Controls.
It is a great base for testing the PWA compatibility of UI5

## What do we need?
A default PWA needs: 
•	Special meta tags in index.html to tell the browser, that this is a web app and to load some icons and to make other modifications. (You can find a collection for PWA related meta tags here: https://github.com/gokulkrishh/awesome-meta-and-manifest)
•	Splash screen and icons because Progressive Web Apps need some static content, which is shown immediately
•	A Web App Manifest to describe our application. 
•	A service worker to guarantee offline compatibility
For more details, you can look up the PWA Checklist: https://developers.google.com/web/progressive-web-apps/checklist


