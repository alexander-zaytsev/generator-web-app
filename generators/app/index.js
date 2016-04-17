'use strict';
const yeoman = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');

module.exports = yeoman.Base.extend({

  prompting: () => {
    const done = this.async();

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

    this.prompt(prompts, (props) => {
      this.props = props;
      // To access props later use this.props.someAnswer;

      done();
    });
  },

  writing: {
    fixed: () => {
      const fixedFilePaths = [
        'main.js', 'colorScheme.less',
        'global.less',  'interface.less', 'layout.less',
        'type.less', 'variables.less', 'README.md', '.editorconfig',
        '.gitignore', 'travis.yml'
      ];

      fixedFilePaths.forEach( (fromFilePath) => {
        let toFilePath =
          path.join(this.props.projectName, fromFilePath);
        if (/.*\.less$/.test(fromFilePath)) {
          toFilePath = path.join(this.props.projectName + 'app',
            'styles', 'modules', fromFilePath);
        } else if (fromFilePath === 'main.js') {
          toFilePath = path.join(this.props.projectName + 'app',
            'scripts', fromFilePath);
        } else if (fromFilePath === 'package.json') {
          toFilePath = path.join(this.props.projectName, fromFilePath);
        }

        this.fs.copy(
          this.templatePath(fromFilePath),
          this.destinationPath(toFilePath)
        );
      });
    },

    flexible: () => {
      const flexibleFilePaths = [
        'index.jade', 'bower.json', 'package.json', 'main.less',
        'gulpfile.js'
      ];
      flexibleFilePaths.forEach(function (fromFilePath) {
        let toFilePath =
          path.join(this.props.projectName, fromFilePath);
        if (fromFilePath === 'index.pug') {
          toFilePath = path.join(this.props.projectName, 'app',
            fromFilePath)
        } else if (fromFilePath === 'main.less') {
          toFilePath = path.join(this.props.projectName, 'app',
            'styles', fromFilePath);
        }

        this.fs.copyTpl(
          this.templatePath(fromFilePath),
          this.destinationPath(toFilePath),
          this.props
        );
      }.bind(this));
    },

    optional: () => {
      const optionalFileNames = [
        'normalize.less'
      ];

      optionalFileNames.forEach((fromFilePath) => {
        let toFilePath =
          path.join(this.props.projectName, fromFilePath);
        if (fromFilePath === 'normalize.less' &&
            this.props.includeNormalize === true ) {

          toFilePath =
            path.join(this.props.projectName, 'app', 'styles', 'vendor',
              'fromFilePath');
          this.fs.copy(
            this.templatePath(fromFilePath),
            this.destinationPath(toFilePath)
          );

        }
      };
    }
  },

  install: () => {
    this.installDependencies();
  }
});
