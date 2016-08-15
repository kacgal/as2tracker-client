let Tail = require('tail').Tail;
let request = require('request');
let util = require('util');
let EventEmitter = require('events').EventEmitter;
let Registry = require('winreg');

class Tracker {

  constructor(debug) {
    this.debug = debug ? true : false;
  }

  findLog(cb) {
    switch (process.platform) {
      case 'linux':
        cb(process.env['HOME'] + '/.config/unity3d/Audiosurf, LLC/Audiosurf 2/Player.log');
        break;
      case 'darwin':
        cb(process.env['HOME'] + '/Library/Logs/Unity/Player.log');
        break;
      case 'win32':
        key = new Registry({
          hive: Regsitry.HKLM,
          key: '\\SOFTWARE\\WOW6432Node\\Valve\\Steam'
        });
        path = key.get('InstallPath', (err, item) => {
          cb(item.value);
        });
        break;
    }
  }
  
  init(logPath) {
    this._tail = new Tail(logPath);
    this._tail.on('line', this._handleLine.bind(this));
  }

  start() {
    this._tail.watch();
  }

  stop() {
    this._tail.unwatch();
  }

  _handleLine(line) {
    var match;
    if (match = /^sending score\. title:(.+) duration:(.+) artist:(.*)$/.exec(line)) {
      this._postSong(match[1], match[2], match[3]);
    }
  }

  _postSong(title, duration, artist) {
    request.post('http://as2tracker.com/input_script.php', {
      form: {
        title: title,
        duration: duration,
        artist: artist
      }
    }, (error, response, body) => {
      if (error)  {
        this.emit('error', 'post_fail', error);
      }
      else {
        this.emit('post_sent', title, artist, ''); // TODO: Get songId
      }
    });
  }
}
util.inherits(Tracker, EventEmitter);
exports.Tracker = Tracker;
