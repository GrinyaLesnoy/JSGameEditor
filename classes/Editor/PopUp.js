classes.Editor.PopUp = {
	objectType : 'classExtend',
	extendOf : 'classes.Editor',
	className : 'PopUp',
	controllerBtn : {//Набор управляющих кнопок и их названий, cansel = false в параметрах объекта отключит кнопку
		ok : {title : 'ok', fn : function(){this.__destruct();}},
		cansel : {title : 'cansel', fn : function(){this.__destruct();}}
	},
	controller : function(e){
		if(e.target.name)this.controllerBtn[e.target.name].fn.call(this);
	},
	__construct : function(){
		//if(!this.id){$_SYS.fn.now()}
		this.view.box = this.view.el.addChild({className:'box'});
		this.view.controll = this.view.el.addChild({className:'controll' });
		for(var c in this.controllerBtn){if(this.controllerBtn[c])this.view['controll_'+c] = this.view.controll.addChild({tagName:'input', value : this.controllerBtn[c].title, name : c });}
		$_SYS.fn.on(this.view.controll,'_DOWN',this.controller,false,this);
		
		this.view.el.XC = $_SYS.info.screen.Width/2;
		this.view.el.YC = $_SYS.info.screen.Height/2;
	},
	__destruct : function(){
		$_SYS.fn.off(this.view.controll,'_DOWN',this.controller,false);
		for(var e in this.view){
			if(this.view[e].remove){this.view[e].remove()}
			delete this.view[e];
		}
	}, 
	data : false,
	view : {
		width : $_SYS.info.screen.Width/2,
		$ClassStyle : {
			'#$' : {background : '#333', border: '5px solid #000', 'z-index':9999, 'min-width':100}
		}
	}
}