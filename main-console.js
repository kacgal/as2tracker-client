let Tracker = require('./tracker.js').Tracker;

tracker = new Tracker()
tracker.on('post_sent', (title, artist, songId) => {
  console.log('Score sent for ' + title + ' - ' + artist + ' http://as2tracker.com/song/' + songId);
});
tracker.findLog((path) => {
  tracker.init(path);
});
