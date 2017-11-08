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

        curl: {
            'src/openui5/resources/sap/ui/core/messagebundle.properties': 'https://openui5nightly.hana.ondemand.com/resources/sap/ui/core/messagebundle.properties',
            'src/openui5/resources/sap/ui/core/messagebundle_en.properties': 'https://openui5nightly.hana.ondemand.com/resources/sap/ui/core/messagebundle_en.properties',
            'src/openui5/resources/sap/m/messagebundle.properties': 'https://openui5nightly.hana.ondemand.com/resources/sap/m/messagebundle.properties',
            'src/openui5/resources/sap/m/messagebundle_en.properties': 'https://openui5nightly.hana.ondemand.com/resources/sap/m/messagebundle_en.properties',
            'src/openui5/resources/sap/ui/layout/messagebundle.properties': 'https://openui5nightly.hana.ondemand.com/resources/sap/ui/layout/messagebundle.properties',
            'src/openui5/resources/sap/ui/layout/messagebundle_en.properties': 'https://openui5nightly.hana.ondemand.com/resources/sap/ui/layout/messagebundle_en.properties',
            'src/openui5/resources/sap/f/messagebundle_en.properties': 'https://openui5nightly.hana.ondemand.com/resources/sap/f/messagebundle_en.properties'
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
					"src/openui5/resources/sap/ui/core/*.properties",
                    "src/openui5/resources/sap/m/*.properties",
                    "src/openui5/resources/sap/ui/layout/*.properties",
                    "src/openui5/resources/sap/f/*.properties"
				],
				dest: "src/openui5/resources/sap-ui-messagebundle-preload.js"
			}
		},




    });
    
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-openui5");
    grunt.loadNpmTasks('grunt-curl');
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    grunt.registerTask('build', ['clean', 'openui5_preload', 'curl', 'concat']);
    grunt.registerTask('default', ['build']);
    
};