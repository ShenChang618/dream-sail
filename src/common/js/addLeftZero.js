export default function addLeftZero( str ) {
  let temp = '00' + str;

  str += '';

  return temp.substr( str.length );
}
