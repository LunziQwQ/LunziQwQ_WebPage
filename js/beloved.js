/**
 * Created by lunzi on 5/6/2017.
 */

"use strict";

var timer =new Timer();
var ourStory = new OurStory();
var bgm = new BGM();

$("#bgMusic")[0].volume = 0.2;

ourStory.showText(0);
timer.updateTimer();

function Timer() {
    var self = this;
    var delay = 100;
    var mode = 1;
    var startDay = new Date(2014,5,1,16,25);
    var base = new Date(2000,1,1);

    this.updateTimer = function () {
        var self = this;
        setTimeout(function () {
            var elapse = getElapseTime();
            $('.num').each(function (i, x) {
                $(x).text(elapse[i]);           //JQ对象集使用each遍历后会转为dom对象
            });
            if (mode === 2)
                $($('.num')[2]).text(elapse[6]);
            self.updateTimer();
        },delay);
    };


    var getElapseTime = function () {
        var now = new Date();
        var temp = new Date(base.getTime() + now.getTime() - startDay.getTime());
        var mode2_day = Math.floor((now.getTime()-startDay.getTime())/(1000*60*60*24));
        return [
            temp.getFullYear() - 2000,
            temp.getMonth(),
            temp.getDate(),
            (temp.getHours() < 10 ? "0" : "") + temp.getHours(),
            (temp.getMinutes() < 10 ? "0" : "") + temp.getMinutes(),
            (temp.getSeconds() < 10 ? "0" : "") + temp.getSeconds(),
            mode2_day
        ];
    };
    this.onTimerClick = function (event) {
        console.log("click");
        if(mode===1) {
            $('#modeCtrl').hide();
            $($('#timer p')[1]).text("We've been together for");
            mode = 2;
        }else {
            $('#modeCtrl').show();
            $($('#timer p')[1]).text("I have fallen in love with you for");
            mode = 1;
        }
        event.cancelBubble = true;                              //阻止事件冒泡

    };
}

function OurStory() {
    var self = this;
    this.node = $(".cpp");
    this.index = 0;

    var delay = 50;
    var storys = [
        $("firstmeet").text(),
        ""
    ];

    this.showText = function (chapter) {
        this.index = 0;
        this.node.text("");
        var tempStory = storys[chapter];
        playAnimation(tempStory,self,delay);
    };

    var playAnimation = function (story,self,delay) {
        setTimeout(function () {
            self.node.append(story.charAt(self.index));
            self.index++;
            if (self.index < story.length)
                playAnimation(story, self, delay);
            if (story.charAt(self.index) === ' ')
                $('pre code').each(function(i, block) {
                window.hljs.highlightBlock(block);
            });
        },delay);
    };
}

function BGM() {
    var isPlaying = true;

    this.onBGMClick = function () {
        if (isPlaying){
            $("#bgMusic")[0].pause();
            $("#bgm_control > img").attr('src', "img/heart251.png");
        } else {
            $("#bgMusic")[0].play();
            $("#bgm_control > img").attr('src',"img/heart249.png");
        }
        isPlaying = !isPlaying;
    };

}