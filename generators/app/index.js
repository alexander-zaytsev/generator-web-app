/*jslint node: true */
'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the supreme ' + chalk.red('generator-web-app') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'projectName',
      message: 'Enter the name of your project'
    }, {
      type: 'confirm',
      name: 'includeNormalize',
      message: 'Would you like to include Normalize (CSS reset)',
      default: true
    }, {
      type: 'confirm',
      name: 'includeReact',
      message: 'Would you like to include React.js?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someAnswer;

      done();
    }.bind(this));
  },

  writing: {
    fixed: function () {
      var fixedFilePaths = [
        'main.js', 'colorScheme.less',
        'global.less',  'interface.less', 'layout.less',
        'type.less', 'variables.less', 'README.md'
      ];

      fixedFilePaths.forEach(function (fromFilePath) {
        var toFilePath = fromFilePath;
        if (/.*\.less$/.test(fromFilePath)) {
          toFilePath = 'app/styles/modules/' + fromFilePath;
        } else if (fromFilePath === 'main.js') {
          toFilePath = 'app/scripts/' + fromFilePath;
        } else if (fromFilePath === 'package.json') {
          toFilePath = 'package.json';
        }

        this.fs.copy(
          this.templatePath(fromFilePath),
          this.destinationPath(toFilePath)
        );
      }.bind(this));
    },

    flexible: function () {
      var flexibleFilePaths = [
        'index.jade', 'bower.json', 'package.json', 'main.less', 'gulpfile.js'
      ];
      flexibleFilePaths.forEach(function (fromFilePath) {
        var toFilePath = fromFilePath;
        if (fromFilePath === 'index.jade') {
          toFilePath = 'app/' + fromFilePath;
        } else if (fromFilePath === 'main.less') {
          toFilePath = 'app/styles/' + fromFilePath;
        }

        this.fs.copyTpl(
          this.templatePath(fromFilePath),
          this.destinationPath(toFilePath),
          this.props
        );
      }.bind(this));
    },

    optional: function () {
      var optionalFileNames = [
        'normalize.less'
      ];

      optionalFileNames.forEach(function (fromFilePath) {
        var toFilePath = fromFilePath;
        if (fromFilePath === 'normalize.less' &&
            this.props.includeNormalize === true ) {

          toFilePath = 'app/styles/vendor/' + fromFilePath;
          this.fs.copy(
            this.templatePath(fromFilePath),
            this.destinationPath(toFilePath)
          );

        }
      }.bind(this));
    }
  },

  install: function () {
    this.installDependencies();
  }
});
