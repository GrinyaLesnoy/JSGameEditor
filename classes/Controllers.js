classes.Controllers = {
	objectType : 'class',
	className : 'Controller',
	view : true
}


classes.Controllers.Levels = {
	objectType : 'classExtend',
	extendOf : 'classes.Controllers',
 
		title:'Levels',
		Level_num : 1, 
		level_templates : {
			default : {
				//Camera : {},
				Gate : {},
				Ground : {},
				Layers : [0],
				canvas: [ 320, 240 ]
			}
		},
		__update : function(o){},
		__construct : function(_this){this.view.select = this.view.el.addChild({tagName : 'select'}); 
				this.view.select.addEventListener('change', function(s){  
					console.log(s.explicitOriginalTarget.value);
					_this.setCurrentLevel.call(_this,s.explicitOriginalTarget.value); 
				} ,false);
				this.view.controll = this.view.el.addChild({className:'controll' });
				this.view.controll.innerHTML = '<span class="add">add</span><span class="copy">copy</span><span class="remove">remove</span>'
				$_SYS.fn.on(this.view.controll,'_DOWN',this.controller,false,this);},
		getLevelName : function(){//Ищит первое свободное id для слоя
			var name=''; for(var i=0; ;i++){ name='Level_'+i; if(!this.MainEditor.Maps[name])break; }
			return name;
		},
		_controllers_ : {
			add : function(){ 
			var Level_id = this.getLevelName();//'Level_'+(++this.Level_num);
				this.MainEditor.Maps[Level_id]=$_SYS._New( this.level_templates.default);
				console.log(this.MainEditor.Maps);
				this.view.addPoint(Level_id);
				this.setCurrentLevel(Level_id,true);
			},
			copy : function(){
				var Level_id = this.getLevelName();//'Level_'+(++this.Level_num);
				this.MainEditor.Maps[Level_id]=$_SYS._New( this.MainEditor.Maps[this.MainEditor.options.actLevel] );
				console.log(this.MainEditor.Maps);
				this.view.addPoint(Level_id);
				this.setCurrentLevel(Level_id,true);
			},
			remove : function( ){
				var Level_id = this.MainEditor.options.actLevel; 
				var MapKey = Object.keys(this.MainEditor.Maps),
				current_index = MapKey.indexOf(Level_id),
				next_id = current_index > 0 ? MapKey[current_index-1] : MapKey[current_index+1];
				delete this.MainEditor.Maps[Level_id];
				this.view['opt_'+Level_id].remove();
				delete this.view['opt_'+Level_id]; 
				this.setCurrentLevel(next_id,true);
			},
		},
		controller:function(e){
			if(e.target.className&&this._controllers_[e.target.className])this._controllers_[e.target.className].call(this);
		},
		prevLayerID : false,//ID предыдущего слоя (переходит на него в случае удаления и блокирует удаление 0 слоя
		setCurrentLevel : function(id, upd){
			this.prevLayerID = this.MainEditor.options.actLevel; 
			this.MainEditor.options.actLevel=id;
			this.MainEditor.updateMap();
			if(upd)for(var i, j = 0; i = this.view.select.options[j]; j++) {
				if(i.value == id) { this.view.select.selectedIndex = j; break; }
			}
		},  
		view : {
			addPoint : function(id){this['opt_'+id] = this.select.addChild({tagName: 'option', value : id, title : id, content : id});},
			$ClassStyle : {
				'.$ .controll span' : {padding:5, cursor:'pointer', margin: 5, display:'inline-block'} 
			}
		}
	}

classes.Controllers.Layers = {
	objectType : 'classExtend',
	extendOf : 'classes.Controllers',
	className : 'LayerBox',
	Layers : {},//Сюда сохраняются слои
	LayersList : [],//Здесь сохраняются ссылки на слои
	act : false, 
	updateLayers : function(){
		var html = '';
		for(var i=0; i<this.LayersList.length; i++){ 
		if(this.act==false)this.act=this.LayersList[i];
		var layer = this.Layers[this.LayersList[i]];
			layer.index = i;
			var className = 'layer';console.log(this.act, layer.id);
			if(this.act == layer.id)className+=' act'; 
			html = '<div class="'+className+'" id="'+layer.id+'">'+(layer.name? layer.name : layer.id)+'</div>'+html;
		}
		this.view.list.innerHTML = html;
	}, 
	addLayer : function(data){
		if(!data.id){
		var c = this.LayersList.lenght;
		while(true){ if(!this.Layers['Layer_'+c]){break;} c++; }
		data.id = 'Layer_'+c;
		}
		this.Layers[data.id] = data;
		this.LayersList.push(data.id);
		$_SYS.fn.Array.pushTo(this.LayersList,data.id,data.index);
		this.updateLayers();
	},
	moveLayer : function(){
		$_SYS.fn.Array.moveTo(this.LayersList,_last_,_new_);
		this.updateLayers();
	},
	removeLayer : function(data){
		if(!data.id){
		var c = this.LayersList.lenght;
		while(true){ if(!this.Layers['Layer_'+c]){break;} c++; }
		data.id = 'Layer_'+c;
		}
		this.Layers[data.id] = data;
		this.LayersList.push(data.id);
		$_SYS.fn.Array.removeTo(this.LayersList,this.Layers[id].index);
		delete this.Layers[id];
		this.updateLayers();
	},
	__update : function(o){
		if(o)for(var i in o){ this[i] = o[i]; }
		if(Object.keys(this.Layers).length>0){//Первым это для обновления существующих ключей
		this.LayersList=[]
		for(var i in this.Layers){
			$_SYS.fn.Array.pushTo(this.LayersList,this.Layers[i].id,this.Layers[i].index);
		}
		}else if(this.LayersList.length>0){
		this.Layers = {}; 
		for(var i=0; i<this.LayersList.length; i++){ 
			this.Layers[this.LayersList[i]] = {id:this.LayersList[i],index:i};
		}
		} console.log(this.Layers,this.LayersList);
		this.updateLayers();
	},
	reAct : function(e){
		if(typeof e == 'string' )if(e!=this.act){e=this.view.el.getElementsBy('id',e)[0];}else{return;}
		this.act = e.id;
				e.parentElement.getElementsByClass('act')[0].removeClass('act');
				e.addClass('act');
				console.log(this);
	},
	__construct : function(){
		this.view.list = this.view.el.addChild({className : 'layerList'});
		$_SYS.fn.on(this.view.el, '_DOWN', function(e){ if(e.target.hasClass('layer')){
			if(this.act!= e.target.id)this.reAct(e.target); 
		} } ,false, this);
	},
	view : {
		$ClassStyle : {
			'.$ .layerList' : { background:'#111','border-bottom': '2px solid #111'},
			'.$ .layerList .layer' : {padding:5, background:'#333', 'border-bottom': '2px solid #000', cursor:'pointer'},
			//'.$ > div':{padding:5},
			'.$ .layerList .layer.act' : {background:'#339'}
		}
	} 
}

classes.Controllers.ItemsBox = {
	objectType : 'classExtend',
	extendOf : 'classes.Controllers',
	IList : [],
	items : {
	
	},
	__construct : function(){
		/*for(var i in this.IList){
			if(!this.items[this.IList[i]])this.items[this.IList[i]]=$_SYS._New(classes.Controllers.Items[this.IList[i]],{parentNode:this.parentNode});
			this.items[this.IList[i]].view.el.hidde();
			
		}*/
	},
		get : function(it,item,key,value){
			if(this.it!=it){
				if(this.it)this.items[this.it].view.el.hidde();
				if(!this.items[it]&&!classes.Controllers.Items[it]){this.it=false;return;}
				this.it=it;
				if(!this.items[this.it])this.items[this.it]=$_SYS._New(classes.Controllers.Items[this.it],{parentNode:this.parentNode});
				this.items[this.it].view.el.show();
			}
			this.items[this.it].Update(item,key,value);
		},
	view:false
}
classes.Controllers.Items = {
	objectType : 'classExtend',
	extendOf : 'classes.Controllers',
	data : {},//Хранилище данных
	inputOptions : {
			ID : {e:{TagName : 'input', title : 'ID', readonly : "readonly"},data:{}},
			xC : {e:{TagName : 'input', title:'X (центра)', type : 'number'},data:{}},
			yC : {e:{TagName : 'input', title:'Y (центра)', type : 'number'},data:{}},
			_x : {e:{TagName : 'input', title:'X', type : 'number'},data:{}},
			_y : {e:{TagName : 'input', title:'Y', type : 'number'},data:{}},
			w : {e:{TagName : 'input', title:'Width', type : 'number'},data:{}},
			h : {e:{TagName : 'input', title:'Height', type : 'number'},data:{}},
			lc : {e:{TagName : 'input', title:'Левый зацеп', value : 1, type : 'checkbox'},data:{}},
			rc : {e:{TagName : 'input', title:'Правый зацеп', value : 1, type : 'checkbox'},data:{}},
			del : {e:{TagName : 'input', type:'button',name : 'delete', value : 'delete'},data:{}},
			'LevelID' : {e:{TagName : 'select', title:'LevelID назначения', TagName : 'select'  },data:{
				get:function(item){ return item.info.Maps;  },
				onChange:function(){this.Update(this.Item);},
				default:function(item){ return item.info.Level;  }//Зн. по умолчанию (значение или функция, возвращающая значение)
			}},
			'GateID' : {e:{TagName : 'select', title:'GateID назначения', TagName : 'select',},data:{
				get:function(item){return item.info.Maps[item.data.LevelID ? item.data.LevelID : item.info.Level].Gate;},
				onChange:function(){ 
				var G = this.Item.info.Maps[this.Item.data.LevelID].Gate[this.Item.data.GateID]; 
				G.LevelID = this.Item.info.Level; G.GateID = this.Item.info.index; 
				console.log(this.Item.data, G);
				},
			}},
			},
		__construct : function(){ console.log(this);
			var d = this.view.el.addChild({TagName:'p',content: (this.itemClass+': ')});
				this.inputOptions.ID.e.name = 'ID';
				this.view.ID=d.addChild(this.inputOptions.ID.e);this.view.ID.setAttribute('readonly',"readonly");
			for(var i=0,v; v=this.options[i];i++){
				d = this.view.el.addChild({TagName:'p',content: (this.inputOptions[v].e.title+': ')});
				this.inputOptions[v].e.name = v;
				this.view[v]=d.addChild(this.inputOptions[v].e);
				//if(this.inputOptions[v].data.event){$_SYS.fn.on(this.view[v],this.inputOptions[v].data.event.ev, this.inputOptions[v].data.event.fn,false,this);}
				 
			}
			  d = this.view.el.addChild({TagName:'p',content: (this.itemClass+': ')});
				 
				this.view.del=d.addChild(this.inputOptions.del.e); 
		},
		item_fn : {
				_x : '_X',
				_y : '_Y',
				w : 'width',
				h : 'height',
				xC : 'XC',
				yC : 'YC'
			},
			_update:function( ){},
	Update:function(Item,key,value){
		var data = Item.data;
		if(key){
			if(this.item_fn[key])value=Number(value);
			data[key]=value;
			Item[key]=value; 
			if(this.item_fn[key])Item[this.item_fn[key]](value);
			if(this.inputOptions[key].data.onChange)this.inputOptions[key].data.onChange.call(this,Item);
		}else{ 	
			var TagName;
			var i;  
			this.Item = Item;
			if(this.data.ID!= Item.id){this.data.ID= Item.id;  this.view.ID.value = Item.info.index; data.MapID = Item.info.index;}//Item.id.substr(Item.id.lastIndexOf('-')+1); 
			for(var j in this.options){//Заносится не все из data а лишь то, что положенно
				i=this.options[j], inputOptions = this.inputOptions[i]; 
				if(Item[i]){ data[i]=Item[i] }
						if(i=='xC') data[i]=parseInt(Item.XC());
						if(i=='yC')data[i]=parseInt(Item.YC()); 
						if(typeof data[i]=='undefined') data[i]= inputOptions.data.default ? (typeof inputOptions.data.default == 'function' ? inputOptions.data.default(Item) : inputOptions.data.default) : 0;
				if(!this.data[i]||this.data[i]!=data[i]){
					//if(this.inputOptions[key].e.type=='number')data[i] = parseInt(data[i]);
					//else{data[iMapDat[d]]=0;}
					this.data[i]=data[i];
					TagName = inputOptions.e.TagName;
					if(TagName == 'input'){
						if(this.view[i].type == 'checkbox'){
							this.view[i].checked = data[i] ? 'checked':false; 
						}else{
							this.view[i].value = data[i];
						}
					}else if(TagName == 'select'){
						//this.view[i].value = data[i]; 
						var html = '', _dat_ = inputOptions.data.get(Item);
						for(var dt in _dat_){html += '<option value="'+dt+'">'+dt+'</option>';}
						this.view[i].innerHTML=html;//console.log(html,this.view[i]);
						for(var dt, j = 0; dt = this.view[i].options[j]; j++) {
							if(dt.value == data[i]) { this.view[i].selectedIndex = j; break; } 
						}
					}
				}
			} 
		} 
	},
	view : {
		$ClassStyle : {
			 '.rightBarBlock .$ p' : {'padding-bottom':10}
		}
	}
}

	classes.Controllers.Items.Ground = {
	objectType : 'classExtend',
	extendOf : 'classes.Controllers.Items',
	itemClass : 'Ground',
	options : ['_x','_y','w','h','lc','rc']  
	}
	
	classes.Controllers.Items.Gate = {
	objectType : 'classExtend',
	itemClass : 'Gate',
	extendOf : 'classes.Controllers.Items',
	options : ['xC','yC','LevelID','GateID'] 
	}
	
	classes.Controllers.Items.____ = {
	objectType : 'classExtend',
	itemClass : 'Gate',
	extendOf : 'classes.Controllers.Items',
	options : ['xC','yC','LevelID','GateID'] 
	}
	
	/*classes.Controllers.Items.Canvas = {
	objectType : 'classExtend',
	extendOf : 'classes.Controllers.Items',
	itemClass : 'Canvas',
	options : ['_x','_y','w','h' ]  
	}*/
	