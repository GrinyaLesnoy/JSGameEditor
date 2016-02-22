classes.rightBar = {
	objectType : 'class',
	className : 'rightBar',
	width : 0,
	Resize : function(w){
		if(w)this.width = w;
		//this.view.el.width(this.width);
console.log(this);		
		this.parentNode.width(this.width); 
		this.onResize();
	},
	__construct : function(){
		this.view.parentTab = this.view.el.getParents('hasClass', 'Tab')[0];
		this.parent = $_SYS.$Get(this.view.parentTab.id);  
		this.Resize();
	},
	onResize  : function(){
		if(this.parent)this.parent.onResize();
		//for(var block in this.Blocks){this.Blocks[block].Resize(this.width);}
	},
	Blocks : {},
	addBar : function(block, options){
		var _default = {
			id: block, 
			parentNode: (this.view.box ? this.view.box : this.view.el)
		}; 
		if(typeof options == 'object')$_SYS.fn._import(_default, options)
		this.Blocks[block] = $_SYS._New(classes.rightBar.Block,_default);
		this.Blocks[block].parent = this;
		this.Blocks[block].onResize();
		return this.Blocks[block];
	},
	view : {
		$ClassStyle : {
			'.$' : {'border-bottom': '2px solid #111'},
			'.$ > div':{padding:5},
			'.$ h3' : {padding:5, background:'#111', 'border-bottom': '2px solid #000'} 
		}
	} 
}

classes.rightBar.Block = {
	objectType : 'classExtend',
	className : 'rightBarBlock',
	extendOf : 'classes.rightBar',
	type : 'default',
	onResize  : function(){ 
		//if(this.parent)this.parent.onResize(); Может уйти в бесконечный цикл
	},
	//title : '',
	__construct : function(){ 
		if(this.title)this.view.title = this.view.el.addChild({TagName : 'h3', content : this.title});
		this.view.box = this.view.el.addChild({}); 
	},
	show : function(act){
		switch (this.type){
			case 'default': this.view.el[act ? 'show' : 'hidden'](); break;
			case 'switch': this.view.title[act ? 'addClass' : 'removeClass']('on'); this.view.box[act ? 'show' : 'hidden'](); break;
			case 'visable': this.view.el.show(); break;
		}
	},
	fn : {},//Контейнер для функций
	Resize : function(w){
		if(this.parent)this.parent.Resize(w);
	}
	}