let lrc = "";
function getLRC() {
    var ajax = new XMLHttpRequest();
    ajax.open("GET", "lrc/βios.lrc");
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4 && ajax.status === 200) {
            lrc = ajax.responseText;
        }
    };
    ajax.send(null);
}
getLRC();
var oLRC = {
    ti: "", //歌曲名
    ar: "", //演唱者
    al: "", //专辑名
    by: "", //歌词制作人
    offset: 0, //时间补偿值，单位毫秒，用于调整歌词整体位置
    ms: [] //歌词数组{t:时间,c:歌词}
};

function createLrcObj(lrc) {
    if(lrc.length === 0) return;
    var lrcs = lrc.split('\n');//用回车拆分成数组
    for(let i in lrcs) {//遍历歌词数组
        lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, ""); //去除前后空格
        let t = lrcs[i].substring(lrcs[i].indexOf("[") + 1, lrcs[i].indexOf("]"));//取[]间的内容
        let s = t.split(":");//分离:前后文字
        if(isNaN(parseInt(s[0]))) { //不是数值
            for (let i in oLRC) {
                if (i !== "ms" && i === s[0].toLowerCase()) {
                    oLRC[i] = s[1];
                }
            }
        }else { //是数值
            var arr = lrcs[i].match(/\[(\d+:.+?)\]/g);//提取时间字段，可能有多个
            var start = 0;
            for(let k in arr){
                start += arr[k].length; //计算歌词位置
            }
            var content = lrcs[i].substring(start);//获取歌词内容
            for (var k in arr){
                let t = arr[k].substring(1, arr[k].length-1);//取[]间的内容
                let s = t.split(":");//分离:前后文字
                oLRC.ms.push({//对象{t:时间,c:歌词}加入ms数组
                    t: (parseFloat(s[0])*60+parseFloat(s[1])).toFixed(3),
                    c: content
                });
            }
        }
    }
    oLRC.ms.sort(function (a, b) {//按时间顺序排序
        return a.t-b.t;
    });

}
//设置异步以保证获取歌词
setTimeout(function () {
    createLrcObj(lrc);
    showLRC();
},1000);

function showLRC() {
    var s="";
    for(var i in oLRC.ms){//遍历ms数组，把歌词加入列表
        s+='<li>'+oLRC.ms[i].c+'</li>';
    }
    document.getElementsByClassName('lyrics')[0].innerHTML = s;
}


var lineNo = 0;
var C_pos = 6;
var offset = -20; //滚动距离（等于行高）
var audio = document.getElementsByTagName('audio')[0];
var ul = document.getElementsByClassName("lyrics")[0];

//高亮显示歌词当前行及文字滚动控制，行号为lineNo
function lineHigh() {
    var lis = ul.getElementsByTagName("li");//歌词数组
    if(lineNo > 0){
        lis[lineNo - 1].removeAttribute("class");//去掉上一行的高亮样式
    }
    lis[lineNo].className = "lineHigh";//高亮显示当前行

    //文字滚动
    if(lineNo>C_pos){
        ul.style.transform = "translateY("+(lineNo-C_pos)*offset+"px)"; //整体向上滚动一行高度
    }
}

//滚回到开头，用于播放结束时
function goback() {
    document.querySelector("#lyric .lineHigh").removeAttribute("class");
    ul.style.transform = "translateY(0)";
    lineNo = 0;
}

//监听播放器的timeupdate事件，实现文字与音频播放同步
audio.ontimeupdate = function () {
    if(lineNo === oLRC.ms.length)
        return;
    var curTime = audio.currentTime; //播放器时间
    if(parseFloat(oLRC.ms[lineNo].t)<=curTime){
        lineHigh();//高亮当前行
        lineNo++;
    }
};

//监听播放器的ended事件，播放结束时回滚歌词
audio.onended = function () {
    goback(); //回滚歌词
};

