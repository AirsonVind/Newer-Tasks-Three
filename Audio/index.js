var audio = document.getElementsByTagName("audio")[0];
var play_control = document.getElementsByClassName("audio-left")[0];
var audio_player = document.getElementById("audioPlayer");
var progressDot = document.getElementById("progressDot");
var current_time = document.getElementsByClassName("audio-length-current")[0];
var total_time = document.getElementsByClassName("audio-length-total")[0];
var progressBarBg = document.getElementById("progressBarBg");
var volume_control = document.getElementById("volume-control");
var play_rate = document.getElementById("play-rate");
var duration;

setTimeout(function () {
    duration = audio.duration;
    total_time.innerHTML = transTime(audio.duration);
},1000);

play_control.onclick = function () {
    if (audio.paused){
        audio.play();
        audio_player.src = "pic/stop.png";
    }else {
        audio.pause();
        audio_player.src = "pic/play.png";
    }
};

audio.addEventListener('timeupdate',function () {
    updatePrograss(audio);
});
audio.addEventListener('ended',function () {
    audioEnded();
});


/**
 * @param {audio} audio
 */
function updatePrograss(audio) {
    var value = audio.currentTime / audio.duration;
    progressDot.style.left = value * 100 + '%';
    current_time.innerHTML = transTime(audio.currentTime);
}

/**
 * @param {number} time
 * @returns {string}
 */
function transTime(time){
    time = parseInt(time);
    var m = Math.floor((time / 60 % 60));
    var s = Math.floor((time % 60));
    if (m < 10){
        m = '0' + m;
    }
    if (s < 10){
        s = '0' + s;
    }
    time = m + ':' + s;
    return time;
}

function audioEnded() {
    current_time.innerHTML = '00:00';
    progressDot.style.left = 0;
    audio_player.src = 'pic/play.png';
}

setTimeout(function () {
    progressBarBg.onmousedown = function (e) {
        var pgsWidth = progressBarBg.clientWidth;
        var rate = e.offsetX / pgsWidth;
        audio.currentTime = duration * rate;
        var value = audio.currentTime / audio.duration;
        progressDot.style.left = value * 100 + '%';
    };
},1000);

volume_control.onclick = function () {
      if (!audio.muted){
          audio.volume = 0;
          this.src = 'pic/mute.png';
          audio.muted = true;
      } else {
          this.src = 'pic/volume.png';
          audio.volume = 1;
          audio.muted = false;
      }
};

play_rate.onclick = function () {
    switch (audio.playbackRate) {
        case 1.0:
            audio.playbackRate = 1.5;
            play_rate.innerText = 'x1.5';
            break;
        case 1.5:
            audio.playbackRate = 2.0;
            play_rate.innerText = 'x2.0';
            break;
        case 2.0:
            audio.playbackRate = 0.5;
            play_rate.innerText = 'x0.5';
            break;
        case 0.5:
            audio.playbackRate = 1.0;
            play_rate.innerText = 'x1.0';
            break;
        default:
            break;
    }
};