const storage = function () {
  if ( !window.localStorage ) {
    return false;
  }

  const objStr = Object.prototype.toString;
  const storage = window.localStorage;
  const result = {
    set( key, value ) {
      storage.setItem( key, objStr.call( value ) === '[object Array]' || objStr.call( value ) === '[object Object]'
                            ? JSON.stringify( value )
                            : value );
    },
    get( key ) {
      let data = null;

      try {
        data = JSON.parse( storage.getItem( key ) );
      } catch ( e ) {
        data = storage.getItem( key );
      }

      return data;
    },
    remove( key ) {
      return result.get( key ) && storage.removeItem( key );
    },
    clear() {
      storage.clear();
    },
  };

  return result;
};

export default storage();
