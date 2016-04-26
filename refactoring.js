animation=new Animation();
myInfo=new MyInfo();



openFlag=new Array();
menuAreaFlag=true;


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
}


function RightMenu(){

	this.element=document.querySelector("#MenuArea");

	var moreNote=this.element.querySelector('p');

	this.showMore=function(){
		animation.opacityShow(moreNote,300);
	}

	this.hideMore=function(){
		animation.opacityHide(moreNote,300);
	}

	this.switch=function(){
		if(menuAreaFlag){
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

	var pullDownMenu=document.querySelector(#TDL_Btn_Area)

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

	this.show=function(){

	}


}

function Input(){
	

}
//=================================================
//  全局变量，频繁使用的HTML元素
input_TDL=document.querySelector("#AddInput_TDL");

//=================================================
//  初始化页面，工具，显示
storage = window.localStorage;
showTDL();
changeInputInfo('show');

//=================================================
//  Flag部分，实现一些需要标记状态的逻辑
openFlag=false;
menuAreaFlag=true;

//=================================================
//  全局通用函数
function clearInput(input) {  //清空输入框中当前文本
    input.value = "";
}

function InputError(input) {  //输入错误时输入框动画
    input.className += ' inputError';
    setTimeout(function(){
        input.className = '';
    }, 500);
}

document.onclick=function(){  //点击监听，点击后隐藏OpenFlag的页面
	while(openFlag.length>0){
		openFlag.pop().close();
	}
}

addEventListener("keyup", function (event) {  //键盘Enter监听，捕获后触发对应效果
    if (event.keyCode==13) {
        if (inputFlag == document.querySelector('#SearchInput')) {
            onSearchClick();
        } else 
		if (inputFlag == input_TDL){
            onAddClick();
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
function showTDL() {  //加载显示TodoList的项目
    var list = loadTDL();
    var temp = "";
    for (var i = 0; i < list.length; i++) {
        temp += "<li>" + "<div class='checkBox_TDL'>" + "<input type='checkbox' id='" + i + "' value='" + i + "'>" + "</div>" + list[i].TDL + "</li>";
    }
    document.getElementById("list_TD").innerHTML = temp;
}



function addTDL() {  //添加新的TodoList项目
    var list = loadTDL();
    var addText;
    addText = input_TDL.value;
    //输入检查并存储
    if (addText.length == 0 || addText.length >= 35 || !addText) {
        InputError(input_TDL);
    } else {
        list[list.length] = {TDL: addText};
        saveTDL(list);
    }
}

function deleteTDL(select) {  //删除指定的TodoList项目
    var list = loadTDL();
    list.splice(select - 1, 1);
    saveTDL(list);
}


function onAddClick() {
    addTDL();
    showTDL();
    clearInput(input_TDL);
}

function onClearClick() {
    clearTDL();
    showTDL();
}

function onEditClick(){
	
}

function onFinishClick(){
	
}

function onInputFocus(){
	inputFlag =input_TDL;
	changeInputInfo('hide');
	input_TDL.style.color='black';
}

function onInputBlur(){
	changeInputInfo('show');
	input_TDL.style.color='lightgray'
}

function changeInputInfo(mode){
	if (mode == 'show') input_TDL.value="   请在这里输入您要添加的事项…";
	if (mode == 'hide') clearInput(input_TDL);
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
