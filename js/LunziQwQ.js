"use strict";
//=================================================
//  对象实例化
var rightMenu = new RightMenu();
var animation = new Animation();
var myInfo = new MyInfo();
var todoList = new TodoList();
var search = new Search();
var inputText = new Input();
var timer = new Timer();
var notice = new Notice();
//=================================================
//  初始化页面，工具，显示
var storage = window.localStorage;
var openFlag = [];
myInfo.showAge();
todoList.show();
rightMenu.load();
inputText.changeInfo(inputText.TodoList, 'show');
inputText.changeInfo(inputText.Search, 'show');
//=================================================
//  全局事件监听
document.onclick = function() { //点击监听，点击页面时隐藏现已打开（openFlag）的页面
    if (event.target == document.querySelector("#background") || event.target == timer.element || event.target == document.querySelector("#MyPng")){
        while (openFlag.length > 0) {
            openFlag.pop().close();
        }
    }
};
addEventListener("keyup", function(event) { //键盘Enter监听，捕获后触发对应效果
	if (event.keyCode == 13) {
		if (inputText.nowFocus == inputText.TodoList) {
			todoList.doAdd();
		}
		if (inputText.nowFocus == inputText.Search) {
			search.doSearch();
		}
        if (inputText.nowFocus == inputText.notice) {
            notice.onSubmitClick();
        }
	}
});
//=================================================
//  页面动画类
function Animation() {
    var list = {
        "scaleShow":        {className: " showTheBlock",    styleName: "transform", value: "scale(1)",  time: 270},
        "scaleHide":        {className: " hideTheBlock",    styleName: "transform", value: "scale(0)",  time: 270},
        "opacityShow":      {className: ' showMore',        styleName: "opacity",   value: "1",         time: 270},
        "opacityHide":      {className: ' hideMore',        styleName: "opacity",   value: "0",         time: 270},
        "pullDownMenu":     {className: ' pullDownMenu',    styleName: "top",       value: "0",         time: 170},
        "pushUpMenu":       {className: ' pushUpMenu',      styleName: "top",       value: "-100px",    time: 170},
        "pullDownPage":     {className: ' pullDownPage',    styleName: "height",    value: "100%",      time: 270},
        "pushUpPage":       {className: ' pushUpPage',      styleName: "height",    value: "0",         time: 270},
        "pullDownNotice":   {className: ' pullDownNotice',  styleName: "top",       value: "0",         time: 270},
        "pushUpNotice":     {className: ' pushUpNotice',    styleName: "top",       value: "-30%",      time: 270},
        "inputError":       {className: ' inputError',      styleName: "position",  value: "relative",  time: 500}
    };
    this.doAnimation = function (mode, element) {
        element.className += list[mode].className;
        setTimeout(function () {
            element.style[list[mode].styleName] = list[mode].value;
            element.className = '';
        }, list[mode].time);
    };
}
//=================================================
//  输入框类
function Input() {
	this.TodoList = document.querySelector("#AddInput_TDL");
	this.Search = document.querySelector("#SearchInput");
	this.notice = document.querySelector("#NoticeInput");
	this.nowFocus = '';

	this.clear = function(element) {
		element.value = '';
	};
	this.errorReport = function(element) {
        animation.doAnimation("inputError", element);
	};
	this.onFocus = function(element) {
		this.nowFocus = element;
		this.changeInfo(element, 'hide');
		element.style.color = 'black';
	};
	this.onBlur = function(element) {
		if (element.value == '') {
			this.changeInfo(element, 'show');
		}
		element.style.color = 'lightgray';
	};
	this.changeInfo = function(element, mode) {
		if (mode == 'show') {
			switch (element) {
				case this.TodoList:
					element.value = todoList.inputInfo;
					break;
				case this.Search:
					element.value = search.inputInfo;
					break;
				case this.notice:
					element.value = notice.inputInfo;
					break;
			}
		} else {
			this.clear(element);
		}
	}
}
//=================================================
//  左上角个人信息类
function MyInfo() {
	this.element = document.querySelector("#MyInfo");

	this.showAge = function() {
		var date = new Date();
		var nowYear = date.getFullYear();
		var myAge = nowYear - 1997 + '';
		var nowMonth = date.getMonth();
		if (nowMonth < 9) myAge -= 1;
		document.querySelector("#lv").innerHTML = myAge;
	};
	this.show = function(event) {
		for	(var i = 0;i < openFlag.length;i++){
			if(openFlag[i] == myInfo){
				event.cancelBubble = true; //阻止事件冒泡
				return;
			}
		}
        animation.doAnimation("scaleShow", myInfo.element);
		openFlag.push(myInfo); //传递当前已达开的页面，点击其他区域时会捕获
		event.cancelBubble = true; //阻止事件冒泡
	};
	this.close = function() {
        animation.doAnimation("scaleHide", myInfo.element);
	}
}
//=================================================
//  右侧四方菜单区域

//=======================
//  Menu Class（包含右上角switch按钮）
function RightMenu() {
	this.element = document.querySelector("#MenuArea");
    var self = this;
	var nowPart = true;

    var save = function () {
        storage.RightMenu = nowPart?"true":"false";
    };
    this.load = function () {
        nowPart = (storage.RightMenu == "true");
        if (!nowPart) {
            this.element.style.transform = "scale(0)";
            todoList.element.style.transform = "scale(1)";
        }
    };

	this.showMore = function(element) {
		var moreNote = element.querySelector('p');
        animation.doAnimation("opacityShow", moreNote);
	};
	this.hideMore = function(element) {
		var moreNote = element.querySelector('p');
        animation.doAnimation("opacityHide", moreNote);
    };
	this.switchMode = function() {
		if (nowPart) {
            animation.doAnimation("scaleHide", rightMenu.element);
			setTimeout("animation.doAnimation('scaleShow',todoList.element)", 300);
			nowPart = false; //传递当前模块为 TodoList
		} else {
            animation.doAnimation("scaleHide", todoList.element);
			setTimeout("animation.doAnimation('scaleShow',rightMenu.element)", 300);
			nowPart = true; //传递当前模块为 四方菜单
		}
        save();
	}
}
//=======================
//  TodoList Class
function TodoList() {
	this.element = document.querySelector("#TodoListArea");
	this.inputInfo = "   请在这里输入您要添加的事项…";

	var menuEditBtns = document.querySelector("#TDL_Btn_Area");

	var load = function() {
        return JSON.parse(storage.TDL || '[]');
    };
    var save = function(Text) {
        storage.TDL = JSON.stringify(Text);
    };
    var clear = function() {
        storage.TDL = '';
    };
    var finish = function(index) {
        var list = load();
        list.splice(index - 1, 1);
        save(list);
    };
    var add = function() {
        var list = load();
        var addText = inputText.TodoList.value;
        if (addText.length == 0 || addText.length >= 35 || !addText || addText == todoList.inputInfo) {
            inputText.errorReport(inputText.TodoList);
        } else {
            list[list.length] = {
				TDL: addText
			};
            save(list);
        }
    };
    this.close = function() {
        animation.doAnimation("pushUpMenu", menuEditBtns);
    };
    this.show = function() {
        //输入检查并存储
        var list = load();
		var temp = "";
		for (var i = 0; i < list.length; i++) {
			temp += "<li>" + "<div class='checkBox_TDL'>" + "<input name='checkbox_TDL' type='checkbox' id='CB_TDL" + i + "' value='" + i + "'>" + "</div>" + list[i].TDL + "</li>";
		}
		document.querySelector("#list_TD").innerHTML = temp;
	};
	this.onEditClick = function(event) {
		for	(var i = 0;i < openFlag.length;i++){
			if(openFlag[i] == todoList){
				event.cancelBubble = true; //阻止事件冒泡
				return;
			}
		}
        animation.doAnimation("pullDownMenu", menuEditBtns);
		openFlag.push(todoList);
		event.cancelBubble = true; //阻止事件冒泡
	};
	this.doAdd = function() {
		add();
		this.show();
		inputText.clear(inputText.TodoList);
	};
	this.onClearClick = function() {
		clear();
		this.show();
		while (openFlag.length > 0) {
			openFlag.pop().close();
		}
	};
	this.onFinishClick = function() {
		var list = document.getElementsByName("checkbox_TDL");
		var length = list.length;
		for (var i = length - 1; i >= 0; i--) {
			if (list[i].checked) finish(i + 1);
		}
		this.show();
		while (openFlag.length > 0) {
			openFlag.pop().close();
		}
	}
}
//=================================================
//  底部菜单区域
//=======================
//  Search Class
function Search() {
	this.element = document.querySelector("#Search");
	this.inputInfo = " 请在这里输入您要搜索的内容…";

	var createGet = function(search_text) {
		var SEOList = {
			"Bing": "http://cn.bing.com/search?q=",
			"Google": "http://www.google.co.jp/?gws_rd=ssl#q=",
			"Bilibili": "http://search.bilibili.com/all?keyword=",
			"Github": "https://github.com/search?utf8=✓&q=",
			"Taobao": "https://s.taobao.com/search?q="
		};
		var select = document.querySelector("#SEOSelect");
		if (search_text.length == 0 || search_text == search.inputInfo) return false;
		return SEOList[select.options[select.selectedIndex].value] + search_text;
	};

	this.doSearch = function() {
		var search_text = inputText.Search.value;
		var URL = createGet(search_text);
		if (!URL) inputText.errorReport(inputText.Search);
		else window.open(URL);
		inputText.clear(inputText.Search);
	};
	this.onSearchClick = function() {
		for	(var i = 0;i < openFlag.length;i++){
			if(openFlag[i] == search){
				event.cancelBubble = true; //阻止事件冒泡
				return;
			}
		}
        animation.doAnimation("scaleShow", this.element);
		openFlag.push(search);
		event.cancelBubble = true; //阻止事件冒泡
	};
    this.close = function () {
        animation.doAnimation("scaleHide", this.element);
    };
}
//=================================================
//  Timer Part
function Timer() {
	this.element = document.querySelector("#Timer");
	this.status = true;

	var numberValue = 0;
	var birthDate = new Date();
	var self = this;
    var birthday = {
        year: 1997,
        month: 9,
        day: 22,
        set: false
    };
	var showNumber = function() {
		var numberElement = document.querySelector("#Number");
		var int = setInterval(function() {
			self.getNumberValue();
			numberElement.innerHTML = numberValue.toFixed(10);
			if (!self.status) {
				clearInterval(int);
				numberElement.innerHTML = '';
			}
		}, 100);
	};
	var show = function() {
		fullScreen(document.documentElement);
        setTimeout(function () {
            animation.doAnimation("pullDownPage", self.element);
            openFlag.push(timer);
        }, 200);
	};
    var fullScreen = function(element) {
        var fs = element.requestFullscreen
            || element.mozRequestFullScreen
            || element.webkitRequestFullscreen
            || element.msRequestFullscreen;
        fs.call(element);
    };
    var exitFullScreen = function() {
        var efs = document.exitFullscreen
            || document.mozCancelFullScreen
            || document.webkitExitFullscreen;
        efs.call(document);
    };
    var checkBirthdayInput = function (string) {
        var patten = /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])$/;
        return patten.test(string);
    };
    var save = function (string) {
        birthday.year = parseInt(string.slice(0, 4));
        birthday.month = parseInt(string.slice(4, 6));
        birthday.day = parseInt(string.slice(6, 8));
        birthday.set = true;
        storage.Birthday = JSON.stringify(birthday);
    };
    var load = function () {
        birthday = JSON.parse(storage.Birthday || JSON.stringify(birthday));
        birthDate.setFullYear(birthday.year);
        birthDate.setMonth(birthday.month - 1);
        birthDate.setDate(birthday.day);
        birthDate.setHours(0);
        birthDate.setMinutes(0);
        birthDate.setSeconds(0);
        birthDate.setMilliseconds(0);
    };

    this.setBirthday = function(string) {
        if (checkBirthdayInput(string)) {
            save(string);
            load();
            return true;
        }else return false;
    };
    this.getNumberValue = function() {
        var nowDate = new Date();
        numberValue = (nowDate.getTime() - birthDate.getTime()) / 31536000000;
    };
	this.close = function() {
        animation.doAnimation("pushUpPage", this.element);
		setTimeout(function(){
			exitFullScreen(document.documentElement);
		},300);
		self.status = false;
	};
	this.onTimerClick = function() {
        load();
		if (!birthday.set) {
			notice.sendNotice("请先设置您的生日~");
			setTimeout(function () {
				notice.setBirthday();
			},1000);
		}else {
			self.status = true;
			show();
			showNumber();
		}
	}
}

//=================================================
//  消息通知部分
function Notice() {
	this.element = document.querySelector("#Notice");
	this.inputInfo = "请输入年龄，如 19960201...";

	var self = this;
    var status = undefined;
	var container = document.querySelector("#NoticeText");
	container.innerHTML = "";

	var createBtn = function () {
		var btn = document.createElement("div");
		btn.id = "NoticeTitleBtn";
		btn.onclick = function () {
			self.onSubmitClick();
		};
		btn.appendChild(document.createTextNode("Submit"));
		container.appendChild(btn);
	};

	var createInput = function () {
		var input = document.createElement("input");
		input.id = "NoticeInput";
		input.onblur = function () {
			inputText.onBlur(this);
		};
		input.onfocus = function () {
			inputText.onFocus(this);
		};
		container.appendChild(input);
	};

	this.sendNotice = function (text) {
		container.innerHTML = text;
		show();
	};
	var login = function () {
		container.innerHTML = "请输入用户名w~：";
		createInput();
		createBtn();
        status = 'login';
		show();
	};
	this.setBirthday = function () {
		container.innerHTML = "请输入您的生日w~：";
		createInput();
		var input = document.querySelector("#NoticeInput");
		inputText.notice = input;
		inputText.changeInfo(input,'show');
		createBtn();
        status = 'birthday';
		show();
	};
	this.onSubmitClick = function () {
        if (status == 'login' || status == undefined){
		    this.sendNotice("Coming soon");
        }else if (status == 'birthday') {
			var input = document.querySelector("#NoticeInput");
			if (timer.setBirthday(input.value)){
				this.sendNotice("Submit success!");
				setTimeout(function () {
					timer.onTimerClick();
				},1000);
			}else {
                inputText.errorReport(input);
            }
        }
	};
	this.onLoginClick = function () {
		login();
	};

	var show = function () {
        animation.doAnimation("pullDownNotice", self.element);
		openFlag.push(notice);
	};
	this.close = function () {
        animation.doAnimation("pushUpNotice", this.element);
	};
}