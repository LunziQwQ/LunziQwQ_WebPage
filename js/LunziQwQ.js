"use strict";
//=================================================
//  对象实例化 初始化定义的每一个类
var rightMenu = new RightMenu();    //右侧四方菜单
var animation = new Animation();    //js动画类
var myInfo = new MyInfo();          //点击左上角后显示的信息控件
var todoList = new TodoList();      //右侧TodoList
var search = new Search();          //底部菜单搜索按钮及控件
var inputText = new Input();        //输入框类
var timer = new Timer();            //底部菜单Timing按钮及控件
var notice = new Notice();          //通知提示类
//=================================================
//  初始化页面，工具，显示，在页面渲染时需要加载或修改的部分
var storage = window.localStorage;
var openFlag = [];                  //存储当前页面中悬浮的控件
myInfo.showAge();                   //根据当前日期计算显示左上角的level（年龄）
todoList.show();                    //加载存储在 缓存 的TodoList条目
rightMenu.load();                   //根据缓存中上次页面关闭的状态渲染右侧为（Menu/TodoList）
inputText.changeInfo(inputText.TodoList, 'show');   //显示TodoList输入框的提示信息
inputText.changeInfo(inputText.Search, 'show');     //显示Search输入框的提示信息
//=================================================
//  全局事件监听
document.onclick = function() {     //监听 （背景/Timer/立绘） 上的点击事件
    if (event.target == document.querySelector("#background")
        || event.target == timer.element
        || event.target == document.querySelector("#MyPng")
    ){
        while (openFlag.length > 0) {
            openFlag.pop().close(); //遍历openFlag数组并调用对应控件的关闭方法
        }
    }
};
addEventListener("keyup", function(event) { //监听键盘的Enter键松开事件
	if (event.keyCode == 13) {      //当焦点在输入框并按下Enter时，调用对应的方法
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
    var list = {    //常用的动画列表及参数，执行动画时将 key（动画类型）以及DOM元素 传入doAnimation（）方法
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
    /**
    * 执行预设的css动画
    * @param {String} mode 本类中list的Key，选择动画类型
    * @param {object} element 指定动画绑定的DOM元素
    * */
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
    //页面中各个输入框的DOM元素
	this.TodoList = document.querySelector("#AddInput_TDL");
	this.Search = document.querySelector("#SearchInput");
	this.notice = document.querySelector("#NoticeInput");

	this.nowFocus = ''; //当前焦点所在的输入框

	this.clear = function(element) {    //清除输入框内容
		element.value = '';
	};
	this.errorReport = function(element) {  //输入错误反馈抖动动画
        animation.doAnimation("inputError", element);
	};
	this.onFocus = function(element) {      //获得焦点时清除提示内容，字体颜色变黑
		this.nowFocus = element;
		this.changeInfo(element, 'hide');
		element.style.color = 'black';
	};
	this.onBlur = function(element) {       //失去焦点时显示提示内容，字体颜色变灰
		if (element.value == '') {
			this.changeInfo(element, 'show');
		}
		element.style.color = 'lightgray';
	};
    /**
     * 显示提示信息/清空提示信息
     * @param {Object} element 作用的DOM元素
     * @param {String} mode 显示/清空（'show'/'hide'）
     */
	this.changeInfo = function(element, mode) { //
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
	this.element = document.querySelector("#MyInfo");   //类对应的DOM元素

    //根据当前日期计算我的年龄，并显示在左上角
	this.showAge = function() {
		var date = new Date();
		var nowYear = date.getFullYear();
		var myAge = nowYear - 1997 + '';
		var nowMonth = date.getMonth();
		if (nowMonth < 9) myAge -= 1;
		document.querySelector("#lv").innerHTML = myAge;
	};
    //显示我的信息控件
	this.show = function(event) {
		for	(var i = 0;i < openFlag.length;i++){    //当控件已经显示时阻止再次点击重复动画
			if(openFlag[i] == myInfo){
				event.cancelBubble = true;          //阻止事件冒泡
				return;
			}
		}
        animation.doAnimation("scaleShow", myInfo.element); //控件显示动画
		openFlag.push(myInfo);                      //将已达开的控件传入openFlag
		event.cancelBubble = true;                  //阻止事件冒泡
	};
	this.close = function() {
        animation.doAnimation("scaleHide", myInfo.element); //控件关闭动画
	}
}
//=================================================
//  右侧四方菜单区域

//=======================
//  Menu Class（包含右上角switch按钮）
function RightMenu() {
	this.element = document.querySelector("#MenuArea"); //类对应的DOM元素
	var nowPart = true;     //当前显示的部分 （true：Menu / false：TodoList）

    //将当前显示状态存入缓存
    var save = function () {
        storage.RightMenu = nowPart?"true":"false";
    };
    //读取缓存中记录的显示状态并改变页面
    this.load = function () {
        nowPart = (storage.RightMenu == "true");
        if (!nowPart) {
            this.element.style.transform = "scale(0)";
            todoList.element.style.transform = "scale(1)";
        }
    };

    //菜单详情hover动画
	this.showMore = function(element) {
		var moreNote = element.querySelector('p');
        animation.doAnimation("opacityShow", moreNote);
	};
	this.hideMore = function(element) {
		var moreNote = element.querySelector('p');
        animation.doAnimation("opacityHide", moreNote);
    };

    //点击左上角时切换显示状态
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
        save();             //缓存当前状态
	}
}
//=======================
//  TodoList Class
function TodoList() {
	this.element = document.querySelector("#TodoListArea");     //类对应的DOM元素
	this.inputInfo = "   请在这里输入您要添加的事项…";            //输入框的提示信息

	var menuEditBtns = document.querySelector("#TDL_Btn_Area"); //TodoList中包含三个Edit按钮菜单的DOM元素

    //读取缓存中的TodoList条目，返回Object数组
	var load = function() {
        return JSON.parse(storage.TDL || '[]');
    };
    /**
     * 缓存当前TodoList条目
     * @param {Array} Text 当前所有条目的列表
     */
    var save = function(Text) {
        storage.TDL = JSON.stringify(Text);
    };
    //清空TodoList条目
    var clear = function() {
        storage.TDL = '';
    };
    /**
     * 删除选中的TodoList条目
     * @param {int} index 选中的条目下标
     */
    var finish = function(index) {
        var list = load();
        list.splice(index - 1, 1);
        save(list);
    };
    //添加新的TodoList条目
    var add = function() {
        var list = load();
        var addText = inputText.TodoList.value;
        if (addText.length == 0 || addText.length >= 35 || !addText || addText == todoList.inputInfo) {
            inputText.errorReport(inputText.TodoList);      //若输入为空或长度大于35字符，反馈输入错误
        } else {
            list[list.length] = {       //条目为JSON结构对象集合
				TDL: addText
			};
            save(list);
        }
    };
    //Edit按钮的弹回动画
    this.close = function() {
        animation.doAnimation("pushUpMenu", menuEditBtns);
    };
    //读取缓存并将所有TodoList条目显示在页面上
    this.show = function() {
        var list = load();
		var temp = "";
		for (var i = 0; i < list.length; i++) {     //以HTML格式构建字符串
			temp += "<li>" + "<div class='checkBox_TDL'>" + "<input name='checkbox_TDL' type='checkbox' id='CB_TDL" + i + "' value='" + i + "'>" + "</div>" + list[i].TDL + "</li>";
		}
		document.querySelector("#list_TD").innerHTML = temp;    //输入页面
	};
    //点击Edit按钮时的动画效果
	this.onEditClick = function(event) {
        //阻止控件已显示后再次点击出现重复动画
		for	(var i = 0;i < openFlag.length;i++){
			if(openFlag[i] == todoList){
				event.cancelBubble = true;                      //阻止事件冒泡
				return;
			}
		}
        animation.doAnimation("pullDownMenu", menuEditBtns);    //下拉菜单动画
		openFlag.push(todoList);                                //将已达开的控件传入openFlag
		event.cancelBubble = true;                              //阻止事件冒泡
	};
    //在输入框按下Enter后将当前输入框内容添加到条目
	this.doAdd = function() {
		add();          //添加新条目
		this.show();    //重新渲染控件
		inputText.clear(inputText.TodoList);//清空输入框
	};
    //点击CLear后清空TodoList
	this.onClearClick = function() {
		clear();        //清空条目
		this.show();    //重新渲染控件
        //点击后收回下拉菜单
		while (openFlag.length > 0) {
			openFlag.pop().close();
		}
	};
    //点击Finish后删除指定条目
	this.onFinishClick = function() {
		var list = document.getElementsByName("checkbox_TDL");
		var length = list.length;
		for (var i = length - 1; i >= 0; i--) { //遍历获得已选中的条目下标
			if (list[i].checked) finish(i + 1); //对已选中的条目调用finish方法
		}
		this.show();
        //点击后收回下拉菜单
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
	this.element = document.querySelector("#Search");   //类对应的DOM元素
	this.inputInfo = " 请在这里输入您要搜索的内容…";      //输入框的提示信息

    /**
     * 根据输入框内容生成对应的Get请求URL
     * @param {String} search_text 输入框中的搜索内容
     * @returns {*} 结合搜索内容后的Get请求URL
     */
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
    //打开新窗口发起createGet方法获得的Get请求
	this.doSearch = function() {
		var search_text = inputText.Search.value;
		var URL = createGet(search_text);
		if (!URL) inputText.errorReport(inputText.Search);  //若URL错误反馈输入错误
		else window.open(URL);                              //新窗口发起请求
		inputText.clear(inputText.Search);                  //清空输入框
	};
    //点击下部search按钮后显示控件动画
	this.onSearchClick = function() {
        //防止控件已显示时再次点击重复动画
		for	(var i = 0;i < openFlag.length;i++){
			if(openFlag[i] == search){
				event.cancelBubble = true;  //阻止事件冒泡
				return;
			}
		}
        animation.doAnimation("scaleShow", this.element);   //控件显示动画
		openFlag.push(search);              //将已显示的控件传入openFlag
		event.cancelBubble = true;          //阻止事件冒泡
	};
    //关闭控件动画
    this.close = function () {
        animation.doAnimation("scaleHide", this.element);
    };
}
//=================================================
//  Timer Part
function Timer() {
    this.element = document.querySelector("#Timer");    //类对应的DOM元素
    var numberValue = 0;    //屏幕中央显示数值
    var self = this;

	this.status = true;         //当前控件状态（打开/关闭）
    var birthDate = new Date(); //用户生日日期
    var birthday = {            //生日JSON，缓存与计算过度对象
        year: 1997,
        month: 9,
        day: 22,
        set: false
    };

    //每隔100ms渲染页面，显示跳动数字
	var showNumber = function() {
		var numberElement = document.querySelector("#Number");
		var int = setInterval(function() {                      //每隔100ms运行一次
			self.getNumberValue();                              //计算用户生日与当前日期年差
			numberElement.innerHTML = numberValue.toFixed(10);  //数值保留十位小数，渲染页面
			if (!self.status) {                                 //当status为false时停止运算
				clearInterval(int);
				numberElement.innerHTML = '';
			}
		}, 100);
	};
    //控件显示动动画
	var show = function() {
		fullScreen(document.documentElement);   //调用全屏API
        setTimeout(function () {
            animation.doAnimation("pullDownPage", self.element);//控件显示动画
            openFlag.push(timer);                               //将已打开的控件传入openFlag
        }, 200);
	};
    //调用各浏览器全屏API
    var fullScreen = function(element) {
        var fs = element.requestFullscreen
            || element.mozRequestFullScreen
            || element.webkitRequestFullscreen
            || element.msRequestFullscreen;
        fs.call(element);
    };
    //调用各浏览器退出全屏API
    var exitFullScreen = function() {
        var efs = document.exitFullscreen
            || document.mozCancelFullScreen
            || document.webkitExitFullscreen;
        efs.call(document);
    };
    /**
     * 检查输入的动画是否合法
     * @param {String} string 用户输入的内容
     * @returns {boolean} 是否合法
     */
    var checkBirthdayInput = function (string) {
        var patten = /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])$/;
        return patten.test(string);
    };
    //缓存输入的生日
    var save = function (string) {
        birthday.year = parseInt(string.slice(0, 4));
        birthday.month = parseInt(string.slice(4, 6));
        birthday.day = parseInt(string.slice(6, 8));
        birthday.set = true;        //是否设置过生日
        storage.Birthday = JSON.stringify(birthday);
    };
    //读取缓存的生日
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
    /**
     * 设置用户生日
     * @param {String} string 用户输入内容
     * @returns {boolean} 是否设置成功
     */
    this.setBirthday = function(string) {
        if (checkBirthdayInput(string)) {   //检查日期是否合法
            save(string);                   //缓存生日
            load();                         //读取设置Date
            return true;
        }else return false;
    };
    //获得用户生日日期与当前日期的年差
    this.getNumberValue = function() {
        var nowDate = new Date();
        numberValue = (nowDate.getTime() - birthDate.getTime()) / 31536000000;
    };
    //关闭控件动画
	this.close = function() {
        animation.doAnimation("pushUpPage", this.element);  //关闭控件动画
		setTimeout(function(){
			exitFullScreen(document.documentElement);       //退出全屏
		},300);
		self.status = false;                                //停止运算
	};
    //点击下方Timing!按钮时逻辑
	this.onTimerClick = function() {
        load();                                     //读取缓存
		if (!birthday.set) {                        //缓存不存在时提示用户输入
			notice.sendNotice("请先设置您的生日~");
			setTimeout(function () {
				notice.setBirthday();
			},1000);
		}else {                                     //缓存存在时打开控件
			self.status = true;
			show();
			showNumber();
		}
	}
}

//=================================================
//  消息通知类
function Notice() {
	this.element = document.querySelector("#Notice");   //对应类的DOM元素
	this.inputInfo = "请输入年龄，如 19960201...";       //对应的输入框提示信息

	var self = this;
    var status = undefined;                             //当前生成的通知类型
	var container = document.querySelector("#NoticeText");  //生成通知的固定容器
	container.innerHTML = "";                           //容器初始化

    //生成subimt按钮
	var createBtn = function () {
		var btn = document.createElement("div");
		btn.id = "NoticeTitleBtn";
		btn.onclick = function () {
			self.onSubmitClick();
		};
		btn.appendChild(document.createTextNode("Submit"));
		container.appendChild(btn);
	};
    //生成输入框
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
    //生成消息通知
	this.sendNotice = function (text) {
		container.innerHTML = text;
		show();
	};
    //生成login通知
	var login = function () {
		container.innerHTML = "请输入用户名w~：";
		createInput();
		createBtn();
        status = 'login';
		show();
	};
    //生成设置生日通知
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
    //点击submit按钮时执行对应方法
	this.onSubmitClick = function () {
        if (status == 'login' || status == undefined){  //根据当前通知类型执行对应submit
		    this.sendNotice("Coming soon");
        }else if (status == 'birthday') {
			var input = document.querySelector("#NoticeInput");
			if (timer.setBirthday(input.value)){
				this.sendNotice("Submit success!");
				setTimeout(function () {
					timer.onTimerClick();
				},1000);
			}else {
                inputText.errorReport(input);       //反馈输入错误
            }
        }
	};
    //点击下部菜单Login按钮调用login()方法
	this.onLoginClick = function () {
		login();
	};
    //显示通知控件动画
	var show = function () {
        animation.doAnimation("pullDownNotice", self.element);
		openFlag.push(notice);
	};
    //关闭控件动画
	this.close = function () {
        animation.doAnimation("pushUpNotice", this.element);
	};
}