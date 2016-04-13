ShowMyBirthday();

myInfo=document.querySelector("#MyInfo");
menuArea=document.querySelector("#MenuArea")

openFlag=false;
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
	ActionAnimation('hide',menuArea);
	openFlag=menuArea;
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
		
		if(openFlag==menuArea) ActionAnimation('show',menuArea);
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



