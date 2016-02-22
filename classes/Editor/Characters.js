classes.Editor.Characters = {
	objectType : 'classExtend',
	extendOf : 'classes.Editor', 
	 
	 $_import : ['Texture'],
	 
	__construct : function(_this){
		this.addTabBox(); 
		this.charactersTextureTab = $_SYS._New(classes.Editor.Tab,{id: 'charactersTextureTab', parent : this.id,  title : 'Текстура', modelClass : 'classes.Editor.Characters.Texture', parentNode : this.view.tabBox });
		var act = 'charactersTextureTab';console.log(this.charactersTextureTab);
		this.TabController.activate(act);
	},
	next : function(){Editor.TabController.activate('contentTab');}, 
	save : function(_callback){
		//root.templateData = $_SYS.fn._import({},this.data);
		//$_SYS.$Get("Content").__update();//$_SYS.$Get("Content") == Editor.contentTab.model
		//if(_callback){_callback();}
		Editor.ajax(_callback,{template:this.data}); 
	},
	view:true
}
 