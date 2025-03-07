var {Buffer} = require('buffer'),
  request = require('./request'),
  //serialize = require('./serializer'),
  extend = require('./ipputil').extend,
  parseurl = require('url').parse;

function Printer(url, opts) {
  if (!(this instanceof Printer)) return new Printer(url, opts);
  opts = opts || {};
  console.log({url});
  this.url = typeof url === 'string' ? parseurl(url) : url;
  this.version = opts.version || '2.0';
  this.uri = opts.uri || 'ipp://' + this.url.host + this.url.path;
  this.charset = opts.charset || 'utf-8';
  this.language = opts.language || 'en-us';
}
Printer.prototype = {
  _message: function (operation, msg) {
    if (typeof operation === 'undefined') operation = 'Get-Printer-Attributes';

    var base = {
      version: this.version,
      operation: operation,
      id: null, //will get added by serializer if one isn't given
      'operation-attributes-tag': {
        //these are required to be in this order
        'attributes-charset': this.charset,
        'attributes-natural-language': this.language,
        'printer-uri': this.uri,
      },
    };
    //these are required to be in this order
    if (msg && msg['operation-attributes-tag']['job-id'])
      base['operation-attributes-tag']['job-id'] =
        msg['operation-attributes-tag']['job-id'];
    //yes, this gets done in extend()- however, by doing this now, we define the position in the result object.
    else if (msg && msg['operation-attributes-tag']['job-uri'])
      base['operation-attributes-tag']['job-uri'] =
        msg['operation-attributes-tag']['job-uri'];

    msg = extend(base, msg);
    if (msg['operation-attributes-tag']['job-uri'])
      delete msg['operation-attributes-tag']['printer-uri'];
    return msg;
  },
  execute: function (operation, msg, cb) {
    msg = this._message(operation, msg);
    var buf = serialize(msg);
    request(this.url, buf, cb);
  },
  printZPL: function (data, cb) {
    let msg = {
      'operation-attributes-tag': {
        'requesting-user-name': 'Urip',
        'job-name': 'My Test Job',
        'document-format': 'application/vnd.cups-raw',
      },
      data: Buffer.from(data, 'utf8'),
    };
    msg = this._message('Print-Job', msg);
    var buf = serialize(msg);
    request(this.url, buf, cb);
  },
};

module.exports = Printer;
