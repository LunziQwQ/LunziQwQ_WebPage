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
	this.scaleShow=function(element){
		element.className+=' showTheBlock'
		setTimeout(function(){
			element.style.transform='scale(1)';
			element.className='';
		},290);
	}
	this.scaleHide=function(element){
		element.className+=' hideTheBlock'
		setTimeout(function(){
			element.style.transform='scale(0)'
			element.className='';
		},290);
	}
	this.opacityShow=function(element){
		element.className+=' showMore';
		setTimeout(function(){
			element.style.opacity='1'	
			element.className='';
		},290);
	}
	this.opacityHide=function(element){
		element.className+=' hideMore';
		setTimeout(function(){
			element.style.opacity='0';
			element.className='';
		},290);
	}
	this.pullDownMenu=function(element){
		element.className += ' pullDownMenu';
		setTimeout(function(){
			element.style.top = '0';
			element.className = '';
		},190)
	}
	this.pullUpMenu=function(element){
		element.className += ' pullUpMenu';
		setTimeout(function(){
			element.style.top = '-100px';
			element.className = '';
		},190)
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
		animation.scaleShow(myInfo.element)
		openFlag.push(myInfo);      //传递当前已达开的页面，点击其他区域时会捕获
		(event||window.event).cancelBubble=true;  //阻止事件冒泡
	}
	this.close=function(){
		animation.scaleHide(myInfo.element)
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
		animation.opacityShow(moreNote);
	}
	this.hideMore=function(element){
		var moreNote=element.querySelector('p');
		animation.opacityHide(moreNote);
	}
	this.switchMode=function(){
		if(this.nowPart){
			animation.scaleHide(rightMenu.element)
			setTimeout("animation.scaleShow(todoList.element)", 300);
			this.nowPart=false;  //传递当前模块
		}else{
			animation.scaleHide(todoList.element)
			setTimeout("animation.scaleShow(rightMenu.element)", 300);
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

	var editMenu=document.querySelector("#TDL_Btn_Area");
	this.close=function(){
		animation.pullUpMenu(editMenu)
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
	this.finish = function(index){
		var list = this.load();
		list.splice(index-1,1);
		this.save(list);
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
	        temp += "<li>" + "<div class='checkBox_TDL'>" + "<input name='checkbox_TDL' type='checkbox' id='CB_TDL" + i + "' value='" + i + "'>" + "</div>" + list[i].TDL + "</li>";
	    }
	    document.querySelector("#list_TD").innerHTML = temp;
	}
	this.onEditClick = function(){
		animation.pullDownMenu(editMenu);
		openFlag.push(todoList);
		(event||window.event).cancelBubble=true;  //阻止事件冒泡
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
		var list=document.getElementsByName("checkbox_TDL");
		var length=list.length;
		for(var i = length-1; i>=0; i--){
			if (list[i].checked) this.finish(i+1);
		}
		this.show();
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
