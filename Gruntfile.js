module.exports = function(grunt) {
	
	grunt.initConfig({
		clean: {
			compile: ['build', 'tmp']
		},
		copy: {
			compile: {
				files: [{
					expand: true,
					cwd: 'src/dropin',
					dot: true,
					src: ['**'],
					dest: 'build'
				}]
			}
		},
		kapocs: {
			compile: {
				assets: [{
					expand: true,
					cwd: 'src/assets',
					dot: true,
					src: ['**'],
					dest: 'build'
				}],
				assetTemplates: [{
					expand: true,
					cwd: 'src/asset_templates',
					dot: true,
					src: ['**'],
					dest: 'build'
				}, {
					expand: true,
					cwd: 'tmp/asset_templates',
					dot: true,
					src: ['**'],
					dest: 'build'
				}],
				templates: [{
					expand: true,
					cwd: 'src/templates',
					dot: true,
					src: ['**'],
					dest: 'build'
				}]
			}
		},
		less: {
			compile: {
				files: {
					'tmp/asset_templates/style/style.css': ['src/style.less']
				}
			}
		},
		typescript: {
			compile: {
				files: {
					'tmp/asset_templates/script/script.js': ['src/mag/Main.ts']
				}
			}
		},
		sas: {
			update: {}
		},
		shell: {
			update: {
				command: [
					'bower prune',
					'bower update',
					'bower install'
				].join('&&')
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-kapocs');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-sas');
	grunt.loadNpmTasks('grunt-typescript');

	grunt.registerTask('update', ['shell:update','sas:update']);
	grunt.registerTask('compile', ['clean:compile','typescript:compile','less:compile', 'copy:compile', 'kapocs:compile']);
	grunt.registerTask('default', ['compile']);
};