var fs = require("fs");
var Handlebars = require("handlebars");


// Create a new template processor.
var MkConf = module.exports = function MkConf(options) {
  this._options = options;
  this._engine = Handlebars.create();
};


// Read and parse JSON defaults.
MkConf.prototype._getDefaults = function _getDefaults() {
  var raw = fs.readFileSync(this._options.defaults);
  return JSON.parse(raw);
};

// Read and parse JSON env-map, then update template data.
MkConf.prototype._getEnvironment = function _getEnvironment(data) {
  var raw = fs.readFileSync(this._options["env-map"]);
  var env = JSON.parse(raw);

  Object.keys(env).forEach(function(data_name) {
    var env_name = env[data_name];
    if (process.env.hasOwnProperty(env_name)) {
      data[data_name] = process.env[env_name];
    }
  });

  return data;
};


// Read the template from file or stdin.
MkConf.prototype._getTemplate = function _getTemplate(callback) {
  return fs.readFileSync(this._options.input, { encoding: "utf-8" });
};

// Compile the template and render it with the data.
MkConf.prototype._render = function _render(source, data) {
  var template = this._engine.compile(source, { noEscape: true });
  return template(data);
};


// Write the output to stdout/stderr.
MkConf.prototype._write = function _write(data) {
  if (this._options.output === "-") {
    process.stdout.write(data);

  } else {
    fs.writeFileSync(this._options.output, data);
  }
};


// Load template and render it.
MkConf.prototype.make = function make() {
  // Load data.
  var data = this._getDefaults();
  this._getEnvironment(data);

  // Render template.
  var template = this._getTemplate();
  var output = this._render(template, data);

  // Write output.
  this._write(output);
};
