export default function copy( obj ) {
  // JSON解析之类的其实如果给定格式不对很容易出错滴，自己做好检验~
  return JSON.parse( JSON.stringify( obj ) );
};
