//=================================================
//  对象实例化
rightMenu = new RightMenu();
animation = new Animation();
myInfo = new MyInfo();
todoList = new TodoList();
inputText = new Input();
//=================================================
//  初始化页面，工具，显示
storage = window.localStorage;
openFlag = new Array();
myInfo.showAge();
todoList.show();
inputText.changeInfo(inputText.TodoList,'show');
//=================================================
//  全局事件监听
document.onclick=function(){  /*点击监听，点击页面时隐藏现已打开（openFlag）的页面*/
	while(openFlag.length>0){
		openFlag.pop().close();
	}
}
addEventListener("keyup", function (event) {  /*键盘Enter监听，捕获后触发对应效果*/
    if (event.keyCode==13) {
		if (inputText.nowFocus == inputText.TodoList){
           todoList.onAddClick();
        }
    }
});
//=================================================
//  页面动画类
function Animation(){
	this.scaleShow=function(element,time){
		element.className+=' showTheBlock'
		element.style.animationDuration=time+'ms';
		setTimeout(function(){
			element.style.transform='scale(1)';
			element.className='';
		},time-10);
	}
	this.scaleHide=function(element,time){
		element.className+=' hideTheBlock'
		element.style.animationDuration=time+'ms';
		setTimeout(function(){
			element.style.transform='scale(0)'
			element.className='';
		},time-10);
	}
	this.opacityShow=function(element,time){
		element.className+=' showMore';
//		element.style.animationDuration = time + 'ms';
		setTimeout(function(){
			element.style.opacity='1'	
			element.classname='';
		},time-10);
	}
	this.opacityHide=function(element,time){
		element.className+=' hideMore';
//		element.style.animationDuration = time + 'ms';
		setTimeout(function(){
			element.style.opacity='0';
			element.classname='';
		},time-10);
	}
	this.pullDownMenu=function(element,time){
		element.classname += ' pullDownMenu';
		element.style.animationDuration = time + 'ms';
		setTimeout(function(){
			element.style.top = '0';
			element.className = '';
		},time-10)
	}
	this.pullUpMenu=function(element,time){
		element.classname += ' pullUpMenu';
//		element.style.animationDuration = time + 'ms';
		setTimeout(function(){
			element.style.top = '-100';
			element.className = '';
		},time-10)
	}
	this.inputError=function(element){
	    element.className += ' inputError';
	    setTimeout(function(){
	        element.className = '';
	    }, 500);
	}
}
//=================================================
//  输入框类
function Input(){
	this.TodoList = document.querySelector("#AddInput_TDL");
	this.nowFocus = '';

	this.clear=function(element){
		element.value='';
	}
	this.errorReport=function(element){
		animation.inputError(element);
	}
	this.onFocus = function(element){
		this.nowFocus=element;
		this.changeInfo(element,'hide');
		element.style.color='black';
	}
	this.onBlur=function(element){
		this.changeInfo(element,'show');
		element.style.color='lightgray';
	}
	this.changeInfo=function(element,mode){
		if (mode == 'show') {
			switch(element){
				case this.TodoList:
					element.value=todoList.inputInfo;
					break;
			}
		}else{
			this.clear(element);
		}
	}
}
//=================================================
//  左上角个人信息类
function MyInfo(){
	this.element=document.querySelector("#MyInfo");
	
	this.showAge=function(){
		var date = new Date();
    	var nowYear = date.getFullYear();
    	var myAge = nowYear - 1997;
    	var nowMonth = date.getMonth();
    	if (nowMonth<9) myAge -= 1;
    	document.querySelector("#lv").innerHTML = myAge;
	}
	this.show=function(){
		animation.scaleShow(myInfo.element,300)
		openFlag.push(myInfo);      //传递当前已达开的页面，点击其他区域时会捕获
		(event||window.event).cancelBubble=true;  //阻止事件冒泡
	}
	this.close=function(){
		animation.scaleHide(myInfo.element,300)
	}
}

//=================================================
//  右侧四方菜单区域

//=======================
//  Menu Class（包含右上角switch按钮）
function RightMenu(){
	this.element=document.querySelector("#MenuArea");
	this.nowPart=true;

	this.showMore=function(element){
		var moreNote=element.querySelector('p');
		animation.opacityShow(moreNote,300);
	}
	this.hideMore=function(element){
		var moreNote=element.querySelector('p');
		animation.opacityHide(moreNote,300);
	}
	this.switchMode=function(){
		if(this.nowPart){
			animation.scaleHide(rightMenu.element,300)
			setTimeout("animation.scaleShow(todoList.element,300)", 300);
			this.nowPart=false;  //传递当前模块
		}else{
			animation.scaleHide(todoList.element,300)
			setTimeout("animation.scaleShow(rightMenu.element,300)", 300);
			this.nowPart=true;   //传递当前模块
		}
		(event||window.event).cancelBubble=true;  //阻止事件冒泡
	}
}
//=======================
//  TodoList Class
function TodoList(){
	this.element=document.querySelector("#TodoListArea");
	this.inputInfo="   请在这里输入您要添加的事项…";

	this.pullDownMenu=document.querySelector("#TDL_Btn_Area");
	this.pullDownMenu.close=function(){
		animation.pullUpMenu(this.pullDownMenu,200)
	}
	this.load=function(){
   		return JSON.parse(storage.TDL || '[]');
	}
	this.save=function(Text){
    	storage.TDL = JSON.stringify(Text);
	}
	this.clear = function(){
		storage.TDL='';
	}
	this.add = function(){
	    var list = this.load();
	    var addText = inputText.TodoList.value;
	    //输入检查并存储
	    if (addText.length == 0 || addText.length >= 35 || !addText) {
	        inputText.errorReport(inputText.TodoList);
	    } else {
	        list[list.length] = {TDL: addText};
	        this.save(list);
	    }
	}
	this.show = function(){
	    var list = this.load();
	    var temp = "";
	    for (var i = 0; i < list.length; i++) {
	        temp += "<li>" + "<div class='checkBox_TDL'>" + "<input type='checkbox' id='" + i + "' value='" + i + "'>" + "</div>" + list[i].TDL + "</li>";
	    }
	    document.querySelector("#list_TD").innerHTML = temp;
	}
	this.onEditClick = function(){
		animation.pullDownMenu(this.pullDownMenu,200);
		openFlag.push(this.pullDownMenu);
	}
	this.onAddClick = function(){
	    this.add();
	    this.show();
	    inputText.clear(inputText.TodoList);
	}
	this.onClearClick = function(){
	    this.clear();
	    this.show();
	}
	this.onFinishClick = function(){
		
	}
}

//=======================
//  Search Part
function createGetURL() {  //处理搜索内容并生成Get请求
    var SEOList = {
        "Bing": "http://cn.bing.com/search?q=",
        "Google": "http://www.google.co.jp/?gws_rd=ssl#q=",
        "Bilibili": "http://search.bilibili.com/all?keyword=",
        "Github": "https://github.com/search?utf8=✓&q=",
        "Taobao": "https://s.taobao.com/search?q="
    };
    var select = document.getElementById("SEOSelect");
    var select_value = select.options[select.selectedIndex].value;
    var search_text = document.getElementById("SearchInput").value;
    if (search_text.length == 0) return false;
    return SEOList[select_value] + search_text;
}

function onSearchClick() {
    var input = document.querySelector("#SearchInput");
    var URL = createGetURL();
    //输入检查并跳转新窗口
    if (!URL){ InputError(input);}
  	else{ window.open(URL);}
  	
    clearInput(input);
}
