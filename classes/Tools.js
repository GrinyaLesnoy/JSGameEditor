classes.Tools = {
	objectType : 'class', 
	className : 'toolBar',

	 
	Select : {
		act : 'standart',  
		cursor : 'default',
		selected : {},
		count : 0,
		selectedItem : false,//Нужен для манипуляций со снятием выделения
		Empty : true,
		moving : false,
		icon : [0,0],
		selectedId : false,//Сюда записывается id выделенного объекта
		deSelect : function(i){ 
				this.selectedId = false;
			if(i=='all'){
				for(var i in this.selected){this.selected[i].removeClass('select'); delete this.selected[i]; } 
				this.Empty =true; 
			}else{
				this.selected[i].removeClass('select'); delete this.selected[i];
				for(var i in this.selected){this.selectedId = i; } 
				if(Object.keys(this.selected).length==0)this.Empty =true;
			}
			this.count=Object.keys(this.selected).length;
			 //Когда остался один объект, переходим на его слой
			if(this.count==1&&this.Tools.Options.Layers)this.Tools.Options.Layers.reAct(this.selected[this.selectedId].info.Layer); 
		},
		fn_do : function(e,act){
			this.deSelect('all');
			this.fn({target:e},'down');
			this.fn({target:e},'up');
		},
		fn : function(e, act){ 
		//Добавить расчет положения и масштаба canvas
		var Mouse = this.Tools.Mouse;
				switch (act){
					case 'down':
						//unSelectNode(e.parentElement);e.addClass('check');
						var s;
						if(e.target.hasClass('item')){
								this.d = this.Tools.MainCanvas;  
							if(!this.selected[e.target.id]){//если не клик по выделенному
								if(!$_SYS.Key.isDown('SHIFT'))this.deSelect('all');
								this.selected[e.target.id] = e.target;
								e.target.addClass('select');  
								//Переходим на слой, где находится выделенный объект
								if(this.Tools.Options.Layers)this.Tools.Options.Layers.reAct(e.target.info.Layer);
								this.Empty = false;
							} else if($_SYS.Key.isDown('SHIFT')){this.selectedItem = e.target;}
							
							 
							 for(var i in this.selected){this.selected[i].delta = {x : this.selected[i]._X()-this.d.mouse_x, y : this.selected[i]._Y()-this.d.mouse_y}; this.selectedId = i;}
						}else if(!$_SYS.Key.isDown('SHIFT') && !this.Empty && (s = e.target.getParents('className','iMain')[0])){  
							console.log('deselect');
							this.deSelect('all');
						};
						this.count=Object.keys(this.selected).length; 
					break;
					case 'move':
						if($_SYS.Mouse.press){ 
							//for(var i this.selected){} 
						 for(var i in this.selected){
							this.selected[i]._X(parseInt(this.d.mouse_x+this.selected[i].delta.x))._Y(parseInt(this.d.mouse_y+this.selected[i].delta.y));
							//console.log(this.selected[i]._X());
						 }
						 this.moving=true;
						}
					break;
					case 'up':
						 if(this.moving){}else
						 
						 if(this.selectedItem && $_SYS.Key.isDown('SHIFT')){
							this.deSelect(this.selectedItem.id);
						 }
						 this.selectedItem = false;
						this.moving=false;
					break;
				} 
				//this.options(act); 
				 if(this.Tools.Options.fn.Select){this.Tools.Options.fn.Select.call(this);}//, this.selected[this.selectedId],this.optionsBar
			},
			init : function(){
				this.canvas = this.Tools.MainCanvas;//e.target.getParents('hasClass','MainCanvas'); 
				if(this.optionsBar)this.optionsBar.Items = $_SYS._New(classes.Controllers.ItemsBox,{IList:['Ground','Gate'],parentNode:this.optionsBar.view.box}); 
			},
			optionsItem : 0, //Для обновления опций при изменеие выделений
			options : function(act){ 
				// console.log(this.optionsBar.view.box ,this.selected,JSON.stringify(this.selected));
				var output = '';
				if(this.count===0){
					//this.selected
				}else if(this.count===1){
					//this.selected
					var Item = this.selected[this.selectedId], data = Item.data; 
					  
					
					console.log(data,JSON.stringify(this.selected[this.selectedId]),this.optionsBar) ;
					data._x = Item._x;
					data._y = Item._y;
					output = [
						this.selectedId,
						data.class,
						('X: '+data._x + ' Y: '+data._y),
						('Width: '+data.w + ' Height: '+data.h) 
					];//this.Tools.MapsEditor
					output=output.join('<br/>');
				}else{
					output = this.count;
				} 
				this.optionsBar.view.box.innerHTML = output;
			}
	},
	Move : {
	
	},
	Hend : {
		act : 'standart',  
		cursor : 'move',
		icon : [30,0],
		delta : false,
	fn : function(e, act){
		switch (act){
			case 'down':	
			var canvas = this.Tools.MainCanvas;
			if(canvas[0]){this.canvas = canvas[0]; }else{return;} 
				 this.delta = {x : this.canvas._X()-$_SYS.Mouse._x, y : this.canvas._Y()-$_SYS.Mouse._y};
			break;
			case 'move':
				if(this.delta&&this.canvas){ 
					this.Tools.MainCanvas.x = parseInt($_SYS.Mouse._x+this.delta.x);
					this.Tools.MainCanvas.y = parseInt($_SYS.Mouse._y+this.delta.y);
					this.canvas._X(this.Tools.MainCanvas.x)._Y(this.Tools.MainCanvas.y);
				}
			break;
			case 'up':
				delete this.canvas;
				this.delta = false;
				this.Tools.onResize();
			break;
		}
		} 
	},
	Zoom : {
		
		act : 'zoomIn',  
		cursor : 'zoomIn',
		icon : [60,0],
		scale : 1,
		zoom : 'In',
		fn : function(e, act){
			switch (act){
				case 'down':
					 var zoom = $_SYS.Key.isDown('ALT') ? (this.zoom == 'In' ?  'Out'  : 'In') : this.zoom;
					 this.scale *= ( zoom=='Out')?(0.5):(2); 
					this.Tools.view.MainCanvas.scale(this.scale);
					this.Tools.MainCanvas.scale = this.scale;
					this.Tools.onResize();
				break;
				case 'move':
				
				break;
				case 'up':
				
				break;
			} 
			if(this.Tools.Options.fn.Zoom){this.Tools.Options.fn.Zoom.call(this);}
		},
		init : function(){
				//this.canvas = this.Tools.MainCanvas;//e.target.getParents('hasClass','MainCanvas'); 
				if(this.optionsBar){
					 
					var view = this.optionsBar.view
					view.content = this.optionsBar.view.box.addChild({});
					view.controller = view.el.addChild({});  
					var o = ['In', 'Out'];
					for(var i in o){
						var label = view.controller.addChild({TagName: 'label'}), 
						input = label.addChild({TagName: 'input', type : 'radio', name: 'Zoom', value: o[i] }); 
						if(i==0)input.setAttribute('checked', 'checked'); console.log(i, input,input.checked);
						label.innerHTML = label.innerHTML+' Zoom '+o[i];
						$_SYS.fn.on(label, '_DOWN', function(e){ var el = (e.target.firstChild || e.target); this.zoom = el.value  } ,false,this);						
					}
				}
			},
		options : function(act){

		}
	}, 
	
	Mouse : {//Сохраняет параметры курсора для Canvas
		//Положение вначале нажатия
		x0 : 0, y0 : 0,
		//Текущее положение курсора
		x : 0, y : 0,
		//Параметры выделенной области : левый верхний угол и ширина/высота
		_x : 0, _y : 0, w : 0, h : 0
	}, 
	 
	Options : {
		fn : {
			Zoom : function(){ 
				this.optionsBar.view.content.innerHTML=this.scale*100+'%';
			},
			
		}
	},
	appyTool : function(e,act){ 
		if($_SYS.Mouse.press||act=='down'||act=='up'){ 
		//Относительное положение курсора в просмотровеке
		var $MC = this.MainCanvas;
		//Далее идет проверка на canvas
		$MC.mouse_x = parseInt(($_SYS.Mouse._x)/$MC.scale - $MC.screenDX);
		$MC.mouse_y = parseInt(($_SYS.Mouse._y)/$MC.scale - $MC.screenDY);
		//Пересчет положения курсора внутри canvas
		
		switch (act){
					case 'down':	  
						this.Mouse._x = this.Mouse._x0 = this.Mouse.x = $MC.mouse_x;
						this.Mouse._y = this.Mouse._y0 = this.Mouse.y = $MC.mouse_y;   
						//this.e = this.data[obj].Box.addChild({className : this.data[obj].lcName+' item', id : this.data[obj].lcName+'-item-'+this.data[obj].List.length }); 
						//this.e._X(this.Mouse._x)._Y(this.Mouse._y);
						//this.MapsEditor.Maps[level][obj].push(this.Mouse);
					break;
					case 'move':
						
						this.Mouse.x = $MC.mouse_x;
						if( this.Mouse.x < this.Mouse._x0){
							this.Mouse.w =  Math.abs(this.Mouse._x0 - this.Mouse.x);
							this.Mouse._x = this.Mouse.x;
							//this.e._X(this.Mouse._x);
						}else{
							this.Mouse.w =  Math.abs($MC.mouse_x -this.Mouse._x);
						}
						this.Mouse.y = $MC.mouse_y;
						if(this.Mouse.y < this.Mouse._y0){
							this.Mouse.h =  Math.abs(this.Mouse._y0 - this.Mouse.y);
							this.Mouse._y = this.Mouse.y;
							//this.e._Y(this.Mouse._y);
						}else{ 
							this.Mouse.h =  Math.abs($MC.mouse_y -this.Mouse._y);
						}
						//this.e.width(this.Mouse.w).height(this.Mouse.h);
					break;
					case 'up': 
						//if(!this.Mouse.w||this.Mouse.w<1)this.Mouse.w=10; 
						//if(!this.Mouse.h||this.Mouse.h<1)this.Mouse.h=10;
						//this.e.width(this.Mouse.w).height(this.Mouse.h); 
					break;
				}
		
		this[this.actTool].fn(e,act);
		}
	},
	unSelectNode : function(e){
		var lastActNode = getElementsByClassName('checked'), i = 0;
		for( i; i<lastActNode.length; i++){lastActNode[0].removeClass('checked');}
	}, 
	getTool : function(e){
		if(e){
			if( this.actTool&&this.view[this.actTool])this.view[this.actTool].removeClass('checked');
			if(this[this.actTool].optionsBar)this[this.actTool].optionsBar.view.el.hidde();
			this.actTool = e;
		}else{ var e = this.actTool; } 
		if(this.Options)this.Options.actTool = this.actTool;
		this.view[e].addClass('checked'); 
		this.view.iMain.style.cursor = (this[e].cursor || 'auto');
		if(this[e].optionsBar)this[e].optionsBar.view.el.show();
			if(this.Options.fn[e]){this.Options.fn[e].call(this[e]);}
	},
	toolBar : {
		
	},
	setTool : function(tool, f){ 
		if(typeof f == 'object'){
			this[tool] = f;//Возможность передавать кастомные инструменты
		}
		if(!this[tool])return; 
		this[tool].Tools = this;//ссылка на палитру инструментов
		this.view[tool] = this.view.el.addChild({id : tool+'_tool', className : 'tool' });
		if(this[tool].icon)this.view[tool].background({position: {x : (-1)*this[tool].icon[0], y : (-1)*this[tool].icon[1]}});
		if(this.Options&&this[tool].options){ 
			this[tool].optionsBar = this.Options.addBar((tool+'options'));
			this[tool].optionsBar.view.el.hidde();
			if(this[tool].init)this[tool].init();
		}
		//this.tabs[a.id].view.el.addEventListener('click', function(c){  _this.activate($_SYS.$Get(c.target.id).tid)} ,false);
		
	},
	//Тип палитры инструментов. Доступные значения 'icon', 'list'
	type : 'list',
	//инструменты
	tools : [], 
	onResize : function(){
		var $MC = this.MainCanvas;
		$MC.x = this.view.MainCanvas._X();
		$MC.y = this.view.MainCanvas._Y();
		//Определение позиции отн-но угла экрана
		$MC.screenDX = ( this.view.MainCanvas.getBoundingClientRect().x)/$MC.scale; 
		$MC.screenDY = ( this.view.MainCanvas.getBoundingClientRect().y)/$MC.scale;
			},
	__construct : function(_this){
		this.view.el.addClass(this.type+'-'+this.className);
		this.view.parentTab = this.view.el.getParents('hasClass', 'Tab')[0];
		this.parent = $_SYS.$Get(this.view.parentTab.id);  
		if(!this.view.iMain)this.view.iMain = this.parent.view.iMain;
		 
		if(!this.view.MainCanvas)this.view.MainCanvas = this.parent.view.MainCanvas;
		if(this.parent.ToolsOptions){this.Options = $_SYS.fn._import(this.parent.ToolsOptions,this.Options); 
			var optionsBarS = {
				'rigghtBar' : 350
			};
			this.Options.Resize(optionsBarS[this.optionsBox]);
			
			this.Options.onChange = function(e){// console.log(e);
					if(this.Options.fn[this.actTool])this.Options.fn[this.actTool].call(this[this.actTool], e.target.name, (e.target.type == 'checkbox' ?e.target.checked : e.target.value));
					}
			$_SYS.fn.on(this.Options.view.el,'input',this.Options.onChange,false,this);
			$_SYS.fn.on(this.Options.view.el,'change',this.Options.onChange,false,this); 
			$_SYS.fn.on(this.Options.view.el, '_DOWN', this.Options.onChange ,false,this); 
		} 
		if(this.parent.Options){
			if(this.parent.Options.Layers){//Для получения информации о слоях
				this.Options.Layers = this.parent.Options.Layers;
			}
		}
		this.MainCanvas = {
			scale : 1,
			x : this.view.MainCanvas._X(),
			y : this.view.MainCanvas._Y(),
			mouse_x : 0,
			mouse_y : 0
		}
		 if(typeof this.tools == 'object'){
		if(Array.isArray(this.tools)){
			if(this.tools[0])this.actTool = this.tools[0];
			for(var i in this.tools){ 
				if(this[this.tools[i]])this.setTool(this.tools[i]);
			}
		}else{
			for(var i in this.tools){
				if(!this.actTool)this.actTool = i;
				;
				 this.setTool(i,this.tools[i]);
			}
		} console.log(this.tools,this.actTool,i)
			this.getTool();
		}
		$_SYS.fn.on(this.view.el, '_DOWN', function(e){ if(e.target.hasClass('tool')){_this.getTool(e.target.id.split('_tool')[0]);} } ,false);
		
					
	},
	view : {  
		$ClassStyle : {
			'.$, .$ .tool' : {position : 'relative'}, 
			'.icons-$' : {width : 60},
			'.icons-$ .tool' : {display : 'inline-block','vertical-align':'top', width:30,height:30, background:'#ccc url("<%path:data%>/interface/Tools.png") no-repeat 0 0' },
			'.icons-$ .tool.checked' : {'background-color':'#999'},
			'.item.select' : {'box-shadow' : '0 0 2px 2px rgba(255,0,112,0.7);'}
		}
	}
}