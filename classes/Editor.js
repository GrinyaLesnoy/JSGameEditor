classes.Editor = {
	objectType : 'class', 
	id : 'Editor', 
	
	$_import : ['Tab','PopUp' ],
	
	// ** Контейнер для вкладок (вынесен в отдельную ф-цию чтобы можно было создавать вкладки внутри вкладок) ** */
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
		this.view.el.position();// ** Растягивает редактор на все окно ** */
		// ** Контейнер для вкладок (вынесен в отдельную ф-цию чтобы можно было создавать вкладки внутри вкладок) ** */
		this.addTabBox();  
		// ** создаем вкладки редактора ** */
		 this.Tabs.DataUploader = $_SYS._New(classes.Editor.Tab.DataUploader,{id: 'DataUploader',  title : 'Файл',  parent : Editor.id, parentNode : Editor.view.tabBox }); 
		 this.Tabs.MapsEditor = $_SYS._New(classes.Editor.Tab.MapsEditor,{id: 'MapsEditor',  title : 'Карты',  parent : Editor.id, parentNode : Editor.view.tabBox }); 
		// ** активируем нужную вкладку */ 
		 var act = 'DataUploader';
		 this.TabController.activate(act); 
		// ** Создаем модальное окно (его используют различные инструменты редактора. Их можно создавать сколько угодно, но врядли понадобится более одного для всех) ** */
		this.ModalWindow = $_SYS._New(classes.Controllers.ModalWindow,{data:false});
		// ** Обновляем CSS ** */
		$_SYS.CSS.update();  
	},
	 
	
	view : {
		// ** CSS ** */
		$ClassStyle : {
			'#$' : {background : '#333', border: '5px solid #000'},
			'button, input[type="button"]':{
				background: '#ccc',
				border: '1px solid #ccc',
				'border-radius': 3,
				cursor: 'pointer',
				display: 'inline-block',
				'vertical-align':'middle',
				margin: 3,
				color:'#000'
			},
			'button:hover, input[type="button"]:hover':{background: '#999', color:'#fb6'}
		}
	}

}




 



