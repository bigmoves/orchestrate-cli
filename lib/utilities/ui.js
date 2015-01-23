var chalk = require('chalk');
var prettyjson = require('prettyjson');

module.exports = {
  
  print: function(text) {
    console.log(text);
  },

  json: function(json) {
    this.print(prettyjson.render(json));
  },

  success: function(text) {
    this.print(chalk.green('>> ') + text);
  },

  error: function(text) {
    this.print(chalk.red('>> ') + text);
  }
};

