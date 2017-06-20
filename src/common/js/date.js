export default function formatDate( date, format ) {
  if ( /(y+)/.test( format ) ) {
    format = format.replace( RegExp.$1, ( date.getFullYear() + '' ).substr( 4 - RegExp.$1.length ) );
  }

  let preg = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  };

  for ( let item in preg ) {
    if ( new RegExp( `(${item})` ).test( format ) ) {
      let str = preg[ item ] + '';

      format = format.replace( RegExp.$1, addLeftZero( str ) );
    }
  }

  return format;
}

function addLeftZero( str ) {
  if ( str < 10 ) {
    return str;
  }

  return ( '00' + str ).substr( str.length );
}
