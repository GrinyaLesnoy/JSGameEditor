 /** == ZIP == **/
 //Создан на основе кода Gildas Lormeau
 $_SYS.ZIP = {
	
	//Создает объект для работы с двоичными данными
	getDataHelper : function (byteLength, bytes) { 
		var dataBuffer = new ArrayBuffer(byteLength);//используется для работы с бинарными данными. Он представляет собой ссылку на поток "сырых" двоичных данных
		var result={
			buffer : dataBuffer,
			array : new Uint8Array(dataBuffer),//8-битное без знаковое целое,
			view : new DataView(dataBuffer)//DataView беспечивает низкоуровневый интерфейс для чтения и записи нескольких типов чисел в ArrayBuffer независимо от байтов платформы.
		}; 
		if (bytes) result.array.set(bytes, 0);
		return result;
	},
	
	readUint8Array : function (index, length, callback) {
			var i, data = getDataHelper(length);
			var start = Math.floor(index / 3) * 4;
			var end = Math.ceil((index + length) / 3) * 4;
			var delta = index - Math.floor(start / 4) * 3;
			//atob декодирует base64 строку
			var bytes = root.atob(this.SATA.dataURI.substring(start + dataStart, end + dataStart));
			for (i = delta; i < delta + length; i++)
				data.array[i - delta] = bytes.charCodeAt(i);//charCodeAt() возвращает числовое значение Юникода для символа по указанному индексу
			callback(data.array);
		},
	onerror : function (error) {
		console.error(error);
	},	
	readCommonHeader : function (entry, data, index, centralDirectory, onerror) {
		entry.version = data.view.getUint16(index, true);
		entry.bitFlag = data.view.getUint16(index + 2, true);
		entry.compressionMethod = data.view.getUint16(index + 4, true);
		entry.lastModDateRaw = data.view.getUint32(index + 6, true);
		entry.lastModDate = getDate(entry.lastModDateRaw);
		if ((entry.bitFlag & 0x01) === 0x01) {
			this.onerror('ERR_ENCRYPTED');
			return;
		}
		if (centralDirectory || (entry.bitFlag & 0x0008) != 0x0008) {
			entry.crc32 = data.view.getUint32(index + 10, true);
			entry.compressedSize = data.view.getUint32(index + 14, true);
			entry.uncompressedSize = data.view.getUint32(index + 18, true);
		}
		if (entry.compressedSize === 0xFFFFFFFF || entry.uncompressedSize === 0xFFFFFFFF) {
			this.onerror('ERR_ZIP64');
			return;
		}
		entry.filenameLength = data.view.getUint16(index + 22, true);
		entry.extraFieldLength = data.view.getUint16(index + 24, true);
	},
	createZipReader : function (reader, callback, onerror) {
		var inflateSN = 0;
		var _this_ = this;
		function Entry() {
		}

		Entry.prototype.getData = function(writer, onend, onprogress, checkCrc32) {
			var that = this;

			function testCrc32(crc32) {
				var dataCrc32 = _this_.getDataHelper(4);
				dataCrc32.view.setUint32(0, crc32);
				return that.crc32 == dataCrc32.view.getUint32(0);
			}

			function getWriterData(uncompressedSize, crc32) {
				if (checkCrc32 && !testCrc32(crc32))
					_this_.onerror('ERR_CRC');
				else
					writer.getData(function(data) { onend(data); });
			}

			function onreaderror(err) { onerror(err || 'ERR_READ_DATA'); }

			function onwriteerror(err) {
				onerror(err || 'ERR_WRITE_DATA');
			}

			_this_.readUint8Array(that.offset, 30, function(bytes) {
				var data = _this_.getDataHelper(bytes.length, bytes), dataOffset;
				if (data.view.getUint32(0) != 0x504b0304) {
					_this_.onerror('ERR_BAD_FORMAT');
					return;
				}
				_this_.readCommonHeader(that, data, 4, false);
				dataOffset = that.offset + 30 + that.filenameLength + that.extraFieldLength;
				writer.init(function() {
					if (that.compressionMethod === 0)
						copy(that._worker, inflateSN++, reader, writer, dataOffset, that.compressedSize, checkCrc32, getWriterData, onprogress, onreaderror, onwriteerror);
					else
						inflate(that._worker, inflateSN++, reader, writer, dataOffset, that.compressedSize, checkCrc32, getWriterData, onprogress, onreaderror, onwriteerror);
				}, onwriteerror);
			}, onreaderror);
		};

		function searchEOCDR(eocdrCallback) {
			// "End of central directory record" is the last part of a zip archive, and is at least 22 bytes long.
			// Zip file comment is the last part of EOCDR and has max length of 64KB,
			// so we only have to search the last 64K + 22 bytes of a archive for EOCDR signature (0x06054b50).
			var EOCDR_MIN = 22;
			if (_this_.DATA.size < EOCDR_MIN) {_this_.onerror('ERR_BAD_FORMAT'); return; }
			var ZIP_COMMENT_MAX = 256 * 256, EOCDR_MAX = EOCDR_MIN + ZIP_COMMENT_MAX; 

			// seek last length bytes of file for EOCDR
			//пытается найти окончание центральной директории
			var Search = function (length, eocdrNotFoundCallback) {
				_this_.readUint8Array(reader.size - length, length, function(bytes) {
					for (var i = bytes.length - EOCDR_MIN; i >= 0; i--) {
						if (bytes[i] === 0x50 && bytes[i + 1] === 0x4b && bytes[i + 2] === 0x05 && bytes[i + 3] === 0x06) {
							eocdrCallback(new DataView(bytes.buffer, i, EOCDR_MIN)); return;
						}
					}
					eocdrNotFoundCallback();
				}, function() { _this_.onerror('ERR_READ'); });
			}
			
			// In most cases, the EOCDR is EOCDR_MIN bytes long
			Search(EOCDR_MIN, function() {
				// If not found, try within EOCDR_MAX bytes
				Search(Math.min(EOCDR_MAX, reader.size), function() { _this_.onerror('ERR_BAD_FORMAT'); });
			});
		}

		var zipReader = {
			getEntries : function(callback) {
				//var worker = this._worker;
				// look for End of central directory record
				// Получаем конец основной директории zip-архива
				searchEOCDR(function(dataView) {
					var datalength, fileslength;
					datalength = dataView.getUint32(16, true);
					fileslength = dataView.getUint16(8, true);
					if (datalength < 0 || datalength >= _this_.DATA.size) {
						_this_.onerror('ERR_BAD_FORMAT');
						return;
					}
					_this_.readUint8Array(datalength, reader.size - datalength, function(bytes) {
						var i, index = 0, entries = [], entry, filename, comment, data = getDataHelper(bytes.length, bytes);
						for (i = 0; i < fileslength; i++) {
							entry = new Entry();
							entry._worker = worker;
							if (data.view.getUint32(index) != 0x504b0102) {
								_this_.onerror('ERR_BAD_FORMAT');
								return;
							}
							readCommonHeader(entry, data, index + 6, true );
							entry.commentLength = data.view.getUint16(index + 32, true);
							entry.directory = ((data.view.getUint8(index + 38) & 0x10) == 0x10);
							entry.offset = data.view.getUint32(index + 42, true);
							filename = getString(data.array.subarray(index + 46, index + 46 + entry.filenameLength));
							entry.filename = ((entry.bitFlag & 0x0800) === 0x0800) ? decodeUTF8(filename) : decodeASCII(filename);
							if (!entry.directory && entry.filename.charAt(entry.filename.length - 1) == "/")
								entry.directory = true;
							comment = getString(data.array.subarray(index + 46 + entry.filenameLength + entry.extraFieldLength, index + 46
									+ entry.filenameLength + entry.extraFieldLength + entry.commentLength));
							entry.comment = ((entry.bitFlag & 0x0800) === 0x0800) ? decodeUTF8(comment) : decodeASCII(comment);
							entries.push(entry);
							index += 46 + entry.filenameLength + entry.extraFieldLength + entry.commentLength;
						}
						callback(entries);
					}, function() {
						_this_.onerror(ERR_READ);
					});
				});
			},
			close : function(callback) {
				if (this._worker) {
					this._worker.terminate();
					this._worker = null;
				}
				if (callback)
					callback();
			},
			_worker: null
		};

		if (!obj.zip.useWebWorkers)
			callback(zipReader);
		else {
			createWorker('inflater',
				function(worker) {
					zipReader._worker = worker;
					callback(zipReader);
				},
				function(err) {
					onerror(err);
				}
			);
		}
	},
	UnPack : function(dataURI, callback){
		this.DATA = {}
		this.SATA.dataURI = dataURI;
		var dataEnd = dataURI.length;
			while (dataURI.charAt(dataEnd - 1) == "=") dataEnd--;
			dataStart = dataURI.indexOf(",") + 1;
			this.DATA.size = Math.floor((dataEnd - dataStart) * 0.75);
			//createZipReader(reader, callback, onerror);
			//callback();
	},
	Pack : function(data){
		
	}
 
 }
 
 /** == END ZIP == **/