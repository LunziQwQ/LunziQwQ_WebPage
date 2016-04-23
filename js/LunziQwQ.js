//=================================================
//  全局变量，频繁使用的HTML元素
myInfo=document.querySelector("#MyInfo");
menuArea=document.querySelector("#MenuArea");
todoList=document.querySelector("#TodoListArea");
input_TDL=document.querySelector("#AddInput_TDL");

//=================================================
//  初始化页面，工具，显示
storage = window.localStorage;
ShowMyBirthday();
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
	if(openFlag){
		if(openFlag==myInfo) ActionAnimation('hide',myInfo);		
		openFlag=false;
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
//  页面动画部分
function ActionAnimation(mode,element){  //触发页面动画，传递动画类型和触发元素
	if(mode=='show') AnimationShow(element);
	if(mode=='hide') AnimationHide(element);
}

//=======================
//  各种类型动画，传递触发元素
function AnimationShow(element){  //缩放显示
	element.className+=' showTheBlock'
	setTimeout(function(){
		element.style.transform='scale(1)'
		element.className='';
	},290)
}
function AnimationHide(element){  //缩放隐藏
	element.className+=' hideTheBlock'
	setTimeout(function(){
		element.style.transform='scale(0)'
		element.className='';
	},290)
}

//=================================================
//  左上角Lv区域
function ShowMyBirthday(){  //计算年龄并显示
    var date = new Date();
    var nowYear = date.getFullYear();
    var myAge = nowYear - 1997;
    var nowMonth = date.getMonth();
    if (nowMonth<9) myAge -= 1;
    document.querySelector("#lv").innerHTML = myAge;
}

function onLevelClick(){  //点击lv部分显示个人信息
	ActionAnimation('show',myInfo);
	openFlag=myInfo;      //传递当前已达开的页面，点击其他区域时会捕获
	(event||window.event).cancelBubble=true;  //阻止事件冒泡
}

//=================================================
//  右上角切换模块按钮
function onSwitchClick(){
	if(menuAreaFlag){
		ActionAnimation('hide',menuArea);
		setTimeout("ActionAnimation('show', todoList)", 300);
		menuAreaFlag=false;  //传递当前模块
	}else{
		ActionAnimation('hide', todoList);
		setTimeout("ActionAnimation('show',menuArea)", 300);
		menuAreaFlag=true;   //传递当前模块
	}
	(event||window.event).cancelBubble=true;  //阻止事件冒泡
}

//=================================================
//  右侧四方菜单功能区域

//=======================
//  Menu Part
function showMore(element){  //鼠标焦点在菜单上时显示详细
	var more = element.querySelector('p');
	more.className+=' showMore';
	setTimeout(function(){
		more.style.opacity='1'	
		more.classname='';
	},290)
}

function hideMore(element){  //鼠标焦点离开菜单上时隐藏详细
	var more=element.querySelector('p');
	more.className+=' hideMore';
	setTimeout(function(){
		more.style.opacity='0';
		more.className='';
	},290)
}

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

function saveTDL(nowText) {  //将当前的TodoList存储进LocalStorage
    storage.TDL = JSON.stringify(nowText);
}

function loadTDL() {  //读取LocalStorage中存储的TodoList项目
    return JSON.parse(storage.TDL || '[]');
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

function clearTDL() {  //清空TodoList
    storage.TDL = '';
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
