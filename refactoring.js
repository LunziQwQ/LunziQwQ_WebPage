
//=================================================
//  初始化页面，工具，显示
storage=window.localStorage;
openFlag = new Array();
animation = new Animation();
myInfo = new MyInfo();
todoList=new TodoList();
input = new Input();


todoList.show();
input.changeInfo(input.TodoList,'show');
myInfo.showAge();



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

	this.onclick=function(){
		animation.scaleShow(myInfo.element,300)
		openFlag.push(myInfo.element);      //传递当前已达开的页面，点击其他区域时会捕获
		(event||window.event).cancelBubble=true;  //阻止事件冒泡
	}

	this.close=function(){
		animation.scaleHide(myInfo.element,300)
	}

}

function Animation(){

	this.scaleShow=function(element,time){
		element.className+=' showTheBlock'
		element.style.animationDuration=time+'ms';
		setTimeout(function(){
			element.style.transform='scale(1)';
			element.className='';
		},time);
	}

	this.scaleHide=function(element,time){
		element.className+=' hideTheBlock'
		element.style.animationDuration=time+'ms';
		setTimeout(function(){
			element.style.transform='scale(0)'
			element.className='';
		},time);
	}

	this.opacityShow=function(element,time){
		element.className+=' showMore';
		element.style.animationDuration=time+'ms';
		setTimeout(function(){
			element.style.opacity='1'	
			element.classname='';
		},time);
	}

	this.opacityHide=function(element,time){
		element.className+=' hideMore';
		element.style.animationDuration=time+'ms';
		setTimeout(function(){
			element.style.opacity='0';
			element.classname='';
		},time);
	}

	this.pullDownMenu=function(element,time){
		element.classname+=' pullDownMenu';
		element.style.animationDuration=time+'ms';
		setTimeout(function(){
			element.style.top='0';
			element.className='';
		},time)
	}

	this.inputError=function(element){
	    element.className += ' inputError';
	    setTimeout(function(){
	        element.className = '';
	    }, 500);
	}
}


function RightMenu(){

	this.element=document.querySelector("#MenuArea");

	this.nowPart=true;

	var moreNote=this.element.querySelector('p');

	this.showMore=function(){
		animation.opacityShow(moreNote,300);
	}

	this.hideMore=function(){
		animation.opacityHide(moreNote,300);
	}

	this.switch=function(){
		if(this.nowPart){
			animation.scaleHide(RightMenu.element,300)
			setTimeout("animation.scaleShow(TodoList.element,300)", 300);
			menuAreaFlag=false;  //传递当前模块
		}else{
			animation.scaleHide(TodoList.element,300)
			setTimeout("animation.scaleShow(RightMenu.element,300)", 300);
			menuAreaFlag=true;   //传递当前模块
		}
		(event||window.event).cancelBubble=true;  //阻止事件冒泡
	}
}


function TodoList(){

	this.element=document.querySelector("#TodoListArea");

	this.inputInfo="   请在这里输入您要添加的事项…";

	var pullDownMenu=document.querySelector(#TDL_Btn_Area);

	this.load=function(){
   		return JSON.parse(storage.TDL || '[]');
	}

	this.save=function(Text){
    	storage.TDL = JSON.stringify(Text);
	}

	this.clear=function(){
		storage.TDL='';
	}

	this.onEditClick=function(){
		animation.pullDownMenu(pullDownMenu,200);
	}

	this.add=function(){
	    var list = this.load();
	    var addText = input.TodoList.value;
	    //输入检查并存储
	    if (addText.length == 0 || addText.length >= 35 || !addText) {
	        input.errorReport(input.TodoList);
	    } else {
	        list[list.length] = {TDL: addText};
	        this.save(list);
	    }
	}

	this.show=function(){
	    var list = this.load();
	    var temp = "";
	    for (var i = 0; i < list.length; i++) {
	        temp += "<li>" + "<div class='checkBox_TDL'>" + "<input type='checkbox' id='" + i + "' value='" + i + "'>" + "</div>" + list[i].TDL + "</li>";
	    }
	    document.querySelector("#list_TD").innerHTML = temp;
	}

	this.onAddClick = function(){
	    this.add();
	    this.show();
	    input.clear(input.TodoList);
	}

	this.onClearClick = function(){
	    this.clear();
	    this.show();
	}

}

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
//  全局变量，频繁使用的HTML元素




//=================================================

//=================================================
//  全局通用函数



document.onclick=function(){  //点击监听，点击后隐藏OpenFlag的页面
	while(openFlag.length>0){
		openFlag.pop().close();
	}
}

addEventListener("keyup", function (event) {  //键盘Enter监听，捕获后触发对应效果
    if (event.keyCode==13) {
		if (input.nowFocus == input.TodoList){
           todoList.onAddClick();
        }
    }
});

//=================================================

//=======================
//  各种类型动画，传递触发元素

//=================================================
//  左上角Lv区域

//=================================================


//=================================================
//  右侧四方菜单功能区域

//=======================
//  Menu Part


//=======================
//  TodoList Part





function deleteTDL(select) {  //删除指定的TodoList项目
    var list = loadTDL();
    list.splice(select - 1, 1);
    saveTDL(list);
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
