classes.Editor = {
	objectType : 'class',
	 //__styles : {position : null},
	id : 'Editor', 
	
	$_import : ['Tab','PopUp' ],
	
	addTabBox : function(){
		this.view.tabBox = this.view.el.addChild({
			id : 'tabBox_'+this.id
		});
		this.view.tabBox.position({top: 60,'overflow':'auto'}); 
		this.TabController = $_SYS._New(classes.Editor.TabController,{id: ('TabController_'+this.id), parentNode: this.view.el, tabBox_id : this.view.tabBox.id});
	},
	
	mouseTab : function(){},
	Tabs : {},
	__construct : function(){ 
		root.Editor = this; 
		this.view.el.position();
		this.addTabBox(); 
		//this.MapsEditor = $_SYS._New(classes.Editor.Tab.MapsEditor,{id: 'MapsEditor',  title : 'Карты',  parent : this.id, parentNode : this.view.tabBox });
		 //this.MapsEditor = $_SYS._New(classes.Editor.Tab.MapsEditor,{id: 'MapsEditor',  title : 'Карты' });
		 this.Tabs.MapsEditor = $_SYS._New(classes.Editor.Tab.MapsEditor,{id: 'MapsEditor',  title : 'Карты',  parent : Editor.id, parentNode : Editor.view.tabBox }); 
		 //this.charactersTab = $_SYS._New(classes.Editor.Tab,{id: 'charactersTab',  title : 'Персонажи', modelClass : 'classes.Editor.Characters', parent : this.id, parentNode : this.view.tabBox });
		 var act = 'MapsEditor';
		 this.TabController.activate(act);
		/* this.ajax(function(){ 
			var act = 'contentTab';
			if(!root.templateData){root.templateData={  p:{}  };  act = 'tempateTab';  }
			if(!root.contentData)root.contentData={}; 
			if(!root.contentData[this.pointID])root.contentData[this.pointID]={}
			this.tempateTab = $_SYS._New(classes.Editor.Tab,{id: 'tempateTab', title : 'Шабон', modelClass : 'Template', parentNode : 'tabBox' });
			this.contentTab = $_SYS._New(classes.Editor.Tab,{id: 'contentTab', title : 'Контент', modelClass : 'Content', parentNode : 'tabBox'});
			this.previewTab = $_SYS._New(classes.Editor.Tab,{id: 'previewTab', title : 'Предпросмотр', modelClass : 'Preview', parentNode : 'tabBox'}); 
			this.TabController.activate(act);
		}); */
		//tinyMCEPopup.requireLangPack();
		//tinyMCEPopup.onInit.add(MicsDialog.init, MicsDialog);
		
		$_SYS.CSS.update(); 
		
		/*$_SYS.fn.on(this.view.el,'_MOUSE*', function(e,type){//console.log(arguments, e.type); //touchstart 
		if(e.target.getParents('hasClass','iMain')[0] ) Editor.mouseTab.call( ( Editor.mouseTab._this || e), e, type ); 
			//console.log(e, e.target.getParents('hasClass','iMain')); 
		} ,false);*/
	},
	
	ajax : function(_callback,data){  
		var _this = this, attr = {
			url : 'main.php?p='+Editor.postID,   
			_callback : function(data){
				console.log(data);			
				var data = JSON.parse(data); 
				console.log(data);
				Editor.data = data;
				if(data.template)root.templateData = data.template;  
				if(data.content)root.contentData = data.content;   				
				if($_SYS.$Get("Content"))$_SYS.$Get("Content").__update();
				if($_SYS.$Get("Preview"))$_SYS.$Get("Preview").__update();
				if(_callback){_callback.call(this);}
			},
			_this : _this,
			metod: 'post' 
		}
		if(data){ 
			var fd = new FormData();
			attr.data=data;
			//myFormData.append(name, file, filename);'imgPrev'
			var pointImgPrev = document.getElementById('pointImgPrev');
			 if(pointImgPrev.files[0])attr.data['imgPrev']=pointImgPrev.files[0]; 
		};
		//console.log(data);
		$_SYS.Loader.LoadData(attr); 
	},
	
	view : {
	 
		$ClassStyle : {
			'#$' : {background : '#333', border: '5px solid #000'}
		}
	}

}




 



