var playVideo = function (streamName) {
    var video = document.getElementById('video');
    // We listen when we can play our video hls
    video.addEventListener('canplaythrough', function () {
                var promise = video.play();
                if (promise !== undefined) {
                    promise.catch(function(error) {
                        console.error('Auto-play was prevented');
                        console.error('We Show a UI element to let the user manually start playback');
                        buttonPlay.style.display = 'block';
                    }).then(function() {
                        console.info('Auto-play started');
                        buttonPlay.style.display = 'none';
                    });
                }
    }); //  Fires when the browser can play through the audio/video without stopping for buffering

    video.muted = 'muted';
    video.autoplay = 'autoplay';
    video.playsinline = 'true';

    var videoSrc = '/' + streamName + '.m3u8';
    if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
        video.play();
        });
    }
    // hls.js is not supported on platforms that do not have Media Source
    // Extensions (MSE) enabled.
    //
    // When the browser has built-in HLS support (check using `canPlayType`),
    // we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video
    // element through the `src` property. This is using the built-in support
    // of the plain video element, without using hls.js.
    //
    // Note: it would be more normal to wait on the 'canplay' event below however
    // on Safari (where you are most likely to find built-in HLS support) the
    // video.src URL must be on the user-driven white-list before a 'canplay'
    // event will be emitted; the last video event that can be reliably
    // listened-for when the URL is not on the white-list is 'loadedmetadata'.
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', function() {
        video.play();
        });
    }
}
