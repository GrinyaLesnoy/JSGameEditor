classes.Editor.Tab.MapsEditor = {
	objectType : 'classExtend',
	extendOf : 'classes.Editor.Tab', 
	 
	// $_import : ['Texture'],
		onGetDATA : function(){
			if(Editor.$Files.files.Data['Maps.js']){ 
				this.loadMap(false,Editor.$Files.files.Data['Maps.js'].content); 
			}
		},
	  loadMap : function(f,data){ 
		if(data.indexOf('Data.Maps') ==-1 || data.indexOf('Data.Maps')>=data.indexOf('{')){alert('ну удалось получить карту'); return;}
		eval(data.replace(/Data./,'this.'));
		console.log( this.Maps.Level_0.Gate[0],this.Maps);
		//this.Options.Levels
		this.Options.Levels.view.select.innerHTML='';
		for(var i in this.Maps){  
			this.Options.Levels.view.addPoint(i);
		}
		this.options.actLevel = 'Level_0';
		this.updateMap();
	 }, 
	 newMaps : function(){
		this.Maps = {}
		this.options.actLevel = 'Level_0';
		this.Options.Levels.view.select.innerHTML='';
		for(var i in this.Maps){  
			this.Options.Levels.view.addPoint(i);
		}
		this.updateMap();
		
	 },
	 compactSave : true,
	 saveMap : function(e){console.log(1);
		//window.open(
			e.target.href='data:text/javascript;charset=utf-8,' + encodeURIComponent(  'Data.Maps='+JSON.stringify(this.Maps, null, (this.compactSave ? false : '\t'))  )
		//);;
		return false;
	 },
	 options : {// ** Значения по умолчанию ** */
		newLayer : {},
		actLevel : 'Level_0',
		actLayer : 'l0',
		actItemLayer : 'Ground',
		ItemLayers : ['Ground', 'Gate'];
	 },
	 
	 itemsData : {// ** Параметры объектов, подлежащие обновлению в this.Maps при их изменении ** */
		Ground : ['_x','_y','w','h','lc','rc'],
		Gate : ['xC','yC','LevelID','GateID']
	 },
	 updateTab : function(){ // ** Описывает обновление вида вкладки после изменения ее размеров или перехода на нее ** */
		if(this.Maps)this.updateMap();
	 },
	 cuurrentLayer : 'Layer_0',
	 // ** Обновление отображенной в редакторе карты при загрузки новой или переходе к редактированию другого уровня ** */
	 updateMap : function(){ 
		this.Tools.Select.deSelect('all'); // ** Снимаем все выделения ** */
		// ** Если чего-то нет, то создаем ** */
		if(!this.view.Layers)this.view.Layers = {};
		if(!this.view.Level)this.view.Level = this.view.MainCanvas.addChild({id : 'Level'});
		this.view.Level.innerHTML='';// ** Очищаем ** */
		
		this.view.Layers['l0']={el: this.view.Level.addChild({id : this.cuurrentLayer})}// ** l0 - базовый слой в игре (остальные - l1, l2, 'l-1'... - отвечают за декорации) - слои "Земля","Врата" и т.д. - на самом деле, это - подслои l0 (Можно сказать, l0 - это слой-папка, как в фотошопе) ** */
		var Level = this.options.actLevel; // ** Значение по умолчанию (см. выше) ** */
		if(!this.Maps[Level]){this.Options.Levels.add.call(this.Options.Levels);}//this.Maps[Level]={}Пусть по умолчанию всегда загоняет 0 слой
		// ** Холст - по сути, пока он оказался почти не нужен ** */
		if(!this.Maps[Level].canvas){this.Maps[Level].canvas = this.Options.Levels.level_templates.default.canvas;} 
		this.view.MainCanvas.width(this.Maps[Level].canvas[0]).height(this.Maps[Level].canvas[1]);
		//Выравниваем холст по центру экрана
		this.view.MainCanvas.XC(this.view.iMain.XC()).YC(this.view.iMain.YC());
		//Сообщаем в инструменты параметры холста
		this.Tools.onResize();
		var ItemLayers =  this.options.ItemLayers;//Слои l0 с которыми работает редактор
		for(var l in ItemLayers){
			var Layer = ItemLayers[l];
			this.view.Layers['l0'][Layer] =  this.view.Layers['l0'].el.addChild({id : Layer});
			var iMap = this.Maps[Level][Layer]; 
			
			for(var g in iMap){
				var item =  this.view.Layers['l0'][Layer].addChild({ id : Layer+'-item-'+g, className : Layer+' item', 'data-class' : Layer}); 
				if(typeof iMap[g].xC == 'number')item.XC(iMap[g].xC).YC(iMap[g].yC)
				else if(typeof iMap[g]._x == 'number')item._X(iMap[g]._x)._Y(iMap[g]._y).width(iMap[g].w).height(iMap[g].h);
				 
				item.data = iMap[g]; 
				item.info = {Maps : this.Maps, Level : Level, Layer : Layer, GLayer : 'l0', index : g};
							
				
			}
		 }
		 
		 this.Options.Layers.__update({LayersList : ItemLayers,Layers : {}, act:'Ground'})
	 },
	 _tools : {
		left : {
			'Select' : true,
			'Hend' : true,
			'Zoom' : true,
			'Add' : {
				act : 'set',  
				cursor : 'cell',
				icon : [150,0],
				box : false,
				data : {},
				//ссылка на Tools добавляется автомат. как this.Tools
				fn : function(e, act){
					var obj = 'Ground', level = 'Level_0';			
						if(!this.MapsEditor)this.MapsEditor = $_SYS.$Get('MapsEditor');	 
						var obj = this.MapsEditor.Options.Layers.act, level = this.MapsEditor.options.actLevel;
					switch (act){
					case 'down':
						if(!this.data[obj]||this.data[obj].level!=level)this.data[obj] = {
							Level : level,
							Box : document.getElementById(obj),
							List : this.MapsEditor.Maps[level][obj], 
							//lcName : obj.toLowerCase(),
						 }; 
						this.box = {
							_x : this.Tools.Mouse._x,_y : this.Tools.Mouse._y 
						}; 
						var last = 0;
						//for(var i in this.data[obj].List){last = Math.max(last, Number(i));}
						for(var last=0; ;last++){ if(!this.data[obj].List[last])break; }
						console.log(last);
						this.e = this.data[obj].Box.addChild({className : obj+' item', id : obj+'-item-'+(last) , 'data-class':obj}); 
						if(obj == 'Ground'){this.e._X(this.box._x)._Y(this.box._y);}else{
							this.e._X(this.box._x-5)._Y(this.box._y-5);
						}
						this.e.data={};
						this.MapsEditor.Maps[level][obj][(last)]=this.e.data;
						this.e.info = {Maps : this.MapsEditor.Maps, Level : level, Layer : obj, GLayer : 'l0', index : (last)};
						console.log(this.MapsEditor.Maps[level][obj]);
					break;
					case 'move':
							if(obj == 'Ground'){
							this.box._x = this.Tools.Mouse._x;
							this.box._y = this.Tools.Mouse._y;
							this.box.w =  this.Tools.Mouse.w;
							this.box.h =  this.Tools.Mouse.h;
						this.e._X(this.box._x)._Y(this.box._y).width(this.box.w).height(this.box.h);
						}
					break;
					case 'up': 
						if(!this.box.w||this.box.w<1)this.box.w=10; 
						if(!this.box.h||this.box.h<1)this.box.h=10;
						this.e.width(this.box.w).height(this.box.h);
						if(obj == 'Ground'){this.e.data.w = this.box.w;this.e.data.h = this.box.h; }
						//this.e.data=this.box; 
						this.Tools.Select.fn_do(this.e);
						this.Tools.getTool('Select');
					break;
				}
				},
			}
		},
	 },
	 ToolsFn : {//Функции инструментов
		Select : function(key, val){
						// console.log(this.optionsBar.view.box ,this.selected,JSON.stringify(this.selected));
						// console.log('fn',key, val);
				var output = '';
				if(this.count===0){
					//this.selected
					this.optionsBar.Items.get('Canvas',this.Tools.MainCanvas); 
				}else if(this.count===1){ 
					 
					//this.selected
					var Item = this.selected[this.selectedId], data = Item.data;  
					console.log(key);
					if(key == 'delete'){ 
						var iMap = this.Tools.MapEditor;
					//console.log(this.selectedId.substr(-1),iMap.Maps['Level_0'][iMap.Options.Layers.act][this.selectedId.substr(-1)]); 
						delete iMap.Maps[iMap.options.actLevel][Item['data-class']][this.selectedId.substr(this.selectedId.lastIndexOf('-')+1)];
						 this.selected[this.selectedId].remove();
						delete this.selected[this.selectedId];
						this.selectedId=false;
						this.Empty =true;
						this.count=0; 
						//this.Tools.Options.fn.Select.call(this);
						//this.optionsBar.view.box.innerHTML = '';
						this.optionsBar.Items.get('Canvas',this.Tools.MainCanvas); 
					return;}
					
					this.optionsBar.Items.get(Item['data-class'],Item,key,val);return;
					if(key&&typeof val!='undefined'){
						var fn = {
							_x : '_X',
							_y : '_Y',
							w : 'width',
							h : 'height',
							xC : 'XC',
							yC : 'YC'
						}
						if(fn[key]){var val = Number(val); Item[fn[key]](val); } 
						Item[key]=val;
						data[key]=val;
						return;
					}
					//console.log(data,JSON.stringify(this.selected[this.selectedId]),this.optionsBar) ;
					var iMap =this.Tools.MapEditor, iMapDat = iMap.itemsData[Item['data-class']];
					data._x = Item._x;
					data._y = Item._y;
					if(!data.lc)data.lc=0;
					if(!data.rc)data.rc=0;  
					output=Item['data-class'] + iMap.view.inputTemplate('ID',this.selectedId.substr(this.selectedId.lastIndexOf('-')+1));
					for(var d in iMapDat){
						if(Item[iMapDat[d]]){data[iMapDat[d]]=Item[iMapDat[d]]}//else{data[iMapDat[d]]=0;}
						if(iMapDat[d]=='xC')data[iMapDat[d]]=parseInt(Item.XC());
						if(iMapDat[d]=='yC')data[iMapDat[d]]=parseInt(Item.YC());
						if(typeof data[iMapDat[d]]=='undefined') data[iMapDat[d]]=0;
						
						output+=iMap.view.inputTemplate(iMapDat[d],data[iMapDat[d]])
					}
					output+=iMap.view.inputTemplate('delete');/**/
				}else{
					//Прописать возможность пакетного перемещения
					output = this.count;
				} 
				//this.optionsBar.view.box.innerHTML = output;
					}
	 },
	 
	 /** ====================================**/
	 /** ====== Функции для интерфейса ===== **/
	 /** ====================================**/
	 
	 iOptions : {
			'rightBar' : function(e){ 
				//Зарезервировать место под toolController, затем передать его в tool
				//При выборе инструмента, загружается соответствующие параметры
				this.Options = $_SYS._New(classes.rightBar,{parentNode : e}); 
				
				//Управление уровнями игры
				var LevesBox = this.Options.addBar('LayersOptions',{title:'Levels'});
				this.Options.Levels = $_SYS._New(classes.Controllers.Levels,{id:e.id+'LevelBox',parentNode : LevesBox.view.box});  
				this.Options.Levels.MainEditor = this;
				//Управление слоями 
				var LayersBox = this.Options.addBar('LayersOptions',{title:'Layers'});
				this.Options.Layers = $_SYS._New(classes.Controllers.Layers,{id:e.id+'LayerBox',parentNode : LayersBox.view.box});
				LayersBox.MapEditor = this;
				this.Options.Layers.parent = LayersBox;
				//Управление параметрами
				this.ToolsOptions = this.Options.addBar('ToolsOptions',{title:'Prop'});
					this.ToolsOptions.fn=this.ToolsFn; 
					this.ToolsOptions.MapEditor = this;
				 
			},
			'leftBar' : function(e){ 
				this.Tools = $_SYS._New(classes.Tools,{parentNode : e, type:'icons', tools : this._tools.left, optionsBox : 'rigghtBar'});
				this.Tools.MapEditor = this;
			},
			'header' : function(e){ 
				var _this_ = this;
				this.view.createFM = e.addChild({TagName : 'a', type:'button', content: 'New', id : 'createFM'});
				$_SYS.fn.on(this.view.createFM,'_DOWN', this.newMaps, false,this);
				this.view.getFM_l = e.addChild({TagName : 'label', content: 'open Maps.js', id:'getFM' });
				this.view.getFM = this.view.getFM_l.addChild({TagName : 'input', type:'file', accept:".js", name:'getFM' });
				this.view.getFM.addEventListener('change', function(c){ $_SYS.LocalFile.read(this.files,_this_.loadMap,_this_);} ,false);
				
				//onGetDATA
				// Добавить: диалог сохранения (в файл или в Data) и диалог открытия
				this.view.returnFM = e.addChild({TagName : 'a', type:'button', content: 'Save', download:'Maps.js', id : 'returnFM'});
				$_SYS.fn.on(this.view.returnFM,'_DOWN', this.saveMap ,false,this);
				var lebel = e.addChild({TagName : 'label', content:' compact '}); 
				this.view.compactSave = e.addChild({TagName : 'input', type:'checkbox', value: '1', checked : 'checked'});
				this.view.compactSave.addEventListener('change', function(c){console.log(c.target.checked); _this_.compactSave = c.target.checked } ,false);
			}
		 },
	 mouseTab : function(e, act){ 
		if(this.Tools)this.Tools.appyTool(e, act);
	},
	 Init : function(_this_){
		var _this_ = this;
		
		 this.setInterface();
		 $_SYS.LocalFile.setListener(this.view.iMain,_this_.loadMap,_this_ );
		//this.GetMapFile = $SYS._New({id : 'GetMapFile'})  
		
		//this.addTabBox();
		//this.charactersTextureTab = $_SYS._New(classes.Editor.Tab,{id: 'charactersTextureTab', parent : this.id,  title : 'Текстура', modelClass : 'classes.Editor.Characters.Texture', parentNode : this.view.tabBox });
		//var act = 'charactersTextureTab';
		//this.TabController.activate(act);
	}, 
	next : function(){Editor.TabController.activate('contentTab');}, 
	save : function(_callback){
		//root.templateData = $_SYS.fn._import({},this.data);
		//$_SYS.$Get("Content").__update();//$_SYS.$Get("Content") == Editor.contentTab.model
		//if(_callback){_callback();}
		Editor.ajax(_callback,{template:this.data}); 
	}, 	
	view:{
		inputOptions : {
			ID : {title : 'ID', readonly : "readonly"},
			xC : {title:'X (центра)', type : 'number'},
			yC : {title:'Y (центра)', type : 'number'},
			_x : {title:'X', type : 'number'},
			_y : {title:'Y', type : 'number'},
			w : {title:'Width', type : 'number'},
			h : {title:'Height', type : 'number'},
			lc : {title:'Левый зацеп', value : 1, type : 'checkbox'},
			rc : {title:'Правый зацеп', value : 1, type : 'checkbox'},
			'delete' : {type:'button',value : 'delete'},
			'LevelID' : {title:'LevelID назначения', TagName : 'select', get:'this.Maps'},
			'GateID' : {title:'GateID назначения', TagName : 'select', get:'this.Maps[]'}, 
			'linkGate' : {title:'Привязать врата назначения', type:'button',value : 'linkGate'},
		},
		inputTemplate: function(key, val,box){//Генерирует input на основе параметров
			if(typeof val == 'object')val=val[key]; 
			var data={name : key, value : val}
			//Не использую $_SYS.fn._import т.к. не нужны лишние проверки
			for(var i in this.inputOptions[key]){data[i]=this.inputOptions[key][i];}
			if(data.type == 'checkbox'&&val)data.checked='checked';
			var input = (data.title&&data.type!='button' ? data.title+': ' : '')+'<input';
			for(var i in data){input+=' '+i+'="'+data[i]+'"';}
			input+='/><br/>';
			return  input+'<br/>'; 
			
		}, 
		selectTemplate: function(key, val,box){
			
		},
		$ClassStyle : {
			'#iHeaderMapsEditor' : {'font-size' : '0.9em','line-height':'25px'},
			'#iHeaderMapsEditor a, #iHeaderMapsEditor #getFM' : {height:25, 'padding-left':30,  display : 'inline-block', 'vertical-align' : 'middle', margin: '0 10px', background:' url("<%path:data%>/interface/SysTools.png") no-repeat 0 0', cursor : 'pointer', border:'none'},
			'#iHeaderMapsEditor input[type="file"]' : {display: 'none'},
			'#iHeaderMapsEditor #getFM' : {'background-position': '0 -25px'},
			'#iHeaderMapsEditor a#returnFM' : {'background-position': '0 -50px'},
			'#Game, .Level' : {overflow:'hidden', left:0, top:0, right:0, bottom:0, 'z-index':1},
			'.Ground' : {background: '#ccc'},
			'.Gate' : {width: 10,height:10,background: '#f73'}
		}
	
	} 
}
 