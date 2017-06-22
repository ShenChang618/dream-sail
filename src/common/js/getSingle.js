// 通用惰性单例
export default function getSingle( fn ) {
  let result = null;

  return function ( ...args ) {
    return result || ( result = fn.apply( this, args ) );
  };
}
