const reverse = function ( array ) {
  const maxIndex = array.length - 1;
  let result = new Array( array.length );

  Array.prototype.forEach.call( array, ( item, index ) => {
    result[ maxIndex - index ] = item;
  } );

  return result;
};

export default reverse;
