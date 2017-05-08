/**
 * Created by lunzi on 5/6/2017.
 */

"use strict";

var timer =new Timer();

timer.updateTimer(500);

function Timer() {
    var startDay = new Date(2014,5,1);
    var base = new Date(2000,1,1);

    this.updateTimer = function (delay) {
        var self = this;
        setTimeout(function () {
            var elapse = getElapseTime();
            $('#Timer > span').each(function (i, x) {
                $(x).text(elapse[i]);           //JQ对象集使用each遍历后会转为dom对象
            });
            self.updateTimer(delay);
        },delay);
    };


    var getElapseTime = function () {
        var now = new Date();
        var temp = new Date(base.getTime() + now.getTime() - startDay.getTime());

        return [
            temp.getFullYear() - 2000,
            temp.getMonth(),
            temp.getDate(),
            temp.getHours() < 10 ? "0" : "" + temp.getHours(),
            temp.getMinutes() < 10 ? "0" : "" + temp.getMinutes(),
            temp.getSeconds() < 10 ? "0" : "" + temp.getSeconds()
        ];

    }
}
