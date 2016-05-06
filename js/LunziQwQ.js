//=================================================
//  对象实例化
rightMenu = new RightMenu();
animation = new Animation();
myInfo = new MyInfo();
todoList = new TodoList();
search = new Search();
inputText = new Input();
timer = new Timer();
//=================================================
//  初始化页面，工具，显示
storage = window.localStorage;
openFlag = [];
myInfo.showAge();
todoList.show();
inputText.changeInfo(inputText.TodoList,'show');
inputText.changeInfo(inputText.Search,'show');
//=================================================
//  全局事件监听
document.onclick=function(){  /*点击监听，点击页面时隐藏现已打开（openFlag）的页面*/
	if (event.target == document.querySelector("#background") || event.target == timer.element || event.target == document.querySelector("#MyPng"))
	while(openFlag.length>0){
		openFlag.pop().close();
	}
}
addEventListener("keyup", function (event) {  /*键盘Enter监听，捕获后触发对应效果*/
    if (event.keyCode==13) {
		if (inputText.nowFocus == inputText.TodoList){
           todoList.doAdd();
        }
		if (inputText.nowFocus == inputText.Search){
           search.doSearch();
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
	this.scaleHide = function(element){
		element.className += ' hideTheBlock'
		setTimeout(function(){
			element.style.transform = 'scale(0)'
			element.className = '';
		},290);
	}
	this.opacityShow = function(element){
		element.className+=' showMore';
		setTimeout(function(){
			element.style.opacity='1'	
			element.className='';
		},290);
	}
	this.opacityHide = function(element){
		element.className += ' hideMore';
		setTimeout(function(){
			element.style.opacity = '0';
			element.className = '';
		},290);
	}
	this.pullDownMenu = function(element){
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
	this.pullDownPage = function(element){
		element.className += ' pullDownPage';
		setTimeout(function(){
			element.style.height = '100%';
			element.className = '';
		},290);
	}
	this.pushUpPage = function(element){
		element.className += ' pushUpPage';
		setTimeout(function(){
			element.style.height = '0';
			element.className = '';
		},290);
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
	this.Search = document.querySelector("#SearchInput");
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
					element.value = todoList.inputInfo;
					break;
				case this.Search:
					element.value = search.inputInfo;
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
	this.show=function(event){
		animation.scaleShow(myInfo.element)
		openFlag.push(myInfo);  //传递当前已达开的页面，点击其他区域时会捕获
		event.cancelBubble=true;  //阻止事件冒泡
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
	    if (addText.length == 0 || addText.length >= 35 || !addText || addText == todoList.inputInfo) {
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
	this.onEditClick = function(event){
		animation.pullDownMenu(editMenu);
		openFlag.push(todoList);
		event.cancelBubble=true;  //阻止事件冒泡
	}
	this.doAdd = function(){
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
//=================================================
//  底部菜单区域
//=======================
//  Search Class
function Search(){
	this.element = document.querySelector("#Search");
	this.inputInfo = " 请在这里输入您要搜索的内容…"
    
    var createGet = function(search_text){
    	var SEOList = {
	        "Bing": "http://cn.bing.com/search?q=",
	        "Google": "http://www.google.co.jp/?gws_rd=ssl#q=",
	        "Bilibili": "http://search.bilibili.com/all?keyword=",
	        "Github": "https://github.com/search?utf8=✓&q=",
	        "Taobao": "https://s.taobao.com/search?q="
	    };
  		var select = document.querySelector("#SEOSelect");
	    var select_value = select.options[select.selectedIndex].value;
	    if (search_text.length == 0 || search_text == search.inputInfo) return false;
	    return SEOList[select_value] + search_text;
    }
    
	this.doSearch = function(){
		var search_text = inputText.Search.value;
		var URL = createGet(search_text);
		if (!URL) inputText.errorReport(inputText.Search);
		else window.open(URL);
		inputText.clear(inputText.Search);
	}
	this.onSearchClick = function(){
		animation.scaleShow(this.element);
		openFlag.push(search);
		event.cancelBubble=true;  //阻止事件冒泡
	}
	this.close = function(){
		animation.scaleHide(this.element)
	}
}
//=================================================
//  Timer Part
function Timer(){
	this.element = document.querySelector("#Timer");
	this.status = true;
	
	this.birthday = {year:1997,month:9,day:22,set:false};
	var numberValue = 0;
	var birthDate = new Date();
	var self = this;
	
	this.setBirthday = function(){
		birthDate.setFullYear(this.birthday.year);
		birthDate.setMonth(this.birthday.month - 1);
		birthDate.setDate(this.birthday.day);
		birthDate.setHours(0);
		birthDate.setMinutes(0);
		birthDate.setSeconds(0);
		birthDate.setMilliseconds(0);
		this.birthday.set = true;
	}
	this.getNumberValue = function(){
		var nowDate = new Date();
		numberValue = (nowDate.getTime() - birthDate.getTime()) / 31536000000;
	}
	this.showNumber = function(){
		var numberElement = document.querySelector("#Number");
		
		int = setInterval(function(){
			self.getNumberValue();
			numberElement.innerHTML = numberValue.toFixed(10);
			if(!self.status) {
				clearInterval(int);
				numberElement.innerHTML = '';
			}
		},100);
	}
	this.show = function(){
		animation.pullDownPage(this.element);
		openFlag.push(timer);
	}
	this.close = function(){
		animation.pushUpPage(this.element);
		self.status = false;
	}
	this.onTimerClick = function(){
		self.status = true;
		this.show();
		this.setBirthday();
		this.showNumber();
	}
}