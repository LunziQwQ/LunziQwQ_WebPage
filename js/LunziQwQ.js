ShowMyBirthday();

myInfo=document.querySelector("#MyInfo");
menuArea=document.querySelector("#MenuArea")
todoList=document.querySelector("#TodoListArea")

openFlag=false;
menuAreaFlag=true;
function ShowMyBirthday(){
    var date = new Date();
    var nowYear = date.getFullYear();
    var myAge = nowYear - 1997;
    var nowMonth = date.getMonth();
    if (nowMonth<9) myAge -= 1;
    document.querySelector("#lv").innerHTML = myAge;
}

function onLevelClick(){
	ActionAnimation('show',myInfo);
	openFlag=myInfo;
	(event||window.event).cancelBubble=true;
	//阻止事件冒泡
}

function onHideMenuClick(){
	if(menuAreaFlag){
		ActionAnimation('hide',menuArea);
		setTimeout("ActionAnimation('show', todoList)", 300);
		menuAreaFlag=false;
		
	}else{
		ActionAnimation('hide', todoList);
		setTimeout("ActionAnimation('show',menuArea)", 300);
		menuAreaFlag=true;
	}
	(event||window.event).cancelBubble=true;
	//阻止事件冒泡
}

function ActionAnimation(mode,element){
	if(mode=='show') AnimationShow(element);
	if(mode=='hide') AnimationHide(element);
}
function AnimationShow(element){
	element.className+=' showTheBlock'
	setTimeout(function(){
		element.style.transform='scale(1)'
		element.className='';
	},290)
}

function AnimationHide(element){
	element.className+=' hideTheBlock'
	setTimeout(function(){
		element.style.transform='scale(0)'
		element.className='';
	},290)
}

document.onclick=function(){
	if(openFlag){
		if(openFlag==myInfo) ActionAnimation('hide',myInfo);
		
		openFlag=false;
	}
}

function showMore(element){
	var more = element.querySelector('p');
	more.className+=' showMore';
	setTimeout(function(){
		more.style.opacity='1'	
		more.classname='';
	},290)
}

function hideMore(element){
	var more=element.querySelector('p');
	more.className+=' hideMore';
	setTimeout(function(){
		more.style.opacity='0';
		more.className='';
	},290)
}

//TODOLIST Part

storage = window.localStorage;
showTDL();
showTDLSelect();

function showTDL() {
    var list = loadTDL();
    var temp = "";
    for (var i = 0; i < list.length; i++) {
        temp += "<li>" + list[i].TDL + "</li>";
    }
    document.getElementById("list_TD").innerHTML = temp;
}

function showTDLSelect() {
    var TDLLength = loadTDL().length;
    var temp = "";
    for (var i = 0; i < TDLLength; i++) {
        var j = i + 1;
        temp += "<option value='" + j + "'>" + j + "</option>";
    }
    document.getElementById("FinishTDL").innerHTML = temp;
}

function loadTDL() {
    return JSON.parse(storage.TDL || '[]');
}

function saveTDL(nowText) {
    storage.TDL = JSON.stringify(nowText);
}

function addTDL() {
    var input = document.querySelector("#AddInput_TDL");
    var list = loadTDL();
    var addText;
    addText = input.value;
    if (addText.length == 0 || addText.length >= 35) {
        InputError(input);
    } else {
        list[list.length] = {TDL: addText};
        saveTDL(list);
    }
}

function deleteTDL(select) {
    var list = loadTDL();
    list.splice(select - 1, 1);
    saveTDL(list);
}

function clearTDL() {
    storage.TDL = '';
}

function clearInput(input) {
    input.value = "";
}

function createGetURL() {
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

function onAddClick() {
    addTDL();
    showTDL();
    showTDLSelect();
    clearInput(document.querySelector("#AddInput_TDL"));
}

function onClearClick() {
    clearTDL();
    showTDL();
    showTDLSelect();
}

function onFinishClick() {
    var select = document.getElementById("FinishTDL");
    var select_value = select.options[select.selectedIndex].value;
    deleteTDL(select_value);
    showTDL();
    showTDLSelect();
}

function onSearchClick() {
    var input = document.querySelector("#SearchInput");
    var URL = createGetURL();
    if (!URL) {
        InputError(input);
    } else {
        window.open(URL);
    }
    clearInput(input);
}

function InputError(input) {
    input.className += ' inputError';
    setTimeout(function(){
        input.className = '';
    }, 500);

}

addEventListener("keyup", function (event) {
    if (event.keyCode==13) {
        if (inputFlag == document.querySelector('#SearchInput')) {
            onSearchClick();
        } else if (inputFlag == document.querySelector('#AddInput_TDL')){
            onAddClick();
        }
    }
});