classes.Editor.Tab.DataUploader = {
	objectType : 'classExtend',
	extendOf : 'classes.Editor.Tab', 
	Init : function(_this_){
		this.view.getData = this.view.el.addChild({tagName : 'label',draggable : "true"}); 
		this.view.getData.position();
		 
		//ondragover - наведение  ondragleave - отмена ondrop - действие
		$_SYS.LocalFile.setListener(this.view.getData,_this_.loadData,_this_ , 'readAsArrayBuffer');
		
		
		this.view.getDataFile = this.view.getData.addChild({tagName : 'input',type : "file"});
		$_SYS.fn.on(this.view.getData, 'change', function(event) {  
			 $_SYS.LocalFile.read(event.target.files,_this_.loadData,_this_, 'readAsArrayBuffer');  
		},false,this);
		
		
		/* $_SYS.fn.on(this.view.getData, 'dragenter dragstart dragend dragleave dragover drag drop', function(e){ e.preventDefault(); });
		 
		 $_SYS.fn.on(this.view.getData, 'dragover', function(e){ 
			e.target.addClass('dragover');
		}); 
		 $_SYS.fn.on(this.view.getData, 'dragleave', function(e){ 
			e.target.removeClass('dragover');
		}); 
		this.model = this.setModel();
		$_SYS.fn.on(this.view.getData, 'drop', function(event) { 
			console.log(event.dataTransfer.files[0].name);
			 // $_SYS.LocalFile.read(event.dataTransfer.files,_this_.loadData,_this_);
			 this.model.getEntries(event.dataTransfer.files[0], function(entries) { console.log(entries); });
			
			 event.preventDefault();
		},false,this);*/ 
	},
	 
	 
	
 
	
	loadData : function(f,data){ 
		 //data = data.replace("application/octet-stream","application/zip");
		//D = data;
		//D = this.dataURItoBlob (data); D1 = data;
		

		if(JSZip&&f&&f.name&&f.name.substr(f.name.length-3)=='zip'){
			
			 var zip = new JSZip(data); 
			console.log('zip',zip);
			Editor.$Files = {
				root: '',//Корневой котолог
				files: {}//Файлы
			}; 
			for(var f in zip.files){if(f.indexOf('sys.js')>0 ){
				Editor.$Files.root = f.substr(0,f.indexOf('sys.js'));
				//if(zip.files[_dir_.extends])
				 break;
			}} 
			for(var f in zip.files){
				if(f == Editor.$Files.root)continue;
				var path = f.substr(Editor.$Files.root.length).split('/'), fname = path.pop(),
				dir = Editor.$Files.files;
				; 
				if(path.length>0){ 
					for(var i=0; i<path.length; i++){
						if(!dir[path[i]])dir[path[i]]={};
						dir = dir[path[i]];
					}
				}
				if(zip.files[f].dir){}else
					dir[fname]={}
				if(zip.files[f]._data){
					dir[fname]={
						type : fname.substr(fname.lastIndexOf('.')+1).toLowerCase(),
						Uint8Array :  zip.files[f]._data.getContent(),
					}; 
					
					if(this.contentType[dir[fname].type]){
						dir[fname].contentTtpe = this.contentType[dir[fname].type];
						dir[fname].content = $_SYS.LocalFile.getBase64(dir[fname].Uint8Array, dir[fname].contentTtpe);
					}else{
						dir[fname].content = $_SYS.LocalFile.uint8ToString(dir[fname].Uint8Array);
					}
				} 
				//if(f.indexOf('Data/Maps.js')>0 ){map = zip.files[f];console.log(zip.files[f]);}
				//$_SYS.LocalFile.uint8ToString(map._data.getContent())
			}
			//Editor.TabController.activate('MapsEditor');//Разобраться с 0 шириной!!!
			for(var t in Editor.Tabs){if(Editor.Tabs[t].onGetDATA)Editor.Tabs[t].onGetDATA();}
			
		}
		
	},
	contentType : {
		/*txt : 'text/text',
		css : 'text/css',
		html :	'text/html',
		htm : 	'text/html',
		js : 'text/javascript',
		rtf : 'text/rtf',
		xml : 'text/xml',*/
		png : 'image/png',
		jpeg : 'image/jpeg',
		jpg : 'image/jpeg',
		gif : 'image/gif',
	},
	view : {
		$ClassStyle : {
			'.$ .dragover' : {'background' : '#777' }, 
		}
	}
	}