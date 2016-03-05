classes.Editor.Characters.Texture = {
	objectType : 'classExtend',
	extendOf : 'classes.Editor.Characters', 
	 
	__construct : function(_this_){
		 this.canvas = this.view.el.addChild({TagName:'canvas', id:'textureMap'});
		
	},
	next : function(){Editor.TabController.activate('contentTab');}, 
	save : function(_callback){
	var img    = canvas.toDataURL("image/png");
		//root.templateData = $_SYS.fn._import({},this.data);
		//$_SYS.$Get("Content").__update();//$_SYS.$Get("Content") == Editor.contentTab.model
		//if(_callback){_callback();}
		Editor.ajax(_callback,{template:this.data}); 
	},
	view:true
}
 