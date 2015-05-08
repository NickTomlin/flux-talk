'use strict';

(function (global, document) {
  var video;
  var debugEnabled = global.videoDebugEnabled;
  var modifier = 'altKey';

  function debug () {
    if (!debugEnabled) { return; }
    console.log.apply(console, arguments);
  }

  document.addEventListener('keyup', function (e) {
    var key = e.keyCode;

    debug(!video, !e[modifier], key);
    if (!video || !e[modifier]) { return; }

    switch (key) {
      case 67:
        var method = video.paused ? 'play' : 'pause'
        return video[method]();
      break;

      case 37:
      case 39:
        var direction = key === 37 ? -1 : 1;
        video.playbackRate = (video.playbackRate + (direction * .25));
      break
    }
  });

  Reveal.addEventListener('slidechanged', handleUpdate);

  function handleUpdate () {
    debug('handle update');
    video = Reveal.getCurrentSlide().querySelector('video');
  }

  handleUpdate();
}(window, document));
