var audio = document.getElementsByTagName("audio")[0];
var play_control = document.getElementsByClassName("audio-left")[0];
var audio_player = document.getElementById("audioPlayer");
var progressDot = document.getElementById("progressDot");
var current_tiem = document.getElementsByClassName("audio-length-current")[0];
var total_time = document.getElementsByClassName("audio-length-total")[0];
var progressBarBg = document.getElementById("progressBarBg");
var duration;

setTimeout(function () {
    duration = audio.duration;
    total_time.innerHTML = transTime(duration);
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



function updatePrograss(audio) {

}

function transTime(time){
    time = parseInt(time);
    var m = Math.floor((time / 60 % 60));
    var s = Math.floor((time % 60));
    time = m + ':' + s;
    return time;
}

function audioEnded() {
    progressDot.style.left = 0;
    audio_player.src = 'pic/play.png';
}

setTimeout(function () {
    progressBarBg.onmousedown = function (e) {
        var pgsWidth = progressBarBg.clientWidth;
        var rate = e.offsetX / pgsWidth;
        console.log( duration * rate);
        audio.currentTime = duration * rate;
        console.log(audio.currentTime);
        var value = audio.currentTime / audio.duration;
        console.log(value);
        progressDot.style.left = value * 100 + '%';
    };
},1000);