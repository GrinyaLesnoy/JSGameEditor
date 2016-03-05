classes.Editor.TabController = {
	objectType : 'classExtend',
	extendOf : 'classes.Editor',
	id : 'TabController',
	className : 'TabController',
	tabs : {},
	left : 0,
	//classes : {},//Локальное хранилище классов
	activate : function(id){console.log(id); 
		var lastActNode = this.view.el.getElementsByClassName('act');
		if(lastActNode[0]){
			lastActNode[0].removeClass('act');//Удаляем класс с прежнего
			document.getElementById(this.tabBox_id).getElementsByClassName('act')[0].removeClass('act'); 
		}
		$_SYS.$Get(id+'_btn').view.el.addClass('act');//Добавляем класс новому 
		var tab =  $_SYS.$Get(id);
		$_SYS.GetEl(tab).addClass('act'); 
			if(tab.mouseTab){tab.mouseTab._this_ = tab;Editor.mouseTab = tab.mouseTab;}
			Editor.Tabs[id].onResize();
		},
	addController :  function(a){ 
		this.tabs[a.id]=$_SYS._New({id : a.id+'_btn', tid : a.id, parentNode : this.view.el, view : true});
		this.tabs[a.id].view.el.textContent = a.title;
		var _this_ = this;
		$_SYS.fn.on(this.tabs[a.id].view.el, '_DOWN', function(c){  _this_.activate($_SYS.$Get(c.target.id).tid)} ,false);
		// window.addEventListener('touchstart',$_SYS.Mouse.Controls.down,false);
		 //  window.addEventListener('touchend', $_SYS.Mouse.Controls.up,false);
		  // window.addEventListener('touchmove', $_SYS.Mouse.Controls.move,false); 
	},
	__construct : function(){ },
	view : {
		$ClassStyle : {
			'.$ div' : {position:'relative', cursor:'pointer', padding:'5px 10px', 'line-height':'25px', bottom:0, 'z-index':1, border:'1px solid #111','border-radius':5, background : '#444', color : '#fff', margin:5, display: 'inline-block'},
			'.$ div.act,.$ div.act:hover' : {background : '#555', border:'1px solid #ccc'},
			'.$ div:hover' : {background : '#554'},
			'.$' : {'border-bottom' : '1px solid #000'}
		}
	}
}

classes.Editor.Tab = {
$_import : ['MapsEditor', 'DataUploader' ], 
__styles : {position : null},
	objectType : 'classExtend',
	extendOf : 'classes.Editor',
	className : 'Tab',
	title : '', 
	iOptions : {//Функции для интерфейса
		iBblocks : ['header', 'main', 'rightBar', 'leftBar'],//Блоки по умолчанию
	},
	setInterface : function(d){ 
		var options =  this.iOptions;
		if(arguments[0])options = $_SYS.fn.marge(options,arguments[0])
		var   tmp, dat = {}, d = options.iBblocks;
		for(i=0; i< d.length; i++){
			tmp = {className : 'i'+$_SYS.fn.toTitleCase(d[i])};
			if(this.id)tmp.id = tmp.className + this.id;
			dat[tmp.className]=tmp; 
		}  
		
		if(dat.iHeader) this.view.iHeader = this.view.el.addChild(dat.iHeader).position({ bottom : 'auto'});
		this.view.iMain = this.view.el.addChild(dat.iMain);
		this.view.MainCanvas = this.view.iMain.addChild({className : 'MainCanvas'});
		if(this.id)this.view.MainCanvas.id =this.id+ 'MainCanvas';//this.view.MainCanvas
		$_SYS.fn.on(this.view.iMain,'_MOUSE*', function(e,type){//console.log(arguments, e.type); //touchstart 
		//if(e.target.getParents('hasClass','iMain')[0] ) 
		Editor.mouseTab.call( ( Editor.mouseTab._this_ || e), e, type ); 
			//console.log(e, e.target.getParents('hasClass','iMain')); 
		} ,false);
		if(dat.iRightBar) this.view.iRightBar = this.view.el.addChild(dat.iRightBar).position({ left: 'auto'}); 
		//this.iMain.addEventListener
		if(dat.iLeftBar)this.view.iLeftBar = this.view.el.addChild(dat.iLeftBar).position({ right: 'auto'});
		//Выполнение функций для блоков
		for(i=0; i< d.length; i++){ if(options[d[i]])options[d[i]].call(this,this.view['i'+$_SYS.fn.toTitleCase(d[i])]);  } 
		var _this_ = this;
		setTimeout(function(){_this_.onResize();},100);
	},
	onResize : function(){
		var top = 0, right = 0, left=0;
		if(this.view.iHeader)top = this.view.iHeader.FullHeight();
		if(this.view.iRightBar){this.view.iRightBar.position({top : top, left : 'auto'}); right = this.view.iRightBar.FullWidth();}
		if(this.view.iLeftBar){this.view.iLeftBar.position({top : top, right : 'auto'}); left = this.view.iLeftBar.FullWidth(); a = this.view.iLeftBar; }  
		if(this.view.iMain)this.view.iMain.position({top : top, right : right, left : left});
		if(this.view.MainCanvas)this.view.MainCanvas.XC(this.view.iMain.XC()).YC(this.view.iMain.YC());
		if(this.updateTab)this.updateTab();/** updateTab задается из класса вкладки : функция для индивидуального обновления**/
		},
	__construct : function(){  
		 $_SYS.$Get(this.parent).TabController.addController(this); 
		
		 if(this.Init)this.Init(this);
		
		this.onResize();
	},
	view : {$ClassStyle : {
			'.$' : {display : 'none'}, 
			'.$.act' : {display : 'block'},
			'.$ .iRightBar' : {background : '#222', 'border-left': '3px solid #444', 'overflow-y': 'auto' },
			'.$ .iRightBar *' : {position : 'relative' },
			'.$ .iLeftBar' : {background : '#222', 'border-right': '3px solid #444' },
			//'.$ :not(.iMain) *' : {position:'relative'},
			'.$ .iMain' : {background : '#555', border : '1px solid #333', overflow:'hidden'},
			'.$ .MainCanvas' : {background : '#000'}
		}
		}
}