function getInteger( n ) {
  let data = [];

  for ( let i = n; i > 0; i-- ) {
    if ( n % i === 0 ) {
      data.push( n / i );
    }
  }

  return data;
}

function getCorrectIntergerList( num ) {
  let result = getInteger( num );
  let integer;

  if ( num > 10 && result.length === 2 ) {
    integer = num + 1;
    result = getInteger( integer );
    result[ result.length - 1 ] = num;
  }

  return result;
}

export { getInteger, getCorrectIntergerList };
