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
		},
    });
    
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-openui5");
    grunt.loadNpmTasks('grunt-curl');
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    grunt.registerTask('build', ['clean', 'openui5_preload', 'concat']);
    grunt.registerTask('default', ['build']);
    
};
