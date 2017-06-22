import mui from 'mui';

const btnValue = [ '确定', '取消' ];
let plus = null;
let wgtVer = null;

function plusReady() {
  // 获取本地应用资源版本号
  plus.runtime.getProperty( plus.runtime.appid, function ( inf ) {
    wgtVer = inf.version;

    console.log( `当前应用版本：${wgtVer}` );
  } );
}

mui.plusReady( function () {
  if ( window.plus ) {
    plus = window.plus;
    plusReady();
  }
} );
// if ( window.plus ) {
//   plus = window.plus;
//   plusReady();
// }

// 检测更新
const checkUrl = 'http://www.cfmwsc.cn/update/dreamSail/checkDreamSail.php';

function checkUpdate( flag = false ) {
  if ( plus === null ) {
    return;
  }

  if ( flag ) {
    plus.nativeUI.showWaiting( '检测更新...' );
  }

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if ( xhr.readyState === 4 ) {
      console.log( '测试 xhr.readyState === 4' );
      if ( flag ) {
        plus.nativeUI.closeWaiting();
      }

      if ( xhr.status === 200 ) {
        console.log( `检测更新成功：${xhr.responseText}` );

        const newVer = xhr.responseText;

        if ( wgtVer && newVer && wgtVer !== newVer ) {
          mui.confirm( '有新版本发布，是否更新', '提醒', btnValue, ( e ) => {
            if ( e.index === 0 ) {
              // 下载升级包
              downWgt();
            }
          } );
        } else {
          if ( flag ) {
            plus.nativeUI.alert( '无新版本可更新！' );
          }
        }
      } else {
        if ( flag ) {
          plus.nativeUI.alert( '检测更新失败！' );
        }
      }
    }
  };

  xhr.open( 'get', checkUrl );
  xhr.send();
}

// 下载wgt文件
const wgtUrl = 'http://www.cfmwsc.cn/update/dreamSail/H5886A8E9.wgt';

function downWgt() {
  plus.nativeUI.showWaiting( '下载wgt文件...' );

  plus.downloader.createDownload( wgtUrl, {
    filename: '_doc/update/',
    timeout: 10,
  }, function ( d, status ) {
    if ( status === 200 ) {
      console.log( `下载wgt成功：${d.filename}` );

      // 安装wgt包
      installWgt( d.filename );
    } else {
      console.log( '下载wgt失败！' );

      plus.nativeUI.alert( '下载wgt失败！' );
    }

    plus.nativeUI.closeWaiting();
  } ).start();
}

// 更新应用资源
function installWgt( path ) {
  plus.nativeUI.showWaiting( '安装wgt文件...' );

  plus.runtime.install( path, { force: true }, function () {
    plus.nativeUI.closeWaiting();

    console.log( '安装wgt文件成功！' );

    // 更新完毕删除更新包
    plus.io.resolveLocalFileSystemURL( path, function ( entity ) {
      entity.remove();
    } );

    plus.nativeUI.alert( '应用资源更新完成！', function () {
      plus.runtime.restart();
    } );
  }, function ( e ) {
    plus.nativeUI.closeWaiting();

    console.log( `安装wgt文件失败[${e.code}]：${e.message}` );

    plus.nativeUI.alert( `安装wgt文件失败[${e.code}]：${e.message}` );
  } );
}

export default checkUpdate;
