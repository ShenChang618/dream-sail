/* eslint-disable */

// 数据库对象
class Database {
	constructor( { version = 1, name, objectStore = null } ) {
		// 初始化对象
		if ( !window.indexedDB ) {
			window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
			!window.indexedDB && console.error( '浏览器不支持 IndexedDB！' );
			window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
			window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
		}

		this.version = version;
		this.name = name;
		this.objectStore = objectStore;
	}

	open( { version = this.version, name = this.name } ) {
		this.version = version;
		this.name = name;
		this.request = indexedDB.open( this.name, this.version );
	}

	close () {
		if ( !this.db ) {
			return false;
		}

		this.db.close();
	}

	run ( fn, opt ) {
		this.open( opt );

		this.request.onerror = function ( event ) {
			console.log( `error: ${event.target.error.message}` );
		};
		fn.apply( this );

		this.close();
	}

	success ( fn ) {
		this.run( function () {
			this.request.onsuccess = ( event ) => {
				this.db = event.target.result;

				fn.call( this );
			};
		} );
	}

	// objectStoreOpt 的格式：{ keyPath: 'id', autoIncrement: true }
	// indexOpt 的格式：[ { name: 'title', keyPath: '', option: { unique: false } } ]
	// 初始化第二个表，需要更新数据库版本
	init( objectStoreOpt, indexOpt, objectStore ) {
		this.run( function () {
			this.objectStore = objectStore || this.objectStore;

			const request = this.request;

			request.onerror = function ( event ) {
				console.log( `error: ${event.target.error.message}` );
			};

			request.onupgradeneeded  = ( event ) => {
			    console.log( 'upgrading' );

			    this.db = event.target.result;

			    // 创建一个对象存储空间，它是唯一的
			    const objectStoreResult = this.db.createObjectStore( this.objectStore, objectStoreOpt );

			    if ( Object.prototype.toString.call( indexOpt ) === '[object Object]' ) {
			    	objectStoreResult.createIndex( indexOpt.name, indexOpt.keyPath, indexOpt.option );
			    } else if ( Object.prototype.toString.call( indexOpt ) === '[object Array]' ) {
			    	indexOpt.forEach( function ( obj ) {
			    		objectStoreResult.createIndex( obj.name, obj.keyPath, obj.option );
			    	} );
			    }
			};
		} );
	}

	// 获取对象表
	getObjectStore ( mode, fn, objectStore ) {
		this.objectStore = objectStore || this.objectStore;

		// 获取事务对象
		mode = mode || 'readonly';

		const transaction = this.db.transaction( [ this.objectStore ], mode );
		const objectStoreRequest = transaction.objectStore( this.objectStore );

		transaction.oncomplete = fn;

		transaction.onerror = function ( event ) {
			// error: null，表示已经添加过
			console.log( `error: ${transaction.error}` );
		};

		return objectStoreRequest;
	}

	// 插入
	insert ( data, fn, store ) {
		this.success( function () {
			const objectStore = this.getObjectStore( 'readwrite', null, store );
			let objectStoreRequest = null;

			if ( Object.prototype.toString.call( data ) === '[object Object]' ) {
		    	objectStoreRequest = objectStore.add( data );
		    	objectStoreRequest.onsuccess = fn;
		    } else if ( Object.prototype.toString.call( data ) === '[object Array]' ) {
		    	data.forEach( function ( obj ) {
			    	objectStoreRequest = objectStore.add( obj );
			    	objectStoreRequest.onsuccess = fn;
		    	} );
		    }
		} );
	}

	// 删除一条数据
	delete ( keyPath, fn, store ) {
		this.success( function () {
			const objectStore = this.getObjectStore( 'readwrite', null, store );
			const request = objectStore.delete( keyPath );

			request.onsuccess = fn;
		} );
	}

	// 清除
	clear ( fn, store ) {
		this.success( function () {
			const objectStore = this.getObjectStore( 'readwrite', null, store );
			const request = objectStore.clear();

			request.onsuccess = fn;
		} );
	}

	// 查询方法
	// db.query( null, fn ) === getAll()
	// db.query( null, keyPath, fn ) === get()
	query ( method, ...args ) {
		if ( method == null && typeof args[ 0 ] === 'function' ) {
			return this.getAll.apply( this, args );
		}

		if ( method != null && method === 'cursor' && typeof args[ 0 ] === 'object' ) {
			return this.cursor.apply( this, args );
		}

		if ( method != null && method === 'index' && typeof args[ 1 ] === 'object' ) {
			return this.index.apply( this, args );
		}

		return this.get.apply( this, args );
	}

	// 使用对象存储空间来查找
	get ( keyPath, fn, store ) {
		let data = null;

		this.success( function () {
			const objectStore = this.getObjectStore( null, null, store );

			if ( Object.prototype.toString.call( keyPath ) === '[object Array]' ) {
				keyPath.forEach( function ( obj, index ) {
					objectStore.get( obj ).onsuccess = function ( event ) {
						data.push( event.target.result );
					};
				} );

				fn && fn( data );
			} else {
				objectStore.get( keyPath ).onsuccess = function ( event ) {
					data = event.target.result;
					fn && fn( data );
				};
			}
		} );

		return data;
	}

	// 获取所有对象，使用 this.cursor 方法来实现
	getAll ( fn, obj, store ) {
		return this.cursor( obj, fn, store );
	}

	// 使用游标来查询
	// range 必须是 IDBKeyRange 对象
	// direction "next", "nextunique", "prev", and "prevunique"
	cursor ( obj, fn, store ) {
		let data = [];

		obj = obj || { range: null, direction: 'next' };

		this.success( function () {
			const objectStore = this.getObjectStore( null, null, store );

			objectStore.openCursor( obj.range || null, obj.direction || 'next' ).onsuccess = function ( event ) {
				const cursor = event.target.result;

				if ( cursor ) {
					data.push( cursor.value );

					cursor.continue();
				} else {
					fn && fn( data );
				}
			};
		} );

		return data;
	}

	// 使用索引来查找数据
	index ( indexName, obj, fn, store ) {
		let data = [];

		obj = obj || { range: null, direction: 'next' };

		this.success( function () {
			const objectStore = this.getObjectStore( null, null, store );
			const index = objectStore.index( indexName );

			index.openCursor( obj.range || null, obj.direction || 'next' ).onsuccess = function ( event ) {
				const cursor = event.target.result;

				if ( cursor ) {
					data.push( cursor.value );

					cursor.continue();
				} else {
					fn && fn( data );
				}
			};
		} );

		return data;
	}

	// 更新数据
	update ( data, fn, store ) {
		this.success( function () {
			const objectStore = this.getObjectStore( 'readwrite', null, store );

			// for ( let key in data ) {
			// 	result[ key ] = data[ key ];
			// }

			const request = objectStore.put( data );

			request.onsuccess = fn;
		} );
	}
}

export default Database;
