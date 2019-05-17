var audio = document.getElementsByTagName("audio")[0];
var play_control = document.getElementsByClassName("audio-left")[0];
var audio_player = document.getElementById("audioPlayer");
var progressDot = document.getElementById("progressDot");
var current_tiem = document.getElementsByClassName("audio-length-current")[0];
var total_time = document.getElementsByClassName("audio-length-total")[0];
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

function updatePrograss(audio) {
    var value = audio.currentTime / audio.duration;
    progressDot.style.left = value * 100 + '%';
    current_tiem.innerHTML = transTime(value);
}

function transTime(value) {
    var time;
    var m = parseInt(value / 60);
    var s = parseInt(value % 60);
    if (m < 1){
        m = '00';
    }
    if ((m < 10)&&(m >= 1)){
        m = '0' + m;
    }
    if (s < 10){
        s = '0' + s;
    }
    time = m + ":" + s;
    return time;
}

